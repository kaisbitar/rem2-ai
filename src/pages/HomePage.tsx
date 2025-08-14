import ServicesSection from "@/components/popup/ServicesSection";
import StatsSection from "@/components/popup/StatsSection";
import type React from "react";
import { css } from "styled-system/css";
import Header from "@/components/popup/Header";
import ForestRestoration from "@/components/popup/ForestRestoration";

const HomePage: React.FC = () => {
	const containerClasses = css({
		background: "white",
		borderRadius: "0",
		margin: "0",
		overflow: "hidden",
		boxShadow: "none",
		width: "100%",
		height: "100%",
		minWidth: "380px",
		minHeight: "500px",
		display: "flex",
		flexDirection: "column",
	});

	const mainClasses = css({
		padding: "5",
		flex: 1,
		overflow: "auto",
		minHeight: 0,
	});

	return (
		<div className={containerClasses}>
			<Header />

			<main className={mainClasses}>
				<ForestRestoration value={10} />
				<StatsSection />
				<ServicesSection />
			</main>
		</div>
	);
};

export default HomePage;
