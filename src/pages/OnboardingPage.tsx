import type React from "react";
import { css } from "styled-system/css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Plant } from "@phosphor-icons/react";

const OnboardingPage: React.FC = () => {
    const { config, updateConfig } = useAppContext();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!config?.hasOnboarded) return;
        navigate("/");
    }, [config?.hasOnboarded, navigate]);

    const complete = async (next: string) => {
        await updateConfig({ hasOnboarded: true });
        navigate(next);
    };

    return (
        <div
            className={css({
                padding: "6",
                display: "flex",
                flexDirection: "column",
                gap: "5",
                width: "400px",
            })}
        >
            <div className={"gradient-bar"} />

            <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                <Plant color="green" />
                <h2 className={css({ fontSize: "xl", fontWeight: "semibold" })}>
                    Welcome to ai m2Balance
                </h2>
            </div>

            <ul className={css({ color: "gray.700", fontSize: "sm", lineHeight: "tall" })}>
                <li>• Track your AI usage impact in real-time.</li>
                <li>• Restore m² through donations when you’re ready.</li>
                <li>• Create an account to sync across devices.</li>
            </ul>

            <div className={css({ display: "flex", gap: "3", marginTop: "2" })}>
                <button
                    type="button"
                    className={css({
                        paddingX: "4",
                        paddingY: "2",
                        borderRadius: "sm",
                        backgroundColor: "green.600",
                        color: "white",
                    })}
                    onClick={() => complete(user ? "/" : "/signup")}
                >
                    {user ? "Start tracking" : "Create my account"}
                </button>
                <button
                    type="button"
                    className={css({
                        paddingX: "4",
                        paddingY: "2",
                        borderRadius: "sm",
                        backgroundColor: "gray.100",
                        color: "gray.700",
                    })}
                    onClick={() => complete("/")}
                >
                    Continue as guest
                </button>
            </div>
        </div>
    );
};

export default OnboardingPage;


