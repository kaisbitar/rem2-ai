import type React from "react";
import { css, cx } from "styled-system/css";
import Tooltip from "./Tooltip";

export interface CallToActionButtonProps {
	text: string;
	icon?: React.ReactNode;
	className?: string;
	tooltip?: string;
	onClick?: () => void;
	disabled?: boolean;
}

const CallToActionButton: React.FC<CallToActionButtonProps> = ({
	text,
	icon,
	tooltip,
	className = "",
	onClick,
	disabled = false,
}) => {
	const buttonClasses = css({
		display: "flex",
		width: "120px",
		alignItems: "center",
		justifyContent: "center",
		gap: "1",
		padding: "2",
		borderRadius: "lg",
		border: "1px solid",
		transition: "all 0.3s ease",
		cursor: "pointer",
		_hover: disabled
			? {}
			: {
					transform: "translateY(-1px)",
					boxShadow: "0 5px 5px rgba(0, 0, 0, 0.15)",
				},
	});

	const iconClasses = css({
		fontSize: "16px",
	});

	const textClasses = css({
		fontSize: "12px",
		fontWeight: "semibold",
	});

	return (
		<Tooltip content={tooltip || "No tooltip"}>
			<button
				className={cx(buttonClasses, className)}
				onClick={onClick}
				disabled={disabled}
				type="button"
			>
				<span className={iconClasses}>{icon}</span>
				<span className={textClasses}>{text}</span>
			</button>
		</Tooltip>
	);
};

export default CallToActionButton;
