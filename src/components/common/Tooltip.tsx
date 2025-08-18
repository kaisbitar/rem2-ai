import type React from "react";
import { useState } from "react";
import { css } from "styled-system/css";

interface TooltipProps {
	content: string;
	children?: React.ReactNode;
	className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
	content,
	children,
	className = "",
}) => {
	const [isVisible, setIsVisible] = useState(false);

	const tooltipContainerClasses = css({
		position: "relative",
		display: "inline-block",
	});

	const tooltipClasses = css({
		position: "absolute",
		top: "-40px",
		left: "50%",
		transform: "translateX(-50%)",
		backgroundColor: "gray.800",
		color: "white",
		padding: "2",
		borderRadius: "md",
		fontSize: "xs",
		whiteSpace: "nowrap",
		zIndex: "50",
		opacity: isVisible ? "1" : "0",
		visibility: isVisible ? "visible" : "hidden",
		transition: "opacity 0.2s ease, visibility 0.2s ease",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
		border: "1px solid",
		borderColor: "gray.700",
		// maxWidth: "200px",
		wordWrap: "break-word",
		textAlign: "center",
	});

	return (
		<div
			className={`${tooltipContainerClasses} ${className}`}
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
			role="tooltip"
			aria-describedby="tooltip-content"
		>
			{children}
			<div className={tooltipClasses} id="tooltip-content" role="tooltip">
				{content}
			</div>
		</div>
	);
};

export default Tooltip;
