import React from "react";
import { css } from "styled-system/css";
import { Plant } from "@phosphor-icons/react";

const footerStyles = {
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    mt: "auto",
    py: "2",
    px: "6",
    borderTop: "1px solid #e5e7eb",
    bg: "white",
    textAlign: "center",
    fontSize: "sm",
    color: "gray.600"
};

export const Footer: React.FC = () => {
    return (
        <footer className={css(footerStyles)}>
            <div className={css({ display: "flex", alignItems: "center" })}>
                RE <Plant color="green" style={{ margin: "0px 2px" }} />
                <span className={css({ fontSize: "sm" })}>m2</span>.AI
            </div>
            <div className={"gradient-bar"} />
        </footer>
    );
}; 