// Environment variables utility
export const getSiteUrl = (): string => {
  // In development, use localhost:8080
  if (process.env.NODE_ENV === "development") {
    return process.env.SITE_URL || "http://localhost:8080";
  }

  // In production, use the production URL
  return process.env.SITE_URL || "https://aim2balance.ai";
};

// Extension IDs for different environments
export const getExtensionId = (): string => {
  // In development, use dev extension ID
  if (process.env.NODE_ENV === "development") {
    return process.env.EXTENSION_ID || "lhgikpiaojfeedbpjkkoonlbpmcofcme";
  }

  // In production, use production extension ID
  return process.env.EXTENSION_ID || "pnbbhdppaaffplcnagfllgcoglcpdghc";
};

// Get the OAuth callback URL for the current environment
export const getOAuthCallbackUrl = (): string => {
  const extensionId = getExtensionId();
  return `chrome-extension://${extensionId}/oauth-callback.html`;
};

// Get the complete login URL with OAuth callback
export const getLoginUrl = (): string => {
  const siteBase = getSiteUrl();
  const callbackUrl = getOAuthCallbackUrl();
  const loginUrl = new URL("/login", siteBase);
  loginUrl.searchParams.set("ext", "1");
  loginUrl.searchParams.set("redirect_uri", callbackUrl);
  return loginUrl.toString();
};

// Google OAuth configuration
export const getGoogleClientId = (): string => {
  return (
    process.env.GOOGLE_CLIENT_ID ||
    "242222187660-5mek55oakpfp9ci3a9b4uul12417sspb.apps.googleusercontent.com"
  );
};
