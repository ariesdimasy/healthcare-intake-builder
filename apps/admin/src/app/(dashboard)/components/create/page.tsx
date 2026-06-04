"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import ComponentForm from "@/components/forms/ComponentForm";
import { useCreateComponent } from "@/hooks/useComponents";

export default function CreateComponentPage() {
  const router = useRouter();
  const { mutateAsync: createComponent, isPending } = useCreateComponent();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      await createComponent(data);
      toast.success("Component berhasil dibuat!");
      router.push("/components");
    } catch {
      toast.error("Gagal membuat component. Coba lagi.");
    }
  };

  return (
    <div className="page-container">
      <div className="breadcrumb" style={{ marginBottom: "20px" }}>
        <div className="breadcrumb-item"><Link href="/dashboard"><HomeIcon style={{ width: "14px", height: "14px" }} /></Link></div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item"><Link href="/components">Components</Link></div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item current">Tambah Component</div>
      </div>

      <div className="page-header">
        <h1 className="page-title">Tambah Component Baru</h1>
        <p className="page-subtitle">Buat form component baru yang dapat digunakan di website builder.</p>
      </div>

      <div className="card-admin" style={{ maxWidth: "640px", padding: "32px" }}>
        <ComponentForm
          mode="create"
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push("/components")}
        />
      </div>
    </div>
  );
}
