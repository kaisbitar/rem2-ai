// supabase.config.ts - Supabase configuration and client setup
import { createClient } from "@supabase/supabase-js";

// Environment configuration
const config = {
  development: {
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || "",
  },
  production: {
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || "",
  },
};

// Get current environment
const environment = process.env.NODE_ENV || "development";
const currentConfig = config[environment as keyof typeof config];

// Validate configuration
if (!currentConfig.url || !currentConfig.anonKey) {
  throw new Error(
    `Missing Supabase configuration for ${environment} environment. ` +
      `Please check your .env.${environment} file.`
  );
}

// Create and export Supabase client
export const supabase = createClient(currentConfig.url, currentConfig.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Export configuration for debugging
export const supabaseConfig = {
  environment,
  url: currentConfig.url,
  hasAnonKey: !!currentConfig.anonKey,
};

// Export types for use in the extension
export type { SupabaseClient } from "@supabase/supabase-js";
