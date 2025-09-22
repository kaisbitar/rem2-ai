import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { css } from "styled-system/css";
import Balance from "@/components/popup/Balance";
import { Plant, UserCircle } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import DonationBanner from "@/components/popup/DonationBanner";
import RestoreModal from "@/components/common/RestoreModal";
import { useBalance } from "@/hooks/useStatsData";
import CreateAccountPrompt from "@/components/common/CreateAccountPrompt";
import CallToActionButton from "@/components/common/CallToActionButton";
import { useUserState } from "@/context/UserStateContext";
import { getSiteUrl } from "@/utils/constants/env";

const HomePage: React.FC = () => {
	const { user, loading: authLoading } = useAuth();
	const { config } = useAppContext();
	const navigate = useNavigate();
	const [restoreOpen, setRestoreOpen] = useState(false);
	const balance = useBalance();
	const { userState } = useUserState();

	useEffect(() => {
		if (!config?.hasOnboarded) {
			navigate("/onboarding");
			return;
		}
	}, [config?.hasOnboarded, navigate]);

	const loading = authLoading;

	const balanceContainerClasses = css({
		// marginBottom: "0px",
	});

	const restoreButton = css({
		backgroundColor: "#89af23",
		color: "white",
		width: "351px",
		margin: "0px 30px 10px 30px",
		_hover: {
			borderColor: "#6c6c6c",
		},
	});

	const secondaryCtaButton = css({
		backgroundColor: "#cdcccd29",
		color: "#5d5d5d",
		borderColor: "#cdcccd29",
		width: "351px",
		margin: "0px 30px 0px 30px",
		_hover: {
			borderColor: "#6c6c6c",
		},
	});

	const secondaryCta = (() => {
		// A — Guest Non‑payer
		if (userState === "guest-non-payer" || userState === "guest-payer") {
			return {
				text: "Create free account",
				onClick: () => {
					const siteUrl = getSiteUrl();
					window.open(`${siteUrl}/login`, "_blank", "noopener,noreferrer");
				},
			};
		}
		// B — Registered Non‑payer
		return {
			text: "View dashboard",
			onClick: () => {
				const siteUrl = getSiteUrl();
				window.open(siteUrl, "_blank", "noopener,noreferrer");
			},
		};
	})();
	return (
		<>
			<DonationBanner />
			<h2>{user && <div>Hi {user.email}</div>}</h2>
			<Balance
				className={balanceContainerClasses}
				consumed={balance.consumed}
				restored={balance.restored}
				loading={loading}
			/>
			<CallToActionButton
				text="Balance my m²"
				className={restoreButton}
				icon={<Plant size={19} />}
				onClick={() => {
					const siteUrl = getSiteUrl();
					window.open(siteUrl, "_blank", "noopener,noreferrer");
				}}
			/>
			<CallToActionButton
				text={secondaryCta.text}
				className={secondaryCtaButton}
				icon={<UserCircle size={19} />}
				onClick={secondaryCta.onClick}
			/>
			<RestoreModal open={restoreOpen} onClose={() => setRestoreOpen(false)} />
			<CreateAccountPrompt />
		</>
	);
};

export default HomePage;
