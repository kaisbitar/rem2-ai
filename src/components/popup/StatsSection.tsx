import { useAppContext } from "@/context/AppContext";
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
import StatsGroup from "./StatsGroup";
import { useStatsData } from "@/hooks/useStatsData";

const StatsSection: React.FC = () => {
	const { viewMode } = useAppContext();
	const data = useStatsData();

	const containerClasses = css({
		marginTop: "3",
	});

	const headerClasses = css({
		fontSize: "lg",
		fontWeight: "semibold",
		marginBottom: "5px",
		marginTop: "20px",
	});

	if (!data) {
		return null;
	}

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
						value: data.requests,
						label: `${i18n.t("requests")} `,
						icon: <BsSend size={17} />,
						tooltip: "Number of AI requests made.",
					},
					{
						value: data.tokens,
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
						value: data.m2_potential.toFixed(2),
						label: "m²",
						icon: <Plant size={19} />,
						tooltip: "Square meters of ecosystem that could be restored to offset your AI usage.",
						className: css({
							backgroundColor: "#f8e3e357",
							borderColor: " #c2175b",
						}),
					},
					{
						value: formatCarbon(data.carbon),
						icon: <MdCo2 size={20} />,
						tooltip: "Carbon dioxide emissions from your AI usage.",
					},
					{
						value: formatWater(data.water),
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
						value: data.m2_potential.toFixed(2),
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
						value: data.trees_potential,
						label: "Trees",
						unit: "planted",
						icon: <Tree size={19} />,
						tooltip: "Number of trees that would need to be planted to offset your AI carbon footprint.",
					},
					{
						value: data.peatland_potential.toFixed(2),
						label: "Peatland",
						unit: "m² rewetted",
						icon: <Leaf size={19} />,
						tooltip: "Square meters of peatland that could be restored.",
					},
					{
						value: data.habitat_potential.toFixed(2),
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