import type React from "react";
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
    color: "gray.600",
};
const superscriptClasses = css({
    marginLeft: "0.5",
    marginRight: "0.5",
    fontWeight: "bold",
});
export const Footer: React.FC = () => {
    return (
        <footer className={css(footerStyles)}>
            <div className={css({ display: "flex", alignItems: "center" })}>
                <Plant color="green" style={{ margin: "0px 2px" }} />
                <span className={superscriptClasses}>m2</span>Balance.AI

            </div>
            <div className={"gradient-bar"} />
        </footer>
    );
};
