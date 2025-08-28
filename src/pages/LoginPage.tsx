import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { css } from "styled-system/css";
import { ArrowLeft } from "@phosphor-icons/react";
import AuthForm from "@/components/common/AuthForm";
import { supabase } from "../config/supabase-client";
// import Header from "@/components/popup/window/Header";

const LoginPage: React.FC = () => {
	const [isLogin, setIsLogin] = useState(true);
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

	const handleSubmit = (email: string, password: string) => {
		// TODO: Implement authentication logic
		console.log(`${isLogin ? "Login" : "Register"} attempt:`, {
			email,
			password,
		});
	};

	const handleGoogleLogin = async () => {
		try {
			console.log("🔄 Starting Google OAuth...");

			// Use Supabase's hosted auth page - simpler and avoids COOP issues
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					// Use Supabase's hosted auth page
					redirectTo: `${window.location.origin}/auth/callback`,
					// Let Supabase handle the OAuth flow
				},
			});
			console.log("🔄 Google OAuth data:", data);

			if (error) {
				console.error("❌ Google OAuth error:", error);
				return;
			}

			console.log("✅ Google OAuth initiated successfully:", data);

			// For Chrome extensions, we need to handle the redirect differently
			if (data.url) {
				// Open the OAuth URL in the same window (not popup)
				// This avoids COOP issues and works better with extensions
				window.location.href = data.url;
			}
		} catch (error) {
			console.error("❌ Unexpected error during Google login:", error);
		}
	};

	const toggleMode = () => {
		setIsLogin(!isLogin);
	};

	return (
		<div className={containerClasses}>
			{/* <Header /> */}

			<div className={headerClasses}>
				<button
					onClick={() => navigate("/")}
					className={backButtonClasses}
					title={i18n.t("back")}
					type="button"
				>
					<ArrowLeft size={20} />
				</button>
				<h1 className={titleClasses}>
					{isLogin ? i18n.t("welcomeBack") : i18n.t("createAccount")}
				</h1>
				<p className={subtitleClasses}>
					{isLogin ? i18n.t("signInToTrack") : i18n.t("joinToTrack")}
				</p>
			</div>

			<AuthForm
				isLogin={isLogin}
				onSubmit={handleSubmit}
				onToggleMode={toggleMode}
				onGoogleLogin={handleGoogleLogin}
			/>
		</div>
	);
};

export default LoginPage;
