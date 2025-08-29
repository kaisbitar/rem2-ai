// src/utils/storage/database-sync.ts - Database synchronization service
import { supabase } from "../../config/supabase-client";
import { logger } from "../core/logger";

export interface PendingUsageData {
	timestamp: string;
	energy_usage_wh: number;
	co2_emissions_g: number;
	token_count: number;
	conversation_id: string;
	model_used: string;
}

export class DatabaseSyncService {
	/**
	 * Process all pending database sync data
	 */
	static async processPendingSync(): Promise<void> {
		try {
			logger.log("🔄 Processing pending database sync...");

			// Get pending data from storage
			const pendingData = await DatabaseSyncService.getPendingData();

			if (pendingData.length === 0) {
				logger.log("ℹ️ No pending data to sync");
				return;
			}

			logger.log(`📊 Found ${pendingData.length} pending records to sync`);

			// Check if user is authenticated
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				logger.log("⚠️ User not authenticated, cannot sync to database");
				return;
			}

			// Process each pending record
			let successCount = 0;
			let errorCount = 0;

			for (const usageData of pendingData) {
				try {
					await DatabaseSyncService.saveUsageData(usageData, user.id);
					successCount++;
				} catch (error) {
					logger.error("❌ Error saving usage data:", error);
					errorCount++;
				}
			}

			// Clear successfully processed data
			if (successCount > 0) {
				await DatabaseSyncService.clearProcessedData(successCount);
				logger.log(
					`✅ Successfully synced ${successCount} records to database`,
				);
			}

			if (errorCount > 0) {
				logger.warn(`⚠️ Failed to sync ${errorCount} records`);
			}
		} catch (error) {
			logger.error("❌ Error in database sync process:", error);
		}
	}

	/**
	 * Save a single usage data record to the database
	 */
	private static async saveUsageData(
		usageData: PendingUsageData,
		userId: string,
	): Promise<void> {
		try {
			const { error } = await supabase.from("usage_data").insert({
				...usageData,
				user_id: userId,
			});

			if (error) {
				throw new Error(`Database error: ${error.message}`);
			}

			logger.log("💾 Usage data saved to database:", usageData);
		} catch (error) {
			logger.error("❌ Error saving usage data:", error);
			throw error;
		}
	}

	/**
	 * Get pending data from Chrome storage
	 */
	private static async getPendingData(): Promise<PendingUsageData[]> {
		try {
			const result = await browser.storage.local.get(["pendingDatabaseSync"]);
			return result.pendingDatabaseSync || [];
		} catch (error) {
			logger.error("❌ Error getting pending data:", error);
			return [];
		}
	}

	/**
	 * Clear successfully processed data from storage
	 */
	private static async clearProcessedData(count: number): Promise<void> {
		try {
			const result = await browser.storage.local.get(["pendingDatabaseSync"]);
			const pendingData = result.pendingDatabaseSync || [];

			// Remove the first 'count' items (successfully processed)
			const remainingData = pendingData.slice(count);

			await browser.storage.local.set({
				pendingDatabaseSync: remainingData,
			});

			logger.log(`🧹 Cleared ${count} processed records from pending queue`);
		} catch (error) {
			logger.error("❌ Error clearing processed data:", error);
		}
	}

	/**
	 * Get sync status and statistics
	 */
	static async getSyncStatus(): Promise<{
		pendingCount: number;
		lastSyncTime: string | null;
		isSyncing: boolean;
	}> {
		try {
			const [pendingData, lastSync] = await Promise.all([
				DatabaseSyncService.getPendingData(),
				browser.storage.local.get(["lastDatabaseSync"]),
			]);

			return {
				pendingCount: pendingData.length,
				lastSyncTime: lastSync.lastDatabaseSync || null,
				isSyncing: false, // Could be enhanced with actual sync state
			};
		} catch (error) {
			logger.error("❌ Error getting sync status:", error);
			return {
				pendingCount: 0,
				lastSyncTime: null,
				isSyncing: false,
			};
		}
	}

	/**
	 * Force a manual sync of all pending data
	 */
	static async forceSync(): Promise<void> {
		try {
			logger.log("🔄 Force syncing all pending data...");
			await DatabaseSyncService.processPendingSync();

			// Update last sync time
			await browser.storage.local.set({
				lastDatabaseSync: new Date().toISOString(),
			});

			logger.log("✅ Force sync completed");
		} catch (error) {
			logger.error("❌ Error in force sync:", error);
		}
	}
}
