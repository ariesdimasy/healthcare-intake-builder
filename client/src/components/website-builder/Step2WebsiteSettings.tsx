"use client";

import { useState } from "react";
import type { WebsiteSettings } from "@/types";

interface Step2Props {
  data: WebsiteSettings;
  onChange: (data: WebsiteSettings) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2WebsiteSettings({ data, onChange, onNext, onBack }: Step2Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof WebsiteSettings, string>>>({});
  const [showPassword, setShowPassword] = useState(false);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!data.username_github.trim()) e.username_github = "GitHub username is required.";
    if (!data.db_host.trim())         e.db_host         = "Database host is required.";
    if (!data.db_username.trim())     e.db_username     = "Database username is required.";
    if (!data.db_name.trim())         e.db_name         = "Database name is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onNext();
  }

  function field(
    id: keyof WebsiteSettings,
    label: string,
    placeholder: string,
    type: string = "text",
    required = false
  ) {
    const isPassword = id === "db_password";
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={id}>
          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
        <div style={{ position: "relative" }}>
          <input
            id={id}
            type={isPassword && !showPassword ? "password" : "text"}
            className={`form-input ${errors[id] ? "error" : ""}`}
            placeholder={placeholder}
            value={data[id]}
            onChange={(e) => onChange({ ...data, [id]: e.target.value })}
            autoComplete={isPassword ? "new-password" : "off"}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                fontSize: "1rem",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          )}
        </div>
        {errors[id] && <p className="form-error">⚠ {errors[id]}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* GitHub section */}
      <div className="wizard-card">
        <div className="wizard-card-header">
          <span className="wizard-card-icon">🐙</span>
          <div>
            <h2 className="wizard-card-title">GitHub Configuration</h2>
            <p className="wizard-card-subtitle">Connect your GitHub account for deployment.</p>
          </div>
        </div>
        <div className="wizard-card-body">
          {field("username_github", "GitHub Username", "e.g. johndoe", "text", true)}
        </div>
      </div>

      {/* Database section */}
      <div className="wizard-card" style={{ marginTop: "20px" }}>
        <div className="wizard-card-header">
          <span className="wizard-card-icon">🗄️</span>
          <div>
            <h2 className="wizard-card-title">Database Configuration</h2>
            <p className="wizard-card-subtitle">PostgreSQL connection settings for your intake data.</p>
          </div>
        </div>
        <div className="wizard-card-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              {field("db_host",     "Host",           "e.g. localhost or db.supabase.co", "text", true)}
            </div>
            {field("db_username",   "Username",       "e.g. postgres", "text", true)}
            {field("db_name",       "Database Name",  "e.g. healthcare_db", "text", true)}
          </div>
          {field("db_password",     "Password",       "Database password", "password")}
          <div className="wizard-info-banner">
            🔒 Credentials are stored locally and used only for deployment configuration.
          </div>
        </div>
      </div>

      <div className="wizard-nav">
        <button type="button" className="btn-secondary-admin" onClick={onBack}>
          ← Back
        </button>
        <button type="submit" className="btn-primary-admin">
          Next: Build Forms →
        </button>
      </div>
    </form>
  );
}
