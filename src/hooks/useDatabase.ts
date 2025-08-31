// src/hooks/useDatabase.ts - Clean database operations hook
import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
	DatabaseService,
	type DatabaseUsageData,
	type DatabaseDonation,
} from "@/utils/storage/database";

/**
 * Custom hook for database operations
 * Provides a clean, React-friendly interface to the DatabaseService
 */
export const useDatabase = () => {
	const { user } = useAuth();

	/**
	 * Save usage data to database (only if user is opted-in)
	 */
	const saveUsageData = useCallback(
		async (data: DatabaseUsageData): Promise<boolean> => {
			if (!user?.id) {
				console.log("ℹ️ User not authenticated, skipping database save");
				return false;
			}

			return await DatabaseService.saveUsageData(user.id, data);
		},
		[user?.id],
	);

	/**
	 * Save donation to database (only if user is opted-in)
	 */
	const saveDonation = useCallback(
		async (data: DatabaseDonation): Promise<boolean> => {
			if (!user?.id) {
				console.log("ℹ️ User not authenticated, skipping database save");
				return false;
			}

			return await DatabaseService.saveDonation(user.id, data);
		},
		[user?.id],
	);

	/**
	 * Get user's usage data from database
	 */
	const getUserUsageData = useCallback(
		async (limit = 50) => {
			if (!user?.id) {
				console.log("ℹ️ User not authenticated, cannot fetch usage data");
				return [];
			}

			return await DatabaseService.getUserUsageData(user.id, limit);
		},
		[user?.id],
	);

	/**
	 * Get user's donations from database
	 */
	const getUserDonations = useCallback(async () => {
		if (!user?.id) {
			console.log("ℹ️ User not authenticated, cannot fetch donations");
			return [];
		}

		return await DatabaseService.getUserDonations(user.id);
	}, [user?.id]);

	/**
	 * Get user profile from database
	 */
	const getUserProfile = useCallback(async () => {
		if (!user?.id) {
			console.log("ℹ️ User not authenticated, cannot fetch profile");
			return null;
		}

		return await DatabaseService.getUserProfile(user.id);
	}, [user?.id]);

	/**
	 * Update user profile in database
	 */
	const updateUserProfile = useCallback(
		async (updates: { opt_in_status?: boolean; email?: string }) => {
			if (!user?.id) {
				console.log("ℹ️ User not authenticated, cannot update profile");
				return false;
			}

			return await DatabaseService.updateUserProfile(user.id, updates);
		},
		[user?.id],
	);

	/**
	 * Check if user is opted-in to database storage
	 */
	const isUserOptedIn = useCallback(async (): Promise<boolean> => {
		if (!user?.id) {
			return false;
		}

		return await DatabaseService.isUserOptedIn(user.id);
	}, [user?.id]);

	return {
		// Database operations
		saveUsageData,
		saveDonation,
		getUserUsageData,
		getUserDonations,
		getUserProfile,
		updateUserProfile,
		isUserOptedIn,

		// State
		isAuthenticated: !!user?.id,
		userId: user?.id,
	};
};
