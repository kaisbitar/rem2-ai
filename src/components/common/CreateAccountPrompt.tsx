import type React from "react";
import { useEffect, useState } from "react";
import { useUserState } from "@/context/UserStateContext";
import { css } from "styled-system/css";
import { X } from "@phosphor-icons/react";
import { getSiteUrl } from "@/utils/constants/env";

const CreateAccountPrompt: React.FC = () => {
	const { isGuest } = useUserState();
	const [shouldShow, setShouldShow] = useState(false);
	const [hasShownPrompt, setHasShownPrompt] = useState(false);

	useEffect(() => {
		// Only proceed if user is a guest
		if (!isGuest) {
			setShouldShow(false);
			return;
		}

		// Show the prompt if it hasn't been shown yet
		if (!hasShownPrompt) {
			console.log("Showing create account prompt for guest user");
			setShouldShow(true);
		}
	}, [isGuest, hasShownPrompt]);

	const handleDismiss = () => {
		setShouldShow(false);
		setHasShownPrompt(true);
	};

	const handleCreateAccount = () => {
		const siteUrl = getSiteUrl();
		window.open(`${siteUrl}/login`, "_blank");
	};
	console.log(
		"CreateAccountPrompt render - isGuest:",
		isGuest,
		"shouldShow:",
		shouldShow,
		"hasShownPrompt:",
		hasShownPrompt,
	);

	if (!shouldShow) {
		return null;
	}

	const containerClasses = css({
		position: "fixed",
		margin: "auto",
		bottom: " 90px",
		left: "0",
		right: "0",
		width: "411px",
		backgroundColor: "#e6f0ca",
		// border: "1px solid",
		borderColor: "#bed9a4",
		borderRadius: "lg",
		padding: "12px 16px",
		textAlign: "center",
		cursor: "pointer",
		zIndex: 1000,
	});

	const contentClasses = css({
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: "12px",
		maxWidth: "450px",
		margin: "0 auto",
		cursor: "pointer",
	});

	const textClasses = css({
		flex: "1",
		color: "#363636",
		lineHeight: "1.4",
		fontWeight: "700",
	});

	const dismissButtonClasses = css({
		position: "absolute",
		top: "8px",
		right: "8px",
		background: "none",
		border: "none",
		cursor: "pointer",
		padding: "4px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	});

	return (
		<div className={containerClasses}>
			<button
				className={contentClasses}
				onClick={handleCreateAccount}
				type="button"
			>
				<div className={textClasses}>
					<p className={css({ fontSize: "sm" })}>Tracking only today's usage</p>
					<p style={{ color: "gray" }}>
						Click here to create an account to save your progress
					</p>
				</div>
			</button>
			<button
				className={dismissButtonClasses}
				onClick={handleDismiss}
				type="button"
				aria-label="Dismiss message"
				style={{}}
			>
				<X size={16} />
			</button>
		</div>
	);
};

export default CreateAccountPrompt;
