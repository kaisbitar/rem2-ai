// src/utils/storage/database.ts - Single source of truth for database operations
import { supabase } from "../../config/supabase-client";
import { logger } from "../core/logger";

// Clean, focused interfaces for database operations
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

export interface UserProfile {
	id: string;
	email: string;
	opt_in_status: boolean;
	created_at: string;
	last_active: string;
}

export interface UsageDataRecord extends DatabaseUsageData {
	id: string;
	user_id: string;
}

export interface DonationRecord extends DatabaseDonation {
	id: string;
	user_id: string;
}

/**
 * Single source of truth for all database operations
 * Follows clean architecture principles with clear separation of concerns
 */
export class DatabaseService {
	/**
	 * Save usage data to database if user is authenticated and opted-in
	 * @param userId - The user's unique identifier
	 * @param usageData - The usage data to save
	 * @returns Promise<boolean> - Success status
	 */
	static async saveUsageData(
		userId: string,
		usageData: DatabaseUsageData,
	): Promise<boolean> {
		try {
			logger.log(`💾 Attempting to save usage data for user: ${userId}`);

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

			logger.log("✅ Usage data saved to database successfully");
			return true;
		} catch (error) {
			logger.error("❌ Unexpected error in saveUsageData:", error);
			return false;
		}
	}

	/**
	 * Save donation to database if user is authenticated and opted-in
	 * @param userId - The user's unique identifier
	 * @param donation - The donation data to save
	 * @returns Promise<boolean> - Success status
	 */
	static async saveDonation(
		userId: string,
		donation: DatabaseDonation,
	): Promise<boolean> {
		try {
			logger.log(`💾 Attempting to save donation for user: ${userId}`);

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

			logger.log("✅ Donation saved to database successfully");
			return true;
		} catch (error) {
			logger.error("❌ Unexpected error in saveDonation:", error);
			return false;
		}
	}

	/**
	 * Get user's usage data from database
	 * @param userId - The user's unique identifier
	 * @param limit - Maximum number of records to return
	 * @returns Promise<UsageDataRecord[]> - Array of usage data records
	 */
	static async getUserUsageData(
		userId: string,
		limit = 50,
	): Promise<UsageDataRecord[]> {
		try {
			logger.log(`📖 Fetching usage data for user: ${userId}, limit: ${limit}`);

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

			logger.log(`✅ Retrieved ${data?.length || 0} usage records`);
			return (data as UsageDataRecord[]) || [];
		} catch (error) {
			logger.error("❌ Unexpected error in getUserUsageData:", error);
			return [];
		}
	}

	/**
	 * Get user's donations from database
	 * @param userId - The user's unique identifier
	 * @returns Promise<DonationRecord[]> - Array of donation records
	 */
	static async getUserDonations(userId: string): Promise<DonationRecord[]> {
		try {
			logger.log(`📖 Fetching donations for user: ${userId}`);

			const { data, error } = await supabase
				.from("donations")
				.select("*")
				.eq("user_id", userId)
				.order("donation_date", { ascending: false });

			if (error) {
				logger.error("❌ Error getting user donations:", error);
				return [];
			}

			logger.log(`✅ Retrieved ${data?.length || 0} donation records`);
			return (data as DonationRecord[]) || [];
		} catch (error) {
			logger.error("❌ Unexpected error in getUserDonations:", error);
			return [];
		}
	}

	/**
	 * Get user profile from database
	 * @param userId - The user's unique identifier
	 * @returns Promise<UserProfile | null> - User profile or null if not found
	 */
	static async getUserProfile(userId: string): Promise<UserProfile | null> {
		try {
			logger.log(`📖 Fetching user profile for: ${userId}`);

			const { data, error } = await supabase
				.from("user_profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) {
				logger.error("❌ Error getting user profile:", error);
				return null;
			}

			logger.log("✅ User profile retrieved successfully");
			return data as UserProfile;
		} catch (error) {
			logger.error("❌ Unexpected error in getUserProfile:", error);
			return null;
		}
	}

	/**
	 * Update user profile in database
	 * @param userId - The user's unique identifier
	 * @param updates - Partial profile data to update
	 * @returns Promise<boolean> - Success status
	 */
	static async updateUserProfile(
		userId: string,
		updates: Partial<UserProfile>,
	): Promise<boolean> {
		try {
			logger.log(`🔄 Updating user profile for: ${userId}`);

			const { error } = await supabase
				.from("user_profiles")
				.update({
					...updates,
					last_active: new Date().toISOString(),
				})
				.eq("id", userId);

			if (error) {
				logger.error("❌ Error updating user profile:", error);
				return false;
			}

			logger.log("✅ User profile updated successfully");
			return true;
		} catch (error) {
			logger.error("❌ Unexpected error in updateUserProfile:", error);
			return false;
		}
	}

	/**
	 * Check if user is opted-in to database storage
	 * @param userId - The user's unique identifier
	 * @returns Promise<boolean> - True if opted-in, false otherwise
	 */
	static async isUserOptedIn(userId: string): Promise<boolean> {
		try {
			const profile = await DatabaseService.getUserProfile(userId);
			return profile?.opt_in_status || false;
		} catch (error) {
			logger.error("❌ Error checking opt-in status:", error);
			return false;
		}
	}
}
