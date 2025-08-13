import type React from "react";
import { css } from "styled-system/css";

interface ForestRestorationProps {
    value: number;
    unit?: string;
    className?: string;
}

const ForestRestoration: React.FC<ForestRestorationProps> = ({
    value,
    unit = "m²",
    className = ""
}) => {
    const containerClasses = css({
        backgroundColor: "white",
        padding: "5",
        borderRadius: "lg",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        border: "1px solid",
        borderColor: "gray.200",
        marginBottom: "4",
    });

    const headerClasses = css({
        display: "flex",
        alignItems: "center",
        gap: "3",
        marginBottom: "4",
    });

    const plantIconClasses = css({
        width: "5",
        height: "5",
        color: "green.main",
    });

    const titleClasses = css({
        fontSize: "lg",
        fontWeight: "bold",
        color: "gray.800",
        textTransform: "uppercase",
        letterSpacing: "wide",
    });

    const progressContainerClasses = css({
        display: "flex",
        alignItems: "center",
        gap: "3",
        marginBottom: "3",
    });

    const progressBarClasses = css({
        flex: "1",
        height: "3",
        backgroundColor: "gray.200",
        borderRadius: "full",
        overflow: "hidden",
        position: "relative",
    });

    const progressFillClasses = css({
        height: "100%",
        borderRadius: "full",
        transition: "width 0.5s ease, background-color 0.3s ease",
        ...(value > 0 ? {
            backgroundColor: "green.main",
            width: `${Math.min((value / 100) * 100, 100)}%`, // Scale to 100m² = 100%
        } : {
            backgroundColor: "#EF4444", // Red color for zero/negative
            width: "100%",
        }),
    });

    const valueClasses = css({
        fontSize: "xl",
        fontWeight: "bold",
        color: value > 0 ? "green.main" : "#EF4444",
        minWidth: "2rem",
        textAlign: "right",
    });

    const unitClasses = css({
        fontSize: "sm",
        color: "gray.600",
        fontWeight: "medium",
    });

    const statusMessageClasses = css({
        fontSize: "sm",
        color: "gray.600",
        textAlign: "center",
        fontStyle: "italic",
    });

    // Plant icon SVG
    const PlantIcon = () => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={plantIconClasses}
        >
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9L3 7V9H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V9H21ZM17 20H7V9H17V20Z" />
        </svg>
    );

    const getStatusMessage = () => {
        if (value > 0) {
            return `${value} ${unit} of forest restored!`;
        } else if (value === 0) {
            return "No forest restoration yet";
        } else {
            return "Forest restoration needed";
        }
    };

    return (
        <div className={`${containerClasses} ${className}`}>
            <div className={headerClasses}>
                <PlantIcon />
                <h3 className={titleClasses}>Forest Restoration</h3>
            </div>

            <div className={progressContainerClasses}>
                <div className={progressBarClasses}>
                    <div className={progressFillClasses}></div>
                </div>
                <div className={valueClasses}>{value}</div>
                <span className={unitClasses}>{unit}</span>
            </div>

            <p className={statusMessageClasses}>
                {getStatusMessage()}
            </p>
        </div>
    );
};

export default ForestRestoration; 