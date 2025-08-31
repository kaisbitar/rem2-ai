// src/config/supabase-client.ts - Supabase client for Chrome extension
import { createClient } from "@supabase/supabase-js";

// Environment-based configuration (secure and flexible)
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error(
		"Missing Supabase configuration. Please check your environment variables.",
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

// Export configuration for debugging
export const supabaseConfig = {
	environment: process.env.NODE_ENV || "development",
	url: SUPABASE_URL,
	hasAnonKey: !!SUPABASE_ANON_KEY,
};

// Export types for use in the extension
export type { SupabaseClient } from "@supabase/supabase-js";
