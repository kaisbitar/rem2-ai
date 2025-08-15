import type React from "react";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";

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
		// boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
		border: "1px solid",
		borderColor: "gray.200",
		position: "relative",
		overflow: "hidden",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		transition: "all 0.3s ease",
		cursor: "pointer",
		_hover: {
			transform: "translateY(-2px)",
			boxShadow: "0 5px 5px rgba(0, 0, 0, 0.15)",
			borderColor: "#A1CA2B",
		},
	});

	const chartContainerClasses = css({
		display: "grid",
		gridTemplateColumns: "auto 1fr auto",
		alignItems: "center",
		gap: "3",
		gridRow: "2",
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
		backgroundColor: "#85693f70",
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

	return (
		<div className={`${containerClasses} ${className}`}>
			<div className={"gradient-bar"} />
			{/* <h3 className={headerClasses}>Your m2 Balance</h3> */}
			<div className={chartContainerClasses}>
				<div className={labelClasses}>
					<span className={`${valueClasses} ${css({ color: "brown" })}`}>
						{consumed}
					</span>{" "}
					m²
				</div>
				<div className={chartWrapperClasses}>
					<div className="bar-shimmer" />
					<div
						className={consumedBarClasses}
						style={{ width: `${animatedWidths.consumed}%` }}
					/>
					<div className="bar-shimmer" />
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
			Due to restore: 0.0Xm
		</div>
	);
};

export default Balance;
