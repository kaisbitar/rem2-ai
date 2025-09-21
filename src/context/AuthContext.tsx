import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase, SUPABASE_STORAGE_KEY } from "../config/supabase-client";
import type { User, Session } from "@supabase/supabase-js";
import { browser } from "wxt/browser";

interface UserProfile {
	id: string;
	email: string;
	opt_in_status: boolean;

	// Balance tracking
	total_m2_consumed: number;
	total_m2_restored: number;

	// Restoration totals
	total_trees_planted: number;
	total_peatland_rewetted: number;
	total_habitat_restored: number;

	// Payment history
	last_donation_date?: string;
	last_donation_amount?: number;

	// Gamification
	streak_days?: number;
	badges?: string[];
	weekly_goal?: number;
	monthly_goal?: number;

	// Timestamps
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

	const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000;

	const getCachedProfile = async (uid: string) => {
		try {
			const { [`userProfile:${uid}`]: entry } = await browser.storage.local.get(
				[`userProfile:${uid}`],
			);
			if (!entry) return null;
			if (Date.now() - entry.cachedAt > PROFILE_CACHE_TTL_MS) return null;
			return entry.data as UserProfile;
		} catch {
			return null;
		}
	};

	const setCachedProfile = async (uid: string, data: UserProfile) => {
		try {
			await browser.storage.local.set({
				[`userProfile:${uid}`]: { data, cachedAt: Date.now() },
			});
		} catch { }
	};

	useEffect(() => {
		const initSupabaseFromStorage = async () => {
			try {
				const { supabaseSession } = await browser.storage.local.get([
					"supabaseSession",
				]);
				if (
					supabaseSession?.access_token &&
					supabaseSession?.refresh_token
				) {
					await supabase.auth.setSession({
						access_token: supabaseSession.access_token,
						refresh_token: supabaseSession.refresh_token,
					});
				}
			} catch (e) {
				console.error("❌ Failed to init Supabase session in popup:", e);
			}
		};

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
				console.log("🔄 Getting initial session");
			} catch (error) {
				console.error("Error getting initial session:", error);
			} finally {
				setLoading(false);
			}
		};

		(async () => {
			await initSupabaseFromStorage();
			await getInitialSession();
		})();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			console.log("Auth state changed:", event, session?.user?.email);
			setSession(session);
			setUser(session?.user ?? null);

			if (session?.user) {
				try {
					await browser.storage.local.set({
						authUser: { id: session.user.id, email: session.user.email },
						supabaseSession: {
							access_token: session.access_token,
							refresh_token: session.refresh_token,
							expires_at: session.expires_at,
						},
					});
				} catch (error) {
					console.error("❌ Error storing auth info:", error);
				}
				await loadUserProfile(session.user.id, session.user.email);
			} else {
				try {
					await browser.storage.local.remove(["authUser", "supabaseSession"]);
					try {
						await browser.storage.local.remove([
							`userProfile:${user?.id}`,
							"authUser",
							"supabaseSession",
						]);
					} catch { }
				} catch (error) {
					console.error("❌ Error clearing auth info:", error);
				}
				setUserProfile(null);
			}
		});

		const handleStorageChange = async (changes: any) => {
			try {
				const s = changes.supabaseSession?.newValue;
				if (s?.access_token && s?.refresh_token) {
					await supabase.auth.setSession({
						access_token: s.access_token,
						refresh_token: s.refresh_token,
					});
				}
			} catch (e) {
				console.error("❌ Failed to apply session from storage change:", e);
			}
		};

		browser.storage.local.onChanged.addListener(handleStorageChange);

		return () => {
			subscription.unsubscribe();
			browser.storage.local.onChanged.removeListener(handleStorageChange);
		};
	}, []);

	const loadUserProfile = async (userId: string, userEmail?: string) => {
		try {
			// fast path: cache
			const cached = await getCachedProfile(userId);
			if (cached) {
				setUserProfile(cached);
				// soft-refresh in background
				void refreshUserProfile(userId, userEmail);
				return; // early return
			}
			// no cache → fetch
			await refreshUserProfile(userId, userEmail);
		} catch (error) {
			console.error("❌ Error in loadUserProfile:", error);
		}
	};

	const refreshUserProfile = async (userId: string, userEmail?: string) => {
		const { data, error } = await supabase
			.from("user_profiles")
			.select("*")
			.eq("id", userId)
			.single();

		if (error && error.code !== "PGRST116") {
			console.error("❌ Error loading user profile:", error);
			return; // early return
		}

		if (data) {
			setUserProfile(data);
			void setCachedProfile(userId, data);
			return; // early return
		}
		await createUserProfile(userId, userEmail);
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
		if (!session && !user) return;

		setLoading(true);
		try {
			// Fire-and-forget local sign-out (avoid hangs in MV3)
			void supabase.auth.signOut({ scope: "local" }).catch((err) => {
				console.warn("signOut local failed:", err);
			});

			// Clear extension-shared storage
			try {
				await browser.storage.local.remove(["authUser", "supabaseSession"]);
				try {
					await browser.storage.local.remove([
						`userProfile:${user?.id}`,
						"authUser",
						"supabaseSession",
					]);
				} catch { }
			} catch (err) {
				console.error("Error clearing extension storage during signout:", err);
			}

			// Ensure Supabase's own localStorage session is cleared
			try {
				localStorage.removeItem(SUPABASE_STORAGE_KEY);
			} catch (err) {
				console.error("Error clearing Supabase localStorage key:", err);
			}

			// Clear local state
			setUser(null);
			setSession(null);
			setUserProfile(null);
		} catch (error) {
			console.error("Error during sign out:", error);
		} finally {
			setLoading(false);
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
