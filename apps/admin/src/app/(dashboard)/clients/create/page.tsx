"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import ClientForm from "@/components/forms/ClientForm";
import { useCreateClient } from "@/hooks/useClients";
import type { CreateClientPayload } from "@/types";

export default function CreateClientPage() {
  const router = useRouter();
  const { mutateAsync: createClient, isPending } = useCreateClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      await createClient(data);
      toast.success("Client berhasil dibuat!");
      router.push("/clients");
    } catch {
      toast.error("Gagal membuat client. Coba lagi.");
    }
  };

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: "20px" }}>
        <div className="breadcrumb-item">
          <Link href="/dashboard"><HomeIcon style={{ width: "14px", height: "14px" }} /></Link>
        </div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item">
          <Link href="/clients">Clients</Link>
        </div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item current">Tambah Client</div>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Tambah Client Baru</h1>
        <p className="page-subtitle">Daftarkan akun client baru untuk mengakses Healthcare Intake Builder.</p>
      </div>

      {/* Form Card */}
      <div className="card-admin" style={{ maxWidth: "640px", padding: "32px" }}>
        <ClientForm
          mode="create"
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push("/clients")}
        />
      </div>
    </div>
  );
}
