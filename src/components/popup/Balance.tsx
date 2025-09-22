import type React from "react";
import { css } from "styled-system/css";
import BalanceChart from "../common/BalanceChart";

interface BalanceProps {
	consumed: number;
	restored: number;
	className?: string;
	loading?: boolean;
}

const Balance: React.FC<BalanceProps> = ({
	consumed,
	restored,
	className = "",
	loading = false,
}) => {
	const containerClasses = css({
		backgroundColor: "white",
		padding: "4",
		borderRadius: "lg",
		borderColor: "gray.200",
		position: "relative",
		overflow: "hidden",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		transition: "all 0.3s ease",
		// border: "1px solid #d6d6d680",
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
			<BalanceChart consumed={consumed} restored={restored} />
		</div>
	);
};

export default Balance;
