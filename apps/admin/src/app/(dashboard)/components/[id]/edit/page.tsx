"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import ComponentForm from "@/components/forms/ComponentForm";
import { useComponent, useUpdateComponent } from "@/hooks/useComponents";

export default function EditComponentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: component, isLoading } = useComponent(id);
  const { mutateAsync: updateComponent, isPending } = useUpdateComponent();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      await updateComponent({ id, data });
      toast.success("Component berhasil diperbarui!");
      router.push(`/components/${id}`);
    } catch {
      toast.error("Gagal memperbarui component.");
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
        <div className="breadcrumb-item"><Link href="/components">Components</Link></div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item"><Link href={`/components/${id}`}>{component?.name}</Link></div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item current">Edit</div>
      </div>

      <div className="page-header">
        <h1 className="page-title">Edit Component</h1>
        <p className="page-subtitle">Perbarui detail component <strong>{component?.name}</strong>.</p>
      </div>

      <div className="card-admin" style={{ maxWidth: "640px", padding: "32px" }}>
        <ComponentForm
          mode="edit"
          defaultValues={component}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push(`/components/${id}`)}
        />
      </div>
    </div>
  );
}
