"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useClients, useCreateClient, useDeleteClient } from "@/hooks/useClients";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ClientForm from "@/components/forms/ClientForm";
import type { Client } from "@/types";

function getInitialsBg(name: string) {
  const colors = ["#2563eb", "#0ea5e9", "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function ClientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  const { data, isLoading } = useClients({ page, per_page: 10, search });
  const createClient = useCreateClient();
  const deleteClient = useDeleteClient();

  const handleCreate = async (formData: unknown) => {
    const d = formData as { name: string; email: string; password: string };
    try {
      await createClient.mutateAsync(d);
      toast.success("Client berhasil dibuat!");
      setCreateOpen(false);
    } catch {
      toast.error("Gagal membuat client. Coba lagi.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteClient.mutateAsync(deleteTarget.id);
      toast.success(`Client "${deleteTarget.name}" berhasil dihapus.`);
      setDeleteTarget(null);
    } catch {
      toast.error("Gagal menghapus client. Coba lagi.");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Client",
      render: (row: Client) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            className="avatar-initials"
            style={{ background: getInitialsBg(row.name) }}
          >
            {row.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{row.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row: Client) => (
        <span className={`badge-status ${row.is_active ? "badge-active" : "badge-inactive"}`}>
          {row.is_active ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Dibuat",
      render: (row: Client) =>
        new Date(row.created_at).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "actions",
      label: "Aksi",
      width: "140px",
      render: (row: Client) => (
        <div style={{ display: "flex", gap: "6px" }}>
          <Link href={`/clients/${row.id}`} title="Lihat Detail">
            <button id={`client-view-${row.id}`} className="btn-icon-admin" type="button">
              <EyeIcon style={{ width: "15px", height: "15px" }} />
            </button>
          </Link>
          <Link href={`/clients/${row.id}/edit`} title="Edit">
            <button id={`client-edit-${row.id}`} className="btn-icon-admin" type="button">
              <PencilSquareIcon style={{ width: "15px", height: "15px" }} />
            </button>
          </Link>
          <button
            id={`client-delete-${row.id}`}
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
      {/* Header */}
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <UsersIcon style={{ width: "24px", height: "24px", color: "#2563eb" }} />
          </div>
          <div>
            <h1 className="page-title">Client Management</h1>
            <p className="page-subtitle">Kelola akun-akun client yang menggunakan platform</p>
          </div>
        </div>
        <button
          id="create-client-btn"
          type="button"
          className="btn-primary-admin"
          onClick={() => setCreateOpen(true)}
        >
          <PlusIcon style={{ width: "16px", height: "16px" }} />
          Tambah Client
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        searchPlaceholder="Cari client berdasarkan nama atau email..."
        searchValue={search}
        onSearchChange={(q) => { setSearch(q); setPage(1); }}
        total={data?.total ?? 0}
        page={page}
        perPage={10}
        onPageChange={setPage}
        emptyMessage="Belum ada client. Buat client pertama Anda."
      />

      {/* Create Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tambah Client Baru"
      >
        <ClientForm
          mode="create"
          onSubmit={handleCreate}
          isLoading={createClient.isPending}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Client?"
        message={`Apakah Anda yakin ingin menghapus client "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Client"
        isLoading={deleteClient.isPending}
      />
    </div>
  );
}
