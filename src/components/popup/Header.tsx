import type React from "react";
import { css } from "styled-system/css";
import { useNavigate } from "react-router-dom";
import { ListIcon, User } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { Plant } from "@phosphor-icons/react";
import { useUserState } from "@/context/UserStateContext";

interface HeaderProps {
	className?: string;
}

const Header: React.FC<HeaderProps> = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { isGuest } = useUserState();
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
		// marginRight: "2",
		fontWeight: "bold",
		color: "green.main",
	});

	const settingsButtonClasses = css({
		fontSize: "lg",
		display: "flex",
		gap: "4",
	});

	const aiClasses = css({
		fontWeight: "bold",
	});

	const handleLoginClick = () => {
		if (user) {
			navigate("/profile");
			return;
		}
		const isProd = import.meta.env.MODE === "production";
		const url = isProd
			? "http://aim2balance.ai/dashboard/login"
			: "http://localhost:8080/login";
		window.open(url, "_blank", "noopener,noreferrer");
	};
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
				display: "flex",
				cursor: "pointer",
			})}
		>
			<div
				className={css({
					fontWeight: "bold",
					marginRight: "5",
					marginTop: "-2px",
					marginLeft: "1",
				})}
			>
				x
			</div>{" "}
			Create a free account to keep your history.
		</div>
	) : null;
	return (
		<div>
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
					{/* <img src={logo} alt="App icon" className={logoClasses} /> */}
					<Plant color="green" style={{ margin: "0px 2px" }} />
					<span className={aiClasses}>ai</span>
					<span className={superscriptClasses}>m2Balance</span>
					<span className={aiClasses}>.ai</span>
				</h1>

				<button
					type="button"
					onClick={handleLoginClick}
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
			{guestBadge}
		</div>
	);
};

export default Header;
