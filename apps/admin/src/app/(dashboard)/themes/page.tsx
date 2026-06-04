"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { useThemes, useCreateTheme, useDeleteTheme } from "@/hooks/useThemes";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ThemeForm from "@/components/forms/ThemeForm";
import type { Theme } from "@/types";

function ColorDots({ colors }: { colors: Theme["colors"] }) {
  const swatches = [colors.primary, colors.secondary, colors.accent, colors.background, colors.text];
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {swatches.map((c, i) => (
        <div
          key={i}
          title={c}
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "4px",
            background: c,
            border: "1.5px solid rgba(0,0,0,0.08)",
          }}
        />
      ))}
    </div>
  );
}

export default function ThemesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Theme | null>(null);

  const { data, isLoading } = useThemes({ page, per_page: 10, search });
  const createTheme = useCreateTheme();
  const deleteTheme = useDeleteTheme();

  const handleCreate = async (formData: unknown) => {
    const d = formData as { name: string; colors: Theme["colors"] };
    try {
      await createTheme.mutateAsync(d);
      toast.success("Theme berhasil dibuat!");
      setCreateOpen(false);
    } catch {
      toast.error("Gagal membuat theme.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTheme.mutateAsync(deleteTarget.id);
      toast.success(`Theme "${deleteTarget.name}" berhasil dihapus.`);
      setDeleteTarget(null);
    } catch {
      toast.error("Gagal menghapus theme.");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Nama Theme",
      render: (row: Theme) => (
        <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{row.name}</span>
      ),
    },
    {
      key: "colors",
      label: "Palet Warna",
      render: (row: Theme) => <ColorDots colors={row.colors} />,
    },
    {
      key: "colors.primary",
      label: "Warna Primer",
      render: (row: Theme) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div className="color-swatch" style={{ background: row.colors.primary }} />
          <span style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "var(--text-secondary)" }}>
            {row.colors.primary}
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Dibuat",
      render: (row: Theme) =>
        new Date(row.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
      key: "actions",
      label: "Aksi",
      width: "140px",
      render: (row: Theme) => (
        <div style={{ display: "flex", gap: "6px" }}>
          <Link href={`/themes/${row.id}`}>
            <button id={`theme-view-${row.id}`} className="btn-icon-admin" type="button" title="Detail">
              <EyeIcon style={{ width: "15px", height: "15px" }} />
            </button>
          </Link>
          <Link href={`/themes/${row.id}/edit`}>
            <button id={`theme-edit-${row.id}`} className="btn-icon-admin" type="button" title="Edit">
              <PencilSquareIcon style={{ width: "15px", height: "15px" }} />
            </button>
          </Link>
          <button
            id={`theme-delete-${row.id}`}
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
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(6,182,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <SwatchIcon style={{ width: "24px", height: "24px", color: "#06b6d4" }} />
          </div>
          <div>
            <h1 className="page-title">Theme Management</h1>
            <p className="page-subtitle">Kelola tema visual website yang tersedia untuk client</p>
          </div>
        </div>
        <button id="create-theme-btn" type="button" className="btn-primary-admin" onClick={() => setCreateOpen(true)}>
          <PlusIcon style={{ width: "16px", height: "16px" }} />
          Tambah Theme
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        searchPlaceholder="Cari theme..."
        searchValue={search}
        onSearchChange={(q) => { setSearch(q); setPage(1); }}
        total={data?.total ?? 0}
        page={page}
        perPage={10}
        onPageChange={setPage}
        emptyMessage="Belum ada theme. Buat theme pertama."
      />

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Buat Theme Baru" maxWidth="620px">
        <ThemeForm mode="create" onSubmit={handleCreate} isLoading={createTheme.isPending} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Theme?"
        message={`Apakah Anda yakin ingin menghapus theme "${deleteTarget?.name}"?`}
        confirmLabel="Hapus Theme"
        isLoading={deleteTheme.isPending}
      />
    </div>
  );
}
