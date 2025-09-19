import { useAppContext } from "@/context/AppContext";
import { formatCarbon, formatWater } from "@/utils/formatting/display";
import { Tree, Leaf, Butterfly, Plant } from "@phosphor-icons/react";
import { BsBraces, BsSend } from "react-icons/bs";
import { MdCo2, MdOutlineWaterDrop } from "react-icons/md";
import type React from "react";
import { css } from "styled-system/css";
import StatsGroup from "./StatsGroup";
import { useStatsData, useAvailableServices } from "@/hooks/useStatsData";
import { useState } from "react";

interface StatsSectionProps {
	dateFilter?: "today" | "7d" | "30d" | "lifetime";
}

const StatsSection: React.FC<StatsSectionProps> = ({ dateFilter }) => {
	const { viewMode } = useAppContext();
	const [selectedService, setSelectedService] = useState<string | null>(null);
	const data = useStatsData(selectedService || undefined, dateFilter);
	const services = useAvailableServices(dateFilter);

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

	// Services are now fetched by the hook

	const selectorClasses = css({
		marginBottom: "4",
		display: "flex",
		gap: "2",
		flexWrap: "wrap",
	});

	const serviceButtonClasses = (isSelected: boolean) =>
		css({
			padding: "2 3",
			borderRadius: "md",
			border: "1px solid",
			borderColor: isSelected ? "blue.500" : "gray.300",
			backgroundColor: isSelected ? "blue.50" : "white",
			color: isSelected ? "blue.700" : "gray.700",
			fontSize: "sm",
			cursor: "pointer",
			transition: "all 0.2s",
			_hover: {
				borderColor: "blue.400",
				backgroundColor: "blue.25",
			},
		});

	return (
		<div className={containerClasses}>
			<h2 className={headerClasses}>
				{selectedService ? `${selectedService} - ` : ""}
				{viewMode === "daily"
					? i18n.t("todayConsumption")
					: i18n.t("totalConsumption")}
			</h2>

			{services.length > 0 && (
				<div className={selectorClasses}>
					<button
						type="button"
						onClick={() => setSelectedService(null)}
						className={serviceButtonClasses(selectedService === null)}
					>
						All Models
					</button>
					{services.map((service) => (
						<button
							type="button"
							key={service}
							onClick={() => setSelectedService(service)}
							className={serviceButtonClasses(selectedService === service)}
						>
							{service}
						</button>
					))}
				</div>
			)}

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
						tooltip:
							"Square meters of ecosystem that could be restored to offset your AI usage.",
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
						tooltip:
							"Water consumption for cooling data centers that process your AI requests.",
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
						tooltip:
							"Square meters of ecosystem that could be restored to offset your AI usage.",
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
						tooltip:
							"Number of trees that would need to be planted to offset your AI carbon footprint.",
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
