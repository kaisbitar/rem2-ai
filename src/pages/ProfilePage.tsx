import type React from "react";
import { useNavigate } from "react-router-dom";
import { css } from "styled-system/css";
import { ArrowLeft, User, Envelope, Calendar, Gear } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { useDatabase } from "@/hooks/useDatabase";

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, userProfile, signOut } = useAuth();
    const { getUserProfile, updateUserProfile } = useDatabase();

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

    const backButtonClasses = css({
        position: "absolute",
        top: "4",
        left: "4",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2",
        borderRadius: "4px",
        color: "gray.600",
        transition: "all 0.2s",
        "&:hover": {
            backgroundColor: "gray.100",
            color: "gray.800",
        },
    });

    const profileSectionClasses = css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        marginBottom: "6",
    });

    const profileItemClasses = css({
        display: "flex",
        alignItems: "center",
        gap: "3",
        padding: "3",
        backgroundColor: "gray.50",
        borderRadius: "6px",
    });

    const iconClasses = css({
        color: "gray.500",
    });

    const labelClasses = css({
        fontWeight: "medium",
        color: "gray.700",
    });

    const valueClasses = css({
        color: "gray.600",
        fontSize: "sm",
    });

    const buttonClasses = css({
        width: "100%",
        padding: "3",
        backgroundColor: "red.600",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "sm",
        fontWeight: "medium",
        cursor: "pointer",
        transition: "background-color 0.2s",
        "&:hover": {
            backgroundColor: "red.700",
        },
    });

    const settingsButtonClasses = css({
        width: "100%",
        padding: "3",
        backgroundColor: "blue.600",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "sm",
        fontWeight: "medium",
        cursor: "pointer",
        transition: "background-color 0.2s",
        "&:hover": {
            backgroundColor: "blue.700",
        },
        marginBottom: "3",
    });

    const handleBackClick = () => {
        navigate("/");
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            console.log("Signing out");
            navigate("/");
        } catch (error) {
            alert("Failed to sign out. Please try again.");
        }
    };

    const handleSettingsClick = () => {
        navigate("/settings");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className={containerClasses}>
            <button
                onClick={handleBackClick}
                className={backButtonClasses}
                type="button"
            >
                <ArrowLeft size={20} />
            </button>

            <div className={headerClasses}>
                <h1 className={titleClasses}>Profile</h1>
                <p className={subtitleClasses}>Manage your account and preferences</p>
            </div>

            <div className={profileSectionClasses}>

                <div className={profileItemClasses}>
                    <Envelope className={iconClasses} size={20} />
                    <div>
                        <div className={labelClasses}>Email</div>
                        <div className={valueClasses}>{user?.email || "N/A"}</div>
                    </div>
                </div>

                <div className={profileItemClasses}>
                    <Calendar className={iconClasses} size={20} />
                    <div>
                        <div className={labelClasses}>Member Since</div>
                        <div className={valueClasses}>
                            {user?.created_at ? formatDate(user.created_at) : "N/A"}
                        </div>
                    </div>
                </div>

                {userProfile && (
                    <div className={profileItemClasses}>
                        <Gear className={iconClasses} size={20} />
                        <div>
                            <div className={labelClasses}>Data Collection</div>
                            <div className={valueClasses}>
                                {userProfile.opt_in_status ? "Enabled" : "Disabled"}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handleSettingsClick}
                className={settingsButtonClasses}
                type="button"
            >
                <Gear size={16} style={{ marginRight: "8px" }} />
                Settings
            </button>

            <button
                onClick={handleSignOut}
                className={buttonClasses}
                type="button"
            >
                Sign Out
            </button>
        </div>
    );
};

export default ProfilePage; 