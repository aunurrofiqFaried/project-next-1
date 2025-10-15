"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Kalau tidak ada token → redirect ke /login
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
