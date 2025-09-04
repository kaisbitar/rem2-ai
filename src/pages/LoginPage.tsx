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
		minWidth: "400px",
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

	const handleGoogleLogin = () => {
		chrome.identity.getAuthToken({ interactive: true }, (token) => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
				return;
			}
			if (token) {
				console.log("Access token received:", token);
				fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token)
					.then(response => response.json())
					.then(userinfo => {
						console.log('User info:', userinfo);
						chrome.storage.local.set({ userinfo, token });
						navigate('/profile');
					});
			}
		});
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
