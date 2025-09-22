import type React from "react";
import { css } from "styled-system/css";
import { useNavigate } from "react-router-dom";
// import { ListIcon } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { getLoginUrl } from "@/utils/constants/env";
// import { useUserState } from "@/context/UserStateContext";
interface HeaderProps {
	className?: string;
}

const Header: React.FC<HeaderProps> = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const headerContainerClasses = css({
		padding: "6px 18px 6px 18px",
		borderBottom: "1px solid #e5e7eb",
		borderColor: "gray.200",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	});

	const titleClasses = css({
		display: "flex",
		fontSize: "xl",
		fontWeight: "light",
		letterSpacing: "tight",
	});

	const superscriptClasses = css({
		marginLeft: "0",
		// marginRight: "2",
		fontWeight: "bold",
		color: "green.main",
	});

	const aiClasses = css({
		fontWeight: "bold",
	});

	const handleLoginClick = () => {
		if (user) {
			navigate("/profile");
			return;
		}
		// Use environment-aware login URL
		const loginUrl = getLoginUrl();
		window.open(loginUrl, "_blank", "noopener,noreferrer");
	};

	return (
		<div>
			<header className={headerContainerClasses}>
				<div className={"gradient-bar"} />
				<h1 className={titleClasses}>
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
					<FaUserCircle size={16} />
				</button>
			</header>
		</div>
	);
};

export default Header;
