// src/utils/supabase/test-connection.ts - Test Supabase connection
import { supabase, supabaseConfig } from "../../../supabase.config";

/**
 * Test the Supabase connection
 * Use this to verify your configuration is working
 */
export async function testSupabaseConnection() {
	try {
		console.log("🔧 Testing Supabase connection...");
		console.log("Environment:", supabaseConfig.environment);
		console.log("URL:", supabaseConfig.url);
		console.log("Has Anon Key:", supabaseConfig.hasAnonKey);

		// Test basic connection by getting server timestamp
		const { data, error } = await supabase
			.from("_dummy_table_test")
			.select("*")
			.limit(1);

		// We expect an error for a non-existent table, but this confirms connection works
		if (error && error.code === "42P01") {
			// Table doesn't exist, but connection is working
			console.log(
				"✅ Supabase connection successful! (Table not found is expected)",
			);
			return { success: true, message: "Connection working" };
		}

		if (error) {
			console.error("❌ Supabase connection error:", error);
			return { success: false, error: error.message };
		}

		console.log("✅ Supabase connection successful!");
		return { success: true, message: "Connection working" };
	} catch (error) {
		console.error("❌ Supabase connection failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Test authentication (optional)
 * Use this to verify auth is working
 */
export async function testSupabaseAuth() {
	try {
		console.log("🔐 Testing Supabase authentication...");

		// Test getting current user (should be null if not authenticated)
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) {
			console.error("❌ Auth test failed:", error);
			return { success: false, error: error.message };
		}

		console.log("✅ Auth test successful!");
		console.log("Current user:", user ? "Authenticated" : "Not authenticated");

		return {
			success: true,
			message: "Auth working",
			user: user ? "authenticated" : "not_authenticated",
		};
	} catch (error) {
		console.error("❌ Auth test failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
