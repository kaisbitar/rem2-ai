import type React from "react";
import { css } from "styled-system/css";
import { PlantIcon } from "@phosphor-icons/react";

interface BalanceChartProps {
	consumed: number;
	restored: number;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ consumed, restored }) => {
	const containerClass = css({
		backgroundColor: "white",
		borderRadius: "12px",
		width: "100%",
	});

	const headerClass = css({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: "16px",
	});

	const titleClass = css({
		display: "flex",
		fontSize: "16px",
		fontWeight: "600",
		color: "#1F2937",
	});

	const progressItemClass = css({
		marginBottom: "12px",
		paddingRight: "18px",
		paddingLeft: "18px",
	});

	const labelClass = css({
		display: "flex",
		alignItems: "center",
		gap: "8px",
		marginBottom: "4px",
		fontSize: "12px",
		fontWeight: "500",
		color: "#374151",
	});

	const dotClass = css({
		width: "8px",
		height: "8px",
		borderRadius: "50%",
	});

	const consumedDotClass = css({
		width: "8px",
		height: "8px",
		borderRadius: "50%",
		backgroundColor: "#c21f42",
	});

	const restoredDotClass = css({
		width: "8px",
		height: "8px",
		borderRadius: "50%",
		backgroundColor: "#89af23",
	});

	const progressBarClass = css({
		width: "100%",
		height: "8px",
		backgroundColor: "#E5E7EB",
		borderRadius: "4px",
		overflow: "hidden",
	});

	const consumedFillClass = css({
		height: "100%",
		borderRadius: "4px",
		transition: "width 0.3s ease",
		backgroundColor: "#c21f42",
	});

	const restoredFillClass = css({
		height: "100%",
		borderRadius: "4px",
		transition: "width 0.3s ease",
		backgroundColor: "#89af23",
	});

	const consumedValueClass = css({
		fontSize: "14px",
		fontWeight: "600",
		marginLeft: "8px",
		color: "#c21f42",
	});

	const restoredValueClass = css({
		fontSize: "14px",
		fontWeight: "600",
		marginLeft: "8px",
		color: "#89af23",
	});

	return (
		<div className={containerClass}>
			<div className={headerClass}>
				<h3 className={titleClass}>Your <PlantIcon style={{ margin: "0px 2px" }} /> m2 Balance</h3>
			</div>

			<div className={progressItemClass}>
				<div className={labelClass}>
					<div className={consumedDotClass} />
					<span>Consumed</span>
				</div>
				<div className={css({ display: "flex", alignItems: "center" })}>
					<div className={progressBarClass}>
						<div
							className={consumedFillClass}
							style={{
								width: `${Math.min((consumed / 20) * 100, 100)}%`,
							}}
						/>
					</div>
					<span className={consumedValueClass}>
						{consumed.toFixed(1)}m²
					</span>
				</div>
			</div>

			<div className={progressItemClass}>
				<div className={labelClass}>
					<div className={restoredDotClass} />
					<span>Restored</span>
				</div>
				<div className={css({ display: "flex", alignItems: "center" })}>
					<div className={progressBarClass}>
						<div
							className={restoredFillClass}
							style={{
								width: `${Math.min((restored / 20) * 100, 100)}%`,
							}}
						/>
					</div>
					<span className={restoredValueClass}>
						{restored.toFixed(1)}m²
					</span>
				</div>
			</div>
		</div>
	);
};

export default BalanceChart;
