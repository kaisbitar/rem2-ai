import StatCard from "@/components/common/StatCard";
import { useAppContext } from "@/context/AppContext";
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

			<h6>AI Usage Equivalences</h6>
			<div className={statsGridClasses}>
				<StatCard
					value={stats.requests}
					label={`${i18n.t("requests")} `}
					icon={<GlobeSimpleIcon size={19} />}
					tooltip="Number of AI requests made today."
				/>
				<StatCard
					value={`${stats.requests * 325} + "{}"`}
					// label={`${i18n.t("tokens")}`}
					icon={<CloudRain size={19} />}
					tooltip="Estimated total tokens processed. Calculated as requests × 325 (average tokens per request)."
				/>
			</div>

			<h6>Environmental Equivalences</h6>
			<div className={statsGridClasses}>
				<StatCard
					value={"XXX"}
					label={"m2"}
					icon={<Plant size={19} />}
					tooltip="Square meters of ecosystem that could be restored to offset your AI usage."
				/>

				<StatCard
					value={formatCarbon(stats.carbon)}
					label={`${i18n.t("carbon")}`}
					icon={<Globe size={19} />}
					tooltip="Carbon dioxide emissions from your AI usage."
				/>

				<StatCard
					value={formatWater(stats.water)}
					label={`${i18n.t("water")}`}
					icon={<CloudRain size={19} />}
					tooltip="Water consumption for cooling data centers that process your AI requests."
				/>

				<StatCard
					value={formatDuration(stats.totalDuration || 0)}
					label={`${i18n.t("totalDuration")}`}
					icon={<Clock size={19} />}
					tooltip="Total time spent using AI services."
				/>
			</div>

			<h6>Restoration Equivalences</h6>
			<div className={statsGridClasses}>
				<StatCard
					value={0}
					label="Trees"
					unit="planted"
					icon={<Tree size={19} />}
					tooltip="Number of trees that would need to be planted to offset your AI carbon footprint."
				/>

				<StatCard
					value={0}
					label="Peatland "
					unit="m² rewetted"
					icon={<Leaf size={19} />}
					tooltip="Square meters of peatland that could be restored."
				/>

				<StatCard
					value={0}
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
