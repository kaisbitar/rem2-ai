import type React from "react";
import { css } from "styled-system/css";
import { useNavigate } from "react-router-dom";
import { Gear, User } from "@phosphor-icons/react";

interface HeaderProps {
	className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
	const navigate = useNavigate();

	const headerContainerClasses = css({
		padding: "10px 25px 6px 25px",
		borderBottom: "1px solid #e5e7eb",
		borderColor: "gray.200",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	});

	const titleClasses = css({
		fontSize: "3xl",
		fontWeight: "light",
		// marginBottom: "2",
		letterSpacing: "tight",
	});

	const superscriptClasses = css({
		marginLeft: "0.5",
		marginRight: "0.5",
		fontWeight: "bold",
	});

	const taglineClasses = css({
		fontSize: "sm",
		opacity: "0.95",
		fontWeight: "light",
	});

	const settingsButtonClasses = css({
		fontSize: "lg",
		display: "flex",
		gap: "4",
	});

	return (
		<header className={`${headerContainerClasses} ${className || ""}`}>
			<div className={"gradient-bar"} />

			<h1 className={titleClasses}>
				RE<span className={superscriptClasses}>m2</span>.AI
				<p className={taglineClasses}>Track & Restore AI Impact</p>
			</h1>
			<button
				type={"button"}
				className={settingsButtonClasses}
				onClick={() => navigate("/settings")}
			>
				<User size={16} />
				<Gear size={16} />
			</button>
		</header>
	);
};

export default Header;
