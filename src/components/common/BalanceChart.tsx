import type React from "react";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";

interface BalanceChartProps {
	consumed: number;
	restored: number;
	consumedColor?: string;
	restoredColor?: string;
	unit?: string;
	className?: string;
}

const BalanceChart: React.FC<BalanceChartProps> = ({
	consumed,
	restored,
	consumedColor = "#c2185b",
	restoredColor = "#a1ca2b",
	unit = "m²",
	className = "",
}) => {
	const [consumedWidth, setConsumedWidth] = useState(0);
	const [restoredWidth, setRestoredWidth] = useState(0);

	// const total = consumed + restored;
	const consumedPercentage = 100; //total > 0 ? (consumed / total) * 100 : 0;
	const restoredPercentage = 3; //total > 0 ? (restored / total) * 100 : 0;

	useEffect(() => {
		const timeout = setTimeout(() => {
			setConsumedWidth(consumedPercentage);
			setRestoredWidth(restoredPercentage);
		}, 300);
		return () => clearTimeout(timeout);
	}, [consumedPercentage, restoredPercentage]);

	const containerClass = css({
		margin: "auto",
	});

	const headerClass = css({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: "1rem",
		fontSize: { base: "0.875rem", sm: "1rem" },
		fontWeight: 600,
		color: "#94a3b8",
		width: "350px",
	});

	const infoItemClass = css({
		display: "flex",
		alignItems: "center",
		gap: "0.5rem",
	});

	const colorDotClass = css({
		width: "0.75rem",
		height: "0.75rem",
		borderRadius: "50%",
	});

	const trackClass = css({
		margin: "auto",
		// backgroundColor: "#1e293b",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: "2rem",
		position: "relative",
		borderRadius: "9999px",
		overflow: "hidden",
	});

	const barClass = css({
		height: "20px",
		position: "absolute",
		transition: "width 1s ease-in-out",
	});

	const consumedBarClass = css({
		left: "50%",
		transform: "translateX(-100%)",
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
		borderTopLeftRadius: "9999px",
		borderBottomLeftRadius: "9999px",
	});

	const restoredBarClass = css({
		left: "50%",
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0,
		borderTopRightRadius: "9999px",
		borderBottomRightRadius: "9999px",
	});

	const centerLineClass = css({
		position: "absolute",
		width: "5px",
		height: "100%",
		backgroundColor: "#e5e6e7",
		border: "1px solid #9c9c9c",
		borderRadius: "9999px",
		zIndex: 10,
	});

	return (
		<div className={`${containerClass} ${className}`}>
			<div className={headerClass}>
				<div className={infoItemClass}>
					<span
						className={colorDotClass}
						style={{ backgroundColor: consumedColor }}
					/>
					<span>
						Consumed: {consumed} {unit}
					</span>
				</div>
				<div className={infoItemClass}>
					<span>
						Restored: {restored} {unit}
					</span>
					<span
						className={colorDotClass}
						style={{ backgroundColor: restoredColor }}
					/>
				</div>
			</div>

			<div className={trackClass}>
				<div
					style={{
						width: `${consumedWidth}%`,
						background: `linear-gradient(to right, ${consumedColor}, ${consumedColor} 70%, #ff0064)`,
						transformOrigin: "right",
					}}
					className={`${barClass} ${consumedBarClass}`}
				/>
				<div
					style={{
						width: `${restoredWidth}%`,
						background: `linear-gradient(to left, ${restoredColor}, ${restoredColor} 70%, #02cd02)`,

						transformOrigin: "left",
					}}
					className={`${barClass} ${restoredBarClass}`}
				/>
				<div className={centerLineClass} />
			</div>
		</div>
	);
};

export default BalanceChart;
