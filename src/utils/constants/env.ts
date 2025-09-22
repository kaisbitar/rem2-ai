// Environment variables utility
export const getSiteUrl = (): string => {
  // In development, use localhost:8080
  if (process.env.NODE_ENV === "development") {
    return process.env.SITE_URL || "http://localhost:8080";
  }

  // In production, use the production URL
  return process.env.SITE_URL || "https://aim2balance.ai";
};
