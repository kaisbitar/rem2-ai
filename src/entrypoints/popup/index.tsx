import { AppContextProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import HomePage from "@/pages/HomePage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import ProfilePage from "@/pages/ProfilePage";
import AuthCallback from "@/pages/AuthCallback";
import OnboardingPage from "@/pages/OnboardingPage";
import InsightsPage from "@/pages/InsightsPage";
import AccountPage from "@/pages/AccountPage";
import type React from "react";
// src/popup.tsx - Chrome extension popup interface with WXT
import { createRoot } from "react-dom/client";
import {
	Route,
	MemoryRouter as Router,
	Routes,
	Navigate,
} from "react-router-dom";
import { css } from "styled-system/css";
import "@/styles/global.css";
import { UserStateProvider } from "@/context/UserStateContext";

const PopupRoot: React.FC = () => {
	return (
		<AuthProvider>
			<UserStateProvider>
				<AppContextProvider viewMode="daily">
					<div
						className={css({
							fontFamily: "body",
							width: "350px",
						})}
					>
						<Router>
							<Routes>
								<Route path="/" element={<Navigate to="/balance" replace />} />
								<Route path="/balance" element={<HomePage />} />
								<Route path="/insights" element={<InsightsPage />} />
								<Route path="/settings" element={<SettingsPage />} />
								<Route path="/login" element={<LoginPage />} />
								<Route path="/signup" element={<SignUpPage />} />
								<Route path="/profile" element={<ProfilePage />} />
								<Route path="/account" element={<AccountPage />} />
								<Route path="/auth/callback" element={<AuthCallback />} />
								<Route path="/onboarding" element={<OnboardingPage />} />
							</Routes>
						</Router>
					</div>
				</AppContextProvider>
			</UserStateProvider>
		</AuthProvider>
	);
};

// Modern WXT: render directly into DOM
const container = document.getElementById("root");
if (container) {
	const root = createRoot(container);
	root.render(<PopupRoot />);
}
