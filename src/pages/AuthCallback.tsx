import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { css } from "styled-system/css";
import { supabase } from "../config/supabase-client";

const AuthCallback: React.FC = () => {
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading",
	);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const handleAuthCallback = async () => {
			try {
				console.log("🔄 Handling auth callback...");

				// Get the session from the URL hash/fragment
				const { data, error } = await supabase.auth.getSession();

				if (error) {
					console.error("❌ Auth callback error:", error);
					setStatus("error");
					setMessage("Authentication failed. Please try again.");
					return;
				}

				if (data.session) {
					console.log("✅ Authentication successful:", data.session.user.email);
					setStatus("success");
					setMessage("Authentication successful! Redirecting...");

					// Redirect to home page after successful auth
					setTimeout(() => {
						navigate("/");
					}, 1500);
				} else {
					console.log("⚠️ No session found in callback");
					setStatus("error");
					setMessage("Authentication incomplete. Please try again.");
				}
			} catch (error) {
				console.error("❌ Unexpected error in auth callback:", error);
				setStatus("error");
				setMessage("An unexpected error occurred. Please try again.");
			}
		};

		handleAuthCallback();
	}, [navigate]);

	const containerClasses = css({
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		minHeight: "300px",
		padding: "6",
		textAlign: "center",
	});

	const messageClasses = css({
		color: "gray.600",
		marginBottom: "4",
	});

	const buttonClasses = css({
		padding: "3",
		backgroundColor: "blue.600",
		color: "white",
		border: "none",
		borderRadius: "6px",
		cursor: "pointer",
		transition: "background-color 0.2s",
		"&:hover": {
			backgroundColor: "blue.700",
		},
	});

	const getStatusIcon = () => {
		switch (status) {
			case "loading":
				return "🔄";
			case "success":
				return "✅";
			case "error":
				return "❌";
			default:
				return "🔄";
		}
	};

	const getStatusColor = () => {
		switch (status) {
			case "loading":
				return "blue.600";
			case "success":
				return "green.600";
			case "error":
				return "red.600";
			default:
				return "blue.600";
		}
	};

	return (
		<div className={containerClasses}>
			<div className={css({ fontSize: "4xl", marginBottom: "4" })}>
				{getStatusIcon()}
			</div>

			<h1
				className={css({
					fontSize: "lg",
					fontWeight: "medium",
					marginBottom: "3",
					color: getStatusColor(),
				})}
			>
				{status === "loading" && "Authenticating..."}
				{status === "success" && "Success!"}
				{status === "error" && "Authentication Failed"}
			</h1>

			<p className={messageClasses}>{message}</p>

			{status === "error" && (
				<button
					type="button"
					onClick={() => navigate("/login")}
					className={buttonClasses}
				>
					Back to Login
				</button>
			)}
		</div>
	);
};

export default AuthCallback;
