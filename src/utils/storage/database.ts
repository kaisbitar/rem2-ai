// src/utils/storage/database.ts - Simple database operations
import { supabase } from "../../config/supabase-client";
import { logger } from "../core/logger";

export interface DatabaseUsageData {
	timestamp: string;
	energy_usage_wh: number;
	co2_emissions_g: number;
	token_count: number;
	conversation_id: string;
	model_used: string;
}

export interface DatabaseDonation {
	amount: number;
	m2_restored: number;
	donation_date: string;
}

/**
 * Simple database service for saving data when users opt-in
 */
export class DatabaseService {
	/**
	 * Save usage data to database if user is authenticated and opted-in
	 */
	static async saveUsageData(
		userId: string,
		usageData: DatabaseUsageData,
	): Promise<boolean> {
		try {
			// Check if user profile exists and is opted-in
			const { data: profile, error: profileError } = await supabase
				.from("user_profiles")
				.select("opt_in_status")
				.eq("id", userId)
				.single();

			if (profileError) {
				logger.log("ℹ️ User profile not found, skipping database save");
				return false;
			}

			if (!profile.opt_in_status) {
				logger.log("ℹ️ User not opted in, skipping database save");
				return false;
			}

			// Save to database
			const { error } = await supabase.from("usage_data").insert({
				...usageData,
				user_id: userId,
			});

			if (error) {
				logger.error("❌ Error saving usage data:", error);
				return false;
			}

			logger.log("✅ Usage data saved to database");
			return true;
		} catch (error) {
			logger.error("❌ Error in saveUsageData:", error);
			return false;
		}
	}

	/**
	 * Save donation to database if user is authenticated and opted-in
	 */
	static async saveDonation(
		userId: string,
		donation: DatabaseDonation,
	): Promise<boolean> {
		try {
			// Check if user profile exists and is opted-in
			const { data: profile, error: profileError } = await supabase
				.from("user_profiles")
				.select("opt_in_status")
				.eq("id", userId)
				.single();

			if (profileError) {
				logger.log("ℹ️ User profile not found, skipping database save");
				return false;
			}

			if (!profile.opt_in_status) {
				logger.log("ℹ️ User not opted in, skipping database save");
				return false;
			}

			// Save to database
			const { error } = await supabase.from("donations").insert({
				...donation,
				user_id: userId,
			});

			if (error) {
				logger.error("❌ Error saving donation:", error);
				return false;
			}

			logger.log("✅ Donation saved to database");
			return true;
		} catch (error) {
			logger.error("❌ Error in saveDonation:", error);
			return false;
		}
	}

	/**
	 * Get user's usage data from database
	 */
	static async getUserUsageData(userId: string, limit = 50): Promise<any[]> {
		try {
			const { data, error } = await supabase
				.from("usage_data")
				.select("*")
				.eq("user_id", userId)
				.order("timestamp", { ascending: false })
				.limit(limit);

			if (error) {
				logger.error("❌ Error getting user usage data:", error);
				return [];
			}

			return data || [];
		} catch (error) {
			logger.error("❌ Error in getUserUsageData:", error);
			return [];
		}
	}

	/**
	 * Get user's donations from database
	 */
	static async getUserDonations(userId: string): Promise<any[]> {
		try {
			const { data, error } = await supabase
				.from("donations")
				.select("*")
				.eq("user_id", userId)
				.order("donation_date", { ascending: false });

			if (error) {
				logger.error("❌ Error getting user donations:", error);
				return [];
			}

			return data || [];
		} catch (error) {
			logger.error("❌ Error in getUserDonations:", error);
			return [];
		}
	}
}
