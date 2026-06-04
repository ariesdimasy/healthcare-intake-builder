"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { DroppedForm } from "@/types";
import {
  INTAKE_FORMS_CATALOG,
  FORM_CATEGORIES,
  CATEGORY_COLORS,
} from "./intakeFormsCatalog";

interface Step3Props {
  droppedForms: DroppedForm[];
  onChange: (forms: DroppedForm[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3DragAndDrop({
  droppedForms,
  onChange,
  onNext,
  onBack,
}: Step3Props) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [error, setError] = useState("");

  const categories = ["All", ...FORM_CATEGORIES];

  const filteredForms =
    activeCategory === "All"
      ? INTAKE_FORMS_CATALOG
      : INTAKE_FORMS_CATALOG.filter((f) => f.category === activeCategory);

  function addForm(formId: string) {
    const item = INTAKE_FORMS_CATALOG.find((f) => f.id === formId)!;
    const newForm: DroppedForm = {
      uid: uuidv4(),
      formId: item.id,
      label: item.label,
      title_text: item.label,
      description_text: item.description,
    };
    onChange([...droppedForms, newForm]);
    setError("");
  }

  function removeForm(uid: string) {
    onChange(droppedForms.filter((f) => f.uid !== uid));
    if (editingUid === uid) setEditingUid(null);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...droppedForms];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index === droppedForms.length - 1) return;
    const next = [...droppedForms];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  function updateField(uid: string, key: "title_text" | "description_text", value: string) {
    onChange(droppedForms.map((f) => (f.uid === uid ? { ...f, [key]: value } : f)));
  }

  function handleNext() {
    if (droppedForms.length === 0) {
      setError("Please add at least one form to your website.");
      return;
    }
    onNext();
  }

  return (
    <div className="builder-layout">
      {/* ── LEFT PANEL: form catalog ─────────────────────── */}
      <aside className="builder-left-panel">
        <div className="builder-panel-header">
          <h3>📋 Form Library</h3>
          <span className="builder-count-badge">{INTAKE_FORMS_CATALOG.length} forms</span>
        </div>

        {/* Category filter pills */}
        <div className="builder-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-pill ${activeCategory === cat ? "active" : ""}`}
            >
              {cat === "All" ? "All" : cat.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Form list */}
        <div className="builder-form-list">
          {filteredForms.map((form) => {
            const color = CATEGORY_COLORS[form.category];
            const alreadyAdded = droppedForms.some((d) => d.formId === form.id);
            return (
              <div key={form.id} className="catalog-item">
                <div className="catalog-item-left">
                  <span className="catalog-icon" style={{ background: `${color}18`, color }}>
                    {form.icon}
                  </span>
                  <div className="catalog-meta">
                    <span className="catalog-label">{form.label}</span>
                    <span className="catalog-desc">{form.description}</span>
                  </div>
                </div>
                <button
                  onClick={() => addForm(form.id)}
                  className="catalog-add-btn"
                  title="Add to website"
                >
                  {alreadyAdded ? "+" : "+"}
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── RIGHT PANEL: canvas ──────────────────────────── */}
      <div className="builder-right-panel">
        <div className="builder-panel-header">
          <h3>🖥️ Website Canvas</h3>
          <span className="builder-count-badge">{droppedForms.length} added</span>
        </div>

        {droppedForms.length === 0 ? (
          <div className="builder-empty-canvas">
            <div className="builder-empty-icon">🧩</div>
            <p className="builder-empty-title">Your canvas is empty</p>
            <p className="builder-empty-subtitle">
              Click <strong>+</strong> on any form in the library to add it here
            </p>
          </div>
        ) : (
          <div className="canvas-form-list">
            {droppedForms.map((form, index) => (
              <div
                key={form.uid}
                className={`canvas-card ${editingUid === form.uid ? "editing" : ""}`}
              >
                {/* Card header */}
                <div className="canvas-card-header">
                  <div className="canvas-card-left">
                    <span className="canvas-card-number">{index + 1}</span>
                    <span className="canvas-card-label">{form.label}</span>
                  </div>
                  <div className="canvas-card-actions">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="canvas-action-btn"
                      title="Move up"
                    >▲</button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === droppedForms.length - 1}
                      className="canvas-action-btn"
                      title="Move down"
                    >▼</button>
                    <button
                      onClick={() =>
                        setEditingUid(editingUid === form.uid ? null : form.uid)
                      }
                      className={`canvas-action-btn ${editingUid === form.uid ? "active-edit" : ""}`}
                      title="Edit labels"
                    >✏️</button>
                    <button
                      onClick={() => removeForm(form.uid)}
                      className="canvas-action-btn danger"
                      title="Remove"
                    >✕</button>
                  </div>
                </div>

                {/* Inline edit panel */}
                {editingUid === form.uid && (
                  <div className="canvas-card-edit">
                    <div className="form-group" style={{ marginBottom: "12px" }}>
                      <label className="form-label">Section Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={form.title_text}
                        onChange={(e) =>
                          updateField(form.uid, "title_text", e.target.value)
                        }
                        placeholder="e.g. Patient Registration"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Section Description</label>
                      <textarea
                        className="form-input"
                        rows={2}
                        style={{ resize: "vertical" }}
                        value={form.description_text}
                        onChange={(e) =>
                          updateField(form.uid, "description_text", e.target.value)
                        }
                        placeholder="Short description shown to patients..."
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ color: "var(--status-error)", fontSize: "0.85rem", marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            ⚠ {error}
          </div>
        )}
      </div>

      {/* ── Navigation (outside the grid) ─────────────── */}
      <div className="wizard-nav builder-nav-footer">
        <button type="button" className="btn-secondary-admin" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="btn-primary-admin" onClick={handleNext}>
          Finish & Preview →
        </button>
      </div>
    </div>
  );
}
