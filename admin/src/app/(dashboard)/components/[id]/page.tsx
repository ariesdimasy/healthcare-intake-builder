"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  PuzzlePieceIcon,
  TagIcon,
  ListBulletIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useComponent, useUpdateComponent, useDeleteComponent } from "@/hooks/useComponents";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ComponentForm from "@/components/forms/ComponentForm";

export default function ComponentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: component, isLoading } = useComponent(id);
  const updateComponent = useUpdateComponent();
  const deleteComponent = useDeleteComponent();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleUpdate = async (formData: unknown) => {
    const d = formData as { name: string; type: string; description: string; position: number };
    try {
      await updateComponent.mutateAsync({ id, data: d });
      toast.success("Component berhasil diperbarui!");
      setEditOpen(false);
    } catch {
      toast.error("Gagal memperbarui component.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComponent.mutateAsync(id);
      toast.success("Component berhasil dihapus.");
      router.push("/components");
    } catch {
      toast.error("Gagal menghapus component.");
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

  if (!component) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Component tidak ditemukan.</p>
          <Link href="/components" className="btn-primary-admin">Kembali ke Daftar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <span className="breadcrumb-item"><Link href="/components">Components</Link></span>
        <span>›</span>
        <span className="breadcrumb-item current">{component.name}</span>
      </div>

      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Link href="/components" className="btn-icon-admin">
            <ArrowLeftIcon style={{ width: "16px", height: "16px" }} />
          </Link>
          <div>
            <h1 className="page-title">{component.name}</h1>
            <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#0ea5e9", background: "rgba(14,165,233,0.1)", padding: "2px 10px", borderRadius: "999px" }}>
              {component.type}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button id="comp-detail-edit" className="btn-secondary-admin" onClick={() => setEditOpen(true)}>
            <PencilSquareIcon style={{ width: "15px", height: "15px" }} /> Edit
          </button>
          <button id="comp-detail-delete" className="btn-danger-admin" onClick={() => setDeleteOpen(true)}>
            <TrashIcon style={{ width: "15px", height: "15px" }} /> Hapus
          </button>
        </div>
      </div>

      <div className="card-admin" style={{ padding: "28px", maxWidth: "600px" }}>
        <h2 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 20px" }}>
          Informasi Component
        </h2>
        {[
          { icon: PuzzlePieceIcon, label: "Nama", value: component.name },
          { icon: TagIcon, label: "Tipe", value: component.type, mono: true },
          { icon: ListBulletIcon, label: "Posisi", value: `#${component.position}` },
          { icon: DocumentTextIcon, label: "Deskripsi", value: component.description },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", gap: "14px", padding: "14px 0", borderBottom: "1px solid var(--border-base)" }}>
            <item.icon style={{ width: "18px", height: "18px", color: "var(--text-muted)", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>{item.label}</div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 500, fontFamily: item.mono ? "monospace" : undefined }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Component" maxWidth="580px">
        <ComponentForm mode="edit" defaultValues={component} onSubmit={handleUpdate} isLoading={updateComponent.isPending} onCancel={() => setEditOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Component?"
        message={`Apakah Anda yakin ingin menghapus component "${component.name}"?`}
        confirmLabel="Hapus Component"
        isLoading={deleteComponent.isPending}
      />
    </div>
  );
}
