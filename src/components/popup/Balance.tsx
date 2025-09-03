import type React from "react";
import { css } from "styled-system/css";
import CallToActionButton from "../common/CallToActionButton";
import BalanceChart from "../common/BalanceChart";
import { CaretUp, CaretDown, Plant } from "@phosphor-icons/react";

interface BalanceProps {
	consumed: number;
	restored: number;
	showStats: boolean;
	className?: string;
	onDetailsClick?: () => void;
	loading?: boolean;
}

const Balance: React.FC<BalanceProps> = ({
	consumed,
	restored,
	showStats,
	className = "",
	onDetailsClick,
	loading = false,
}) => {
	const containerClasses = css({
		backgroundColor: "white",
		padding: "4",
		borderRadius: "lg",
		border: "1px solid",
		borderColor: "gray.200",
		position: "relative",
		overflow: "hidden",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		transition: "all 0.3s ease",
	});

	const dueLabelClasses = css({
		fontSize: "sm",
		fontWeight: "medium",
		color: "gray.500",
		marginBottom: "5px",
	});

	if (loading) {
		return (
			<div className={`${containerClasses} ${className}`}>
				<div className={"gradient-bar"} />
				<div
					className={css({ textAlign: "center", width: "100%", padding: "4" })}
				>
					Loading balance...
				</div>
			</div>
		);
	}

	return (
		<div className={`${containerClasses} ${className}`}>
			<div className={"gradient-bar"} />
			<BalanceChart consumed={consumed} restored={restored} />
			<span className={dueLabelClasses}>
				Due to restore: {(consumed - restored).toFixed(2)}m²
			</span>
			<div className={css({ display: "flex", gap: "2" })}>
				<CallToActionButton
					text={showStats ? "Hide Details" : "Show Details"}
					className="btn-theme-magenta"
					icon={showStats ? <CaretUp size={19} /> : <CaretDown size={19} />}
					onClick={onDetailsClick}
				/>
				<CallToActionButton
					text="Restore m²"
					className="btn-theme-green"
					icon={<Plant size={19} />}
					onClick={() => {}}
				/>
			</div>
		</div>
	);
};

export default Balance;
