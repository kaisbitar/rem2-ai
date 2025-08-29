import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase-client";
import type { User, Session } from "@supabase/supabase-js";

// User profile interface matching our database schema
interface UserProfile {
    id: string;
    email: string;
    opt_in_status: boolean;
    created_at: string;
    last_active: string;
}

// Usage data interface
interface UsageData {
    id: string;
    user_id: string;
    timestamp: string;
    energy_usage_wh: number;
    co2_emissions_g: number;
    token_count: number;
    conversation_id: string;
    model_used: string;
}

// Donation interface
interface Donation {
    id: string;
    user_id: string;
    amount: number;
    m2_restored: number;
    donation_date: string;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    userProfile: UserProfile | null;
    signOut: () => Promise<void>;

    // User data operations
    getUserProfile: () => Promise<UserProfile | null>;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;

    // Usage data operations
    addUsageData: (data: Omit<UsageData, 'id' | 'user_id'>) => Promise<void>;
    getUserUsageData: (limit?: number) => Promise<UsageData[]>;

    // Donation operations
    addDonation: (data: Omit<Donation, 'id' | 'user_id'>) => Promise<void>;
    getUserDonations: () => Promise<Donation[]>;

    // Synced data state
    syncedUsageData: UsageData[];
    syncedDonations: Donation[];
    isDataSynced: boolean;

    // Data sync operations
    syncUserData: () => Promise<void>;
    clearSyncedData: () => void;
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

    // Synced data state
    const [syncedUsageData, setSyncedUsageData] = useState<UsageData[]>([]);
    const [syncedDonations, setSyncedDonations] = useState<Donation[]>([]);
    const [isDataSynced, setIsDataSynced] = useState(false);

    useEffect(() => {
        const getInitialSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
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

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log("Auth state changed:", event, session?.user?.email);
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await loadUserProfile(session.user.id, session.user.email);
                } else {
                    setUserProfile(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Enhanced loadUserProfile to also sync data
    const loadUserProfile = async (userId: string, userEmail?: string) => {
        try {
            console.log("🔄 Loading user profile for:", userId, "with email:", userEmail);

            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error("❌ Error loading user profile:", error);
                return;
            }

            if (data) {
                console.log("✅ User profile found:", data);
                setUserProfile(data);
                // Auto-sync data when profile is loaded
                await syncUserData();
            } else {
                console.log("⚠️ No profile found, creating new one...");
                // Create profile if it doesn't exist
                await createUserProfile(userId, userEmail);
            }
        } catch (error) {
            console.error("❌ Error in loadUserProfile:", error);
        }
    };

    const createUserProfile = async (userId: string, userEmail?: string) => {
        try {
            console.log("🔄 Creating user profile for:", userId, "with email:", userEmail);

            const { data, error } = await supabase
                .from('user_profiles')
                .insert({
                    id: userId,
                    email: userEmail || 'unknown@example.com', // Use passed email or fallback
                    opt_in_status: true,
                    last_active: new Date().toISOString()
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

    // Enhanced signOut to clear synced data
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setSession(null);
            setUserProfile(null);
            clearSyncedData(); // Clear synced data on sign out
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // User profile operations
    const getUserProfile = async (): Promise<UserProfile | null> => {
        if (!user) return null;

        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
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
                .from('user_profiles')
                .update({
                    ...updates,
                    last_active: new Date().toISOString()
                })
                .eq('id', user.id);

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

    // Usage data operations
    const addUsageData = async (data: Omit<UsageData, 'id' | 'user_id'>) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('usage_data')
                .insert({
                    ...data,
                    user_id: user.id
                });

            if (error) {
                console.error("Error adding usage data:", error);
                return;
            }

            console.log("✅ Usage data added successfully");
        } catch (error) {
            console.error("Error in addUsageData:", error);
        }
    };

    const getUserUsageData = async (limit: number = 50): Promise<UsageData[]> => {
        if (!user) return [];

        try {
            const { data, error } = await supabase
                .from('usage_data')
                .select('*')
                .eq('user_id', user.id)
                .order('timestamp', { ascending: false })
                .limit(limit);

            if (error) {
                console.error("Error getting user usage data:", error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error("Error in getUserUsageData:", error);
            return [];
        }
    };

    // Donation operations
    const addDonation = async (data: Omit<Donation, 'id' | 'user_id'>) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('donations')
                .insert({
                    ...data,
                    user_id: user.id
                });

            if (error) {
                console.error("Error adding donation:", error);
                return;
            }

            console.log("✅ Donation added successfully");
        } catch (error) {
            console.error("Error in addDonation:", error);
        }
    };

    const getUserDonations = async (): Promise<Donation[]> => {
        if (!user) return [];

        try {
            const { data, error } = await supabase
                .from('donations')
                .select('*')
                .eq('user_id', user.id)
                .order('donation_date', { ascending: false });

            if (error) {
                console.error("Error getting user donations:", error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error("Error in getUserDonations:", error);
            return [];
        }
    };

    // Data sync operations
    const syncUserData = async () => {
        if (!user) return;

        try {
            console.log("🔄 Syncing user data for:", user.email);

            // Load user's historical data from database
            const [usageData, donations] = await Promise.all([
                getUserUsageData(100), // Get last 100 usage records
                getUserDonations()
            ]);

            // Update synced data state
            setSyncedUsageData(usageData);
            setSyncedDonations(donations);
            setIsDataSynced(true);

            console.log(`✅ Synced ${usageData.length} usage records and ${donations.length} donations`);

        } catch (error) {
            console.error("Error in syncUserData:", error);
            setIsDataSynced(false);
        }
    };

    const clearSyncedData = () => {
        setSyncedUsageData([]);
        setSyncedDonations([]);
        setIsDataSynced(false);
    };

    const value: AuthContextType = {
        user,
        session,
        loading,
        userProfile,
        signOut,
        getUserProfile,
        updateUserProfile,
        addUsageData,
        getUserUsageData,
        addDonation,
        getUserDonations,
        syncedUsageData,
        syncedDonations,
        isDataSynced,
        syncUserData,
        clearSyncedData,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
