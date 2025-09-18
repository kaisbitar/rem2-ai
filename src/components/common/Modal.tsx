import type React from "react";
import { useEffect } from "react";
import { css, cx } from "styled-system/css";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
}

const Modal: React.FC<ModalProps> = ({
	open,
	onClose,
	children,
	className,
}) => {
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	const overlay = css({
		position: "fixed",
		inset: 0,
		backgroundColor: "rgba(0,0,0,0.3)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 50,
	});

	const panel = css({
		backgroundColor: "white",
		borderRadius: "md",
		border: "1px solid",
		borderColor: "gray.200",
		width: "360px",
		maxWidth: "90vw",
		padding: "4",
		boxShadow: "sm",
	});

	return (
		<div className={overlay} >
			<div
				className={cx(panel, className)}
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default Modal;
