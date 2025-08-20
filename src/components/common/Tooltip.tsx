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
		width: "auto",
		height: "auto",
	});

	const tooltipClasses = css({
		position: "absolute",
		bottom: "100%",
		left: "50%",
		transform: "translateX(-50%)",
		marginBottom: "8px",
		backgroundColor: "gray.800",
		color: "white",
		padding: "8px 12px",
		borderRadius: "6px",
		fontSize: "12px",
		whiteSpace: "nowrap",
		zIndex: "1000",
		overflow: "visible",
		opacity: isVisible ? "1" : "0",
		visibility: isVisible ? "visible" : "hidden",
		pointerEvents: "none",
		transition: "opacity 0.2s ease, visibility 0.2s ease",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
		border: "1px solid",
		borderColor: "gray.700",
		"&::after": {
			content: '""',
			position: "absolute",
			top: "100%",
			left: "50%",
			transform: "translateX(-50%)",
			border: "4px solid transparent",
			borderTopColor: "gray.800",
		},
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
