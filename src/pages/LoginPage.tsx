import type React from "react";
import { useState } from "react";
import { css } from "styled-system/css";
import AuthForm from "@/components/common/AuthForm";

const LoginPage: React.FC = () => {
	const [isLogin, setIsLogin] = useState(true);

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

	const handleSubmit = (email: string, password: string) => {
		// TODO: Implement authentication logic
		console.log(`${isLogin ? "Login" : "Register"} attempt:`, {
			email,
			password,
		});
	};

	const toggleMode = () => {
		setIsLogin(!isLogin);
	};

	return (
		<div className={containerClasses}>
			<div className={headerClasses}>
				<h1 className={titleClasses}>
					{isLogin ? i18n.t("welcomeBack") : i18n.t("createAccount")}
				</h1>
				<p className={subtitleClasses}>
					{isLogin
						? i18n.t("signInToTrack")
						: i18n.t("joinToTrack")}
				</p>
			</div>

			<AuthForm
				isLogin={isLogin}
				onSubmit={handleSubmit}
				onToggleMode={toggleMode}
			/>
		</div>
	);
};

export default LoginPage;
