// src/utils/constants/conversions.ts - Conversion factors for carbon to restoration metrics

/**
 * Conversion factors for calculating restoration potential from CO2 emissions
 * These factors are based on scientific research and can be adjusted as needed
 */
export const CARBON_CONVERSION_FACTORS = {
	// CO2 grams to square meters of ecosystem restoration potential
	CO2_TO_M2: 0.25,

	// CO2 grams to number of trees that need to be planted
	CO2_TO_TREES: 0.14,

	// CO2 grams to square meters of peatland that could be rewetted
	CO2_TO_PEATLAND: 0.52,

	// CO2 grams to square meters of natural habitat that could be restored
	CO2_TO_HABITAT: 0.84,
} as const;
