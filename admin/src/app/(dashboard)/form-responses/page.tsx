"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  TrashIcon,
  EyeIcon,
  ClipboardDocumentListIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { useFormResponses, useDeleteFormResponse } from "@/hooks/useFormResponses";
import DataTable from "@/components/ui/DataTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { FormResponse } from "@/types";

function getInitialsBg(name: string) {
  const colors = ["#2563eb", "#0ea5e9", "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function FormResponsesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [websiteFilter, setWebsiteFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<FormResponse | null>(null);

  const { data, isLoading } = useFormResponses({
    page,
    per_page: 10,
    search,
    website_id: websiteFilter || undefined,
  });
  const deleteResponse = useDeleteFormResponse();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteResponse.mutateAsync(deleteTarget.id);
      toast.success("Form response berhasil dihapus.");
      setDeleteTarget(null);
    } catch {
      toast.error("Gagal menghapus form response.");
    }
  };

  const columns = [
    {
      key: "patient",
      label: "Pasien",
      render: (row: FormResponse) => {
        const name = row.patient?.name ?? "Unknown";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              className="avatar-initials"
              style={{ background: getInitialsBg(name), fontSize: "0.7rem" }}
            >
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {row.patient?.email ?? "—"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "component",
      label: "Form Component",
      render: (row: FormResponse) => (
        <div>
          <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>
            {row.component?.name ?? "—"}
          </div>
          {row.component?.type && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.7rem",
                color: "#0ea5e9",
                background: "rgba(14,165,233,0.08)",
                padding: "1px 7px",
                borderRadius: "999px",
              }}
            >
              {row.component.type}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "website",
      label: "Website",
      render: (row: FormResponse) => (
        <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          {row.website?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Tanggal Submit",
      render: (row: FormResponse) =>
        new Date(row.created_at).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "actions",
      label: "Aksi",
      width: "100px",
      render: (row: FormResponse) => (
        <div style={{ display: "flex", gap: "6px" }}>
          <Link href={`/form-responses/${row.id}`}>
            <button
              id={`response-view-${row.id}`}
              className="btn-icon-admin"
              type="button"
              title="Lihat Detail"
            >
              <EyeIcon style={{ width: "15px", height: "15px" }} />
            </button>
          </Link>
          <button
            id={`response-delete-${row.id}`}
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
      <div
        className="page-header"
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(139,92,246,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ClipboardDocumentListIcon
              style={{ width: "24px", height: "24px", color: "#8b5cf6" }}
            />
          </div>
          <div>
            <h1 className="page-title">Form Response Management</h1>
            <p className="page-subtitle">
              Lihat dan kelola semua respons form yang disubmit oleh pasien
            </p>
          </div>
        </div>

        {/* Website Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FunnelIcon
            style={{ width: "16px", height: "16px", color: "var(--text-muted)" }}
          />
          <input
            id="form-response-website-filter"
            type="text"
            placeholder="Filter by Website ID"
            value={websiteFilter}
            onChange={(e) => {
              setWebsiteFilter(e.target.value);
              setPage(1);
            }}
            className="form-input"
            style={{ width: "200px", padding: "8px 12px" }}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        searchPlaceholder="Cari berdasarkan pasien atau website..."
        searchValue={search}
        onSearchChange={(q) => {
          setSearch(q);
          setPage(1);
        }}
        total={data?.total ?? 0}
        page={page}
        perPage={10}
        onPageChange={setPage}
        emptyMessage="Belum ada form response yang masuk."
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Form Response?"
        message={`Apakah Anda yakin ingin menghapus respons dari pasien "${deleteTarget?.patient?.name ?? "ini"}"? Data tidak dapat dipulihkan.`}
        confirmLabel="Hapus Response"
        isLoading={deleteResponse.isPending}
      />
    </div>
  );
}
