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

  function validate(): boolean {
    const e: typeof errors = {};
    if (!data.username_github.trim()) e.username_github = "GitHub username is required.";
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
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={id}>
          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
        <div style={{ position: "relative" }}>
          <input
            id={id}
            type={type}
            className={`form-input ${errors[id] ? "error" : ""}`}
            placeholder={placeholder}
            value={data[id]}
            onChange={(e) => onChange({ ...data, [id]: e.target.value })}
            autoComplete="off"
          />
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
