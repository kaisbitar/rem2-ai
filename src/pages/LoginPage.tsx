import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { css } from "styled-system/css";
import { ArrowLeft } from "@phosphor-icons/react";
import AuthForm from "@/components/common/AuthForm";
import { supabase } from "../config/supabase-client";

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

	const handleSubmit = async (email: string, password: string) => {
		try {
			console.log(`${isLogin ? "Login" : "Register"} attempt:`, {
				email,
				password,
			});

			if (isLogin) {
				// Sign in with email/password
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});

				if (error) {
					console.error("❌ Login error:", error);
					alert(`Login failed: ${error.message}`);
					return;
				}

				console.log("✅ Login successful:", data.user?.email);

				// Navigate to home page
				navigate("/");
			} else {
				// Sign up with email/password
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
				});

				if (error) {
					console.error("❌ Registration error:", error);
					alert(`Registration failed: ${error.message}`);
					return;
				}

				console.log("✅ Registration successful:", data.user?.email);

				// Show success message and switch to login
				alert(
					"✅ Registration successful! Please check your email to verify your account.",
				);
				setIsLogin(true);
			}
		} catch (error) {
			console.error("❌ Authentication error:", error);
			alert("❌ An unexpected error occurred. Please try again.");
		}
	};

	const handleBackClick = () => {
		navigate("/");
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
				<h1 className={titleClasses}>
					{isLogin ? "Welcome Back" : "Create Account"}
				</h1>
				<p className={subtitleClasses}>
					{isLogin
						? "Sign in to track your AI impact"
						: "Join us to start tracking your AI impact"}
				</p>
			</div>

			<AuthForm
				isLogin={isLogin}
				onSubmit={handleSubmit}
				onToggleMode={() => setIsLogin(!isLogin)}
			/>
		</div>
	);
};

export default LoginPage;
