"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useClient, useUpdateClient, useDeleteClient } from "@/hooks/useClients";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ClientForm from "@/components/forms/ClientForm";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: client, isLoading } = useClient(id);
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleUpdate = async (formData: unknown) => {
    const d = formData as { name: string; email: string; is_active: boolean };
    try {
      await updateClient.mutateAsync({ id, data: d });
      toast.success("Data client berhasil diperbarui!");
      setEditOpen(false);
    } catch {
      toast.error("Gagal memperbarui client.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient.mutateAsync(id);
      toast.success("Client berhasil dihapus.");
      router.push("/clients");
    } catch {
      toast.error("Gagal menghapus client.");
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="skeleton" style={{ height: "32px", width: "200px", borderRadius: "8px" }} />
          <div className="card-admin" style={{ padding: "32px" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "20px", marginBottom: "16px", borderRadius: "6px", width: i % 2 === 0 ? "70%" : "50%" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Client tidak ditemukan.</p>
          <Link href="/clients" className="btn-primary-admin">Kembali ke Daftar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-item"><Link href="/clients">Clients</Link></span>
        <span>›</span>
        <span className="breadcrumb-item current">{client.name}</span>
      </div>

      {/* Header */}
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Link href="/clients" className="btn-icon-admin" title="Kembali">
            <ArrowLeftIcon style={{ width: "16px", height: "16px" }} />
          </Link>
          <div>
            <h1 className="page-title">{client.name}</h1>
            <span className={`badge-status ${client.is_active ? "badge-active" : "badge-inactive"}`}>
              {client.is_active ? "Aktif" : "Nonaktif"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button id="client-detail-edit" className="btn-secondary-admin" onClick={() => setEditOpen(true)}>
            <PencilSquareIcon style={{ width: "15px", height: "15px" }} /> Edit
          </button>
          <button id="client-detail-delete" className="btn-danger-admin" onClick={() => setDeleteOpen(true)}>
            <TrashIcon style={{ width: "15px", height: "15px" }} /> Hapus
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="card-admin" style={{ padding: "28px", maxWidth: "600px" }}>
        <h2 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 20px" }}>
          Informasi Client
        </h2>
        {[
          { icon: UserCircleIcon, label: "Nama Lengkap", value: client.name },
          { icon: EnvelopeIcon, label: "Email", value: client.email },
          { icon: ShieldCheckIcon, label: "Role", value: client.role },
          {
            icon: CalendarIcon,
            label: "Dibuat",
            value: new Date(client.created_at).toLocaleDateString("id-ID", { dateStyle: "full" }),
          },
          {
            icon: CalendarIcon,
            label: "Terakhir Diperbarui",
            value: new Date(client.updated_at).toLocaleDateString("id-ID", { dateStyle: "full" }),
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              gap: "14px",
              padding: "14px 0",
              borderBottom: "1px solid var(--border-base)",
              alignItems: "flex-start",
            }}
          >
            <item.icon style={{ width: "18px", height: "18px", color: "var(--text-muted)", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>
                {item.label}
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 500 }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Client">
        <ClientForm
          mode="edit"
          defaultValues={client}
          onSubmit={handleUpdate}
          isLoading={updateClient.isPending}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Client?"
        message={`Apakah Anda yakin ingin menghapus client "${client.name}"? Semua data terkait juga akan terhapus.`}
        confirmLabel="Hapus Client"
        isLoading={deleteClient.isPending}
      />
    </div>
  );
}
