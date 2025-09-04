import { AppContextProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import HomePage from "@/pages/HomePage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import ProfilePage from "@/pages/ProfilePage";
import AuthCallback from "@/pages/AuthCallback";
import type React from "react";
// src/popup.tsx - Chrome extension popup interface with WXT
import { createRoot } from "react-dom/client";
import { Route, MemoryRouter as Router, Routes } from "react-router-dom";
import { css } from "styled-system/css";
import "@/styles/global.css";

const PopupRoot: React.FC = () => {
	return (
		<AuthProvider>
			<AppContextProvider viewMode="daily">
				<div className={css({ fontFamily: "body" })}>
					<Router>
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/settings" element={<SettingsPage />} />
							<Route path="/login" element={<LoginPage />} />
							<Route path="/signup" element={<SignUpPage />} />
							<Route path="/profile" element={<ProfilePage />} />
							<Route path="/auth/callback" element={<AuthCallback />} />
						</Routes>
					</Router>
				</div>
			</AppContextProvider>
		</AuthProvider>
	);
};

// Modern WXT: render directly into DOM
const container = document.getElementById("root");
if (container) {
	const root = createRoot(container);
	root.render(<PopupRoot />);
}
