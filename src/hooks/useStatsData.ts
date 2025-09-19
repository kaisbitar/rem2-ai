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

export const useStatsData = (
  serviceName?: string,
  dateFilter?: "today" | "7d" | "30d" | "lifetime"
) => {
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
  }, [user?.id, viewMode, stats, serviceName, dateFilter]);

  const fetchDatabaseData = async () => {
    if (!getUserConsumptionMetrics) return;

    let metrics = [];
    const filter = dateFilter || (viewMode === "daily" ? "today" : "lifetime");

    if (filter === "today") {
      // Get today's data with UTC day range
      const now = new Date();
      const startUtc = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          0,
          0,
          0
        )
      );
      const endUtc = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          0,
          0,
          0
        )
      );
      metrics = await getUserConsumptionMetrics(
        200,
        startUtc.toISOString(),
        endUtc.toISOString()
      );
    } else if (filter === "7d") {
      // Get last 7 days
      const now = new Date();
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      metrics = await getUserConsumptionMetrics(
        500,
        start.toISOString(),
        now.toISOString()
      );
    } else if (filter === "30d") {
      // Get last 30 days
      const now = new Date();
      const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      metrics = await getUserConsumptionMetrics(
        1000,
        start.toISOString(),
        now.toISOString()
      );
    } else {
      // Get all data (lifetime)
      metrics = await getUserConsumptionMetrics();
    }

    // Filter by service if specified
    const filteredMetrics = serviceName
      ? metrics.filter((metric) => metric.model_used === serviceName)
      : metrics;

    const aggregatedData = MetricsCalculator.aggregateMetrics(filteredMetrics);
    setData(transformDatabaseData(aggregatedData));
  };

  const transformLocalData = (
    stats: TotalFootprint,
    serviceName?: string
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
          carbon * CARBON_CONVERSION_FACTORS.CO2_TO_TREES
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
        carbon * CARBON_CONVERSION_FACTORS.CO2_TO_TREES
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

// Helper hook to get available services for filtering
export const useAvailableServices = (
  dateFilter?: "today" | "7d" | "30d" | "lifetime"
) => {
  const { stats } = useAppContext();
  const { user } = useAuth();
  const { getUserConsumptionMetrics } = useDatabase();
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      if (user?.id && getUserConsumptionMetrics) {
        // For database users, fetch metrics and extract unique services
        let metrics = [];
        const filter = dateFilter || "lifetime";

        // Use same date logic as useStatsData
        if (filter === "today") {
          const now = new Date();
          const startUtc = new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate(),
              0,
              0,
              0
            )
          );
          const endUtc = new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate() + 1,
              0,
              0,
              0
            )
          );
          metrics = await getUserConsumptionMetrics(
            200,
            startUtc.toISOString(),
            endUtc.toISOString()
          );
        } else if (filter === "7d") {
          const now = new Date();
          const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          metrics = await getUserConsumptionMetrics(
            500,
            start.toISOString(),
            now.toISOString()
          );
        } else if (filter === "30d") {
          const now = new Date();
          const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          metrics = await getUserConsumptionMetrics(
            1000,
            start.toISOString(),
            now.toISOString()
          );
        } else {
          metrics = await getUserConsumptionMetrics();
        }

        const uniqueServices = [...new Set(metrics.map((m) => m.model_used))];
        setServices(uniqueServices);
      } else {
        // For guest users, use local storage services
        const localServices = stats?.services
          ? Object.keys(stats.services)
          : [];
        setServices(localServices);
      }
    };

    loadServices();
  }, [user?.id, dateFilter, stats, getUserConsumptionMetrics]);

  return services;
};

// Simple balance data structure
interface BalanceData {
  consumed: number;
  restored: number;
  netBalance: number;
}

// Centralized balance hook - reuses exact same pattern as useStatsData
export const useBalance = (): BalanceData => {
  const { user } = useAuth();
  const { userProfile } = useAuth();
  const data = useStatsData(undefined, "lifetime"); // Get lifetime consumption for balance

  // For authenticated users, use database totals
  if (user?.id && userProfile) {
    const consumed = userProfile.total_m2_consumed || 0;
    const restored = userProfile.total_m2_restored || 0;
    return {
      consumed,
      restored,
      netBalance: restored - consumed,
    };
  }

  // For guests, calculate from real-time data
  const consumed = data?.m2_potential || 0;
  return {
    consumed,
    restored: 0, // Guests have no restoration yet
    netBalance: -consumed,
  };
};
