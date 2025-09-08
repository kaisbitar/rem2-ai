import type { PaymentSession } from "@/types/user";

const PAYMENT_SESSION_KEY = "payment_session";

export async function getPaymentSession(): Promise<PaymentSession | null> {
	if (!chrome?.storage?.local) return null;
	const res = await chrome.storage.local.get([PAYMENT_SESSION_KEY]);
	return (res?.[PAYMENT_SESSION_KEY] as PaymentSession) || null;
}

export async function savePaymentSession(session: PaymentSession) {
	if (!chrome?.storage?.local) return;
	await chrome.storage.local.set({ [PAYMENT_SESSION_KEY]: session });
}

export async function clearPaymentSession() {
	if (!chrome?.storage?.local) return;
	await chrome.storage.local.remove([PAYMENT_SESSION_KEY]);
}

export async function markPaymentSessionClaimed() {
	const session = await getPaymentSession();
	if (!session) return;
	if (session.claimed) return;
	await savePaymentSession({ ...session, claimed: true });
}
