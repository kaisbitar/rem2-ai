import type React from "react";
import { css } from "styled-system/css";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const headerContainerClasses = css({
    background: "repeating-radial-gradient( circle, #6A7B02, #A1CA2B)",
    padding: "2",
    textAlign: "center",

  });

  const titleClasses = css({
    fontSize: "2xl",
    fontWeight: "bold",
    color: "white",
    marginBottom: "2",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    letterSpacing: "tight",
  });

  const superscriptClasses = css({
    fontSize: "lg",
    verticalAlign: "super",
    lineHeight: "1",
    marginLeft: "0.5",
  });

  const taglineClasses = css({
    fontSize: "sm",
    color: "white",
    opacity: "0.95",
    fontWeight: "medium",
    textShadow: "0 1px 4px rgba(0, 0, 0, 0.15)",
  });

  return (
    <header className={`${headerContainerClasses} ${className || ""}`}>
      <h1 className={titleClasses}>
        REM<span className={superscriptClasses}>²</span>.AI
      </h1>
      <p className={taglineClasses}>Track & Restore AI Impact</p>
    </header>
  );
};

export default Header; 