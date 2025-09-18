import React from "react";
import { css } from "styled-system/css";
import StatCard from "@/components/common/StatCard";

interface StatItem {
    value: string | number;
    label?: string;
    unit?: string;
    icon: React.ReactNode;
    tooltip: string;
    className?: string;
}

interface StatsGroupProps {
    title: string;
    stats: StatItem[];
    operators?: ("=" | "+" | undefined)[]; // Optional operators between stats
}

const StatsGroup: React.FC<StatsGroupProps> = ({ title, stats, operators }) => {
    const statsGridClasses = css({
        display: "flex",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "5px",
        marginBottom: "10px",
        marginTop: "1",
    });

    const operatorClasses = css({
        fontSize: "sm",
        margin: "10px 0px"
    });

    return (
        <>
            <h6>{title}</h6>
            <div className={statsGridClasses}>
                {stats.map((stat, index) => (
                    <React.Fragment key={`${title}-stat-${index}`}>
                        <StatCard
                            value={stat.value}
                            label={stat.label}
                            unit={stat.unit}
                            icon={stat.icon}
                            tooltip={stat.tooltip}
                            className={stat.className}
                        />
                        {operators?.[index] && (
                            <span className={operatorClasses}>{operators[index]}</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </>
    );
};

export default StatsGroup;
