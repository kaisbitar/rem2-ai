import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useDatabase } from "@/hooks/useDatabase";
import { useAuth } from "@/context/AuthContext";
import {
	MetricsCalculator,
	type AggregatedMetrics,
} from "@/utils/calculations/metrics";
import type { TotalFootprint } from "@/types/carbon";
import { CARBON_CONVERSION_FACTORS } from "@/utils/constants/conversions";

// Simple unified data structure
interface StatsData {
	requests: number;
	tokens: number;
	carbon: number;
	water: number;
	duration: number;
	m2_potential: number;
	trees_potential: number;
	peatland_potential: number;
	habitat_potential: number;
}

export const useStatsData = (serviceName?: string) => {
	const { stats, viewMode } = useAppContext();
	const { user } = useAuth();
	const { getUserConsumptionMetrics } = useDatabase();
	const [data, setData] = useState<StatsData | null>(null);

	useEffect(() => {
		const loadData = async () => {
			if (user?.id) {
				// User is logged in - get data from database
				await fetchDatabaseData();
			} else {
				// Guest user - use local storage data
				setData(transformLocalData(stats, serviceName));
			}
		};

		loadData();
	}, [user?.id, viewMode, stats, serviceName]);

	const fetchDatabaseData = async () => {
		if (!getUserConsumptionMetrics) return;

		let metrics = [];

		if (viewMode === "daily") {
			// Get today's data with UTC day range
			const now = new Date();
			const startUtc = new Date(
				Date.UTC(
					now.getUTCFullYear(),
					now.getUTCMonth(),
					now.getUTCDate(),
					0,
					0,
					0,
				),
			);
			const endUtc = new Date(
				Date.UTC(
					now.getUTCFullYear(),
					now.getUTCMonth(),
					now.getUTCDate() + 1,
					0,
					0,
					0,
				),
			);
			metrics = await getUserConsumptionMetrics(
				200,
				startUtc.toISOString(),
				endUtc.toISOString(),
			);
		} else {
			// Get all data
			metrics = await getUserConsumptionMetrics();
		}

		const aggregatedData = MetricsCalculator.aggregateMetrics(metrics);
		setData(transformDatabaseData(aggregatedData));
	};

	const transformLocalData = (
		stats: TotalFootprint,
		serviceName?: string,
	): StatsData => {
		// If serviceName is provided, use only that service's data
		if (serviceName && stats.services && stats.services[serviceName]) {
			const serviceStats = stats.services[serviceName];
			const carbon = serviceStats.carbon || 0;

			return {
				requests: serviceStats.requests || 0,
				tokens: serviceStats.tokens || 0,
				carbon,
				water: serviceStats.water || 0,
				duration: serviceStats.totalDuration || 0,
				// Calculate potential values using the same factors as MetricsCalculator
				m2_potential: carbon * CARBON_CONVERSION_FACTORS.CO2_TO_M2,
				trees_potential: Math.round(
					carbon * CARBON_CONVERSION_FACTORS.CO2_TO_TREES,
				),
				peatland_potential: carbon * CARBON_CONVERSION_FACTORS.CO2_TO_PEATLAND,
				habitat_potential: carbon * CARBON_CONVERSION_FACTORS.CO2_TO_HABITAT,
			};
		}

		// Default: use all stats
		const carbon = stats.carbon || 0;
		return {
			requests: stats.requests || 0,
			tokens: stats.tokens || 0,
			carbon,
			water: stats.water || 0,
			duration: stats.totalDuration || 0,
			// Calculate potential values using the same factors as MetricsCalculator
			m2_potential: carbon * CARBON_CONVERSION_FACTORS.CO2_TO_M2,
			trees_potential: Math.round(
				carbon * CARBON_CONVERSION_FACTORS.CO2_TO_TREES,
			),
			peatland_potential: carbon * CARBON_CONVERSION_FACTORS.CO2_TO_PEATLAND,
			habitat_potential: carbon * CARBON_CONVERSION_FACTORS.CO2_TO_HABITAT,
		};
	};

	const transformDatabaseData = (aggregated: AggregatedMetrics): StatsData => {
		return {
			requests: aggregated.requests || 0,
			tokens: aggregated.tokens || 0,
			carbon: aggregated.carbon || 0,
			water: aggregated.water || 0,
			duration: aggregated.duration || 0,
			m2_potential: aggregated.m2_potential || 0,
			trees_potential: aggregated.trees_potential || 0,
			peatland_potential: aggregated.peatland_potential || 0,
			habitat_potential: aggregated.habitat_potential || 0,
		};
	};

	return data;
};
