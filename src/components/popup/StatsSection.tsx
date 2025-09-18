import { useAppContext } from "@/context/AppContext";
import { useDatabase } from "@/hooks/useDatabase";
import { useAuth } from "@/context/AuthContext";
import {
	formatCarbon,
	formatWater,
} from "@/utils/formatting/display";
import {
	Tree,
	Leaf,
	Butterfly,
	Plant,
} from "@phosphor-icons/react";
import { BsBraces, BsSend } from "react-icons/bs";
import { MdCo2, MdOutlineWaterDrop } from "react-icons/md";
import type React from "react";
import { css } from "styled-system/css";
import { useState, useEffect } from "react";
import {
	MetricsCalculator,
	type AggregatedMetrics,
} from "@/utils/calculations/metrics";
import StatsGroup from "./StatsGroup";

const StatsSection: React.FC = () => {
	const { stats, viewMode } = useAppContext();
	const { user } = useAuth();
	const { getUserConsumptionMetrics } = useDatabase();
	const [consumptionData, setConsumptionData] =
		useState<AggregatedMetrics | null>(null);
	// const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			if (!user?.id || !getUserConsumptionMetrics) {
				return;
			}

			try {
				let metrics = [];
				if (viewMode === "daily") {
					// UTC day range to align with ReactiveStorage keying
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
					metrics = await getUserConsumptionMetrics();
				}
				const aggregatedData = MetricsCalculator.aggregateMetrics(metrics);
				setConsumptionData(aggregatedData);
			} catch (error) {
				console.error("Error fetching consumption data:", error);
			} finally {
			}
		};

		fetchData();
	}, [user?.id, getUserConsumptionMetrics, viewMode]);

	// Convert TotalFootprint to AggregatedMetrics format if needed
	const displayData: AggregatedMetrics = user?.id && consumptionData ? consumptionData : {
		requests: stats.requests,
		tokens: 0, // TotalFootprint doesn't have tokens
		carbon: stats.carbon,
		water: stats.water,
		duration: stats.totalDuration,
		m2_potential: stats.carbon * 0.0001, // Same conversion as in MetricsCalculator
		trees_potential: Math.round(stats.carbon * 0.00001),
		peatland_potential: stats.carbon * 0.00005,
		habitat_potential: stats.carbon * 0.00008,
	};
	console.log(stats);

	const containerClasses = css({
		marginTop: "3",
	});

	const headerClasses = css({
		fontSize: "lg",
		fontWeight: "semibold",
		marginBottom: "5px",
		marginTop: "20px",
	});

	return (
		<div className={containerClasses}>
			<h2 className={headerClasses}>
				{viewMode === "daily"
					? i18n.t("todayConsumption")
					: i18n.t("totalConsumption")}
			</h2>

			<StatsGroup
				title="AI Usage"
				stats={[
					{
						value: displayData?.requests || 0,
						label: `${i18n.t("requests")} `,
						icon: <BsSend size={17} />,
						tooltip: "Number of AI requests made.",
					},
					{
						value: displayData?.tokens || 0,
						label: `${i18n.t("tokens")}`,
						icon: <BsBraces size={17} />,
						tooltip: "Total tokens processed by AI models.",
					},
				]}
			/>

			<StatsGroup
				title="Consumption Metrics"
				stats={[
					{
						value: displayData?.m2_potential?.toFixed(2) || "0.00",
						label: "m²",
						icon: <Plant size={19} />,
						tooltip: "Square meters of ecosystem that could be restored to offset your AI usage.",
						className: css({
							backgroundColor: "#f8e3e357",
							borderColor: " #c2175b",
						}),
					},
					{
						value: formatCarbon(displayData?.carbon || 0),
						icon: <MdCo2 size={20} />,
						tooltip: "Carbon dioxide emissions from your AI usage.",
					},
					{
						value: formatWater(displayData?.water || 0),
						icon: <MdOutlineWaterDrop size={19} />,
						tooltip: "Water consumption for cooling data centers that process your AI requests.",
					},
				]}
				operators={["=", "+"]}
			/>

			<StatsGroup
				title="Restoration Metrics"
				stats={[
					{
						value: displayData?.m2_potential?.toFixed(2) || "0.00",
						label: "m²",
						icon: <Plant size={19} />,
						tooltip: "Square meters of ecosystem that could be restored to offset your AI usage.",
						className: css({
							backgroundColor: "#e6f0ca21",
							border: "1px solid",
							borderColor: "#89af24",
						}),
					},
					{
						value: displayData?.trees_potential || 0,
						label: "Trees",
						unit: "planted",
						icon: <Tree size={19} />,
						tooltip: "Number of trees that would need to be planted to offset your AI carbon footprint.",
					},
					{
						value: displayData?.peatland_potential?.toFixed(2) || "0.00",
						label: "Peatland",
						unit: "m² rewetted",
						icon: <Leaf size={19} />,
						tooltip: "Square meters of peatland that could be restored.",
					},
					{
						value: displayData?.habitat_potential?.toFixed(2) || "0.00",
						label: "Habitat",
						unit: "m² restored",
						icon: <Butterfly size={19} />,
						tooltip: "Square meters of natural habitat that could be restored.",
					},
				]}
				operators={["=", "+", "+"]}
			/>
		</div>
	);
};

export default StatsSection;
