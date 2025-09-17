import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { css } from "styled-system/css";
import Header from "@/components/popup/Header";
import Balance from "@/components/popup/Balance";
import { PlantIcon } from "@phosphor-icons/react";
// import { Footer } from "@/components/common/Footer";
import { useAuth } from "@/context/AuthContext";
import DonationBanner from "@/components/popup/DonationBanner";
import { useUserState } from "@/context/UserStateContext";
import BottomTabs from "@/components/common/BottomTabs";
// import StickyRestoreBar from "@/components/common/StickyRestoreBar";
import RestoreModal from "@/components/common/RestoreModal";

const HomePage: React.FC = () => {
	const { user, userProfile, loading: authLoading } = useAuth();
	const { isGuest } = useUserState();
	const { config } = useAppContext();
	const navigate = useNavigate();
	const [restoreOpen, setRestoreOpen] = useState(false);

	useEffect(() => {
		if (!config?.hasOnboarded) {
			navigate("/onboarding");
			return;
		}
	}, [config?.hasOnboarded, navigate]);

	const loading = authLoading;
	const consumed = userProfile?.total_m2_consumed ?? 100;
	const restored = userProfile?.total_m2_restored ?? 0;

	const containerClasses = css({
		// color: "gray.700",
		display: "flex",
		flexDirection: "column",
		height: "600px",
	});

	const mainClasses = css({
		padding: "5",
		paddingTop: "5px",
		paddingBottom: "56px", // leave space for bottom tabs
		flex: 1,
		overflow: "auto",
	});

	const balanceHeaderClasses = css({
		display: "flex",
		fontSize: "lg",
		fontWeight: "bold",
		marginBottom: "5px",
	});

	// const footerClasses = css({
	// 	display: "block",
	// 	transition: "opacity .4s ease-in-out, height .5s ease",
	// });

	const guestBadge = isGuest ? (
		<div
			className={css({
				backgroundColor: "yellow.50",
				border: "1px solid",
				borderColor: "yellow.200",
				color: "yellow.900",
				fontSize: "sm",
				padding: "2",
				borderRadius: "md",
				marginBottom: "3",
			})}
		>
			Create a free account to keep your history.
		</div>
	) : null;

	return (
		<div className={containerClasses}>
			<Header />
			<main className={mainClasses}>
				<DonationBanner />
				{guestBadge}

				<h2>{user && <div>Hi {user.email}</div>}</h2>
				<h3 className={balanceHeaderClasses}>
					Your <PlantIcon style={{ margin: "0px 2px" }} /> m2 Balance
				</h3>

				<Balance consumed={consumed} restored={restored} loading={loading} />

				{/* <div className={footerClasses}>
					<Footer />
				</div> */}
			</main>
			{/* <StickyRestoreBar onClick={() => setRestoreOpen(true)} /> */}
			<BottomTabs />
			<RestoreModal open={restoreOpen} onClose={() => setRestoreOpen(false)} />
		</div>
	);
};

export default HomePage;
