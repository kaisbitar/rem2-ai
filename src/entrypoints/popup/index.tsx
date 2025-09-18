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
import MainLayout from "@/layouts/MainLayout";
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
							width: "450px",
						})}
					>
						<Router>
							<Routes>
								<Route path="/" element={<Navigate to="/balance" replace />} />

								{/* Routes with main layout (header + bottom tabs) */}
								<Route element={<MainLayout />}>
									<Route path="/balance" element={<HomePage />} />
									<Route path="/insights" element={<InsightsPage />} />
									<Route path="/profile" element={<ProfilePage />} />
									<Route path="/account" element={<AccountPage />} />
								</Route>

								{/* Routes with header only */}
								<Route element={<MainLayout showBottomTabs={false} />}>
									<Route path="/settings" element={<SettingsPage />} />
								</Route>

								{/* Routes without header and bottom tabs */}
								<Route element={<MainLayout showHeader={false} showBottomTabs={false} />}>
									<Route path="/login" element={<LoginPage />} />
									<Route path="/signup" element={<SignUpPage />} />
									<Route path="/auth/callback" element={<AuthCallback />} />
									<Route path="/onboarding" element={<OnboardingPage />} />
								</Route>
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
