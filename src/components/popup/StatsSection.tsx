import StatCard from "@/components/common/StatCard";
import { useAppContext } from "@/context/AppContext";
import { useDatabase } from "@/hooks/useDatabase";
import { useAuth } from "@/context/AuthContext";
import {
	// formatDuration,
	formatCarbon,
	formatWater,
} from "@/utils/formatting/display";
import {
	// Globe,
	// GlobeSimpleIcon,
	// CloudRain,
	// Clock,
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

	const displayData = user?.id && consumptionData ? consumptionData : stats;

	const containerClasses = css({
		marginTop: "3",
	});

	const headerClasses = css({
		fontSize: "lg",
		fontWeight: "semibold",
		marginBottom: "5px",
		marginTop: "20px",
	});

	const statsGridClasses = css({
		display: "flex",
		gridTemplateColumns: "repeat(4, 1fr)",
		gap: "5px",
		marginBottom: "10px",
		marginTop: "1",
	});

	return (
		<div className={containerClasses}>
			<h2 className={headerClasses}>
				{viewMode === "daily"
					? i18n.t("todayConsumption")
					: i18n.t("totalConsumption")}
			</h2>

			<h6>AI Usage</h6>
			<div className={statsGridClasses}>
				<StatCard
					value={displayData?.requests || 0}
					label={`${i18n.t("requests")} `}
					icon={<BsSend size={17} />}
					tooltip="Number of AI requests made."
				/>
				<StatCard
					value={displayData?.tokens || 0}
					label={`${i18n.t("tokens")}`}
					icon={<BsBraces size={17} />}
					tooltip="Total tokens processed by AI models."
				/>
			</div>

			<h6>Consumption Metrics</h6>
			<div className={statsGridClasses}>
				<StatCard
					className={css({
						backgroundColor: "#e6f0ca",
						border: "1px solid #000",
					})}
					value={displayData?.m2_potential?.toFixed(2) || "0.00"}
					label={"m²"}
					icon={<Plant size={19} />}
					tooltip="Square meters of ecosystem that could be restored to offset your AI usage."
				/>
				<span className={css({ fontSize: "sm", margin: "10px 0px" })}>=</span>
				<StatCard
					value={formatCarbon(displayData?.carbon || 0)}
					// label={`${i18n.t("carbon")}`}
					icon={<MdCo2 size={20} />}
					tooltip="Carbon dioxide emissions from your AI usage."
				/>
				<span className={css({ fontSize: "sm", margin: "10px 0px" })}>+</span>

				<StatCard
					value={formatWater(displayData?.water || 0)}
					// label={`${i18n.t("water")}`}
					icon={<MdOutlineWaterDrop size={19} />}
					tooltip="Water consumption for cooling data centers that process your AI requests."
				/>

				{/* <StatCard
					value={formatDuration(displayData?.duration || 0)}
					// label={`${i18n.t("totalDuration")}`}
					icon={<Clock size={19} />}
					tooltip="Total time spent using AI services."
				/> */}
			</div>

			<h6>Restoration Metrics</h6>
			<div className={statsGridClasses}>
				<StatCard
					className={css({ backgroundColor: "#f8e3e3" })}
					value={displayData?.m2_potential?.toFixed(2) || "0.00"}
					label={"m²"}
					icon={<Plant size={19} />}
					tooltip="Square meters of ecosystem that could be restored to offset your AI usage."
				/>
				<span className={css({ fontSize: "sm", margin: "10px 0px" })}>=</span>

				<StatCard
					value={displayData?.trees_potential || 0}
					label="Trees"
					unit="planted"
					icon={<Tree size={19} />}
					tooltip="Number of trees that would need to be planted to offset your AI carbon footprint."
				/>
				<span className={css({ fontSize: "sm", margin: "10px 0px" })}>+</span>

				<StatCard
					value={displayData?.peatland_potential?.toFixed(2) || "0.00"}
					label="Peatland "
					unit="m² rewetted"
					icon={<Leaf size={19} />}
					tooltip="Square meters of peatland that could be restored."
				/>
				<span className={css({ fontSize: "sm", margin: "10px 0px" })}>+</span>

				<StatCard
					value={displayData?.habitat_potential?.toFixed(2) || "0.00"}
					label="Habitat"
					unit="m² restored"
					icon={<Butterfly size={19} />}
					tooltip="Square meters of natural habitat that could be restored."
				/>
			</div>
		</div>
	);
};

export default StatsSection;
