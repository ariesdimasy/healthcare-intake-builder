"use client";

import Link from "next/link";
import { PlusIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

// Placeholder mock data — replace with real API call
const MOCK_WEBSITES = [
  {
    id: "1",
    name: "HealthFirst Clinic Portal",
    website_url: "https://healthfirst.example.com",
    status: "active",
    forms_count: 7,
    created_at: "2026-05-15",
  },
  {
    id: "2",
    name: "Sunrise Dental Intake",
    website_url: "https://sunrise-dental.example.com",
    status: "draft",
    forms_count: 3,
    created_at: "2026-05-28",
  },
];

export default function WebsitesPage() {
  return (
    <div className="page-container">
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1 className="page-title">Websites</h1>
          <p className="page-subtitle">Manage your healthcare intake websites.</p>
        </div>
        <Link href="/websites/create" className="btn-primary-admin">
          <PlusIcon style={{ width: 16, height: 16 }} />
          Create Website
        </Link>
      </div>

      {MOCK_WEBSITES.length === 0 ? (
        /* ── Empty state ── */
        <div className="card-admin">
          <div className="empty-state">
            <div className="empty-state-icon">
              <GlobeAltIcon style={{ width: 32, height: 32, color: "var(--text-muted)" }} />
            </div>
            <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>No websites yet</p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Create your first intake website to start collecting patient data.
            </p>
            <Link href="/websites/create" className="btn-primary-admin" style={{ marginTop: "8px" }}>
              <PlusIcon style={{ width: 16, height: 16 }} />
              Create Website
            </Link>
          </div>
        </div>
      ) : (
        /* ── Website grid ── */
        <div className="websites-grid">
          {MOCK_WEBSITES.map((site) => (
            <div key={site.id} className="website-card card-admin">
              <div className="website-card-header">
                <div className="website-card-icon">
                  <GlobeAltIcon style={{ width: 22, height: 22, color: "var(--brand-primary)" }} />
                </div>
                <span
                  className={`badge-status ${site.status === "active" ? "badge-active" : "badge-inactive"}`}
                >
                  {site.status}
                </span>
              </div>
              <div className="website-card-body">
                <h3 className="website-card-name">{site.name}</h3>
                <a
                  href={site.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-card-url"
                >
                  {site.website_url}
                </a>
                <div className="website-card-meta">
                  <span>🧩 {site.forms_count} forms</span>
                  <span>📅 {site.created_at}</span>
                </div>
              </div>
              <div className="website-card-footer">
                <button className="btn-secondary-admin" style={{ flex: 1 }}>
                  Edit
                </button>
                <Link href="/websites/create" className="btn-primary-admin" style={{ flex: 1, justifyContent: "center" }}>
                  Builder
                </Link>
              </div>
            </div>
          ))}

          {/* Create new card */}
          <Link href="/websites/create" className="website-card website-card--new card-admin">
            <div className="website-new-inner">
              <span className="website-new-icon">+</span>
              <span className="website-new-label">Create New Website</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
