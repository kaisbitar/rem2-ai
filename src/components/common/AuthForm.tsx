import type React from "react";
import { useState } from "react";
import { css } from "styled-system/css";
import { User, Lock, Eye, EyeSlash } from "@phosphor-icons/react";

interface AuthFormProps {
    isLogin: boolean;
    onSubmit: (email: string, password: string) => void;
    onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSubmit, onToggleMode }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const formClasses = css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
    });

    const inputGroupClasses = css({
        position: "relative",
    });

    const inputClasses = css({
        width: "100%",
        padding: "3",
        border: "1px solid",
        borderColor: "gray.300",
        borderRadius: "6px",
        fontSize: "sm",
        transition: "border-color 0.2s",
        "&:focus": {
            outline: "none",
            borderColor: "blue.500",
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
        },
    });

    const iconClasses = css({
        position: "absolute",
        left: "3",
        top: "50%",
        transform: "translateY(-50%)",
        color: "gray.400",
    });

    const inputWithIconClasses = css({
        paddingLeft: "10",
    });

    const passwordToggleClasses = css({
        position: "absolute",
        right: "3",
        top: "50%",
        transform: "translateY(-50%)",
        color: "gray.400",
        cursor: "pointer",
        "&:hover": {
            color: "gray.600",
        },
    });

    const buttonClasses = css({
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
        "&:active": {
            backgroundColor: "blue.800",
        },
    });

    const toggleClasses = css({
        textAlign: "center",
        marginTop: "4",
        fontSize: "sm",
        color: "gray.600",
    });

    const toggleButtonClasses = css({
        background: "none",
        border: "none",
        color: "blue.600",
        cursor: "pointer",
        textDecoration: "underline",
        "&:hover": {
            color: "blue.700",
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(email, password);
    };

    const handleToggleMode = () => {
        setEmail("");
        setPassword("");
        onToggleMode();
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={formClasses}>
                <div className={inputGroupClasses}>
                    <User className={iconClasses} size={16} />
                    <input
                        type="email"
                        placeholder={i18n.t("emailAddress")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${inputClasses} ${inputWithIconClasses}`}
                        required
                    />
                </div>

                <div className={inputGroupClasses}>
                    <Lock className={iconClasses} size={16} />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder={i18n.t("password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClasses} ${inputWithIconClasses}`}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={passwordToggleClasses}
                    >
                        {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                <button type="submit" className={buttonClasses}>
                    {isLogin ? i18n.t("signIn") : i18n.t("createAccount")}
                </button>
            </form>

            <div className={toggleClasses}>
                {isLogin ? i18n.t("dontHaveAccount") : i18n.t("alreadyHaveAccount")}
                <button
                    type="button"
                    onClick={handleToggleMode}
                    className={toggleButtonClasses}
                >
                    {isLogin ? i18n.t("signUp") : i18n.t("signIn")}
                </button>
            </div>
        </>
    );
};

export default AuthForm; 