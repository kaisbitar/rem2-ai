import StatCard from "@/components/common/StatCard";
import { useAppContext } from "@/context/AppContext";
import { useDatabase } from "@/hooks/useDatabase";
import { useAuth } from "@/context/AuthContext";
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
import { useState, useEffect } from "react";

const StatsSection: React.FC = () => {
	const { stats, viewMode } = useAppContext();
	const { user } = useAuth();
	const { getUserConsumptionMetrics } = useDatabase();
	const [consumptionData, setConsumptionData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	// Fetch consumption data and user profile
	useEffect(() => {
		const fetchData = async () => {
			if (user?.id) {

				try {
					const [metrics] = await Promise.all([
						getUserConsumptionMetrics(50),
					]);
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
						}
					);

					setConsumptionData(totals);
				} catch (error) {
					console.error("Error fetching consumption data:", error);
				} finally {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		};

		fetchData();
	}, [user?.id, getUserConsumptionMetrics]);

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

	if (loading) {
		return (
			<div className={containerClasses}>
				<h2 className={headerClasses}>
					{viewMode === "daily"
						? i18n.t("todayConsumption")
						: i18n.t("totalConsumption")}
				</h2>
				<div className={css({ textAlign: "center", padding: "4" })}>
					Loading consumption data...
				</div>
			</div>
		);
	}


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
					value={consumptionData?.requests || 0}
					label={`${i18n.t("requests")} `}
					icon={<GlobeSimpleIcon size={19} />}
					tooltip="Number of AI requests made."
				/>
				<StatCard
					value={consumptionData?.tokens || 0}
					label={`${i18n.t("tokens")}`}
					icon={<CloudRain size={19} />}
					tooltip="Total tokens processed by AI models."
				/>
			</div>

			<h6>Environmental Equivalences</h6>
			<div className={statsGridClasses}>
				<StatCard
					value={consumptionData?.m2_potential?.toFixed(2) || "0.00"}
					label={"m²"}
					icon={<Plant size={19} />}
					tooltip="Square meters of ecosystem that could be restored to offset your AI usage."
				/>

				<StatCard
					value={formatCarbon(consumptionData?.carbon || 0)}
					label={`${i18n.t("carbon")}`}
					icon={<Globe size={19} />}
					tooltip="Carbon dioxide emissions from your AI usage."
				/>

				<StatCard
					value={formatWater(consumptionData?.water || 0)}
					label={`${i18n.t("water")}`}
					icon={<CloudRain size={19} />}
					tooltip="Water consumption for cooling data centers that process your AI requests."
				/>

				<StatCard
					value={formatDuration(consumptionData?.duration || 0)}
					label={`${i18n.t("totalDuration")}`}
					icon={<Clock size={19} />}
					tooltip="Total time spent using AI services."
				/>
			</div>

			<h6>Restoration Equivalences</h6>
			<div className={statsGridClasses}>
				<StatCard
					value={consumptionData?.trees_potential || 0}
					label="Trees"
					unit="planted"
					icon={<Tree size={19} />}
					tooltip="Number of trees that would need to be planted to offset your AI carbon footprint."
				/>

				<StatCard
					value={consumptionData?.peatland_potential?.toFixed(2) || "0.00"}
					label="Peatland "
					unit="m² rewetted"
					icon={<Leaf size={19} />}
					tooltip="Square meters of peatland that could be restored."
				/>

				<StatCard
					value={consumptionData?.habitat_potential?.toFixed(2) || "0.00"}
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
