import ServicesSection from "@/components/popup/ServicesSection";
import StatsSection from "@/components/popup/StatsSection";
import type React from "react";
import { css } from "styled-system/css";
import Header from "@/components/popup/Header";
import Balance from "@/components/popup/Balance";
import { useState } from "react";
import { FlowerIcon, PlantIcon } from "@phosphor-icons/react";
import CallToActionButton from "@/components/common/CallToActionButton";
import { Footer } from "@/components/common/Footer";

const HomePage: React.FC = () => {
	const [showStats, setShowStats] = useState(true);

	const containerClasses = css({
		background: "white",
		borderRadius: "0",
		margin: "0",
		boxShadow: "none",
		width: "100%",
		minWidth: "400px",
		height: "600px",
		display: "flex",
		flexDirection: "column",
		color: "gray.700",
	});

	const mainClasses = css({
		padding: "5",
		paddingTop: "5px",
		paddingBottom: "0px",
		flex: 1,
		overflow: "auto",
		minHeight: 0,
	});

	const contentContainerClasses = css({
		position: "relative",
		opacity: showStats ? 1 : 0,
		height: showStats ? "100%" : "0%",
		transition: "opacity .4s ease-in-out, height .5s ease-in-out",
	});

	const balanceHeaderClasses = css({
		display: "flex",
		fontSize: "lg",
		fontWeight: "bold",
		marginBottom: "5px",
	});

	const autoBalanceClasses = css({
		position: "relative",
		bottom: "-5px",
		width: "150px",
	});
	return (
		<div className={containerClasses}>
			<Header />
			<main className={mainClasses}>
				<h3 className={balanceHeaderClasses}>
					Your <PlantIcon style={{ margin: "0px 2px" }} /> m2 Balance
				</h3>

				<Balance
					consumed={11.2}
					restored={0}
					onDetailsClick={() => setShowStats(!showStats)}
					showStats={showStats}
				/>
				<div className={contentContainerClasses}>
					<StatsSection />
					<ServicesSection />
				</div>
				<CallToActionButton
					text="Auto Balance"
					tooltip="Monthly m² restoration"
					className={`${autoBalanceClasses} btn-theme-green`}
					icon={<FlowerIcon size={19} />}
					onClick={() => {}}
				/>
			</main>
			<Footer />
		</div>
	);
};

export default HomePage;
