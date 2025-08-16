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
	icon?: React.ReactNode;
	unit?: string;
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
	icon,
	unit,
	className = "",
	dynamicColors,
}) => {
	const containerClasses = css({
		width: "100px",
		// height: "65px",
		backgroundColor: "white",
		padding: "10px",
		paddingBottom: "15px",
		borderRadius: "lg",
		// boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
		border: "1px solid",
		borderColor: "gray.200",
		position: "relative",
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
		// marginBottom: "2",
	});

	const labelClasses = css({
		display: "flex",
		fontSize: ".5rem",
		fontWeight: "medium",
		color: "gray.600",
		textTransform: "uppercase",
		letterSpacing: "wide",
		marginBottom: "1",
		textAlign: "center",
		justifyContent: "center",
	});

	const valueClasses = css({
		fontSize: "md",
		fontWeight: "bold",
		color: "gray.800",
		lineHeight: "1",
		textAlign: "center",
		justifyContent: "center",
	});

	const unitClasses = css({
		fontSize: "10px",
		color: "red.400",
		marginLeft: "1",
		textAlign: "center",
		justifyContent: "center",
	});

	const iconClasses = css({
		marginRight: "1",
		marginTop: "-3px",
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
						<div className={labelClasses}>
							<span className={iconClasses}>{icon}</span>
							<span>{label}</span>
						</div>
						<div className={valueClasses}>
							{value}
						</div>
						<div className={unitClasses}>{unit}</div>

					</div>
				</div>
			</div>
		</Tooltip>
	);
};

export default StatCard;
