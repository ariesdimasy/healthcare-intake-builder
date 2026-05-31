"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Component } from "@/types";

const COMPONENT_TYPES = [
  "patient_form",
  "intake_form",
  "consent_form",
  "vital_sign_form",
  "referral_form",
  "history_form",
  "medical_hx_form",
  "surgical_hx_form",
  "family_hx_form",
  "social_hx_form",
  "medication_hx_form",
  "allergy_hx_form",
  "review_of_system_form",
  "lifestyle_form",
  "nutrition_form",
  "exercise_form",
  "stress_management_form",
  "sleep_hx_form",
  "smoking_hx_form",
  "alcohol_hx_form",
  "substance_hx_form",
  "mental_health_hx_form",
  "sexual_health_hx_form",
  "reproductive_health_hx_form",
  "travel_hx_form",
  "vaccination_hx_form",
  "screening_form",
];

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  type: z.string().min(1, "Tipe wajib dipilih"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  position: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .pipe(z.number().min(0, "Posisi tidak boleh negatif")),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

interface ComponentFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<Component>;
  onSubmit: (data: FormData) => void; // FormData = output (position: number)
  isLoading?: boolean;
  onCancel: () => void;
}

export default function ComponentForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
}: ComponentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name || "",
      type: defaultValues?.type || "",
      description: defaultValues?.description || "",
      position: defaultValues?.position ?? 0,
    },
  });

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset({
        name: defaultValues.name || "",
        type: defaultValues.type || "",
        description: defaultValues.description || "",
        position: defaultValues.position ?? 0,
      });
    }
  }, [defaultValues, mode, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit as never)} noValidate>
      <div className="form-group">
        <label htmlFor="comp-name" className="form-label">Nama Component</label>
        <input
          id="comp-name"
          type="text"
          placeholder="Patient Registration Form"
          className={`form-input ${errors.name ? "error" : ""}`}
          {...register("name")}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="comp-type" className="form-label">Tipe Component</label>
        <select
          id="comp-type"
          className={`form-input ${errors.type ? "error" : ""}`}
          {...register("type")}
        >
          <option value="">— Pilih Tipe —</option>
          {COMPONENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
        {errors.type && <p className="form-error">{errors.type.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="comp-description" className="form-label">Deskripsi</label>
        <textarea
          id="comp-description"
          rows={3}
          placeholder="Deskripsi singkat komponen ini..."
          className={`form-input ${errors.description ? "error" : ""}`}
          style={{ resize: "vertical" }}
          {...register("description")}
        />
        {errors.description && <p className="form-error">{errors.description.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="comp-position" className="form-label">Posisi (Urutan)</label>
        <input
          id="comp-position"
          type="number"
          min={0}
          placeholder="0"
          className={`form-input ${errors.position ? "error" : ""}`}
          {...register("position")}
        />
        {errors.position && <p className="form-error">{errors.position.message}</p>}
      </div>

      <div className="modal-footer" style={{ padding: 0, marginTop: "8px" }}>
        <button type="button" className="btn-secondary-admin" onClick={onCancel}>
          Batal
        </button>
        <button
          id="comp-form-submit"
          type="submit"
          className="btn-primary-admin"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin" style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} />
              Menyimpan...
            </>
          ) : mode === "create" ? "Buat Component" : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
