// src/utils/supabase/test-connection.ts - Test Supabase connection
import { supabase, supabaseConfig } from "../../config/supabase-client";

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

    // Test basic connection by checking if our tables exist
    const { data: profiles, error: profilesError } = await supabase
      .from("user_profiles")
      .select("count")
      .limit(1);

    if (profilesError) {
      console.error("❌ Error accessing user_profiles table:", profilesError);
      return { success: false, error: profilesError.message };
    }

    console.log("✅ user_profiles table accessible", profiles);

    // Test usage_data table
    const { data: usage, error: usageError } = await supabase
      .from("usage_data")
      .select("count")
      .limit(1);

    if (usageError) {
      console.error("❌ Error accessing usage_data table:", usageError);
      return { success: false, error: usageError.message };
    }

    console.log("✅ usage_data table accessible", usage);

    // Test donations table
    const { data: donations, error: donationsError } = await supabase
      .from("donations")
      .select("count")
      .limit(1);

    if (donationsError) {
      console.error("❌ Error accessing donations table:", donationsError);
      return { success: false, error: donationsError.message };
    }

    console.log("✅ donations table accessible", donations);

    console.log("✅ Supabase connection successful! All tables accessible.");
    return { success: true, message: "All tables accessible" };
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

/**
 * Test database operations
 * Use this to verify database operations work
 */
export async function testDatabaseOperations() {
  try {
    console.log("🗄️ Testing database operations...");

    // Test inserting a test user profile
    const testUserId = `test-${Date.now()}`;
    const { error: insertError } = await supabase.from("user_profiles").insert({
      id: testUserId,
      email: `test-${Date.now()}@example.com`,
      opt_in_status: true,
      last_active: new Date().toISOString(),
    });

    if (insertError) {
      console.error("❌ Error inserting test profile:", insertError);
      return { success: false, error: insertError.message };
    }

    console.log("✅ Test profile inserted successfully", insertError);

    // Test inserting test usage data
    const { error: usageError } = await supabase.from("usage_data").insert({
      user_id: testUserId,
      timestamp: new Date().toISOString(),
      energy_usage_wh: 100,
      co2_emissions_g: 50,
      token_count: 100,
      conversation_id: `test-${Date.now()}`,
      model_used: "TestModel",
    });

    if (usageError) {
      console.error("❌ Error inserting test usage data:", usageError);
      return { success: false, error: usageError.message };
    }

    console.log("✅ Test usage data inserted successfully", usageError);

    // Clean up test data
    await supabase.from("usage_data").delete().eq("user_id", testUserId);
    await supabase.from("user_profiles").delete().eq("id", testUserId);

    console.log("✅ Test data cleaned up successfully");
    console.log("✅ Database operations test successful!");

    return { success: true, message: "Database operations working" };
  } catch (error) {
    console.error("❌ Database operations test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
