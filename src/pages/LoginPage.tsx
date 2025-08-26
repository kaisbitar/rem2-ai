import React, { useState } from "react";
import { css } from "styled-system/css";
import { User, Lock, Eye, EyeSlash } from "@phosphor-icons/react";

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
        // TODO: Implement authentication logic
        console.log(`${isLogin ? "Login" : "Register"} attempt:`, { email, password });
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setEmail("");
        setPassword("");
    };

    return (
        <div className={containerClasses}>
            <div className={headerClasses}>
                <h1 className={titleClasses}>
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p className={subtitleClasses}>
                    {isLogin
                        ? "Sign in to track your AI impact"
                        : "Join us to start tracking your AI impact"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className={formClasses}>
                <div className={inputGroupClasses}>
                    <User className={iconClasses} size={16} />
                    <input
                        type="email"
                        placeholder="Email address"
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
                        placeholder="Password"
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
                    {isLogin ? "Sign In" : "Create Account"}
                </button>
            </form>

            <div className={toggleClasses}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={toggleMode} className={toggleButtonClasses}>
                    {isLogin ? "Sign up" : "Sign in"}
                </button>
            </div>
        </div>
    );
};

export default LoginPage; 