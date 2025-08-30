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
	restoredColor = "green",
	unit = "m²",
	className = "",
}) => {
	const totalAbsolute = Math.abs(consumed) + Math.abs(restored) || 1;
	const consumedPercentage = (Math.abs(consumed) / totalAbsolute) * 50;
	const restoredPercentage = (Math.abs(restored) / totalAbsolute) * 50;

	const [animatedWidths, setAnimatedWidths] = useState({
		consumed: 0,
		restored: 0,
	});

	const [tooltip, setTooltip] = useState<{
		content: string;
		x: number;
		y: number;
		visible: boolean;
	}>({
		content: "",
		x: 0,
		y: 0,
		visible: false,
	});

	useEffect(() => {
		setAnimatedWidths({
			consumed: Math.abs(consumedPercentage),
			restored: Math.abs(restoredPercentage),
		});
	}, [consumedPercentage, restoredPercentage]);

	const chartContainerClasses = css({
		display: "grid",
		gridTemplateColumns: "auto 1fr auto",
		alignItems: "center",
		gap: "3",
		marginBottom: "5px",
	});

	const labelClasses = css({
		fontSize: "sm",
		fontWeight: "medium",
		textAlign: "center",
		whiteSpace: "nowrap",
	});

	const chartWrapperClasses = css({
		height: "23px",
		width: "176px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		// backgroundColor: "#a1ca2a45",
		borderRadius: "full",
		overflow: "visible",
		border: "1px solid #00800036",
	});

	const consumedBarClasses = css({
		position: "absolute",
		right: "50%",
		height: "100%",
		backgroundColor: consumedColor,
		transition: "width 1s ease-out",
		overflow: "visible",
		borderRadius: "0px",
		zIndex: "1",
		cursor: "pointer",
		_hover: {
			backgroundColor: "#c2175b7a",
		},
		// "&::after": {
		//     content: '""',
		//     position: "absolute",
		//     left: "-12px",
		//     top: "50%",
		//     transform: "translateY(-50%)",
		//     width: "0",
		//     height: "0",
		//     borderStyle: "solid",
		//     borderWidth: "8px 12px 8px 0",
		//     borderColor: "transparent #c2175b7a transparent transparent",
		//     zIndex: "2",
		// },
		// "&:hover::after": {
		//     borderColor: `transparent ${consumedColor} transparent transparent`,
		// },
	});

	const restoredBarClasses = css({
		position: "absolute",
		left: "50%",
		height: "100%",
		backgroundColor: restoredColor,
		transition: "width 1s ease-out",
		overflow: "visible",
		borderRadius: "0px",
		zIndex: "1",
		cursor: "pointer",
		_hover: {
			backgroundColor: "#0080004d",
		},
		// "&::after": {
		//     content: '""',
		//     position: "absolute",
		//     right: "-12px",
		//     top: "50%",
		//     transform: "translateY(-50%)",
		//     width: "0",
		//     height: "0",
		//     borderStyle: "solid",
		//     borderWidth: "8px 0 8px 12px",
		//     borderColor: "transparent transparent transparent #0080004d",
		//     zIndex: "2",
		// },
		// "&:hover::after": {
		//     borderColor: `transparent transparent transparent ${restoredColor}`,
		// },
	});

	const valueClasses = css({
		fontSize: "3xl",
		fontWeight: "bold",
		color: consumedColor,
	});

	const customTooltipClasses = css({
		position: "fixed",
		backgroundColor: "gray.800",
		color: "white",
		padding: "8px 12px",
		borderRadius: "6px",
		fontSize: "12px",
		whiteSpace: "nowrap",
		zIndex: "1000",
		pointerEvents: "none",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
		border: "1px solid",
		borderColor: "gray.700",
		opacity: tooltip.visible ? "1" : "0",
		visibility: tooltip.visible ? "visible" : "hidden",
		transition: "opacity 0.4s ease",
		// left: "100px",
		transform: "translate(0%, -130%)",
	});

	const handleMouseEnter = (content: string, event: React.MouseEvent) => {
		setTooltip({
			content,
			x: event.clientX,
			y: event.clientY,
			visible: true,
		});
	};

	const handleMouseLeave = () => {
		setTooltip((prev) => ({ ...prev, visible: false }));
	};

	return (
		<div className={`${chartContainerClasses} ${className}`}>
			<div className={labelClasses}>
				<span className={`${valueClasses} ${css({ color: consumedColor })}`}>
					{consumed}
				</span>{" "}
				{unit}
			</div>
			<div className={chartWrapperClasses}>
				<div
					className={consumedBarClasses}
					style={{ width: `${animatedWidths.consumed}%` }}
					onMouseEnter={(e) =>
						handleMouseEnter(`Consumed: ${consumed} ${unit}`, e)
					}
					onMouseLeave={handleMouseLeave}
					role="button"
					tabIndex={0}
					aria-label={`Consumed: ${consumed} ${unit}`}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							handleMouseEnter(`Consumed: ${consumed} ${unit}`, e as any);
						}
					}}
				/>
				<div
					className={restoredBarClasses}
					style={{ width: `${animatedWidths.restored}%` }}
					onMouseEnter={(e) =>
						handleMouseEnter(`Restored: ${restored} ${unit}`, e)
					}
					onMouseLeave={handleMouseLeave}
					role="button"
					tabIndex={0}
					aria-label={`Restored: ${restored} ${unit}`}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							handleMouseEnter(`Restored: ${restored} ${unit}`, e as any);
						}
					}}
				/>
			</div>
			<div className={labelClasses}>
				<span className={`${valueClasses} ${css({ color: restoredColor })}`}>
					{restored}
				</span>{" "}
				{unit}
			</div>

			{/* Custom tooltip */}
			<div
				className={customTooltipClasses}
				style={{
					left: tooltip.x,
					top: tooltip.y,
				}}
			>
				{tooltip.content}
			</div>
		</div>
	);
};

export default BalanceChart;
