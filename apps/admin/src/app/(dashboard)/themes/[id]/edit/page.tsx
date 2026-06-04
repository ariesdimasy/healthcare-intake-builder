"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import ThemeForm from "@/components/forms/ThemeForm";
import { useTheme, useUpdateTheme } from "@/hooks/useThemes";

export default function EditThemePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: theme, isLoading } = useTheme(id);
  const { mutateAsync: updateTheme, isPending } = useUpdateTheme();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      await updateTheme({ id, data });
      toast.success("Theme berhasil diperbarui!");
      router.push(`/themes/${id}`);
    } catch {
      toast.error("Gagal memperbarui theme.");
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "700px" }}>
          {[1, 2, 3, 4].map((i) => (
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
        <div className="breadcrumb-item"><Link href="/themes">Themes</Link></div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item"><Link href={`/themes/${id}`}>{theme?.name}</Link></div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item current">Edit</div>
      </div>

      <div className="page-header">
        <h1 className="page-title">Edit Theme</h1>
        <p className="page-subtitle">Perbarui nama dan palet warna theme <strong>{theme?.name}</strong>.</p>
      </div>

      <div className="card-admin" style={{ maxWidth: "700px", padding: "32px" }}>
        <ThemeForm
          mode="edit"
          defaultValues={theme}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push(`/themes/${id}`)}
        />
      </div>
    </div>
  );
}
