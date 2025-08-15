import StatCard from "@/components/common/StatCard";
import { useAppContext } from "@/context/AppContext";
// import { CarbonCalculator } from "@/utils/calculations/carbon";
import {
	formatDuration,
	formatCarbon,
	formatWater,
} from "@/utils/formatting/display";
import {
	Globe,
	GlobeSimpleIcon,
	CloudRain,
	Clock,
	Tree,
	Leaf,
	Butterfly,
} from "@phosphor-icons/react";
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
		display: "flex",
		gridTemplateColumns: "repeat(4, 1fr)",
		gap: "5px",
		marginBottom: "4",
	});

	const restorationGridClasses = css({
		display: "flex",
		gridTemplateColumns: "repeat(3, 1fr)",
		gap: "5px",
		marginBottom: "4",
	});

	return (
		<div className={containerClasses}>
			{/* <h2 className={headerClasses}>
				{viewMode === "daily"
					? i18n.t("todayConsumption")
					: i18n.t("totalConsumption")}
			</h2> */}

			<h6>AI Usage Equivalences</h6>
			<div className={statsGridClasses}>
				<StatCard
					value={stats.requests}
					label={`${i18n.t("requests")} `}
					icon={<GlobeSimpleIcon size={12} />}
				/>
				<StatCard
					value={stats.requests * 325}
					label={`${i18n.t("tokens")}`}
					icon={<CloudRain size={12} />}
				/>
			</div>

			<h6>AI Usage Equivalences</h6>
			<div className={statsGridClasses}>
				<StatCard
					value={formatCarbon(stats.carbon)}
					label={`${i18n.t("carbon")}`}
					icon={<Globe size={12} />}
				/>

				<StatCard
					value={formatWater(stats.water)}
					label={`${i18n.t("water")}`}
					icon={<CloudRain size={12} />}
				/>

				<StatCard
					value={formatDuration(stats.totalDuration || 0)}
					label={`${i18n.t("totalDuration")}`}
					icon={<Clock size={12} />}
				/>
			</div>

			<h6>Restoration Equivalences</h6>
			<div className={restorationGridClasses}>
				<StatCard value={0} label="Trees planted" icon={<Tree size={12} />} />

				<StatCard value={0} label="Peatland " icon={<Leaf size={12} />} />

				<StatCard value={0} label="Habitat" icon={<Butterfly size={12} />} />
			</div>
		</div>
	);
};

export default StatsSection;
