import ServicesSection from "@/components/popup/ServicesSection";
import StatsSection from "@/components/popup/StatsSection";
import type React from "react";
import { css } from "styled-system/css";
import Header from "@/components/popup/Header";
import Balance from "@/components/popup/Balance";
import { useState, useEffect } from "react";
import { PlantIcon } from "@phosphor-icons/react";
import { Footer } from "@/components/common/Footer";
import { useAuth } from "@/context/AuthContext";
import { useDatabase } from "@/hooks/useDatabase";
import DonationBanner from "@/components/popup/DonationBanner";
import { useUserState } from "@/context/UserStateContext";

const HomePage: React.FC = () => {
	const { user } = useAuth();
	const { getUserProfile } = useDatabase();
	const { isGuest } = useUserState();
	const [showStats, setShowStats] = useState(false);
	const [userProfile, setUserProfile] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	// Fetch user profile data on component mount
	useEffect(() => {
		const fetchUserData = async () => {
			if (user?.id) {
				try {
					const profile = await getUserProfile();
					setUserProfile(profile);
				} catch (error) {
					console.error("Error fetching user profile:", error);
				} finally {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [user?.id, getUserProfile]);

	const containerClasses = css({
		background: "white",
		borderRadius: "0",
		margin: "0",
		boxShadow: "none",
		width: "100%",
		minWidth: "400px",
		height: showStats ? "100%" : "0px",
		color: "gray.700",
		transition: " height .5s ease-in-out",
	});

	const mainClasses = css({
		padding: "5",
		paddingTop: "5px",
		paddingBottom: "0px",
		flex: 1,
		transition: " height .5s ease-in-out",
	});

	const contentContainerClasses = css({
		overflow: "hidden",
		opacity: showStats ? 1 : 0,
		height: showStats ? "10%" : "50px",
		transition: "opacity .4s ease-in-out, height .5s ease",
	});

	const balanceHeaderClasses = css({
		display: "flex",
		fontSize: "lg",
		fontWeight: "bold",
		marginBottom: "5px",
	});

	const footerClasses = css({
		display: showStats ? "none" : "block",
		transition: "opacity .4s ease-in-out, height .5s ease",
	});

	// Calculate balance from user profile data
	const consumed = userProfile?.total_m2_consumed || 40;
	const restored = userProfile?.total_m2_restored || 18;

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

				<h2>{user && <div>Hi {user.email}</div>}</h2>
				<h3 className={balanceHeaderClasses}>
					Your <PlantIcon style={{ margin: "0px 2px" }} /> m2 Balance
				</h3>

				<Balance
					consumed={consumed}
					restored={restored}
					showStats={showStats}
					onDetailsClick={() => setShowStats(!showStats)}
					loading={loading}
				/>

				<div className={contentContainerClasses}>
					<StatsSection />
					<ServicesSection />
				</div>

				<div className={footerClasses}>
					<Footer />
				</div>
			</main>
		</div>
	);
};

export default HomePage;
