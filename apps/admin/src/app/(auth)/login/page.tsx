"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, BeakerIcon } from "@heroicons/react/24/outline";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const DEMO_EMAIL = "admin@healthcareintake.com";
const DEMO_PASSWORD = "admin123";

export default function LoginPage() {
  const { login, isDemoMode } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleAutoFill = () => {
    setValue("email", DEMO_EMAIL);
    setValue("password", DEMO_PASSWORD);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Login berhasil! Selamat datang.");
    } catch {
      toast.error("Email atau password salah. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
            }}
          >
            <ShieldCheckIcon style={{ width: "30px", height: "30px", color: "white" }} />
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              color: "#0f172a",
              margin: "0 0 6px",
              letterSpacing: "-0.02em",
            }}
          >
            Admin Portal
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>
            Healthcare Intake Builder
          </p>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div
            style={{
              background: "linear-gradient(135deg, #fef3c7, #fde68a)",
              border: "1px solid #f59e0b",
              borderRadius: "10px",
              padding: "14px 16px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <BeakerIcon
                style={{ width: "16px", height: "16px", color: "#92400e", flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: "700",
                  color: "#92400e",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Mode Demo — Backend belum terhubung
              </span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}
            >
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#78350f",
                    fontWeight: "600",
                    width: "64px",
                  }}
                >
                  Email
                </span>
                <code
                  style={{
                    fontSize: "0.78rem",
                    background: "rgba(0,0,0,0.08)",
                    padding: "2px 8px",
                    borderRadius: "5px",
                    color: "#1c1917",
                  }}
                >
                  {DEMO_EMAIL}
                </code>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#78350f",
                    fontWeight: "600",
                    width: "64px",
                  }}
                >
                  Password
                </span>
                <code
                  style={{
                    fontSize: "0.78rem",
                    background: "rgba(0,0,0,0.08)",
                    padding: "2px 8px",
                    borderRadius: "5px",
                    color: "#1c1917",
                  }}
                >
                  {DEMO_PASSWORD}
                </code>
              </div>
            </div>
            <button
              type="button"
              id="demo-autofill-btn"
              onClick={handleAutoFill}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                width: "100%",
                padding: "7px",
                background: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "7px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              ⚡ Isi Otomatis & Login Demo
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              className={`form-input ${errors.email ? "error" : ""}`}
              {...register("email")}
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`form-input ${errors.password ? "error" : ""}`}
                style={{ paddingRight: "44px" }}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon style={{ width: "18px", height: "18px" }} />
                ) : (
                  <EyeIcon style={{ width: "18px", height: "18px" }} />
                )}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="btn-primary-admin"
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "8px",
              padding: "12px",
            }}
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                  className="animate-spin"
                />
                Masuk...
              </>
            ) : (
              "Masuk ke Dashboard"
            )}
          </button>
        </form>

        {/* Footer */}
        <p
          style={{
            fontSize: "0.75rem",
            color: "#94a3b8",
            textAlign: "center",
            marginTop: "20px",
            marginBottom: 0,
          }}
        >
          {isDemoMode
            ? "⚠️ Mode demo aktif. Data tidak tersimpan ke database."
            : "Hanya akun administrator yang dapat login. Dilindungi enkripsi JWT."}
        </p>
      </div>
    </div>
  );
}
