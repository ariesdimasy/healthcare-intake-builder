"use client";

import React from "react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: {
    value: string;
    positive?: boolean;
    label: string;
  };
  isLoading?: boolean;
}

export default function StatsCard({
  label,
  value,
  icon,
  iconBg,
  trend,
  isLoading,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <div className="stats-card">
        <div className="skeleton" style={{ width: "48px", height: "48px", borderRadius: "12px" }} />
        <div className="skeleton" style={{ width: "80px", height: "28px", marginTop: "12px", borderRadius: "6px" }} />
        <div className="skeleton" style={{ width: "120px", height: "14px", marginTop: "8px", borderRadius: "4px" }} />
      </div>
    );
  }

  return (
    <div className="stats-card">
      <div className="stats-card-icon" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="stats-card-value">{value.toLocaleString()}</div>
      <div className="stats-card-label">{label}</div>
      {trend && (
        <div
          className="stats-card-trend"
          style={{ color: trend.positive ? "#10b981" : "#ef4444" }}
        >
          <span>{trend.positive ? "↑" : "↓"}</span>
          <span>{trend.value}</span>
          <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
