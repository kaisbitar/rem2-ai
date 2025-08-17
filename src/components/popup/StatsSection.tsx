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
	Plant,
} from "@phosphor-icons/react";
import type React from "react";
import { css } from "styled-system/css";

const StatsSection: React.FC = () => {
	const { stats, viewMode } = useAppContext();

	const containerClasses = css({
		// marginTop: "6",
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

			<h6>AI Usage Equivalences</h6>
			<div className={statsGridClasses}>
				<StatCard
					value={stats.requests}
					label={`${i18n.t("requests")} `}
					icon={<GlobeSimpleIcon size={19} />}
				/>
				<StatCard
					value={stats.requests * 325}
					label={`${i18n.t("tokens")}`}
					icon={<CloudRain size={19} />}
				/>
				<StatCard value={"XXX"} label={"m2"} icon={<Plant size={19} />} />
			</div>

			<h6>AI Usage Equivalences</h6>
			<div className={statsGridClasses}>
				<StatCard
					value={formatCarbon(stats.carbon)}
					label={`${i18n.t("carbon")}`}
					icon={<Globe size={19} />}
				/>

				<StatCard
					value={formatWater(stats.water)}
					label={`${i18n.t("water")}`}
					icon={<CloudRain size={19} />}
				/>

				<StatCard
					value={formatDuration(stats.totalDuration || 0)}
					label={`${i18n.t("totalDuration")}`}
					icon={<Clock size={19} />}
				/>
			</div>

			<h6>Restoration Equivalences</h6>
			<div className={statsGridClasses}>
				<StatCard
					value={0}
					label="Trees"
					unit="planted"
					icon={<Tree size={19} />}
				/>

				<StatCard
					value={0}
					label="Peatland "
					unit="m² rewetted"
					icon={<Leaf size={19} />}
				/>

				<StatCard
					value={0}
					label="Habitat"
					unit="m² restored"
					icon={<Butterfly size={19} />}
				/>
			</div>
		</div>
	);
};

export default StatsSection;
