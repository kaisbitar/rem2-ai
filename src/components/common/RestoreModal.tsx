import type React from "react";
import Modal from "@/components/common/Modal";
import { css } from "styled-system/css";

interface RestoreModalProps {
	open: boolean;
	onClose: () => void;
}

const RestoreModal: React.FC<RestoreModalProps> = ({ open, onClose }) => {
	return (
		<Modal open={open} onClose={onClose}>
			<div
				className={css({ display: "flex", flexDirection: "column", gap: "3" })}
			>
				<h3 className={css({ fontWeight: 700 })}>Restore m²</h3>
				<p className={css({ fontSize: "sm", color: "gray.700" })}>
					This is a placeholder for the restore flow. One-off and plan options
					will be wired here.
				</p>
				<div
					className={css({
						display: "flex",
						gap: "2",
						justifyContent: "flex-end",
					})}
				>
					<button
						type="button"
						className={css({
							paddingX: "3",
							paddingY: "2",
							borderRadius: "sm",
							backgroundColor: "gray.100",
						})}
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default RestoreModal;
