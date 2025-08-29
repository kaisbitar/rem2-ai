import { useAppContext } from "@/context/AppContext";
import StatCard from "@/components/common/StatCard";
import { formatCarbon, formatWater } from "@/utils/formatting/display";
import {
	GlobeSimpleIcon,
	Globe,
	CloudRain,
	Clock,
} from "@phosphor-icons/react";
import type React from "react";
import { css } from "styled-system/css";

const ServicesSection: React.FC = () => {
	const { stats } = useAppContext();

	const services = stats?.services ? Object.entries(stats.services) : [];

	const calculatePercentage = (
		serviceRequests: number,
		totalRequests: number,
	): number => {
		if (totalRequests === 0) return 0;
		return (serviceRequests / totalRequests) * 100;
	};

	// CSS Classes
	const emptyStateClasses = css({
		textAlign: "center",
		padding: "8",
		color: "gray.500",
		fontStyle: "italic",
	});

	const containerClasses = css({
		display: "flex",
		flexDirection: "column",
		gap: "4",
		marginTop: "10",
	});

	const serviceHeaderClasses = css({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: "1",
	});

	const serviceTitleClasses = css({
		fontSize: "md",
		fontWeight: "semibold",
		color: "gray.700",
		fontFamily: "heading",
	});

	const statsGridClasses = css({
		display: "flex",
		gridTemplateColumns: "repeat(4, 1fr)",
		gap: "5px",
		marginBottom: "4",
	});

	if (services.length === 0) {
		return (
			<div className={emptyStateClasses}>{i18n.t("visitToStartTracking")}</div>
		);
	}

	const headerClasses = css({
		fontSize: "lg",
		fontWeight: "semibold",
	});

	return (
		<div className={containerClasses}>
			<h2 className={headerClasses}>AI Models Breakdown</h2>
			{services.map(([serviceName, serviceStats]) => {
				const percentage = calculatePercentage(
					serviceStats.requests,
					stats.requests,
				);

				return (
					<div key={serviceName}>
						<div className={serviceHeaderClasses}>
							<h3 className={serviceTitleClasses}>{serviceName}</h3>
							<span>{percentage.toFixed(1)}%</span>
						</div>

						<h6>AI Usage Equivalences</h6>

						<div className={statsGridClasses}>
							<StatCard
								value={serviceStats.requests}
								label={`${i18n.t("requests")}`}
								icon={<GlobeSimpleIcon size={19} />}
							/>
							<StatCard
								value={serviceStats.requests * 325}
								label={`${i18n.t("tokens")}`}
								icon={<CloudRain size={19} />}
							/>
						</div>

						<h6>AI Usage Equivalences</h6>
						<div className={statsGridClasses}>
							<StatCard
								value={formatCarbon(serviceStats.carbon)}
								label={`${i18n.t("carbon")}`}
								icon={<Globe size={19} />}
							/>
							<StatCard
								value={formatWater(serviceStats.water)}
								label={`${i18n.t("water")}`}
								icon={<CloudRain size={19} />}
							/>

							<StatCard
								value={`${(serviceStats.totalDuration / 1000).toFixed(1)}s`}
								label={`${i18n.t("duration")}`}
								icon={<Clock size={19} />}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default ServicesSection;
