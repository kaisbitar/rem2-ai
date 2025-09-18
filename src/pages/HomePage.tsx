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
import BottomTabs from "@/components/common/BottomTabs";
// import StickyRestoreBar from "@/components/common/StickyRestoreBar";
import RestoreModal from "@/components/common/RestoreModal";

const HomePage: React.FC = () => {
	const { user, userProfile, loading: authLoading } = useAuth();
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
	const consumed = userProfile?.total_m2_consumed ?? 60;
	const restored = userProfile?.total_m2_restored ?? 40;

	const containerClasses = css({
		// color: "gray.700",
		display: "flex",
		flexDirection: "column",
		height: "500px",
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
		marginTop: "20px",
		marginBottom: "20px",

	});

	// const footerClasses = css({
	// 	display: "block",
	// 	transition: "opacity .4s ease-in-out, height .5s ease",
	// });


	return (
		<div className={containerClasses}>
			<Header />
			<main className={mainClasses}>
				<DonationBanner />

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
