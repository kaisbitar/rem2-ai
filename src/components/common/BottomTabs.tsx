import type React from "react";
import { css, cx } from "styled-system/css";
import { useLocation, useNavigate } from "react-router-dom";
import { ChartBar, PlantIcon } from "@phosphor-icons/react";

interface TabItem {
	key: "balance" | "insights" | "account";
	label: string;
	icon: React.ReactNode;
	to: string;
}

const BottomTabs: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const pathname = location?.pathname || "/";

	const items: TabItem[] = [
		{
			key: "balance",
			label: "Balance",
			icon: <PlantIcon size={20} weight="fill" />,
			to: "/balance",
		},

		{
			key: "insights",
			label: "Insights",
			icon: <ChartBar size={20} weight="fill" />,
			to: "/insights",
		},
	];

	const getIsActive = (item: TabItem) => {
		if (item.key === "balance") {
			if (pathname === "/" || pathname.startsWith("/balance")) return true;
			return false;
		}
		if (item.key === "insights") return pathname.startsWith("/insights");
		return false;
	};

	const container = css({
		position: "sticky",
		bottom: 0,
		width: "100%",
		backgroundColor: "white",
		padding: "12px 0",
		zIndex: 10,
	});

	const list = css({
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		maxWidth: "450px",
		margin: "0 auto",
		gap: "8px",
	});

	const itemBtn = css({
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: "8px 16px",
		color: "#9CA3AF",
		fontSize: "12px",
		// fontWeight: "800",
		cursor: "pointer",
		userSelect: "none",
		borderRadius: "8px",
		textAlign: "center",
		position: "relative",
		transition: "all 0.2s ease",
		gap: "4px",
		_hover: {
			backgroundColor: "#F3F4F6",
		},
	});

	const itemActive = css({
		color: "#1F2937",
		fontWeight: "700",
		backgroundColor: "#F3F4F6",
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
