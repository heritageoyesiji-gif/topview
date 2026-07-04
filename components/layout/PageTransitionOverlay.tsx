"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageTransitionOverlay() {
  const pathname = usePathname();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const el = document.getElementById("pg-overlay") as HTMLElement | null;
    if (!el) return;

    // New page loaded — slide overlay out to the left
    el.style.transition = "transform 0.28s cubic-bezier(0.76, 0, 0.24, 1)";
    el.style.transform = "translateX(-100%)";

    const t = setTimeout(() => {
      el.style.transition = "none";
      el.style.transform = "translateX(100%)";
    }, 300);

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
