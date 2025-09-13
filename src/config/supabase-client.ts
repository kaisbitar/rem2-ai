// src/config/supabase-client.ts - Supabase client for Chrome extension
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "./supabase-config";

// Use configuration from the config file
const SUPABASE_URL = SUPABASE_CONFIG.url;
const SUPABASE_ANON_KEY = SUPABASE_CONFIG.anonKey;

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error(
		"Missing Supabase configuration. Please check your configuration file.",
	);
}

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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

// Compute and export Supabase's localStorage key (used for manual cleanup on signout)
const PROJECT_REF = new URL(SUPABASE_URL).hostname.split(".")[0];
export const SUPABASE_STORAGE_KEY = `sb-${PROJECT_REF}-auth-token`;

// Export configuration for debugging
export const supabaseConfig = {
	environment: SUPABASE_CONFIG.environment,
	url: SUPABASE_URL,
	hasAnonKey: !!SUPABASE_ANON_KEY,
};

// Export types for use in the extension
export type { SupabaseClient } from "@supabase/supabase-js";
