import ServicesSection from "@/components/popup/ServicesSection";
import StatsSection from "@/components/popup/StatsSection";
import type React from "react";
import { css } from "styled-system/css";
import Header from "@/components/popup/Header";
import Balance from "@/components/popup/Balance";
import { useState } from "react";
import { PlantIcon } from "@phosphor-icons/react";
// import CallToActionButton from "@/components/common/CallToActionButton";
import { Footer } from "@/components/common/Footer";
import { useAuth } from "@/context/AuthContext";
import { DatabaseSyncService } from "@/utils/storage/database-sync";

const HomePage: React.FC = () => {
	const { user, isDataSynced, syncUserData } = useAuth();
	const [isSyncing, setIsSyncing] = useState(false);
	const [showStats, setShowStats] = useState(false);

	const containerClasses = css({
		background: "white",
		borderRadius: "0",
		margin: "0",
		boxShadow: "none",
		width: "100%",
		minWidth: "400px",
		height: showStats ? "100%" : "0px",
		// display: "flex",
		// flexDirection: "column",
		color: "gray.700",
		transition: " height .5s ease-in-out",
	});

	const mainClasses = css({
		padding: "5",
		paddingTop: "5px",
		paddingBottom: "0px",
		flex: 1,
		// height: showStats ? "50px" : "0px",
		transition: " height .5s ease-in-out",
	});

	const contentContainerClasses = css({
		// height: "100px",

		// position: "relative",
		overflow: "hidden",
		opacity: showStats ? 1 : 0,
		// display: showStats ? "block" : "none",
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

	const handleManualSync = async () => {
		if (!user) return;

		setIsSyncing(true);
		try {
			console.log("🔄 Manual sync triggered by user");
			await syncUserData();
			alert("✅ Data sync completed successfully!");
		} catch (error) {
			console.error("❌ Manual sync failed:", error);
			alert("❌ Data sync failed. Please try again.");
		} finally {
			setIsSyncing(false);
		}
	};

	return (
		<div className={containerClasses}>
			<Header />
			<main className={mainClasses}>
				{/* Sync Status and Manual Sync Button */}
				{user && (
					<div
						className={css({
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							padding: "3",
							backgroundColor: "gray.50",
							borderRadius: "6px",
							marginBottom: "4",
							border: "1px solid",
							borderColor: "gray.200",
						})}
					>
						<div
							className={css({
								display: "flex",
								alignItems: "center",
								gap: "2",
							})}
						>
							<span
								className={css({
									fontSize: "sm",
									color: "gray.600",
								})}
							>
								Database Sync Status:
							</span>
							<span
								className={css({
									padding: "1",
									borderRadius: "4px",
									fontSize: "xs",
									fontWeight: "medium",
									backgroundColor: isDataSynced ? "green.100" : "yellow.100",
									color: isDataSynced ? "green.700" : "yellow.700",
								})}
							>
								{isDataSynced ? "✅ Synced" : "🔄 Pending"}
							</span>
						</div>
						<button
							onClick={handleManualSync}
							disabled={isSyncing}
							type="button"
							className={css({
								padding: "2",
								backgroundColor: "blue.600",
								color: "white",
								border: "none",
								borderRadius: "4px",
								fontSize: "sm",
								cursor: "pointer",
								transition: "background-color 0.2s",
								"&:hover": {
									backgroundColor: "blue.700",
								},
								"&:disabled": {
									backgroundColor: "gray.400",
									cursor: "not-allowed",
								},
							})}
						>
							{isSyncing ? "🔄 Syncing..." : "🔄 Sync Now"}
						</button>
					</div>
				)}
				<h3 className={balanceHeaderClasses}>
					Your <PlantIcon style={{ margin: "0px 2px" }} /> m2 Balance
				</h3>

				<Balance
					consumed={11.2}
					restored={9}
					onDetailsClick={() => setShowStats(!showStats)}
					showStats={showStats}
				/>
				<div className={contentContainerClasses}>
					<StatsSection />
					<ServicesSection />
				</div>
				{/* <CallToActionButton
					text="Auto Balance"
					tooltip="Monthly m² restoration"
					className={`${autoBalanceClasses} btn-theme-green`}
					icon={<FlowerIcon size={19} />}
					onClick={() => { }}
				/> */}
			</main>
			<div className={footerClasses}>
				<Footer />
			</div>
		</div>
	);
};

export default HomePage;
