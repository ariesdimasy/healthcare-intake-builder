"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import { useComponents, useCreateComponent, useDeleteComponent } from "@/hooks/useComponents";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ComponentForm from "@/components/forms/ComponentForm";
import type { Component } from "@/types";

const TYPE_COLORS: Record<string, string> = {
  patient_form: "#2563eb",
  intake_form: "#0ea5e9",
  consent_form: "#06b6d4",
  vital_sign_form: "#10b981",
  referral_form: "#8b5cf6",
  history_form: "#f59e0b",
};

function getTypeColor(type: string): string {
  return TYPE_COLORS[type] || "#64748b";
}

export default function ComponentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Component | null>(null);

  const { data, isLoading } = useComponents({ page, per_page: 10, search });
  const createComponent = useCreateComponent();
  const deleteComponent = useDeleteComponent();

  const handleCreate = async (formData: unknown) => {
    const d = formData as { name: string; type: string; description: string; position: number };
    try {
      await createComponent.mutateAsync(d);
      toast.success("Component berhasil dibuat!");
      setCreateOpen(false);
    } catch {
      toast.error("Gagal membuat component.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteComponent.mutateAsync(deleteTarget.id);
      toast.success(`Component "${deleteTarget.name}" berhasil dihapus.`);
      setDeleteTarget(null);
    } catch {
      toast.error("Gagal menghapus component.");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Component",
      render: (row: Component) => (
        <div>
          <div style={{ fontWeight: "600", color: "var(--text-primary)", marginBottom: "2px" }}>{row.name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{row.type}</div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Tipe",
      render: (row: Component) => (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px 10px",
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: "600",
            background: `${getTypeColor(row.type)}15`,
            color: getTypeColor(row.type),
            fontFamily: "monospace",
          }}
        >
          {row.type.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "position",
      label: "Posisi",
      render: (row: Component) => (
        <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--text-secondary)" }}>
          #{row.position}
        </span>
      ),
    },
    {
      key: "description",
      label: "Deskripsi",
      render: (row: Component) => (
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {row.description}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      width: "140px",
      render: (row: Component) => (
        <div style={{ display: "flex", gap: "6px" }}>
          <Link href={`/components/${row.id}`}>
            <button id={`comp-view-${row.id}`} className="btn-icon-admin" type="button" title="Detail">
              <EyeIcon style={{ width: "15px", height: "15px" }} />
            </button>
          </Link>
          <Link href={`/components/${row.id}/edit`}>
            <button id={`comp-edit-${row.id}`} className="btn-icon-admin" type="button" title="Edit">
              <PencilSquareIcon style={{ width: "15px", height: "15px" }} />
            </button>
          </Link>
          <button
            id={`comp-delete-${row.id}`}
            className="btn-icon-admin danger"
            type="button"
            title="Hapus"
            onClick={() => setDeleteTarget(row)}
          >
            <TrashIcon style={{ width: "15px", height: "15px" }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(14,165,233,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <PuzzlePieceIcon style={{ width: "24px", height: "24px", color: "#0ea5e9" }} />
          </div>
          <div>
            <h1 className="page-title">Component Management</h1>
            <p className="page-subtitle">Kelola komponen form yang tersedia di platform</p>
          </div>
        </div>
        <button id="create-component-btn" type="button" className="btn-primary-admin" onClick={() => setCreateOpen(true)}>
          <PlusIcon style={{ width: "16px", height: "16px" }} />
          Tambah Component
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        searchPlaceholder="Cari component..."
        searchValue={search}
        onSearchChange={(q) => { setSearch(q); setPage(1); }}
        total={data?.total ?? 0}
        page={page}
        perPage={10}
        onPageChange={setPage}
        emptyMessage="Belum ada component. Tambahkan component pertama."
      />

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Tambah Component Baru" maxWidth="580px">
        <ComponentForm
          mode="create"
          onSubmit={handleCreate}
          isLoading={createComponent.isPending}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Component?"
        message={`Apakah Anda yakin ingin menghapus component "${deleteTarget?.name}"?`}
        confirmLabel="Hapus Component"
        isLoading={deleteComponent.isPending}
      />
    </div>
  );
}
