import type React from "react";
import { css, cx } from "styled-system/css";
import Tooltip from "./Tooltip";

export interface StatCardProps {
	/** Main value to display */
	value: string | number | React.ReactNode;
	/** Statistic label */
	label?: string;
	/** Custom CSS class (optional) */
	tooltip?: string;
	className?: string;
	/** Dynamic colors to apply (optional) */
	dynamicColors?: {
		backgroundColor?: string;
		borderColor?: string;
		borderColorHover?: string;
		boxShadow?: string;
	};
}

const StatCard: React.FC<StatCardProps> = ({
	value,
	label,
	tooltip,
	className = "",
	dynamicColors,
}) => {
	const containerClasses = css({
		width: "5rem",
		height: "4rem",
		backgroundColor: "white",
		padding: "8px 0px 0px 8px",
		borderRadius: "lg",
		boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
		border: "1px solid",
		borderColor: "gray.200",
		position: "relative",
		// overflow: "hidden",
		// display: "flex",
		// flexDirection: "column",
		// alignItems: "flex-start",
		// justifyContent: "flex-start",
		transition: "all 0.3s ease",
		_hover: {
			transform: "translateY(-2px)",
			boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
			borderColor: "#A1CA2B",
			backgroundColor: "gray.50",
		},
	});

	const contentClasses = css({
		position: "relative",
		zIndex: "1",
		width: "100%",
	});

	const topRowClasses = css({
		alignItems: "center",
		gap: "3",
		marginBottom: "2",
	});

	const labelClasses = css({
		fontSize: ".5rem",
		fontWeight: "medium",
		color: "gray.600",
		textTransform: "uppercase",
		letterSpacing: "wide",
	});

	const valueClasses = css({
		fontSize: "md",
		fontWeight: "bold",
		color: "gray.800",
		lineHeight: "1",
		marginLeft: "0.3",
	});

	// Combine dynamic colors with base styles
	const dynamicStyle = dynamicColors
		? {
				backgroundColor: dynamicColors.backgroundColor,
				borderColor: dynamicColors.borderColor,
				boxShadow: dynamicColors.boxShadow,
			}
		: {};

	return (
		<Tooltip content={tooltip || "No tooltip"}>
			<div className={cx(containerClasses, className)} style={dynamicStyle}>
				<div className={"gradient-bar"} />
				<div className={contentClasses}>
					<div className={topRowClasses}>
						<span className={labelClasses}>{label}</span>
						<div className={valueClasses}>{value}</div>
					</div>
				</div>
			</div>
		</Tooltip>
	);
};

export default StatCard;
