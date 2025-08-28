// src/config/supabase-client.ts - Supabase client for Chrome extension
import { createClient } from "@supabase/supabase-js";

// Development configuration (hardcoded for Chrome extension)
const SUPABASE_URL = "https://golidwlfnfabmothqipx.supabase.co";
const SUPABASE_ANON_KEY =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvbGlkd2xmbmZhYm1vdGhxaXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDkzODIsImV4cCI6MjA2NzM4NTM4Mn0.HH2a3IFhuWeZXPvTu_Ub9BgAwdLtwLVFrIUtHW93nMc";

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
	environment: "development",
	url: SUPABASE_URL,
	hasAnonKey: !!SUPABASE_ANON_KEY,
};

// Export types for use in the extension
export type { SupabaseClient } from "@supabase/supabase-js";
