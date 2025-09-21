import type {
  AIRequest,
  ExtensionMessage,
  MessageResponse,
} from "@/types/carbon";
import { calculateAdaptiveImpact } from "@/utils/calculations/impact";
import { formatDuration } from "@/utils/formatting/display";
import { logger } from "@/utils/core/logger";
import {
  generateManifestUrls,
  getProviderByHostname,
} from "@/utils/providers/detection";
import { ReactiveStorage } from "@/utils/storage/reactive";
import { DatabaseService } from "@/utils/storage/database";
import { type Browser, browser } from "wxt/browser";

import { supabase } from "@/config/supabase-client";

async function initSupabaseAuthFromStorage() {
  try {
    const { supabaseSession } = await browser.storage.local.get([
      "supabaseSession",
    ]);
    if (supabaseSession?.access_token && supabaseSession?.refresh_token) {
      await supabase.auth.setSession({
        access_token: supabaseSession.access_token,
        refresh_token: supabaseSession.refresh_token,
      });
    }
  } catch (e) {
    console.error("❌ Failed to init Supabase session in background:", e);
  }
}

browser.storage.local.onChanged.addListener(async (changes) => {
  if (changes.supabaseSession?.newValue) {
    const s = changes.supabaseSession.newValue;
    if (s?.access_token && s?.refresh_token) {
      await supabase.auth.setSession({
        access_token: s.access_token,
        refresh_token: s.refresh_token,
      });
    }
  }
});

// Call this during background startup
void initSupabaseAuthFromStorage();

export default defineBackground(() => {
  logger.log("🎯 Extension background starting...");

  ReactiveStorage.getInstance();

  // Properly stop cleanup when extension is disabled
  browser.runtime.onSuspend.addListener(() => {
    logger.log("🛑 Extension being disabled - stopping cleanup");
    ReactiveStorage.stopCleanup();
  });

  // Generate endpoints automatically from providers
  const manifestUrls = generateManifestUrls();
  logger.log("📋 Endpoints configured for all providers");
  logger.log("🌐 Manifest URLs generated:", manifestUrls);

  // Request duration tracking system
  interface RequestDurationData {
    requestId: string;
    hostname: string;
    method: string;
    url: string;
    startTime: number;
    endTime?: number;
    duration?: number;
  }

  const requestDurationTracker = new Map<string, RequestDurationData>();

  // Utility function to clean up both tracking systems
  function cleanupAllTracking() {
    ReactiveStorage.clearAllActiveRequests().catch(() => {
      // Silent error handling for storage cleanup
    });
    requestDurationTracker.clear();
  }

  // Initialize webRequest listeners only in runtime environment
  function initializeWebRequestListeners() {
    try {
      // Check if webRequest API is available (runtime environment)
      if (!browser?.webRequest?.onBeforeRequest) {
        logger.log("⚠️ WebRequest API not available in current environment");
        return;
      }

      // Intercept requests with webRequest
      browser.webRequest.onBeforeRequest.addListener(
        (details) => {
          handleWebRequest(details).catch((error) => {
            console.error("❌ Error processing request:", error);
          });
          return {};
        },
        {
          urls: manifestUrls.hostPermissions,
        }
      );

      // Intercept responses to calculate duration and impact
      browser.webRequest.onCompleted.addListener(
        (details) => {
          handleResponseCompleted(details).catch((error) => {
            console.error("❌ Error processing response:", error);
          });
        },
        {
          urls: manifestUrls.hostPermissions,
        }
      );

      // Intercept request errors to clean up state
      browser.webRequest.onErrorOccurred.addListener(
        (details) => {
          handleRequestError(details).catch((error) => {
            console.error("❌ Error processing request error:", error);
          });
        },
        {
          urls: manifestUrls.hostPermissions,
        }
      );

      logger.log("✅ WebRequest listeners configured with WXT");
    } catch (error) {
      logger.log("⚠️ Error initializing webRequest listeners:", error);
    }
  }

  // Initialize webRequest listeners
  initializeWebRequestListeners();

  // Clean up active requests when tabs change or close
  browser.tabs.onUpdated.addListener((_tabId, changeInfo, _tab) => {
    if (changeInfo.url) {
      logger.log("🧹 Navigation detected - cleaning up active requests");
      cleanupAllTracking();
    }
  });

  browser.tabs.onRemoved.addListener((_tabId, _removeInfo) => {
    logger.log("🧹 Tab closed - cleaning up active requests");
    cleanupAllTracking();
  });

  // Listen to messages
  browser.runtime.onMessage.addListener(
    (
      message: ExtensionMessage,
      _sender: Browser.runtime.MessageSender,
      sendResponse: (response: MessageResponse) => void
    ): boolean => {
      if (!browser.runtime.getManifest()) {
        logger.log("⚠️ Message ignored: invalid context");
        sendResponse({ success: false, error: i18n.t("invalidContext") });
        return false;
      }

      if (!message || typeof message.type !== "string") {
        sendResponse({ success: false, error: i18n.t("invalidMessage") });
        return false;
      }

      logger.info("📨 Message received:", message.type);

      try {
        switch (message.type) {
          case "GET_STATS":
            ReactiveStorage.getGlobalStats()
              .then((stats) => {
                if (browser.runtime.getManifest()) {
                  sendResponse({ success: true, data: stats });
                }
              })
              .catch((error: any) => {
                if (browser.runtime.getManifest()) {
                  logger.error("❌ Error GET_STATS:", error);
                  sendResponse({ success: false, error: error.message });
                }
              });
            return true;

          case "GET_SERVICE_INFO": {
            const hostname = message.hostname;
            const provider = hostname ? getProviderByHostname(hostname) : null;
            const serviceInfo = provider
              ? {
                  name: provider.name,
                  carbon: provider.metrics.carbon,
                  water: provider.metrics.water,
                  sources: provider.metrics.sources,
                }
              : null;

            sendResponse({ success: true, data: serviceInfo });
            return false;
          }

          default:
            sendResponse({
              success: false,
              error: i18n.t("unknownMessageType"),
            });
            return false;
        }
      } catch (error) {
        logger.error("❌ Error processing message:", error);
        sendResponse({ success: false, error: i18n.t("internalError") });
        return false;
      }
    }
  );

  // Request processing functions
  async function handleWebRequest(details: any) {
    try {
      if (!browser.runtime.getManifest()) {
        return;
      }

      const hostname = new URL(details.url).hostname;
      const provider = getProviderByHostname(hostname);

      // Debug: Log all requests to provider hostnames
      if (provider) {
        logger.log("🔍 Request detected to provider:", {
          provider: provider.name,
          hostname,
          url: details.url,
          method: details.method,
        });
      }

      if (!provider) {
        return;
      }

      // Check if we should intercept this request
      const shouldIntercept = shouldInterceptRequest(details, provider);
      logger.log("🎯 Interception decision:", {
        provider: provider.name,
        url: details.url,
        shouldIntercept,
        endpoints: provider.endpoints,
        useRegex: provider.config?.filtering?.useRegex,
      });

      if (!shouldIntercept) {
        return;
      }

      logger.info("🔍 Intercepted request", {
        provider: provider.name,
        url: details.url,
      });

      // Start duration tracking
      requestDurationTracker.set(details.requestId, {
        requestId: details.requestId,
        hostname: hostname,
        method: details.method,
        url: details.url,
        startTime: Date.now(),
      });

      // Mark request start
      await ReactiveStorage.markRequestStart(provider.name, details.requestId);
    } catch (error) {
      logger.error("❌ Error handleWebRequest:", error);
    }
  }

  function shouldInterceptRequest(details: any, provider: any): boolean {
    const url = details.url;
    const useRegex = provider.config?.filtering?.useRegex || false;

    // Check exclude endpoints first
    if (provider.config?.filtering?.excludeEndpoints) {
      for (const excludePattern of provider.config.filtering.excludeEndpoints) {
        if (matchesPattern(url, excludePattern, true)) {
          return false; // Exclude this request
        }
      }
    }

    // Check if HTTP method is allowed
    if (provider.config?.filtering?.methods) {
      if (!provider.config.filtering.methods.includes(details.method)) {
        return false;
      }
    }

    // Check include endpoints
    for (const endpoint of provider.endpoints) {
      if (matchesPattern(url, endpoint, useRegex)) {
        return true;
      }
    }

    return false;
  }

  function matchesPattern(
    url: string,
    pattern: string,
    useRegex: boolean
  ): boolean {
    if (useRegex) {
      try {
        const regex = new RegExp(pattern);
        return regex.test(url);
      } catch (error) {
        logger.error("❌ Error regex pattern:", pattern, error);
        return false;
      }
    } else {
      return url.includes(pattern);
    }
  }

  async function handleResponseCompleted(details: any) {
    try {
      if (!browser.runtime.getManifest()) {
        return;
      }

      const requestData = requestDurationTracker.get(details.requestId);

      try {
        if (requestData) {
          // Calculate request duration
          const endTime = Date.now();
          const duration = endTime - requestData.startTime;

          requestData.endTime = endTime;
          requestData.duration = duration;

          const hostname = new URL(details.url).hostname;
          const provider = getProviderByHostname(hostname);

          if (provider && shouldInterceptRequest(details, provider)) {
            // Calculate adaptive impact based on duration only
            let carbonImpact: number;
            let waterImpact: number;

            // Handle adaptive or fixed values
            if (typeof provider.metrics.carbon === "number") {
              carbonImpact = provider.metrics.carbon;
            } else {
              // Use calculateAdaptiveImpact for adaptive values
              carbonImpact = calculateAdaptiveImpact(
                provider.metrics.carbon,
                duration,
                provider.metrics.durationThresholds
              );
            }

            if (typeof provider.metrics.water === "number") {
              waterImpact = provider.metrics.water;
            } else {
              // Use calculateAdaptiveImpact for adaptive values
              waterImpact = calculateAdaptiveImpact(
                provider.metrics.water,
                duration,
                provider.metrics.durationThresholds
              );
            }

            logger.info("📊 Request completed", {
              provider: provider.name,
              duration: formatDuration(duration),
              carbonImpact,
              waterImpact,
            });

            // Record request with adaptive metrics
            const aiRequest: AIRequest = {
              service: provider.name,
              carbonImpact: carbonImpact,
              waterImpact: waterImpact,
              duration: duration,
              timestamp: Date.now(),
              url: details.url,
              method: details.method,
            };

            await ReactiveStorage.recordAIRequest(aiRequest);

            // Try to save to database if user is authenticated and opted-in
            try {
              const authUser = await browser.storage.local.get(["authUser"]);
              if (authUser.authUser?.id) {
                // Convert to new consumption metrics format
                const consumptionMetrics = {
                  timestamp: new Date(aiRequest.timestamp).toISOString(),
                  energy_usage_wh: Math.round(carbonImpact * 0.5), // Rough conversion
                  co2_emissions_g: carbonImpact,
                  token_count: estimateTokenCount(aiRequest.service),
                  conversation_id: `${aiRequest.service}-${aiRequest.timestamp}-${Math.random().toString(36).substr(2, 9)}`,
                  model_used: aiRequest.service,
                  duration_ms: duration,
                  water_consumption_ml: Math.round(waterImpact), // Convert to ml
                };

                // Save to database (will check opt-in status)
                await DatabaseService.saveConsumptionMetrics(
                  authUser.authUser.id,
                  consumptionMetrics
                );
              }
            } catch (dbError) {
              // Silent fail - database save is optional
              logger.log("ℹ️ Database save failed (optional):", dbError);
            }
          }

          // Mark request end
          await ReactiveStorage.markRequestEnd(
            provider?.name || "unknown",
            details.requestId
          );
        } else {
          // Only warn if this is not a known provider request
          try {
            const hostname = new URL(details.url).hostname;
            const provider = getProviderByHostname(hostname);

            if (provider && shouldInterceptRequest(details, provider)) {
              logger.warn(
                "⚠️ No tracking data found for",
                details.requestId,
                "- possible race condition during cleanup"
              );
            }
            // Silent skip for non-provider requests or cleaned up requests
          } catch (_urlError) {
            // Invalid URL, skip silently
          }
        }
      } catch (error) {
        logger.error("❌ Error in handleResponseCompleted:", error);
      } finally {
        requestDurationTracker.delete(details.requestId);
      }
    } catch (error) {
      logger.error("❌ Critical error handleResponseCompleted:", error);
      requestDurationTracker.delete(details.requestId);
    }
  }

  async function handleRequestError(details: any) {
    try {
      logger.warn(
        "⚠️ Request error detected:",
        details.requestId,
        details.error
      );

      const hostname = new URL(details.url).hostname;
      const provider = getProviderByHostname(hostname);
      if (provider) {
        await ReactiveStorage.markRequestEnd(provider.name, details.requestId);
      }

      requestDurationTracker.delete(details.requestId);
      logger.log("🧹 State cleaned for error request:", details.requestId);
    } catch (error) {
      logger.error("❌ Error during error request cleanup:", error);
    }
  }

  // Simple token count estimation
  function estimateTokenCount(service: string): number {
    const baseTokens = {
      ChatGPT: 325,
      Claude: 300,
      "Google Gemini": 280,
    };

    return baseTokens[service as keyof typeof baseTokens] || 325;
  }
});
