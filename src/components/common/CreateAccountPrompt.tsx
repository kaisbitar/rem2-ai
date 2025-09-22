import type React from "react";
import { useEffect, useState } from "react";
import { useUserState } from "@/context/UserStateContext";
import { css } from "styled-system/css";
import { UserPlus, X } from "@phosphor-icons/react";

const CreateAccountPrompt: React.FC = () => {
    const { isGuest } = useUserState();
    const [shouldShow, setShouldShow] = useState(false);
    const [hasShownPrompt, setHasShownPrompt] = useState(false);

    useEffect(() => {
        // Only proceed if user is a guest
        if (!isGuest) {
            setShouldShow(false);
            return;
        }

        // Show the prompt if it hasn't been shown yet
        if (!hasShownPrompt) {
            console.log("Showing create account prompt for guest user");
            setShouldShow(true);
        }
    }, [isGuest, hasShownPrompt]);

    const handleDismiss = () => {
        setShouldShow(false);
        setHasShownPrompt(true);
    };

    const handleCreateAccount = () => {
        const loginUrl = process.env.NODE_ENV === "production"
            ? "https://aim2balance.ai/login"
            : "http://localhost:8080/login";

        window.open(loginUrl, "_blank");
    };
    console.log("CreateAccountPrompt render - isGuest:", isGuest, "shouldShow:", shouldShow, "hasShownPrompt:", hasShownPrompt);

    if (!shouldShow) {
        return null;
    }

    const containerClasses = css({
        position: "fixed",
        margin: "auto",
        bottom: " 101px",
        left: "0",
        right: "0",
        width: "411px",
        backgroundColor: "#f8f8f8",
        border: "1px solid",
        borderColor: "#cbcbcb",
        borderRadius: "lg",
        padding: "12px 16px",
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
    });

    const contentClasses = css({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        maxWidth: "450px",
        margin: "0 auto",
    });

    const textClasses = css({
        flex: "1",
        // fontSize: "sm",
        color: "#363636",
        lineHeight: "1.4",
        fontWeight: "500",
    });

    const buttonClasses = css({
        display: "flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: "blue.600",
        color: "white",
        padding: "8px 12px",
        borderRadius: "sm",
        // fontSize: "sm",
        fontWeight: "medium",
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
        _hover: {
            backgroundColor: "blue.700",
        },
        _focus: {
            outline: "2px solid",
            outlineColor: "blue.300",
            outlineOffset: "2px",
        },
    });

    const dismissButtonClasses = css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "24px",
        height: "24px",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        borderRadius: "sm",
        color: "blue.600",
        transition: "all 0.2s ease",
        _hover: {
            backgroundColor: "blue.100",
            color: "blue.800",
        },
        _focus: {
            outline: "2px solid",
            outlineColor: "blue.300",
            outlineOffset: "2px",
        },
    });

    return (
        <div className={containerClasses}>
            <div className={contentClasses}>
                <div className={textClasses}>
                    Create an account to save your progress and unlock premium features
                </div>
                <button
                    className={buttonClasses}
                    onClick={handleCreateAccount}
                    type="button"
                >
                    <UserPlus size={16} />
                    Create Account
                </button>
                <button
                    className={dismissButtonClasses}
                    onClick={handleDismiss}
                    type="button"
                    aria-label="Dismiss message"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default CreateAccountPrompt;
