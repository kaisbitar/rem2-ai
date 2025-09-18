import type React from "react";
import { css } from "styled-system/css";
import Header from "@/components/popup/Header";
import BottomTabs from "@/components/common/BottomTabs";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {
	showHeader?: boolean;
	showBottomTabs?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
	showHeader = true,
	showBottomTabs = true,
}) => {
	const containerClasses = css({
		display: "flex",
		flexDirection: "column",
		height: "500px",
	});

	const mainClasses = css({
		padding: "5",
		paddingTop: "5px",
		paddingBottom: showBottomTabs ? "56px" : "5px", // leave space for bottom tabs if shown
		flex: 1,
		overflow: "auto",
	});

	return (
		<div className={containerClasses}>
			{showHeader && <Header />}
			<main className={mainClasses}>
				<Outlet />
			</main>
			{showBottomTabs && <BottomTabs />}
		</div>
	);
};

export default MainLayout;
