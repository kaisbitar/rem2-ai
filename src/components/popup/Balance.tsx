import type React from "react";
import { css } from "styled-system/css";
import CallToActionButton from "../common/CallToActionButton";
import BalanceChart from "../common/BalanceChart";
import { Plant } from "@phosphor-icons/react";
import { useUserState } from "@/context/UserStateContext";
import { useNavigate } from "react-router-dom";

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
	const { userState } = useUserState();
	const navigate = useNavigate();

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
		border: "1px solid #d6d6d680",
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
			onClick: () =>
				window.open("http://localhost:8080/", "_blank", "noopener,noreferrer"), //navigate("/settings"),
		};
	})();

	const handlePrimary = () => {
		navigate("/settings");
	};

	return (
		<div className={`${containerClasses} ${className}`}>
			<BalanceChart consumed={consumed} restored={restored} />

			<div
				className={css({
					display: "flex",
					gap: "2",
					marginTop: "20px",
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
		</div>
	);
};

export default Balance;
