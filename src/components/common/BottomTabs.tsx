import type React from "react";
import { css, cx } from "styled-system/css";
import { useLocation, useNavigate } from "react-router-dom";
import { ChartBar, PlantIcon } from "@phosphor-icons/react";
// import { useAuth } from "@/context/AuthContext";

interface TabItem {
	key: "balance" | "insights" | "account";
	label: string;
	icon: React.ReactNode;
	to: string;
}

const BottomTabs: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	// const { user } = useAuth();

	const pathname = location?.pathname || "/";

	const items: TabItem[] = [
		{
			key: "balance",
			label: "Balance",
			icon: <PlantIcon size={18} />,
			to: "/balance",
		},
		{
			key: "insights",
			label: "Insights",
			icon: <ChartBar size={18} />,
			to: "/insights",
		},
		// {
		// 	key: "account",
		// 	label: "Account",
		// 	icon: <User size={18} />,
		// 	to: user ? "/account" : "/account",
		// },
	];

	const getIsActive = (item: TabItem) => {
		if (item.key === "balance") {
			if (pathname === "/" || pathname.startsWith("/balance")) return true;
			return false;
		}
		if (item.key === "insights") return pathname.startsWith("/insights");
		if (item.key === "account") return pathname.startsWith("/account");
		return false;
	};

	const container = css({
		position: "sticky",
		bottom: 0,
		width: "100%",
		backgroundColor: "white",
		// borderTop: "1px solid",
		boxShadow: "0 0 10px 0 rgb(189 189 189 / 81%)",
		// borderColor: "gray.200",
		// paddingY: "2",
		zIndex: 10,
	});

	const list = css({
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: "1",
		alignItems: "center",
	});

	const itemBtn = css({
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		// gap: "1",
		padding: "3",
		color: "gray.600",
		fontSize: "xs",
		cursor: "pointer",
		userSelect: "none",
		"&:hover": { backgroundColor: "gray.50" },
		borderRadius: "xlg",
		width: "100%",
		textAlign: "center",
		position: "relative",
	});

	const itemActive = css({
		color: "gray.900",
		fontWeight: 700,
		backgroundColor: "#f4f4f4",
		borderRadius: "0px",
	});

	return (
		<nav className={container} aria-label="Bottom tabs">
			<ul className={list}>
				{items.map((it) => {
					const active = getIsActive(it);
					return (
						<li key={it.key}>
							<button
								type="button"
								className={cx(itemBtn, active && itemActive)}
								onClick={() => navigate(it.to)}
								aria-current={active ? "page" : undefined}
							>
								{it.icon}
								<span>{it.label}</span>
							</button>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default BottomTabs;
