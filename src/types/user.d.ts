// src/types/user.d.ts - User state management types for 4 distinct user experiences

// Core user state types representing the 4 different user experiences
export type UserState =
  | "guest-non-payer" // No signup, local storage only
  | "registered-non-payer" // Signed in, no payments
  | "guest-payer" // Paid but no account (payment session)
  | "registered-payer"; // Signed in & paid

// Payment session data for guest payers (stored in Chrome storage)
export interface PaymentSession {
  sessionId: string;
  amount: number;
  m2Restored: number;
  timestamp: string;
  claimed: boolean; // Whether the guest has created an account to claim this
  receiptUrl?: string;
  paymentProvider?: string;
}

// Enhanced user profile with balance, gamification, and payment history
export interface UserProfile {
  id: string;
  email: string;
  opt_in_status: boolean;

  // Carbon balance tracking
  total_m2_consumed: number;
  total_m2_restored: number;

  // Payment history
  last_donation_date?: string;
  last_donation_amount?: number;

  // Gamification system
  streak_days?: number;
  badges?: string[];
  weekly_goal?: number;
  monthly_goal?: number;

  // Timestamps
  created_at: string;
  last_active: string;
}

// Badge definitions for gamification
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: "streak" | "balance" | "donation" | "achievement";
}

// User state context for managing the 4 user experiences
export interface UserStateContextType {
  // Current state
  userState: UserState;
  userProfile: UserProfile | null;
  paymentSession: PaymentSession | null;

  // State detection helpers
  isGuest: boolean;
  isRegistered: boolean;
  isPayer: boolean;

  // Balance data moved to useBalance hook for centralization

  // Gamification data
  currentStreak: number;
  badges: Badge[];

  // Actions
  updateUserState: () => void;
  claimPaymentSession: () => Promise<void>;
  updateBalance: (consumed: number, restored: number) => Promise<void>;
  updateGamification: (streak: number, badges: Badge[]) => Promise<void>;
}

// Donation tracking interface
export interface Donation {
  id: string;
  user_id?: string; // Optional for guest donations
  payment_session_id?: string;
  amount: number;
  m2_restored: number;
  donation_date: string;
  receipt_url?: string;
}

// User goals for gamification
export interface UserGoals {
  weekly_m2_goal?: number;
  monthly_m2_goal?: number;
  weekly_carbon_goal?: number;
  monthly_carbon_goal?: number;
}

// Achievement progress tracking
export interface AchievementProgress {
  current: number;
  target: number;
  percentage: number;
  completed: boolean;
}

// Streak information
export interface StreakInfo {
  current: number;
  longest: number;
  lastActivity: string;
  isActive: boolean;
}

// User preferences for customization
export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  notifications: boolean;
  weeklyReports: boolean;
  gamification: boolean;
  publicProfile: boolean;
}
