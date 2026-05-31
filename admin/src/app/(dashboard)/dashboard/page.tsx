"use client";

import { useDashboard } from "@/hooks/useDashboard";
import StatsCard from "@/components/ui/StatsCard";
import {
  UsersIcon,
  PuzzlePieceIcon,
  SwatchIcon,
  ClipboardDocumentListIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboard();

  const cards = [
    {
      label: "Total Clients",
      value: stats?.total_clients ?? 0,
      icon: <UsersIcon style={{ width: "24px", height: "24px", color: "#2563eb" }} />,
      iconBg: "rgba(37, 99, 235, 0.1)",
      href: "/clients",
    },
    {
      label: "Total Components",
      value: stats?.total_components ?? 0,
      icon: <PuzzlePieceIcon style={{ width: "24px", height: "24px", color: "#0ea5e9" }} />,
      iconBg: "rgba(14, 165, 233, 0.1)",
      href: "/components",
    },
    {
      label: "Total Themes",
      value: stats?.total_themes ?? 0,
      icon: <SwatchIcon style={{ width: "24px", height: "24px", color: "#06b6d4" }} />,
      iconBg: "rgba(6, 182, 212, 0.1)",
      href: "/themes",
    },
    {
      label: "Form Responses",
      value: stats?.total_form_responses ?? 0,
      icon: <ClipboardDocumentListIcon style={{ width: "24px", height: "24px", color: "#8b5cf6" }} />,
      iconBg: "rgba(139, 92, 246, 0.1)",
      href: "/form-responses",
    },
  ];

  const quickLinks = [
    { label: "Tambah Client Baru", href: "/clients", icon: UsersIcon, color: "#2563eb" },
    { label: "Kelola Components", href: "/components", icon: PuzzlePieceIcon, color: "#0ea5e9" },
    { label: "Buat Theme Baru", href: "/themes", icon: SwatchIcon, color: "#06b6d4" },
    { label: "Lihat Semua Responses", href: "/form-responses", icon: ClipboardDocumentListIcon, color: "#8b5cf6" },
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            }}
          >
            <ShieldCheckIcon style={{ width: "24px", height: "24px", color: "white" }} />
          </div>
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Selamat datang di Healthcare Intake Builder Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{ textDecoration: "none" }}
          >
            <StatsCard
              label={card.label}
              value={card.value}
              icon={card.icon}
              iconBg={card.iconBg}
              isLoading={isLoading}
            />
          </Link>
        ))}
      </div>

      {/* Quick Actions + Info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* Quick Links */}
        <div className="card-admin" style={{ padding: "24px" }}>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: "700",
              color: "var(--text-primary)",
              margin: "0 0 16px",
            }}
          >
            Aksi Cepat
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "var(--surface-base)",
                  textDecoration: "none",
                  transition: "all 150ms",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = link.color;
                  (e.currentTarget as HTMLElement).style.background = "white";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                  (e.currentTarget as HTMLElement).style.background = "var(--surface-base)";
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    background: `${link.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <link.icon style={{ width: "18px", height: "18px", color: link.color }} />
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "var(--text-primary)", flex: 1 }}>
                  {link.label}
                </span>
                <ArrowRightIcon style={{ width: "16px", height: "16px", color: "var(--text-muted)" }} />
              </Link>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="card-admin" style={{ padding: "24px" }}>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: "700",
              color: "var(--text-primary)",
              margin: "0 0 16px",
            }}
          >
            Informasi Sistem
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Versi Platform", value: "v1.0.0" },
              { label: "Regulasi", value: "HIPAA Compliant 1996" },
              { label: "Database", value: "PostgreSQL" },
              { label: "Backend", value: "FastAPI + Python" },
              { label: "Enkripsi", value: "JWT + AES-256" },
              { label: "Status", value: "Operational", ok: true },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border-base)",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: item.ok ? "#10b981" : "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {item.ok && (
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                  )}
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
