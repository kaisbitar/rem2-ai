import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { css } from "styled-system/css";
import Balance from "@/components/popup/Balance";
import { PlantIcon } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import DonationBanner from "@/components/popup/DonationBanner";
import RestoreModal from "@/components/common/RestoreModal";
import { useBalance } from "@/hooks/useStatsData";

const HomePage: React.FC = () => {
	const { user, loading: authLoading } = useAuth();
	const { config } = useAppContext();
	const navigate = useNavigate();
	const [restoreOpen, setRestoreOpen] = useState(false);
	const balance = useBalance();

	useEffect(() => {
		if (!config?.hasOnboarded) {
			navigate("/onboarding");
			return;
		}
	}, [config?.hasOnboarded, navigate]);

	const loading = authLoading;

	const balanceHeaderClasses = css({
		display: "flex",
		fontSize: "lg",
		fontWeight: "bold",
		marginTop: "20px",
		marginBottom: "20px",
	});
	console.log(balance);
	return (
		<>
			<DonationBanner />
			<h2>{user && <div>Hi {user.email}</div>}</h2>
			<h3 className={balanceHeaderClasses}>
				Your <PlantIcon style={{ margin: "0px 2px" }} /> m2 Balance
			</h3>
			<Balance
				consumed={balance.consumed}
				restored={balance.restored}
				loading={loading}
			/>
			<RestoreModal open={restoreOpen} onClose={() => setRestoreOpen(false)} />
		</>
	);
};

export default HomePage;
