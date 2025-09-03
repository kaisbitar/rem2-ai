// src/utils/calculations/metrics.ts - Consumption metrics aggregation and calculations
import type { ConsumptionMetricsRecord } from "@/utils/storage/database";

export interface AggregatedMetrics {
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

export class MetricsCalculator {
  /**
   * Aggregates consumption metrics and calculates potential values
   * @param metrics - Array of consumption metrics records
   * @returns Aggregated metrics with calculated potential values
   */
  static aggregateMetrics(
    metrics: ConsumptionMetricsRecord[]
  ): AggregatedMetrics {
    if (!metrics || metrics.length === 0) {
      return MetricsCalculator.getEmptyMetrics();
    }

    const totals = metrics.reduce(
      (acc, record) => ({
        requests: acc.requests + 1,
        tokens: acc.tokens + (record.token_count || 0),
        carbon: acc.carbon + (record.co2_emissions_g || 0),
        water: acc.water + (record.water_consumption_ml || 0),
        duration: acc.duration + (record.duration_ms || 0),
      }),
      {
        requests: 0,
        tokens: 0,
        carbon: 0,
        water: 0,
        duration: 0,
      }
    );

    // Calculate potential values from CO2 emissions
    return {
      ...totals,
      m2_potential: totals.carbon * 0.0001, // Convert CO2 to m2 potential
      trees_potential: Math.round(totals.carbon * 0.00001), // Convert CO2 to trees
      peatland_potential: totals.carbon * 0.00005, // Convert CO2 to peatland
      habitat_potential: totals.carbon * 0.00008, // Convert CO2 to habitat
    };
  }

  /**
   * Returns empty metrics object
   * @returns Empty aggregated metrics
   */
  private static getEmptyMetrics(): AggregatedMetrics {
    return {
      requests: 0,
      tokens: 0,
      carbon: 0,
      water: 0,
      duration: 0,
      m2_potential: 0,
      trees_potential: 0,
      peatland_potential: 0,
      habitat_potential: 0,
    };
  }
}
