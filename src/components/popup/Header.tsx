import type React from "react";
import { css } from "styled-system/css";
import { useNavigate } from "react-router-dom";
import { ListIcon, Plant, User } from "@phosphor-icons/react";

interface HeaderProps {
	className?: string;
}

const Header: React.FC<HeaderProps> = () => {
	const navigate = useNavigate();

	const headerContainerClasses = css({
		padding: "10px 20px 6px 18px",
		borderBottom: "1px solid #e5e7eb",
		borderColor: "gray.200",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	});

	const titleClasses = css({
		display: "flex",
		fontSize: "3xl",
		fontWeight: "light",
		letterSpacing: "tight",
	});

	const superscriptClasses = css({
		marginLeft: "0",
		marginRight: "2",
		fontWeight: "bold",
	});

	const settingsButtonClasses = css({
		fontSize: "lg",
		display: "flex",
		gap: "4",
	});

	return (
		<header className={headerContainerClasses}>
			<div className={"gradient-bar"} />

			<button
				type={"button"}
				className={settingsButtonClasses}
				onClick={() => navigate("/settings")}
			>
				<ListIcon size={16} />
			</button>
			<h1 className={titleClasses}>
				<Plant color="green" style={{ margin: "0px 2px" }} />
				<span className={superscriptClasses}>m2 </span> Balance.AI
			</h1>

			<button
				type="button"
				onClick={() => navigate("/login")}
				className={css({
					background: "none",
					border: "none",
					cursor: "pointer",
					padding: "2",
					borderRadius: "4px",
					transition: "background-color 0.2s",
					"&:hover": {
						backgroundColor: "gray.100",
					},
				})}
			>
				<User size={16} />
			</button>
		</header>
	);
};

export default Header;
