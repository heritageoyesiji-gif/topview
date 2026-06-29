"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import HeroCanvas from "@/components/talent/HeroCanvas";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const timer = setTimeout(() => {
      gsap.to(overlay, {
        "--mask-size": "160%",
        duration: 1.0,
        ease: "power2.inOut",
        onComplete,
      });
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-black overflow-hidden"
      style={{
        maskImage: "radial-gradient(circle at 50% 50%, transparent var(--mask-size, 0%), black var(--mask-size, 0%))",
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent var(--mask-size, 0%), black var(--mask-size, 0%))",
      }}
    >
      {/* Orb renders immediately — reveal: true so it starts fading in on mount */}
      <HeroCanvas loaded={true} />

      {/* Branding — sits below the orb */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 pointer-events-none z-10">
        <div className="flex flex-col items-center gap-5">
          <div className="liquid-glass px-7 py-2.5 rounded-full">
            <p className="text-white text-[13px] font-semibold uppercase tracking-[0.44em] opacity-90">
              TOPVIEW
            </p>
          </div>
          <div
            className="w-5 h-5 rounded-full border-[1.5px]"
            style={{
              borderColor: "rgba(255,255,255,0.15)",
              borderTopColor: "rgba(255,180,110,0.95)",
              animation: "tvspin 0.9s linear infinite",
            }}
          />
        </div>
      </div>

      <style>{`@keyframes tvspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
