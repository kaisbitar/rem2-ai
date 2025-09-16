import StatsSection from "@/components/popup/StatsSection";
import ServicesSection from "@/components/popup/ServicesSection";
import type React from "react";
import { css } from "styled-system/css";
import Header from "@/components/popup/Header";
import { Footer } from "@/components/common/Footer";
import { useAuth } from "@/context/AuthContext";
import DonationBanner from "@/components/popup/DonationBanner";
import { useUserState } from "@/context/UserStateContext";
import BottomTabs from "@/components/common/BottomTabs";

const InsightsPage: React.FC = () => {
	const { loading: authLoading } = useAuth();
	const { isGuest } = useUserState();

	if (authLoading) {
		return <div className={css({ padding: "5" })}>Loading…</div>;
	}

	const containerClasses = css({
		background: "white",
		borderRadius: "0",
		margin: "0",
		boxShadow: "none",
		color: "gray.700",
	});

	const mainClasses = css({
		padding: "5",
		paddingTop: "5px",
		paddingBottom: "56px", // leave space for tabs
		flex: 1,
	});

	const footerClasses = css({
		transition: "opacity .4s ease-in-out, height .5s ease",
	});

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
			Tracking on this device only. Create a free account to keep your history.
		</div>
	) : null;

	return (
		<div className={containerClasses}>
			<Header />
			<main className={mainClasses}>
				<DonationBanner />
				{guestBadge}

				<div>
					<StatsSection />
					<ServicesSection />
				</div>

				<div className={footerClasses}>
					<Footer />
				</div>
			</main>
			<BottomTabs />
		</div>
	);
};

export default InsightsPage;
