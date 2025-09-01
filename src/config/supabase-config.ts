// src/config/supabase-config.ts - Supabase configuration
// This file contains the Supabase credentials for the extension
// NOTE: These are PUBLIC credentials (anon key) meant for client-side use
// They are NOT secret keys and are safe to include in the extension bundle

export const SUPABASE_CONFIG = {
  url: "https://golidwlfnfabmothqipx.supabase.co",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvbGlkd2xmbmZhYm1vdGhxaXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDkzODIsImV4cCI6MjA2NzM4NTM4Mn0.HH2a3IFhuWeZXPvTu_Ub9BgAwdLtwLVFrIUtHW93nMc",
  environment: "development",
} as const;
