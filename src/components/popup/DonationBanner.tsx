import type React from "react";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { useUserState } from "@/context/UserStateContext";
import { useNavigate } from "react-router-dom";

const DonationBanner: React.FC = () => {
	const { userState, paymentSession } = useUserState();
	const navigate = useNavigate();

	const visible = useMemo(() => {
		if (userState !== "guest-payer") return false;
		if (!paymentSession) return false;
		if (paymentSession.claimed) return false;
		return true;
	}, [userState, paymentSession]);

	if (!visible) return null;

	return (
		<div
			className={css({
				backgroundColor: "green.50",
				border: "1px solid",
				borderColor: "green.200",
				borderRadius: "md",
				padding: "3",
				marginBottom: "3",
				color: "green.800",
				fontSize: "sm",
			})}
		>
			<div className={css({ fontWeight: 600, marginBottom: "2" })}>
				Thank you! +{paymentSession?.m2Restored || 0} m² restored
			</div>
			<div className={css({ display: "flex", gap: "2" })}>
				<button
					type="button"
					className={css({
						paddingX: "3",
						paddingY: "2",
						backgroundColor: "green.600",
						color: "white",
						borderRadius: "sm",
					})}
					onClick={() => navigate("/signup")}
				>
					Claim your donation
				</button>
				<button
					type="button"
					className={css({
						paddingX: "3",
						paddingY: "2",
						backgroundColor: "gray.100",
						color: "gray.700",
						borderRadius: "sm",
					})}
					onClick={() => navigate("/")}
				>
					Later
				</button>
			</div>
		</div>
	);
};

export default DonationBanner;
