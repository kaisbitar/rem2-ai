import type React from "react";
import { css } from "styled-system/css";

interface HeaderProps {
	className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
	const headerContainerClasses = css({
		// background: "repeating-radial-gradient( circle, #6A7B02, #A1CA2B)",
		padding: "4",
		// textAlign: "center",
		background: "linear-gradient(135deg, #accf94 0%, #bcb58e 100%)",
	});

	const titleClasses = css({
		fontSize: "2xl",
		fontWeight: "light",
		// color: "white",
		marginBottom: "2",
		textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
		letterSpacing: "tight",
	});

	const superscriptClasses = css({
		// fontSize: "lg",
		// verticalAlign: "super",
		// lineHeight: "1",
		marginLeft: "0.5",
		marginRight: "0.5",
		fontWeight: "bold",
	});

	const taglineClasses = css({
		fontSize: "sm",
		// color: "white",
		opacity: "0.95",
		fontWeight: "light",
		textShadow: "0 1px 4px rgba(0, 0, 0, 0.15)",
	});

	return (
		<header className={`${headerContainerClasses} ${className || ""}`}>
			<h1 className={titleClasses}>
				RE<span className={superscriptClasses}>M2</span>.AI
				<p className={taglineClasses}>Track & Restore AI Impact</p>
			</h1>
		</header>
	);
};

export default Header;
