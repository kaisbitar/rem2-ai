import type React from "react";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";
// import Tooltip from "@/components/common/Tooltip";

interface BalanceChartProps {
    consumed: number;
    restored: number;
    consumedColor?: string;
    restoredColor?: string;
    unit?: string;
    className?: string;
}

const BalanceChart: React.FC<BalanceChartProps> = ({
    consumed,
    restored,
    consumedColor = "#c2185b",
    restoredColor = "green",
    unit = "m²",
    className = "",
}) => {
    const totalAbsolute = Math.abs(consumed) + Math.abs(restored) || 1;
    const consumedPercentage = (Math.abs(consumed) / totalAbsolute) * 50;
    const restoredPercentage = (Math.abs(restored) / totalAbsolute) * 50;

    const [animatedWidths, setAnimatedWidths] = useState({
        consumed: 0,
        restored: 0,
    });

    useEffect(() => {
        setAnimatedWidths({
            consumed: Math.abs(consumedPercentage),
            restored: Math.abs(restoredPercentage),
        });
    }, [consumedPercentage, restoredPercentage]);

    const chartContainerClasses = css({
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: "3",
        marginBottom: "5px",
    });

    const labelClasses = css({
        fontSize: "sm",
        fontWeight: "medium",
        textAlign: "center",
        whiteSpace: "nowrap",
    });

    const chartWrapperClasses = css({
        height: "13px",
        width: "160px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "#a1ca2a45",
        borderRadius: "full",
        overflow: "hidden",
    });

    const consumedBarClasses = css({
        position: "absolute",
        left: "50%",
        height: "100%",
        backgroundColor: "#c2175b7a",
        transform: "translateX(-100%)",
        transition: "width 1s ease-out",
        overflow: "hidden",
        borderRadius: "50px 0px 0px 50px",
        zIndex: "1",
        _hover: {
            backgroundColor: consumedColor,
        },
    });

    const restoredBarClasses = css({
        position: "absolute",
        left: "50%",
        height: "100%",
        backgroundColor: "#0080004d",
        transition: "width 1s ease-out",
        overflow: "hidden",
        borderRadius: "0px 10px 10px 0px",
        _hover: {
            backgroundColor: restoredColor,
        },
    });

    const valueClasses = css({
        fontSize: "3xl",
        fontWeight: "bold",
        color: consumedColor,
    });

    return (
        <div className={`${chartContainerClasses} ${className}`}>
            <div className={labelClasses}>
                <span className={`${valueClasses} ${css({ color: consumedColor })}`}>
                    {consumed}
                </span>{" "}
                {unit}
            </div>
            <div className={chartWrapperClasses}>
                {/* <Tooltip content={"Consumed"}> */}

                <div
                    className={consumedBarClasses}
                    style={{ width: `${animatedWidths.consumed}%` }}
                />
                {/* </Tooltip> */}
                <div
                    className={restoredBarClasses}
                    style={{ width: `${animatedWidths.restored}%` }}
                />
            </div>
            <div className={labelClasses}>
                <span className={`${valueClasses} ${css({ color: restoredColor })}`}>
                    {restored}
                </span>{" "}
                {unit}
            </div>
        </div>
    );
};

export default BalanceChart;
