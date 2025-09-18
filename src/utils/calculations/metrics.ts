// src/utils/calculations/metrics.ts - Consumption metrics aggregation and calculations
import type { ConsumptionMetricsRecord } from "@/utils/storage/database";
import { CARBON_CONVERSION_FACTORS } from "@/utils/constants/conversions";

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
		metrics: ConsumptionMetricsRecord[],
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
			},
		);

		// Calculate potential values from CO2 emissions
		return {
			...totals,
			m2_potential: totals.carbon * CARBON_CONVERSION_FACTORS.CO2_TO_M2,
			trees_potential: Math.round(
				totals.carbon * CARBON_CONVERSION_FACTORS.CO2_TO_TREES,
			),
			peatland_potential:
				totals.carbon * CARBON_CONVERSION_FACTORS.CO2_TO_PEATLAND,
			habitat_potential:
				totals.carbon * CARBON_CONVERSION_FACTORS.CO2_TO_HABITAT,
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
