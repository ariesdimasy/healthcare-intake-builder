"use client";

import { useState } from "react";
import type { WebsiteInfo, WebsiteSettings, DroppedForm } from "@/types";
import { generateWebsiteCode } from "./websiteCodeGenerator";

interface Step4Props {
  websiteInfo: WebsiteInfo;
  websiteSettings: WebsiteSettings;
  droppedForms: DroppedForm[];
  onBack: () => void;
}

type Tab = "preview" | "code";

export default function Step4PreviewExport({
  websiteInfo,
  websiteSettings,
  droppedForms,
  onBack,
}: Step4Props) {
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);

  const htmlCode = generateWebsiteCode(websiteInfo, websiteSettings, droppedForms);

  async function handleCopy() {
    await navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${websiteInfo.title.replace(/\s+/g, "-").toLowerCase() || "intake-form"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Summary banner */}
      <div className="wizard-card" style={{ marginBottom: "20px" }}>
        <div className="wizard-card-header">
          <span className="wizard-card-icon">✅</span>
          <div>
            <h2 className="wizard-card-title">Website Ready!</h2>
            <p className="wizard-card-subtitle">
              <strong>{websiteInfo.title}</strong> · {droppedForms.length} form section{droppedForms.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="wizard-card-body" style={{ paddingTop: 0 }}>
          <div className="preview-meta-grid">
            <div className="preview-meta-item">
              <span className="preview-meta-label">GitHub</span>
              <span className="preview-meta-value">@{websiteSettings.username_github || "—"}</span>
            </div>
            <div className="preview-meta-item">
              <span className="preview-meta-label">DB Host</span>
              <span className="preview-meta-value">{websiteSettings.db_host || "—"}</span>
            </div>
            <div className="preview-meta-item">
              <span className="preview-meta-label">Database</span>
              <span className="preview-meta-value">{websiteSettings.db_name || "—"}</span>
            </div>
            <div className="preview-meta-item">
              <span className="preview-meta-label">Forms</span>
              <span className="preview-meta-value">{droppedForms.map((f) => f.label).join(", ")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="preview-tabs-wrapper">
        <div className="preview-tabs">
          <button
            className={`preview-tab-btn ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            🖥️ Website Preview
          </button>
          <button
            className={`preview-tab-btn ${activeTab === "code" ? "active" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            💻 HTML + JS Code
          </button>
        </div>

        {/* Code tab action buttons */}
        {activeTab === "code" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn-secondary-admin" onClick={handleCopy}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
            <button className="btn-primary-admin" onClick={handleDownload}>
              ⬇️ Download HTML
            </button>
          </div>
        )}
      </div>

      {/* Tab content */}
      <div className="preview-tab-content">
        {activeTab === "preview" && (
          <div className="preview-iframe-wrapper">
            <iframe
              srcDoc={htmlCode}
              title="Website Preview"
              className="preview-iframe"
              sandbox="allow-scripts"
            />
          </div>
        )}

        {activeTab === "code" && (
          <div className="code-viewer">
            <pre className="code-block">
              <code>{htmlCode}</code>
            </pre>
          </div>
        )}
      </div>

      <div className="wizard-nav" style={{ marginTop: "20px" }}>
        <button type="button" className="btn-secondary-admin" onClick={onBack}>
          ← Back to Builder
        </button>
        <button type="button" className="btn-primary-admin" onClick={handleDownload}>
          ⬇️ Download Website
        </button>
      </div>
    </div>
  );
}
