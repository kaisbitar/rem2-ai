import type React from "react";
import { css } from "styled-system/css";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
	className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
	const navigate = useNavigate();

	const headerContainerClasses = css({
		padding: "10px 25px 6px 25px",
		borderBottom: "1px solid #e5e7eb",
		borderColor: "gray.200",
		boxShadow: "1px 1px 7px 0px #00000017",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	});

	const titleClasses = css({
		fontSize: "xl",
		fontWeight: "light",
		marginBottom: "2",
		textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
		letterSpacing: "tight",
		color: "gray.700",
	});

	const superscriptClasses = css({
		marginLeft: "0.5",
		marginRight: "0.5",
		fontWeight: "bold",
	});

	// const taglineClasses = css({
	// 	fontSize: "sm",
	// 	opacity: "0.95",
	// 	fontWeight: "light",
	// 	textShadow: "0 1px 4px rgba(0, 0, 0, 0.15)",
	// });

	const settingsButtonClasses = css({
		fontSize: "lg",
	});

	return (
		<header className={`${headerContainerClasses} ${className || ""}`}>
			<div className={"gradient-bar"} />

			<h1 className={titleClasses}>
				RE<span className={superscriptClasses}>m2</span>.AI
				{/* <p className={taglineClasses}>Track & Restore AI Impact</p> */}
			</h1>
			<button
				type={"button"}
				className={settingsButtonClasses}
				onClick={() => navigate("/settings")}
			>
				⚙️
				{/* {i18n.t("settings")} */}
			</button>
		</header>
	);
};

export default Header;
