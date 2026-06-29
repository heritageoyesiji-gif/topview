"use client";

import { useEffect } from "react";

export default function LiquidGLInit() {
  useEffect(() => {
    const init = () => {
      const lg = (window as any).liquidGL;
      if (!lg) return;
      try {
        lg({
          target: ".liquid-glass",
          snapshot: "body",
          resolution: 1.5,
          refraction: 0.014,
          bevelDepth: 0.05,
          bevelWidth: 0.08,
          frost: 1.2,
          shadow: false,
          specular: true,
          reveal: "fade",
          tilt: false,
        });
      } catch {
        // liquidGL.js not placed yet — drop it at /public/scripts/liquidGL.js
      }
    };

    // Wait until after the loading screen iris-wipe completes (~3.8s total)
    // so the snapshot captures the real hero content, not the loading overlay
    const timer = setTimeout(init, 4500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
