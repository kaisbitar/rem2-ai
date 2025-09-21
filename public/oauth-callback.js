// This page handles the OAuth callback from the website
// It will write tokens to extension storage so popup/background can adopt the session

console.log("🔄 OAuth callback script loaded");

async function setSessionInExtension(accessToken, refreshToken, expiresAt) {
  try {
    const session = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    if (expiresAt) session.expires_at = Number(expiresAt) || undefined;

    await chrome.storage.local.set({ supabaseSession: session });
    console.log("✅ Tokens stored in chrome.storage.local");
  } catch (e) {
    console.error("❌ Failed to store tokens:", e);
  }
}

(async () => {
  try {
    const hash = new URLSearchParams((location.hash || "").replace(/^#/, ""));
    const query = new URLSearchParams(location.search || "");
    const accessToken = hash.get("access_token") || query.get("access_token");
    const refreshToken =
      hash.get("refresh_token") || query.get("refresh_token");
    const expiresAt = hash.get("expires_at") || query.get("expires_at");

    if (accessToken && refreshToken) {
      await setSessionInExtension(accessToken, refreshToken, expiresAt);
    } else {
      console.log("ℹ️ No tokens found in callback URL");
    }
  } catch (e) {
    console.error("❌ Error parsing callback params:", e);
  }

  // If opened by the extension, notify and close
  if (window.opener) {
    try {
      window.opener.postMessage(
        { type: "SUPABASE_AUTH_SUCCESS", timestamp: Date.now() },
        "*"
      );
      setTimeout(() => window.close(), 800);
    } catch (error) {
      console.error("❌ Error notifying parent:", error);
      setTimeout(() => window.close(), 1500);
    }
    return;
  }

  // If not a popup, show completion message
  setTimeout(() => {
    const container = document.querySelector(".container");
    if (container) {
      container.innerHTML =
        "<h1>✅ Authentication Complete!</h1><p>You can now close this window and return to your extension.</p>";
    }
  }, 1200);
})();
