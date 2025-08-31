import ServicesSection from "@/components/popup/ServicesSection";
import StatsSection from "@/components/popup/StatsSection";
import type React from "react";
import { css } from "styled-system/css";
import Header from "@/components/popup/Header";
import Balance from "@/components/popup/Balance";
import { useState } from "react";
import { PlantIcon } from "@phosphor-icons/react";
import { Footer } from "@/components/common/Footer";
import { useAuth } from "@/context/AuthContext";

const HomePage: React.FC = () => {
	const { user } = useAuth();
	const [showStats, setShowStats] = useState(false);

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

	return (
		<div className={containerClasses}>
			<Header />
			<main className={mainClasses}>
				<h2 >{user && <div>Hi {user.email}</div>}</h2>
				<h3 className={balanceHeaderClasses}>
					Your <PlantIcon style={{ margin: "0px 2px" }} /> m2 Balance
				</h3>

				<Balance
					consumed={11.2}
					restored={2.1}
					showStats={showStats}
					onDetailsClick={() => setShowStats(!showStats)}
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
