"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import ThemeForm from "@/components/forms/ThemeForm";
import { useCreateTheme } from "@/hooks/useThemes";

export default function CreateThemePage() {
  const router = useRouter();
  const { mutateAsync: createTheme, isPending } = useCreateTheme();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      await createTheme(data);
      toast.success("Theme berhasil dibuat!");
      router.push("/themes");
    } catch {
      toast.error("Gagal membuat theme. Coba lagi.");
    }
  };

  return (
    <div className="page-container">
      <div className="breadcrumb" style={{ marginBottom: "20px" }}>
        <div className="breadcrumb-item"><Link href="/dashboard"><HomeIcon style={{ width: "14px", height: "14px" }} /></Link></div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item"><Link href="/themes">Themes</Link></div>
        <ChevronRightIcon style={{ width: "14px", height: "14px" }} />
        <div className="breadcrumb-item current">Buat Theme</div>
      </div>

      <div className="page-header">
        <h1 className="page-title">Buat Theme Baru</h1>
        <p className="page-subtitle">Definisikan palet warna dan nama theme untuk website builder.</p>
      </div>

      <div className="card-admin" style={{ maxWidth: "700px", padding: "32px" }}>
        <ThemeForm
          mode="create"
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push("/themes")}
        />
      </div>
    </div>
  );
}
