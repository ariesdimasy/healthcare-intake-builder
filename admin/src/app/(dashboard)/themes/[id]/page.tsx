"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeftIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTheme, useUpdateTheme, useDeleteTheme } from "@/hooks/useThemes";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ThemeForm from "@/components/forms/ThemeForm";
import type { Theme } from "@/types";

const COLOR_LABELS: Array<{ key: keyof Theme["colors"]; label: string }> = [
  { key: "primary", label: "Warna Primer" },
  { key: "secondary", label: "Warna Sekunder" },
  { key: "accent", label: "Warna Aksen" },
  { key: "background", label: "Background" },
  { key: "text", label: "Warna Teks" },
];

export default function ThemeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: theme, isLoading } = useTheme(id);
  const updateTheme = useUpdateTheme();
  const deleteTheme = useDeleteTheme();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleUpdate = async (formData: unknown) => {
    const d = formData as { name: string; colors: Theme["colors"] };
    try {
      await updateTheme.mutateAsync({ id, data: d });
      toast.success("Theme berhasil diperbarui!");
      setEditOpen(false);
    } catch {
      toast.error("Gagal memperbarui theme.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTheme.mutateAsync(id);
      toast.success("Theme berhasil dihapus.");
      router.push("/themes");
    } catch {
      toast.error("Gagal menghapus theme.");
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: "20px", marginBottom: "16px", borderRadius: "6px", width: `${60 + i * 8}%` }} />
        ))}
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Theme tidak ditemukan.</p>
          <Link href="/themes" className="btn-primary-admin">Kembali ke Daftar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <span className="breadcrumb-item"><Link href="/themes">Themes</Link></span>
        <span>›</span>
        <span className="breadcrumb-item current">{theme.name}</span>
      </div>

      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Link href="/themes" className="btn-icon-admin">
            <ArrowLeftIcon style={{ width: "16px", height: "16px" }} />
          </Link>
          <h1 className="page-title">{theme.name}</h1>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button id="theme-detail-edit" className="btn-secondary-admin" onClick={() => setEditOpen(true)}>
            <PencilSquareIcon style={{ width: "15px", height: "15px" }} /> Edit
          </button>
          <button id="theme-detail-delete" className="btn-danger-admin" onClick={() => setDeleteOpen(true)}>
            <TrashIcon style={{ width: "15px", height: "15px" }} /> Hapus
          </button>
        </div>
      </div>

      {/* Color Preview Banner */}
      <div
        style={{
          height: "80px",
          borderRadius: "12px",
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.accent})`,
          marginBottom: "20px",
          boxShadow: "var(--shadow-md)",
        }}
      />

      <div className="card-admin" style={{ padding: "28px", maxWidth: "600px" }}>
        <h2 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 20px" }}>
          Palet Warna
        </h2>
        {COLOR_LABELS.map((item) => (
          <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border-base)" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "var(--text-secondary)" }}>{item.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: theme.colors[item.key],
                  border: "2px solid rgba(0,0,0,0.08)",
                }}
              />
              <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: "600" }}>
                {theme.colors[item.key]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Theme" maxWidth="620px">
        <ThemeForm mode="edit" defaultValues={theme} onSubmit={handleUpdate} isLoading={updateTheme.isPending} onCancel={() => setEditOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Theme?"
        message={`Apakah Anda yakin ingin menghapus theme "${theme.name}"?`}
        confirmLabel="Hapus Theme"
        isLoading={deleteTheme.isPending}
      />
    </div>
  );
}
