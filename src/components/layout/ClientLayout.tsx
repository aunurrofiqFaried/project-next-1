// app/ClientLayout.tsx (client component)
"use client";

import { usePathname } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Path yang pakai layout
  const useLayoutPaths = [
    "/dashboard",
    "/dashboard/siswa",
    "/dashboard/kelas",
    "/dashboard/pelanggaran",
  ];

  // Path tanpa layout
  const noLayoutPaths = [
    "/auth/login",
    "/auth/register",
    "/404",
    "/not-found",
    "/",
  ];

  if (noLayoutPaths.includes(pathname)) {
    return <>{children}</>;
  }

  const useAppLayout = useLayoutPaths.some((p) => pathname.startsWith(p));

  if (useAppLayout) {
    return <AppLayout>{children}</AppLayout>;
  }

  // fallback jika path lain
  return <>{children}</>;
}
