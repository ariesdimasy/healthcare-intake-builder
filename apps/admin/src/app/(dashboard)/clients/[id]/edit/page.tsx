"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import ClientForm from "@/components/forms/ClientForm";
import { useClient, useUpdateClient } from "@/hooks/useClients";

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: client, isLoading } = useClient(id);
  const { mutateAsync: updateClient, isPending } = useUpdateClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      await updateClient({ id, data });
      toast.success("Client berhasil diperbarui!");
      router.push(`/clients/${id}`);
    } catch {
      toast.error("Gagal memperbarui client.");
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "640px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: "52px", borderRadius: "8px" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="breadcrumb" style={{ marginBottom: "20px" }}>
        <div className="breadcrumb-item"><Link href="/dashboard"><HomeIcon style={{ width: "14px", height: "14px" }} /></Link></div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item"><Link href="/clients">Clients</Link></div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item"><Link href={`/clients/${id}`}>{client?.name}</Link></div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item current">Edit</div>
      </div>

      <div className="page-header">
        <h1 className="page-title">Edit Client</h1>
        <p className="page-subtitle">Perbarui informasi akun client <strong>{client?.name}</strong>.</p>
      </div>

      <div className="card-admin" style={{ maxWidth: "640px", padding: "32px" }}>
        <ClientForm
          mode="edit"
          defaultValues={client}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push(`/clients/${id}`)}
        />
      </div>
    </div>
  );
}
