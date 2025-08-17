import type React from "react";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";
import CallToActionButton from "../common/CallToActionButton";
import { ChartLineUp, Plant } from "@phosphor-icons/react";

interface BalanceProps {
	consumed: number;
	restored: number;
	className?: string;
}

const Balance: React.FC<BalanceProps> = ({
	consumed,
	restored,
	className = "",
}) => {
	const totalAbsolute = Math.abs(consumed) + Math.abs(restored) || 1;
	const consumedPercentage = (Math.abs(consumed) / totalAbsolute) * 50;
	const restoredPercentage = (Math.abs(restored) / totalAbsolute) * 50;

	const [animatedWidths, setAnimatedWidths] = useState({
		consumed: 0,
		restored: 0,
	});

	useEffect(() => {
		setAnimatedWidths({
			consumed: Math.abs(consumedPercentage),
			restored: Math.abs(restoredPercentage),
		});
	}, [consumedPercentage, restoredPercentage]);

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

	const chartContainerClasses = css({
		display: "grid",
		gridTemplateColumns: "auto 1fr auto",
		alignItems: "center",
		gap: "3",
		gridRow: "2",
		marginBottom: "5px",
	});

	const labelClasses = css({
		fontSize: "sm",
		fontWeight: "medium",
		textAlign: "center",
		whiteSpace: "nowrap",
	});

	const chartWrapperClasses = css({
		height: "13px",
		width: "160px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		backgroundColor: "#a1ca2a45",
		borderRadius: "full",
		overflow: "hidden",
		border: "1px solid",
		borderColor: "#a1ca2a",
	});

	const consumedBarClasses = css({
		position: "absolute",
		left: "50%",
		height: "100%",
		backgroundColor: "#c2175b7a",
		transform: "translateX(-100%)",
		transition: "width 1s ease-out",
		overflow: "hidden",
		borderRadius: "50px 0px 0px 50px",
	});

	const restoredBarClasses = css({
		position: "absolute",
		left: "50%",
		height: "100%",
		backgroundColor: "#0080004d",
		transition: "width 1s ease-out",
		overflow: "hidden",
		borderRadius: "0px 10px 10px 0px",
	});

	const valueClasses = css({
		fontSize: "3xl",
		fontWeight: "bold",
	});

	const dueLabelClasses = css({
		width: "100px",
	});

	return (
		<div className={`${containerClasses} ${className}`}>
			<div className={"gradient-bar"} />
			<div className={chartContainerClasses}>
				<div className={labelClasses}>
					<span className={`${valueClasses} ${css({ color: "#c2185b" })}`}>
						{consumed}
					</span>{" "}
					m²
				</div>
				<div className={chartWrapperClasses}>
					<div
						className={consumedBarClasses}
						style={{ width: `${animatedWidths.consumed}%` }}
					/>
					<div
						className={restoredBarClasses}
						style={{ width: `${animatedWidths.restored}%` }}
					/>
				</div>
				<div className={labelClasses}>
					<span className={`${valueClasses} ${css({ color: "green" })}`}>
						{restored}
					</span>{" "}
					m²
				</div>
			</div>
			<div className={css({ display: "flex", gap: "2" })}>
				<span className={dueLabelClasses}>Due to restore: 0.0Xm</span>
				<CallToActionButton
					text="Details"
					className="btn-theme-magenta"
					icon={<ChartLineUp size={19} />}
					onClick={() => { }}
				/>
				<CallToActionButton
					text="Restore m2"
					className="btn-theme-green"
					icon={<Plant size={19} />}
					onClick={() => { }}
				/>

			</div>
		</div>
	);
};

export default Balance;
