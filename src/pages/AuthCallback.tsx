import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { css } from "styled-system/css";
import { supabase } from "../config/supabase-client";
import { savePaymentSession } from "@/utils/payment/paymentSession";

const AuthCallback: React.FC = () => {
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading",
	);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const handleCallback = async () => {
			try {
				const params = new URLSearchParams(location.search);
				const type = params.get("type");

				// Donation callback flow (guest)
				if (type === "donation") {
					const sessionId = params.get("session_id") || params.get("sessionId");
					if (!sessionId) {
						setStatus("error");
						setMessage("Missing donation session. Please try again.");
						return;
					}

					const amount = Number(params.get("amount") || 0);
					const m2 = Number(params.get("m2") || params.get("m2_restored") || 0);

					await savePaymentSession({
						sessionId,
						amount,
						m2Restored: m2,
						timestamp: new Date().toISOString(),
						claimed: false,
					});

					setStatus("success");
					setMessage(
						"Thank you! Your donation has been recorded on this device.",
					);
					setTimeout(() => navigate("/"), 1200);
					return;
				}

				// Auth callback flow (existing)
				const { data, error } = await supabase.auth.getSession();
				if (error) {
					setStatus("error");
					setMessage("Authentication failed. Please try again.");
					return;
				}

				if (!data.session) {
					setStatus("error");
					setMessage("Authentication incomplete. Please try again.");
					return;
				}

				setStatus("success");
				setMessage("Authentication successful! Redirecting...");
				setTimeout(() => navigate("/"), 1500);
			} catch (error) {
				setStatus("error");
				setMessage("An unexpected error occurred. Please try again.");
				console.error(error);
			}
		};

		handleCallback();
	}, [navigate, location.search]);

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
				{status === "loading" && "Processing..."}
				{status === "success" && "Success!"}
				{status === "error" && "Something went wrong"}
			</h1>

			<p className={messageClasses}>{message}</p>

			{status === "error" && (
				<button
					type="button"
					onClick={() => navigate("/")}
					className={buttonClasses}
				>
					Back to Home
				</button>
			)}
		</div>
	);
};

export default AuthCallback;
