"use client";

import { useState, useRef } from "react";
import type { WebsiteInfo } from "@/types";

interface Step1Props {
  data: WebsiteInfo;
  onChange: (data: WebsiteInfo) => void;
  onNext: () => void;
}

export default function Step1WebsiteInfo({ data, onChange, onNext }: Step1Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof WebsiteInfo, string>>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!data.title.trim())            e.title           = "Website title is required.";
    if (!data.meta_description.trim()) e.meta_description = "Meta description is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ ...data, logo: file, logoPreview: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onNext();
  }

  const field = (
    id: keyof WebsiteInfo,
    label: string,
    placeholder: string,
    multiline?: boolean
  ) => (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>
        {label} {(id === "title" || id === "meta_description") && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className={`form-input ${errors[id] ? "error" : ""}`}
          placeholder={placeholder}
          rows={3}
          value={data[id] as string}
          onChange={(e) => onChange({ ...data, [id]: e.target.value })}
          style={{ resize: "vertical" }}
        />
      ) : (
        <input
          id={id}
          type="text"
          className={`form-input ${errors[id] ? "error" : ""}`}
          placeholder={placeholder}
          value={data[id] as string}
          onChange={(e) => onChange({ ...data, [id]: e.target.value })}
        />
      )}
      {errors[id] && <p className="form-error">⚠ {errors[id]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="wizard-card">
        <div className="wizard-card-header">
          <span className="wizard-card-icon">🌐</span>
          <div>
            <h2 className="wizard-card-title">Website Information</h2>
            <p className="wizard-card-subtitle">Set your website&apos;s basic identity and SEO metadata.</p>
          </div>
        </div>

        <div className="wizard-card-body">
          {field("title",            "Website Title",       "e.g. HealthFirst Clinic Intake Portal")}
          {field("meta_content",     "Meta Keywords",       "e.g. healthcare, clinic, intake form, patient")}
          {field("meta_description", "Meta Description",    "A short description of your website (shown in search results)", true)}

          {/* Logo upload */}
          <div className="form-group">
            <label className="form-label">Website Logo</label>
            <div className="logo-upload-area" onClick={() => fileRef.current?.click()}>
              {data.logoPreview ? (
                <img
                  src={data.logoPreview}
                  alt="Logo preview"
                  className="logo-preview"
                />
              ) : (
                <div className="logo-upload-placeholder">
                  <span style={{ fontSize: "2rem" }}>📁</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    Click to upload logo
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    PNG, JPG, SVG (max 2MB)
                  </span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleLogoChange}
            />
            {data.logoPreview && (
              <button
                type="button"
                onClick={() => onChange({ ...data, logo: null, logoPreview: null })}
                style={{ marginTop: "8px", fontSize: "0.8rem", color: "var(--status-error)", background: "none", border: "none", cursor: "pointer" }}
              >
                ✕ Remove logo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="wizard-nav">
        <div />
        <button type="submit" className="btn-primary-admin">
          Next: Settings →
        </button>
      </div>
    </form>
  );
}
