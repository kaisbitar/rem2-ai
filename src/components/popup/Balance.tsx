import type React from "react";
import { css } from "styled-system/css";
import CallToActionButton from "../common/CallToActionButton";
import BalanceChart from "../common/BalanceChart";
import { CaretUp, CaretDown, Plant } from "@phosphor-icons/react";
import { useUserState } from "@/context/UserStateContext";
import { useNavigate } from "react-router-dom";

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
	const { userState } = useUserState();
	const navigate = useNavigate();

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

	const detailsBtn = css({
		// position: "absolute",
		// top: "4",
		// right: "4",
		cursor: "pointer",
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

	const secondaryCta = (() => {
		// A — Guest Non‑payer
		if (userState === "guest-non-payer" || userState === "guest-payer") {
			return {
				text: "Save my footprint",
				onClick: () => navigate("/signup"),
			};
		}
		// B — Registered Non‑payer
		return {
			text: "Set monthly target",
			onClick: () => navigate("/settings"),
		};
	})();

	const handlePrimary = () => {
		// Primary CTA is "Restore m²" for both A and B.
		// Route can be adjusted later to an external donation page or in-app flow.
		navigate("/settings");
	};

	return (
		<div className={`${containerClasses} ${className}`}>
			<div className={"gradient-bar"} />
			<BalanceChart consumed={consumed} restored={restored} />

			<div
				className={css({
					display: "flex",
					gap: "2",
					margin: "auto",
					marginTop: "4",
				})}
			>

				<CallToActionButton
					text="Restore m²"
					className="btn-theme-green"
					icon={<Plant size={19} />}
					onClick={handlePrimary}
				/>
				<CallToActionButton
					text={secondaryCta.text}
					className="btn-theme-gray"
					onClick={secondaryCta.onClick}
				/>
			</div>
			{showStats && <CaretUp
				// text={showStats ? "Hide Details" : "Show Details"}
				className={detailsBtn}
				// icon={showStats ? <CaretUp size={19} /> : <CaretDown size={19} />}
				onClick={onDetailsClick}
				size={20}
			/>}
			{!showStats && <CaretDown
				// text={showStats ? "Hide Details" : "Show Details"}
				className={detailsBtn}
				// icon={showStats ? <CaretUp size={19} /> : <CaretDown size={19} />}
				onClick={onDetailsClick}
				size={20}

			/>}
		</div>
	);
};

export default Balance;