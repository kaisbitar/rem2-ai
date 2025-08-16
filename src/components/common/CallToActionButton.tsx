import type React from "react";
import { css, cx } from "styled-system/css";

export interface CallToActionButtonProps {
    variant: string;
    text: string;
    icon: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

const CallToActionButton: React.FC<CallToActionButtonProps> = ({
    variant,
    text,
    icon,
    className = "",
    onClick,
    disabled = false,
}) => {
    const buttonClasses = css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "3",
        // width: "100%",
        padding: "4",
        paddingY: "3",
        borderRadius: "lg",
        border: "1px solid",
        // fontSize: "10px",
        // fontWeight: "semibold",
        transition: "all 0.3s ease",
        cursor: "pointer",
        // opacity: disabled ? 0.6 : 1,
        _hover: disabled ? {} : {
            transform: "translateZ(-2px)",
            boxShadow: "0 5px 5px rgba(0, 0, 0, 0.15)",
        },
    });

    const iconClasses = css({
        fontSize: "16px",
    });

    const textClasses = css({
        fontSize: "sm",
        fontWeight: "semibold",
    });

    return (
        <button
            className={cx(buttonClasses, className)}
            onClick={onClick}
            disabled={disabled}
            type="button"
        >
            <span className={iconClasses}>{icon}</span>
            <span className={textClasses}>{text}</span>
        </button>
    );
};

export default CallToActionButton; 