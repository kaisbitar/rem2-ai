// src/hooks/useDatabase.ts - Clean database operations hook
import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
	DatabaseService,
	type ConsumptionMetrics,
} from "@/utils/storage/database";

/**
 * Custom hook for database operations
 * Provides a clean, React-friendly interface to the DatabaseService
 */
export const useDatabase = () => {
	const { user } = useAuth();

	/**
	 * Save consumption metrics to database (only if user is opted-in)
	 */
	const saveConsumptionMetrics = useCallback(
		async (data: ConsumptionMetrics): Promise<boolean> => {
			if (!user?.id) {
				console.log("ℹ️ User not authenticated, skipping database save");
				return false;
			}

			return await DatabaseService.saveConsumptionMetrics(user.id, data);
		},
		[user?.id],
	);

	const getUserConsumptionMetrics = useCallback(
		async (limit = 50, fromIso?: string, toIso?: string) => {
			if (!user?.id) {
				console.log(
					"ℹ️ User not authenticated, cannot fetch consumption metrics",
				);
				return [];
			}
			const result = await DatabaseService.getUserConsumptionMetrics(
				user.id,
				limit,
				fromIso,
				toIso,
			);
			console.log(result);
			return result;
		},
		[user?.id],
	);

	/**
	 * Get user's restoration actions from database
	 */
	const getUserRestorationActions = useCallback(async () => {
		if (!user?.id) {
			console.log("ℹ️ User not authenticated, cannot fetch restoration actions");
			return [];
		}

		return await DatabaseService.getUserRestorationActions(user.id);
	}, [user?.id]);

	/**
	 * Get user profile from database
	 */
	const getUserProfile = useCallback(async () => {
		if (!user?.id) {
			console.log("ℹ️ User not authenticated, cannot fetch profile");
			return null;
		}
		console.log(user);

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
		// New database operations
		saveConsumptionMetrics,
		getUserConsumptionMetrics,
		getUserRestorationActions,
		getUserProfile,
		updateUserProfile,
		isUserOptedIn,

		// State
		isAuthenticated: !!user?.id,
		userId: user?.id,
	};
};
