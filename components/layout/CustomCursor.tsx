"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let introduced = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!introduced) {
        introduced = true;
        gsap.set([dot, ring], { x: mouseX, y: mouseY });
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1 });
      gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.4, ease: "power2.out" });
    };

    // Event delegation — catches all links/buttons including ones added after mount
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest("a, button, [role='button']")) {
        gsap.to(ring, { scale: 2, opacity: 0.5, duration: 0.3 });
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest("a, button, [role='button']")) {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ opacity: 0 }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white/60 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ opacity: 0 }}
      />
    </>
  );
}
