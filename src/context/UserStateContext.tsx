// src/context/UserStateContext.tsx
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type {
	UserState,
	UserStateContextType,
	UserProfile,
} from "@/types/user";
import {
	getPaymentSession,
	clearPaymentSession,
} from "@/utils/payment/paymentSession";
import { supabase } from "@/config/supabase-client";

const UserStateContext = createContext<UserStateContextType | null>(null);

export const useUserState = () => {
	const ctx = useContext(UserStateContext);
	if (!ctx)
		throw new Error("useUserState must be used within a UserStateProvider");
	return ctx;
};

export const UserStateProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { user, userProfile, getUserProfile } = useAuth();
	const [paymentSession, setPaymentSession] = useState(null as any);

	useEffect(() => {
		const load = async () => {
			const session = await getPaymentSession();
			setPaymentSession(session);
		};
		load();
	}, []);

	useEffect(() => {
		if (!user?.id) return;
		void getUserProfile?.();
	}, [user?.id, getUserProfile]);

	useEffect(() => {
		if (!user) return;
		const restored =
			(userProfile as UserProfile | null)?.total_m2_restored ?? 0;
		if (restored <= 0) return;
		if (!paymentSession) return;

		// Server state confirms donation is linked → clear local stub
		void (async () => {
			await clearPaymentSession();
			setPaymentSession(null);
		})();
	}, [user, userProfile, paymentSession]);

	const userState: UserState = useMemo(() => {
		if (!user) {
			return paymentSession && !paymentSession.claimed
				? "guest-payer"
				: "guest-non-payer";
		}
		const restored =
			(userProfile as UserProfile | null)?.total_m2_restored ?? 0;
		if (restored > 0) return "registered-payer";
		return "registered-non-payer";
	}, [user, userProfile, paymentSession]);

	const isGuest = !user;
	const isRegistered = !!user;
	const isPayer =
		userState === "guest-payer" || userState === "registered-payer";

	// Balance calculation moved to useBalance hook for centralization

	const claimPaymentSession = async () => {
		const session = await getPaymentSession();
		if (!session) return;

		try {
			if (user?.id && session.sessionId) {
				await supabase.rpc("claim_donation_session", {
					p_session_id: session.sessionId,
				});
				await getUserProfile?.(); // refresh to pick up server totals
			}
		} finally {
			await clearPaymentSession(); // remove local stub regardless
			setPaymentSession(null);
		}
	};

	const value: UserStateContextType = {
		userState,
		userProfile: (userProfile as any) ?? null,
		paymentSession,

		isGuest,
		isRegistered,
		isPayer,

		// Balance values moved to useBalance hook

		currentStreak: (userProfile as any)?.streak_days ?? 0,
		badges: (userProfile as any)?.badges ?? [],

		updateUserState: () => {}, // derived; no-op
		claimPaymentSession,
		updateBalance: async () => {}, // server-owned; no-op
		updateGamification: async () => {}, // server-owned; no-op
	};

	return (
		<UserStateContext.Provider value={value}>
			{children}
		</UserStateContext.Provider>
	);
};
