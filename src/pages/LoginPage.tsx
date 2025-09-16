import type React from "react";
import { useNavigate } from "react-router-dom";
import { css } from "styled-system/css";
import { ArrowLeft } from "@phosphor-icons/react";
import AuthForm from "@/components/common/AuthForm";
import { supabase } from "../config/supabase-client";

const LoginPage: React.FC = () => {
	const navigate = useNavigate();

	const containerClasses = css({
		background: "white",
		borderRadius: "8px",
		padding: "6",
		width: "100%",
		color: "gray.700",
		boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
	});

	const headerClasses = css({
		textAlign: "center",
		marginBottom: "6",
	});

	const titleClasses = css({
		fontSize: "xl",
		fontWeight: "bold",
		color: "gray.800",
		marginBottom: "2",
	});

	const subtitleClasses = css({
		color: "gray.600",
		fontSize: "sm",
	});

	const backButtonClasses = css({
		position: "absolute",
		top: "4",
		left: "4",
		background: "none",
		border: "none",
		cursor: "pointer",
		padding: "2",
		borderRadius: "4px",
		color: "gray.600",
		transition: "all 0.2s",
		"&:hover": {
			backgroundColor: "gray.100",
			color: "gray.800",
		},
	});

	const handleSubmit = async (email: string, password: string) => {
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				alert(`Login failed: ${error.message}`);
				return;
			}

			navigate("/profile");
		} catch (error) {
			console.error("Failed to sign in. Please try again.", error);
			alert("❌ An unexpected error occurred. Please try again.");
		}
	};

	const handleGoogleLogin = async () => {
		try {
			const clientId =
				"242222187660-mtoje8qj2gecq2jesrdmi4qoemsgah2f.apps.googleusercontent.com"; // replace if needed
			const redirectUri = chrome.identity.getRedirectURL();
			console.log("Redirect URI:", redirectUri);
			const nonce = crypto.randomUUID();

			const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
			authUrl.searchParams.set("client_id", clientId);
			authUrl.searchParams.set("redirect_uri", redirectUri);
			authUrl.searchParams.set("response_type", "id_token"); // id_token is enough for Supabase
			authUrl.searchParams.set("scope", "openid email profile");
			authUrl.searchParams.set("prompt", "consent");
			authUrl.searchParams.set("nonce", nonce);

			chrome.identity.launchWebAuthFlow(
				{ url: authUrl.toString(), interactive: true },
				async (redirectUrl) => {
					if (chrome.runtime.lastError) {
						console.error(chrome.runtime.lastError);
						return;
					}
					if (!redirectUrl) {
						console.error("Missing redirectUrl from Google OAuth");
						return;
					}

					const hash = new URL(redirectUrl).hash.replace(/^#/, "");
					if (!hash) {
						console.error("No URL fragment returned from Google");
						return;
					}

					const params = new URLSearchParams(hash);
					const error = params.get("error");
					if (error) {
						console.error("OAuth error:", error);
						return;
					}

					const idToken = params.get("id_token");
					if (!idToken) {
						console.error("No id_token received from Google");
						return;
					}

					const { error: supaError } = await supabase.auth.signInWithIdToken({
						provider: "google",
						token: idToken,
						nonce,
					});

					if (supaError) {
						console.error("Supabase sign-in failed:", supaError);
						return;
					}

					navigate("/profile");
				},
			);
		} catch (error) {
			console.error("Google login error:", error);
		}
	};

	const handleBackClick = () => {
		navigate("/");
	};

	const handleSignUpClick = () => {
		navigate("/signup");
	};

	return (
		<div className={containerClasses}>
			<button
				onClick={handleBackClick}
				className={backButtonClasses}
				type="button"
			>
				<ArrowLeft size={20} />
			</button>

			<div className={headerClasses}>
				<h1 className={titleClasses}>Welcome Back</h1>
				<p className={subtitleClasses}>Sign in to track your AI impact</p>
			</div>

			<AuthForm
				isLogin={true}
				onSubmit={handleSubmit}
				onToggleMode={handleSignUpClick}
				onGoogleLogin={handleGoogleLogin}
			/>
		</div>
	);
};

export default LoginPage;
