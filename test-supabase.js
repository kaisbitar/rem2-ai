#!/usr/bin/env node

// test-supabase.js - Simple script to test Supabase connection
// Run with: node test-supabase.js

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.development" });

// Get configuration from environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log("🔧 Testing Supabase Connection...");
console.log("=====================================");
console.log("Environment:", process.env.NODE_ENV || "development");
console.log("URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
console.log("Anon Key:", supabaseAnonKey ? "✅ Set" : "❌ Missing");
console.log("");

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing configuration!");
  console.error("Please check your .env.development file");
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
async function testConnection() {
  try {
    console.log("🔄 Testing connection...");

    // Test basic connection by trying to access a non-existent table
    // This will fail with a "table doesn't exist" error, but confirms connection works
    const { data, error } = await supabase
      .from("_test_connection_table")
      .select("*")
      .limit(1);

    if (error && error.code === "42P01") {
      // Table doesn't exist, but connection is working
      console.log("✅ Connection successful!");
      console.log(
        "   (Table not found error is expected and confirms connection works)"
      );
      return true;
    }

    if (error) {
      console.error("❌ Connection error:", error.message);
      return false;
    }

    console.log("✅ Connection successful!");
    return true;
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    return false;
  }
}

// Test authentication
async function testAuth() {
  try {
    console.log("🔄 Testing authentication...");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("❌ Auth test failed:", error.message);
      return false;
    }

    console.log("✅ Authentication working!");
    console.log(
      "   Current user:",
      user ? "Authenticated" : "Not authenticated"
    );
    return true;
  } catch (error) {
    console.error("❌ Auth test failed:", error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log("🚀 Starting Supabase tests...\n");

  const connectionTest = await testConnection();
  console.log("");

  const authTest = await testAuth();
  console.log("");

  // Summary
  console.log("📊 Test Results:");
  console.log("================");
  console.log("Connection:", connectionTest ? "✅ PASS" : "❌ FAIL");
  console.log("Authentication:", authTest ? "✅ PASS" : "❌ FAIL");
  console.log("");

  if (connectionTest && authTest) {
    console.log(
      "🎉 All tests passed! Your Supabase setup is working correctly."
    );
    console.log("");
    console.log("Next steps:");
    console.log("1. Set up your database tables in Supabase");
    console.log("2. Start implementing features in your extension");
    console.log("3. Test real-time subscriptions");
  } else {
    console.log("⚠️  Some tests failed. Please check your configuration.");
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error("❌ Test runner failed:", error);
  process.exit(1);
});
