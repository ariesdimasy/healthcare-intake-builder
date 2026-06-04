"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Theme } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  colors: z.object({
    primary: z.string().min(4, "Wajib diisi"),
    secondary: z.string().min(4, "Wajib diisi"),
    accent: z.string().min(4, "Wajib diisi"),
    background: z.string().min(4, "Wajib diisi"),
    text: z.string().min(4, "Wajib diisi"),
  }),
});

type FormData = z.infer<typeof schema>;

interface ThemeFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<Theme>;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

const COLOR_FIELDS: Array<{
  key: keyof FormData["colors"];
  label: string;
  defaultColor: string;
}> = [
  { key: "primary", label: "Warna Primer", defaultColor: "#2563eb" },
  { key: "secondary", label: "Warna Sekunder", defaultColor: "#0ea5e9" },
  { key: "accent", label: "Warna Aksen", defaultColor: "#06b6d4" },
  { key: "background", label: "Background", defaultColor: "#ffffff" },
  { key: "text", label: "Warna Teks", defaultColor: "#0f172a" },
];

export default function ThemeForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
}: ThemeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name || "",
      colors: {
        primary: defaultValues?.colors?.primary || "#2563eb",
        secondary: defaultValues?.colors?.secondary || "#0ea5e9",
        accent: defaultValues?.colors?.accent || "#06b6d4",
        background: defaultValues?.colors?.background || "#ffffff",
        text: defaultValues?.colors?.text || "#0f172a",
      },
    },
  });

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset({
        name: defaultValues.name || "",
        colors: {
          primary: defaultValues.colors?.primary || "#2563eb",
          secondary: defaultValues.colors?.secondary || "#0ea5e9",
          accent: defaultValues.colors?.accent || "#06b6d4",
          background: defaultValues.colors?.background || "#ffffff",
          text: defaultValues.colors?.text || "#0f172a",
        },
      });
    }
  }, [defaultValues, mode, reset]);

  const colors = watch("colors");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-group">
        <label htmlFor="theme-name" className="form-label">Nama Theme</label>
        <input
          id="theme-name"
          type="text"
          placeholder="Clean Blue Medical"
          className={`form-input ${errors.name ? "error" : ""}`}
          {...register("name")}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      {/* Color Palette Preview */}
      <div style={{ marginBottom: "16px" }}>
        <div className="form-label" style={{ marginBottom: "10px" }}>Preview Palet Warna</div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {COLOR_FIELDS.map((f) => (
            <div
              key={f.key}
              title={f.label}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: colors?.[f.key] || f.defaultColor,
                border: "2px solid rgba(0,0,0,0.1)",
                transition: "all 150ms",
              }}
            />
          ))}
        </div>
      </div>

      {/* Color Inputs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
        }}
      >
        {COLOR_FIELDS.map((f) => (
          <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor={`theme-color-${f.key}`} className="form-label">
              {f.label}
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                id={`theme-color-picker-${f.key}`}
                type="color"
                {...register(`colors.${f.key}`)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border-base)",
                  padding: "2px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
              <input
                id={`theme-color-${f.key}`}
                type="text"
                placeholder={f.defaultColor}
                className="form-input"
                style={{ flex: 1, fontFamily: "monospace", fontSize: "0.8rem" }}
                {...register(`colors.${f.key}`)}
              />
            </div>
            {errors.colors?.[f.key] && (
              <p className="form-error">{errors.colors[f.key]?.message}</p>
            )}
          </div>
        ))}
      </div>

      <div className="modal-footer" style={{ padding: 0, marginTop: "20px" }}>
        <button type="button" className="btn-secondary-admin" onClick={onCancel}>
          Batal
        </button>
        <button
          id="theme-form-submit"
          type="submit"
          className="btn-primary-admin"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin" style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} />
              Menyimpan...
            </>
          ) : mode === "create" ? "Buat Theme" : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
