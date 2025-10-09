// src/utils/storage/database.ts - Single source of truth for database operations
import { supabase } from "../../config/supabase-client";
import { logger } from "../core/logger";
import { CARBON_CONVERSION_FACTORS } from "../constants/conversions";

// Clean, focused interfaces for database operations
export interface ConsumptionMetrics {
  timestamp: string;
  energy_usage_wh: number;
  co2_emissions_g: number;
  token_count: number;
  conversation_id: string;
  model_used: string;
  duration_ms: number;
  water_consumption_ml: number;
}

export interface RestorationAction {
  action_date: string;
  action_type: "donation" | "volunteer" | "offset";
  amount: number;
  m2_restored: number;
  trees_planted: number;
  peatland_rewetted_m2: number;
  habitat_restored_m2: number;
  organization?: string;
  project_name?: string;
  verification_status?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  opt_in_status: boolean;

  // Balance tracking
  total_m2_consumed: number;
  total_m2_restored: number;

  // Restoration totals
  total_trees_planted: number;
  total_peatland_rewetted: number;
  total_habitat_restored: number;

  // Payment history
  last_donation_date?: string;
  last_donation_amount?: number;

  // Gamification
  streak_days?: number;
  badges?: string[];
  weekly_goal?: number;
  monthly_goal?: number;

  // Timestamps
  created_at: string;
  last_active: string;
}

export interface Donation {
  id: string;
  user_id?: string;
  payment_session_id?: string;
  amount: number;
  m2_restored: number;
  donation_date: string;
  receipt_url?: string;
}
export interface ConsumptionMetricsRecord extends ConsumptionMetrics {
  id: string;
  user_id: string;
}

export interface RestorationActionRecord extends RestorationAction {
  id: string;
  user_id: string;
}

/**
 * Single source of truth for all database operations
 * Follows clean architecture principles with clear separation of concerns
 */
export class DatabaseService {
  /**
   * Save consumption metrics to database if user is authenticated and opted-in
   * @param userId - The user's unique identifier
   * @param metrics - The consumption metrics to save
   * @returns Promise<boolean> - Success status
   */
  static async saveConsumptionMetrics(
    userId: string,
    metrics: ConsumptionMetrics
  ): Promise<boolean> {
    try {
      logger.log(
        `💾 Attempting to save consumption metrics for user: ${userId}`
      );

      // Check if user profile exists and is opted-in
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("opt_in_status")
        .eq("id", userId)
        .single();

      if (profileError) {
        logger.log("ℹ️ User profile not found, skipping database save");
        return false;
      }

      if (!profile.opt_in_status) {
        logger.log("ℹ️ User not opted in, skipping database save");
        return false;
      }

      // Save to database
      const { error } = await supabase.from("consumption_metrics").insert({
        ...metrics,
        user_id: userId,
      });

      if (error) {
        logger.error("❌ Error saving consumption metrics:", error);
        return false;
      }

      // Update user profile totals
      await DatabaseService.updateUserConsumptionTotals(userId);

      logger.log("✅ Consumption metrics saved to database successfully");
      return true;
    } catch (error) {
      logger.error("❌ Unexpected error in saveConsumptionMetrics:", error);
      return false;
    }
  }

  /**
   * Get user's consumption metrics from database
   * @param userId - The user's unique identifier
   * @param limit - Maximum number of records to return
   * @param fromIso - Optional ISO string (inclusive lower bound)
   * @param toIso - Optional ISO string (exclusive upper bound)
   * @returns Promise<ConsumptionMetricsRecord[]>
   */
  static async getUserConsumptionMetrics(
    userId: string,
    limit = 50,
    fromIso?: string,
    toIso?: string
  ): Promise<ConsumptionMetricsRecord[]> {
    try {
      logger.log(
        `📖 Fetching consumption metrics for user: ${userId}, limit: ${limit}`
      );

      // Get session from Chrome storage
      const storageResult = await chrome.storage.local.get(["supabaseSession"]);

      if (!storageResult.supabaseSession) {
        logger.log("ℹ️ No session found, user not authenticated");
        return [];
      }

      // Import config
      const { SUPABASE_CONFIG } = await import("../../config/supabase-config");

      // Build PostgREST query URL
      let queryUrl = `${SUPABASE_CONFIG.url}/rest/v1/consumption_metrics`;
      const params = new URLSearchParams();
      params.append("user_id", `eq.${userId}`);
      params.append("select", "*");
      params.append("order", "timestamp.desc");
      params.append("limit", limit.toString());

      if (fromIso) {
        params.append("timestamp", `gte.${fromIso}`);
      }
      if (toIso) {
        params.append("timestamp", `lt.${toIso}`);
      }

      queryUrl += `?${params.toString()}`;

      // Make direct HTTP request to Supabase REST API
      const response = await fetch(queryUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storageResult.supabaseSession.access_token}`,
          apikey: SUPABASE_CONFIG.anonKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(
          `❌ HTTP error: ${response.status} ${response.statusText} - ${errorText}`
        );
        return [];
      }

      const data = await response.json();
      console.log(data);
      logger.log(`✅ Retrieved ${data?.length || 0} consumption records`);
      return (data as ConsumptionMetricsRecord[]) || [];
    } catch (error) {
      logger.error("❌ Error fetching consumption metrics:", error);
      return [];
    }
  }

  /**
   * Get user's restoration actions from database
   * @param userId - The user's unique identifier
   * @returns Promise<RestorationActionRecord[]> - Array of restoration action records
   */
  static async getUserRestorationActions(
    userId: string
  ): Promise<RestorationActionRecord[]> {
    try {
      logger.log(`📖 Fetching restoration actions for user: ${userId}`);

      // Get session from Chrome storage
      const storageResult = await chrome.storage.local.get(["supabaseSession"]);

      if (!storageResult.supabaseSession) {
        logger.log("ℹ️ No session found, user not authenticated");
        return [];
      }

      // Import config
      const { SUPABASE_CONFIG } = await import("../../config/supabase-config");

      // Build PostgREST query URL
      const queryUrl = `${SUPABASE_CONFIG.url}/rest/v1/restoration_actions?user_id=eq.${userId}&select=*&order=action_date.desc`;

      // Make direct HTTP request
      const response = await fetch(queryUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storageResult.supabaseSession.access_token}`,
          apikey: SUPABASE_CONFIG.anonKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(
          `❌ HTTP error: ${response.status} ${response.statusText} - ${errorText}`
        );
        return [];
      }

      const data = await response.json();
      logger.log(`✅ Retrieved ${data?.length || 0} restoration records`);
      return (data as RestorationActionRecord[]) || [];
    } catch (error) {
      logger.error("❌ Error fetching restoration actions:", error);
      return [];
    }
  }

  /**
   * Get user profile from database
   * @param userId - The user's unique identifier
   * @returns Promise<UserProfile | null> - User profile or null if not found
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      logger.log(`📖 Fetching user profile for: ${userId}`);

      // Get session from Chrome storage
      const storageResult = await chrome.storage.local.get(["supabaseSession"]);

      if (!storageResult.supabaseSession) {
        logger.log("ℹ️ No session found, user not authenticated");
        return null;
      }

      // Import config
      const { SUPABASE_CONFIG } = await import("../../config/supabase-config");

      // Build PostgREST query URL
      const queryUrl = `${SUPABASE_CONFIG.url}/rest/v1/user_profiles?id=eq.${userId}&select=*`;

      // Make direct HTTP request
      const response = await fetch(queryUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storageResult.supabaseSession.access_token}`,
          apikey: SUPABASE_CONFIG.anonKey,
          "Content-Type": "application/json",
          Accept: "application/vnd.pgrst.object+json", // Return single object
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(
          `❌ HTTP error: ${response.status} ${response.statusText} - ${errorText}`
        );
        return null;
      }

      const data = await response.json();

      // PostgREST returns array by default, get first item
      const profile = Array.isArray(data) ? data[0] : data;

      if (!profile) {
        logger.log("ℹ️ User profile not found");
        return null;
      }

      logger.log("✅ User profile retrieved successfully");
      return profile as UserProfile;
    } catch (error) {
      logger.error("❌ Error fetching user profile:", error);
      return null;
    }
  }

  /**
   * Update user profile in database
   * @param userId - The user's unique identifier
   * @param updates - Partial profile data to update
   * @returns Promise<boolean> - Success status
   */
  static async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<boolean> {
    try {
      logger.log(`🔄 Updating user profile for: ${userId}`);

      const { error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          last_active: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        logger.error("❌ Error updating user profile:", error);
        return false;
      }

      logger.log("✅ User profile updated successfully");
      return true;
    } catch (error) {
      logger.error("❌ Unexpected error in updateUserProfile:", error);
      return false;
    }
  }

  /**
   * Update user consumption totals from consumption_metrics table
   * @param userId - The user's unique identifier
   * @returns Promise<boolean> - Success status
   */
  private static async updateUserConsumptionTotals(
    userId: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("consumption_metrics")
        .select("co2_emissions_g")
        .eq("user_id", userId);

      if (error) {
        logger.error("❌ Error calculating consumption totals:", error);
        return false;
      }

      const totalCo2 =
        data?.reduce((sum, record) => sum + (record.co2_emissions_g || 0), 0) ||
        0;

      // Convert CO2 to m2 using the same factor as real-time calculations
      const totalConsumedM2 = totalCo2 * CARBON_CONVERSION_FACTORS.CO2_TO_M2;

      await DatabaseService.updateUserProfile(userId, {
        total_m2_consumed: totalConsumedM2,
      });

      return true;
    } catch (error) {
      logger.error("❌ Error updating consumption totals:", error);
      return false;
    }
  }

  /**
   * Check if user is opted-in to database storage
   * @param userId - The user's unique identifier
   * @returns Promise<boolean> - True if opted-in, false otherwise
   */
  static async isUserOptedIn(userId: string): Promise<boolean> {
    try {
      const profile = await DatabaseService.getUserProfile(userId);
      return profile?.opt_in_status || false;
    } catch (error) {
      logger.error("❌ Error checking opt-in status:", error);
      return false;
    }
  }
}
