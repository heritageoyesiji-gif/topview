"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Prefetcher() {
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/marketing");
    router.prefetch("/talent");
  }, [router]);
  return null;
}
