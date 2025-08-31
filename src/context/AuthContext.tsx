import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase-client";
import type { User, Session } from "@supabase/supabase-js";
import { browser } from "wxt/browser";

// Clean, simple interfaces matching our database schema
interface UserProfile {
	id: string;
	email: string;
	opt_in_status: boolean;
	created_at: string;
	last_active: string;
}

interface AuthContextType {
	user: User | null;
	session: Session | null;
	loading: boolean;
	userProfile: UserProfile | null;
	signOut: () => Promise<void>;

	// User profile operations ONLY
	getUserProfile: () => Promise<UserProfile | null>;
	updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	useEffect(() => {
		const getInitialSession = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				setSession(session);
				setUser(session?.user ?? null);

				if (session?.user) {
					await loadUserProfile(session.user.id, session.user.email);
				}
			} catch (error) {
				console.error("Error getting initial session:", error);
			} finally {
				setLoading(false);
			}
		};

		getInitialSession();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			console.log("Auth state changed:", event, session?.user?.email);
			setSession(session);
			setUser(session?.user ?? null);

			if (session?.user) {
				// Store user info in Chrome storage for background script access
				try {
					await browser.storage.local.set({
						authUser: {
							id: session.user.id,
							email: session.user.email,
						},
					});
					console.log("✅ User auth info stored in Chrome storage");
				} catch (error) {
					console.error("❌ Error storing auth info:", error);
				}

				await loadUserProfile(session.user.id, session.user.email);
			} else {
				// Clear auth info from storage when user signs out
				try {
					await browser.storage.local.remove(["authUser"]);
					console.log("✅ User auth info cleared from Chrome storage");
				} catch (error) {
					console.error("❌ Error clearing auth info:", error);
				}

				setUserProfile(null);
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	const loadUserProfile = async (userId: string, userEmail?: string) => {
		try {
			console.log("🔄 Loading user profile for:", userId);

			const { data, error } = await supabase
				.from("user_profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error && error.code !== "PGRST116") {
				console.error("❌ Error loading user profile:", error);
				return;
			}

			if (data) {
				console.log("✅ User profile found:", data);
				setUserProfile(data);
			} else {
				console.log("⚠️ No profile found, creating new one...");
				await createUserProfile(userId, userEmail);
			}
		} catch (error) {
			console.error("❌ Error in loadUserProfile:", error);
		}
	};

	const createUserProfile = async (userId: string, userEmail?: string) => {
		try {
			console.log("🔄 Creating user profile for:", userId);

			const { data, error } = await supabase
				.from("user_profiles")
				.insert({
					id: userId,
					email: userEmail,
					opt_in_status: true, // Default to opt-in
					last_active: new Date().toISOString(),
				})
				.select()
				.single();

			if (error) {
				console.error("❌ Error creating user profile:", error);
				return;
			}

			console.log("✅ User profile created successfully:", data);
			setUserProfile(data);
		} catch (error) {
			console.error("❌ Error in createUserProfile:", error);
		}
	};

	const signOut = async () => {
		try {
			await supabase.auth.signOut();
			setUser(null);
			setSession(null);
			setUserProfile(null);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	const getUserProfile = async (): Promise<UserProfile | null> => {
		if (!user) return null;

		try {
			const { data, error } = await supabase
				.from("user_profiles")
				.select("*")
				.eq("id", user.id)
				.single();

			if (error) {
				console.error("Error getting user profile:", error);
				return null;
			}

			return data;
		} catch (error) {
			console.error("Error in getUserProfile:", error);
			return null;
		}
	};

	const updateUserProfile = async (updates: Partial<UserProfile>) => {
		if (!user) return;

		try {
			const { error } = await supabase
				.from("user_profiles")
				.update({
					...updates,
					last_active: new Date().toISOString(),
				})
				.eq("id", user.id);

			if (error) {
				console.error("Error updating user profile:", error);
				return;
			}

			// Reload profile to get updated data
			await loadUserProfile(user.id);
		} catch (error) {
			console.error("Error in updateUserProfile:", error);
		}
	};

	const value: AuthContextType = {
		user,
		session,
		loading,
		userProfile,
		signOut,
		getUserProfile,
		updateUserProfile,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
