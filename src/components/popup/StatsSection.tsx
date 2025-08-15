import StatCard from "@/components/common/StatCard";
import { useAppContext } from "@/context/AppContext";
// import { CarbonCalculator } from "@/utils/calculations/carbon";
import {
	formatDuration,
	formatCarbon,
	formatWater,
} from "@/utils/formatting/display";
import type React from "react";
import { css } from "styled-system/css";

const StatsSection: React.FC = () => {
	const { stats, viewMode } = useAppContext();

	const containerClasses = css({
		marginTop: "6",
	});

	const headerClasses = css({
		fontSize: "lg",
		fontFamily: "heading",
		fontWeight: "semibold",
		color: "gray.800",
		display: "flex",
		alignItems: "center",
		gap: "2",
		marginBottom: "3",
	});

	const statsGridClasses = css({
		display: "grid",
		gridTemplateColumns: "repeat(4, 1fr)",
		gap: "1",
		marginBottom: "4",
	});

	return (
		<div className={containerClasses}>
			<h2 className={headerClasses}>
				{viewMode === "daily"
					? i18n.t("todayConsumption")
					: i18n.t("totalConsumption")}
			</h2>

			<div className={statsGridClasses}>
				<StatCard value={stats.requests} label={`🌐 ${i18n.t("requests")}`} />

				<StatCard
					value={formatCarbon(stats.carbon)}
					label={`🌎 ${i18n.t("carbon")}`}
				/>

				<StatCard
					value={formatWater(stats.water)}
					label={`💧 ${i18n.t("water")}`}
				/>

				<StatCard
					value={formatDuration(stats.totalDuration || 0)}
					label={`⏳ ${i18n.t("totalDuration")}`}
				/>
			</div>

			{/* <div className={impactMessageContainerClasses}>
				<ImpactMessageCard messages={impactMessages} />
			</div> */}
		</div>
	);
};

export default StatsSection;
