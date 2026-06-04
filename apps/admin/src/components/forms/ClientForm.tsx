"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Client } from "@/types";

const createSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

const editSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  is_active: z.boolean(),
  password: z.string().optional(),
});

type CreateFormData = z.infer<typeof createSchema>;
type EditFormData = z.infer<typeof editSchema>;
type FormData = CreateFormData | EditFormData;

interface ClientFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<Client>;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export default function ClientForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
}: ClientFormProps) {
  const schema = mode === "create" ? createSchema : editSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "edit"
        ? {
            name: defaultValues?.name || "",
            email: defaultValues?.email || "",
            is_active: defaultValues?.is_active ?? true,
          }
        : undefined,
  });

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset({
        name: defaultValues.name || "",
        email: defaultValues.email || "",
        is_active: defaultValues.is_active ?? true,
      });
    }
  }, [defaultValues, mode, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit as never)} noValidate>
      <div className="form-group">
        <label htmlFor="client-name" className="form-label">Nama Lengkap</label>
        <input
          id="client-name"
          type="text"
          placeholder="John Doe"
          className={`form-input ${errors.name ? "error" : ""}`}
          {...register("name")}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="client-email" className="form-label">Email</label>
        <input
          id="client-email"
          type="email"
          placeholder="client@example.com"
          className={`form-input ${errors.email ? "error" : ""}`}
          {...register("email")}
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="client-password" className="form-label">
          {mode === "create" ? "Password" : "Password Baru (opsional)"}
        </label>
        <input
          id="client-password"
          type="password"
          placeholder={mode === "create" ? "Min. 8 karakter" : "Kosongkan jika tidak ingin diubah"}
          className={`form-input ${"password" in errors && errors.password ? "error" : ""}`}
          {...register("password")}
        />
        {"password" in errors && errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>

      {mode === "edit" && (
        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              id="client-is-active"
              type="checkbox"
              {...register("is_active" as never)}
              style={{ width: "16px", height: "16px", accentColor: "var(--brand-primary)" }}
            />
            Akun Aktif
          </label>
        </div>
      )}

      <div className="modal-footer" style={{ padding: 0, marginTop: "8px" }}>
        <button type="button" className="btn-secondary-admin" onClick={onCancel}>
          Batal
        </button>
        <button
          id="client-form-submit"
          type="submit"
          className="btn-primary-admin"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin" style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} />
              Menyimpan...
            </>
          ) : mode === "create" ? "Buat Client" : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
