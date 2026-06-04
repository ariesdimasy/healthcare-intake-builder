"use client";

import { useDashboard } from "@/hooks/useDashboard";
import {
  GlobeAltIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="page-container">
        <h1 className="page-title skeleton" style={{ width: 200, height: 32, marginBottom: 8 }} />
        <p className="page-subtitle skeleton" style={{ width: 300, height: 20, marginBottom: 28 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 32 }}>
          {[1, 2].map((i) => (
            <div key={i} className="stats-card skeleton" style={{ height: 140 }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p style={{ color: "var(--status-error)" }}>Gagal memuat data dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard Client</h1>
        <p className="page-subtitle">Ringkasan aktivitas website intake Anda hari ini</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        
        {/* Websites */}
        <div className="stats-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="stats-card-label">Total Websites</div>
              <div className="stats-card-value">{data.total_websites}</div>
              <div className="stats-card-trend" style={{ color: "var(--status-success)" }}>
                <span>Website aktif</span>
              </div>
            </div>
            <div className="stats-card-icon" style={{ background: "rgba(37,99,235,0.1)", color: "#2563eb" }}>
              <GlobeAltIcon style={{ width: "24px", height: "24px" }} />
            </div>
          </div>
        </div>

        {/* Form Responses */}
        <div className="stats-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="stats-card-label">Total Responses</div>
              <div className="stats-card-value">{data.total_responses}</div>
              <div className="stats-card-trend" style={{ color: "var(--status-info)" }}>
                <span>Respons pasien</span>
              </div>
            </div>
            <div className="stats-card-icon" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}>
              <DocumentTextIcon style={{ width: "24px", height: "24px" }} />
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
        
        {/* Recent Websites */}
        <div className="card-admin" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Website Terbaru</h3>
            <Link href="/websites" style={{ fontSize: "0.85rem", color: "var(--brand-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}>
              Lihat Semua <ArrowRightIcon style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {data.recent_websites?.map((website) => (
              <div key={website.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px", background: "var(--surface-base)", borderRadius: "10px", border: "1px solid var(--border-base)" }}>
                <div className="avatar-initials" style={{ background: "var(--brand-primary)" }}>
                  {website.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{website.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <GlobeAltIcon style={{ width: 12, height: 12 }} />
                    {website.website_url}
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <ClockIcon style={{ width: 14, height: 14 }} />
                  {dayjs(website.created_at).format("DD MMM, HH:mm")}
                </div>
              </div>
            ))}
            {(!data.recent_websites || data.recent_websites.length === 0) && (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Belum ada website
              </div>
            )}
          </div>
        </div>

        {/* Recent Responses */}
        <div className="card-admin" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Respons Terbaru</h3>
            <Link href="/form-responses" style={{ fontSize: "0.85rem", color: "var(--brand-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}>
              Lihat Semua <ArrowRightIcon style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {data.recent_responses?.map((resp) => (
              <div key={resp.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px", background: "var(--surface-base)", borderRadius: "10px", border: "1px solid var(--border-base)" }}>
                <div className="avatar-initials" style={{ background: "var(--brand-secondary)" }}>
                  {resp.patient?.name?.charAt(0).toUpperCase() || "P"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{resp.patient?.name || "Unknown Patient"}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Mengisi {resp.component?.name || "Form"} di {resp.website?.name || "Website"}
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <ClockIcon style={{ width: 14, height: 14 }} />
                  {dayjs(resp.created_at).format("DD MMM, HH:mm")}
                </div>
              </div>
            ))}
            {(!data.recent_responses || data.recent_responses.length === 0) && (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Belum ada respons masuk
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
