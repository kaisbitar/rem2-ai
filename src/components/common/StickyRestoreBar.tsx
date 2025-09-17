import type React from "react";
import { css } from "styled-system/css";

interface StickyRestoreBarProps {
	onClick: () => void;
}

const StickyRestoreBar: React.FC<StickyRestoreBarProps> = ({ onClick }) => {
	const bar = css({
		position: "sticky",
		bottom: "56px", // sit above the bottom tabs
		width: "100%",
		backgroundColor: "green.600",
		color: "white",
		textAlign: "center",
		paddingY: "2",
		cursor: "pointer",
		zIndex: 9,
	});
	return (
		<button type="button" className={bar} onClick={onClick}>
			Restore m²
		</button>
	);
};

export default StickyRestoreBar;
