import ServicesSection from "@/components/popup/ServicesSection";
import StatsSection from "@/components/popup/StatsSection";
import type React from "react";
import { css } from "styled-system/css";
import Header from "@/components/popup/Header";
import Balance from "@/components/popup/Balance";
import { useState } from "react";

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
		flex: 1,
		overflow: "auto",
		minHeight: 0,
	});

	const toggleModelsBreakdown = () => {
		setShowStats(!showStats);
	};

	const contentContainerClasses = css({
		position: "relative",
		overflow: "scroll",
		height: "350px",
	});

	const statsClasses = css({
		transition: "transform 0.3s ease",
		transform: showStats ? "translateY(0)" : "translateY(-100%)",
		opacity: showStats ? 1 : 0,
	});

	const servicesClasses = css({
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		transition: "transform 0.3s ease",
		transform: showStats ? "translateY(100%)" : "translateY(0)",
		opacity: showStats ? 0 : 1,
		display: showStats ? "none" : "block",
	});

	const balanceHeaderClasses = css({
		fontSize: "lg",
		fontWeight: "bold",
	});

	return (
		<div className={containerClasses}>
			<Header />
			<main className={mainClasses}>
				<h3 className={balanceHeaderClasses}>Your m2 Balance</h3>

				<Balance consumed={1.2} restored={7.2} />
				{/* <button
					type="button"
					onClick={toggleModelsBreakdown}
				>
					{showStats ? "Show Services" : "Show Stats"}
				</button> */}

				<div className={contentContainerClasses}>
					<div className={statsClasses}>
						<StatsSection />
					</div>
					<div className={servicesClasses}>
						<ServicesSection />
					</div>
				</div>
			</main>
		</div>
	);
};

export default HomePage;
