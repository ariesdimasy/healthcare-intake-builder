"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  GlobeAltIcon,
  PuzzlePieceIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useFormResponse, useDeleteFormResponse } from "@/hooks/useFormResponses";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import JsonViewer from "@/components/ui/JsonViewer";

export default function FormResponseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: response, isLoading } = useFormResponse(id);
  const deleteResponse = useDeleteFormResponse();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteResponse.mutateAsync(id);
      toast.success("Form response berhasil dihapus.");
      router.push("/form-responses");
    } catch {
      toast.error("Gagal menghapus form response.");
    }
  };

  const handleCopyJson = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response.response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                height: "20px",
                borderRadius: "6px",
                width: `${50 + i * 12}%`,
              }}
            />
          ))}
          <div className="skeleton" style={{ height: "200px", borderRadius: "12px", marginTop: "16px" }} />
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Form response tidak ditemukan.</p>
          <Link href="/form-responses" className="btn-primary-admin">
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const meta = [
    {
      icon: UserCircleIcon,
      label: "Pasien",
      value: response.patient?.name ?? "Unknown",
      sub: response.patient?.email,
    },
    {
      icon: GlobeAltIcon,
      label: "Website",
      value: response.website?.name ?? "—",
    },
    {
      icon: PuzzlePieceIcon,
      label: "Form Component",
      value: response.component?.name ?? "—",
      sub: response.component?.type,
      mono: true,
    },
    {
      icon: CalendarIcon,
      label: "Tanggal Submit",
      value: new Date(response.created_at).toLocaleDateString("id-ID", {
        dateStyle: "full",
      }),
      sub: new Date(response.created_at).toLocaleTimeString("id-ID"),
    },
  ];

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-item">
          <Link href="/form-responses">Form Responses</Link>
        </span>
        <span>›</span>
        <span className="breadcrumb-item current">Detail Response</span>
      </div>

      {/* Header */}
      <div
        className="page-header"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Link href="/form-responses" className="btn-icon-admin" title="Kembali">
            <ArrowLeftIcon style={{ width: "16px", height: "16px" }} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(139,92,246,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClipboardDocumentListIcon
                style={{ width: "22px", height: "22px", color: "#8b5cf6" }}
              />
            </div>
            <div>
              <h1 className="page-title" style={{ fontSize: "1.4rem" }}>
                Form Response Detail
              </h1>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, fontFamily: "monospace" }}>
                ID: {response.id}
              </p>
            </div>
          </div>
        </div>
        <button
          id="response-detail-delete"
          className="btn-danger-admin"
          onClick={() => setDeleteOpen(true)}
        >
          <TrashIcon style={{ width: "15px", height: "15px" }} />
          Hapus Response
        </button>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* Left: Meta Info */}
        <div className="card-admin" style={{ padding: "24px" }}>
          <h2
            style={{
              fontSize: "0.8rem",
              fontWeight: "700",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 16px",
            }}
          >
            Informasi Respons
          </h2>
          {meta.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                gap: "12px",
                padding: "12px 0",
                borderBottom: "1px solid var(--border-base)",
                alignItems: "flex-start",
              }}
            >
              <item.icon
                style={{
                  width: "17px",
                  height: "17px",
                  color: "var(--text-muted)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginBottom: "2px",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-primary)",
                    fontWeight: "600",
                    fontFamily: item.mono ? "monospace" : undefined,
                  }}
                >
                  {item.value}
                </div>
                {item.sub && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: "1px",
                      fontFamily: item.mono ? "monospace" : undefined,
                    }}
                  >
                    {item.sub}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: JSON Response */}
        <div className="card-admin" style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "0.8rem",
                fontWeight: "700",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: 0,
              }}
            >
              Data Respons (JSON)
            </h2>
            <button
              id="response-copy-json"
              onClick={handleCopyJson}
              className="btn-secondary-admin"
              style={{ padding: "6px 12px", fontSize: "0.8rem" }}
            >
              {copied ? (
                <>
                  <CheckIcon style={{ width: "14px", height: "14px", color: "#10b981" }} />
                  <span style={{ color: "#10b981" }}>Tersalin!</span>
                </>
              ) : (
                <>
                  <DocumentDuplicateIcon style={{ width: "14px", height: "14px" }} />
                  Salin JSON
                </>
              )}
            </button>
          </div>
          <JsonViewer data={response.response} />
        </div>
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Form Response?"
        message={`Apakah Anda yakin ingin menghapus respons form ini dari pasien "${response.patient?.name ?? "Unknown"}"? Data tidak dapat dipulihkan.`}
        confirmLabel="Hapus Response"
        isLoading={deleteResponse.isPending}
      />
    </div>
  );
}
