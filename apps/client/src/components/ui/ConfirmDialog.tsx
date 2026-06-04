"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Hapus",
  isLoading,
  variant = "danger",
}: ConfirmDialogProps) {
  const colors = {
    danger: { bg: "rgba(239,68,68,0.08)", icon: "#ef4444", btn: "#ef4444", btnHover: "#dc2626" },
    warning: { bg: "rgba(245,158,11,0.08)", icon: "#f59e0b", btn: "#f59e0b", btnHover: "#d97706" },
  };
  const c = colors[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="420px"
      footer={
        <>
          <button className="btn-secondary-admin" onClick={onClose} disabled={isLoading}>
            Batal
          </button>
          <button
            id="confirm-dialog-confirm"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 18px",
              background: isLoading ? "#fca5a5" : c.btn,
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading && (
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                }}
                className="animate-spin"
              />
            )}
            {isLoading ? "Memproses..." : confirmLabel}
          </button>
        </>
      }
    >
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: c.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <ExclamationTriangleIcon style={{ width: "28px", height: "28px", color: c.icon }} />
        </div>
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: "700",
            color: "var(--text-primary)",
            margin: "0 0 8px",
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
          {message}
        </p>
      </div>
    </Modal>
  );
}
