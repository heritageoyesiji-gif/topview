"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HeroCanvasProps {
  loaded: boolean;
}

export default function HeroCanvas({ loaded }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<Record<string, any>>({});

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const OFF = 384;
    const s = stateRef.current;
    s.OFF = OFF;
    s.parallax = { x: 0, y: 0 };
    s.anim = { reveal: 0 };
    s.timers = [] as ReturnType<typeof setTimeout>[];
    s.raf = 0;

    // Arcsin lookup table — avoids Math.asin per pixel
    const buildAsin = () => {
      const N = 2048;
      const L = new Float32Array(N + 1);
      for (let i = 0; i <= N; i++) L[i] = Math.asin(-1 + (2 * i) / N);
      s.LUTN = N; s.ASIN = L;
    };
    const asinL = (x: number) => {
      let idx = ((x + 1) * 0.5 * s.LUTN) | 0;
      if (idx < 0) idx = 0; else if (idx > s.LUTN) idx = s.LUTN;
      return s.ASIN[idx];
    };

    // Seeded Perlin noise height field (256×256)
    const buildField = () => {
      const FS = 256;
      const p = new Uint8Array(512), perm = new Uint8Array(256);
      for (let i = 0; i < 256; i++) perm[i] = i;
      let seed = 1337 >>> 0;
      const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      for (let i = 255; i > 0; i--) {
        const j = (rnd() * (i + 1)) | 0;
        const t = perm[i]; perm[i] = perm[j]; perm[j] = t;
      }
      for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
      const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
      const grad = (h: number, x: number, y: number) => ((h & 1) ? -x : x) + ((h & 2) ? -y : y);
      const lp = (a: number, b: number, t: number) => a + (b - a) * t;
      const noise = (x: number, y: number, per: number) => {
        const fx = Math.floor(x), fy = Math.floor(y);
        const X = fx & 255, Y = fy & 255;
        const xf = x - fx, yf = y - fy;
        const u = fade(xf), v = fade(yf);
        const X0 = X % per, X1 = (X + 1) % per, Y0 = Y % per, Y1 = (Y + 1) % per;
        const aa = p[p[X0] + Y0], ab = p[p[X0] + Y1], ba = p[p[X1] + Y0], bb = p[p[X1] + Y1];
        return lp(lp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
                  lp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u), v);
      };
      const field = new Float32Array(FS * FS);
      let mn = 1e9, mx = -1e9;
      for (let y = 0; y < FS; y++) {
        for (let x = 0; x < FS; x++) {
          let amp = 1, freq = 2, sum = 0, norm = 0;
          for (let o = 0; o < 5; o++) {
            sum += amp * noise((x / FS) * freq, (y / FS) * freq, freq);
            norm += amp; amp *= 0.5; freq *= 2;
          }
          const e = sum / norm; field[y * FS + x] = e;
          if (e < mn) mn = e; if (e > mx) mx = e;
        }
      }
      const inv = 1 / (mx - mn);
      for (let i = 0; i < field.length; i++) field[i] = (field[i] - mn) * inv;
      s.field = field; s.FS = FS;
    };

    // Static film grain texture (160×160 canvas, randomised per frame by translate)
    const buildGrain = () => {
      const g = document.createElement("canvas");
      g.width = g.height = 160;
      const gx = g.getContext("2d")!;
      const id = gx.createImageData(160, 160);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = n; d[i + 3] = 255;
      }
      gx.putImageData(id, 0, 0);
      s.grain = g;
    };

    buildAsin();
    buildField();
    buildGrain();

    const ctx = cv.getContext("2d")!;
    const oc = document.createElement("canvas");
    oc.width = oc.height = OFF;
    const octx = oc.getContext("2d")!;
    s.ctx = ctx;
    s.offcanvas = oc;
    s.octx = octx;
    s.img = octx.createImageData(OFF, OFF);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      s.W = cv.width; s.H = cv.height; s.dpr = dpr;
      s.orbDia = Math.min(s.W, s.H) * 0.26;
      s.grainPattern = null;
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse parallax via GSAP quickTo
    s.qx = gsap.quickTo(s.parallax, "x", { duration: 0.9, ease: "power2.out" });
    s.qy = gsap.quickTo(s.parallax, "y", { duration: 0.9, ease: "power2.out" });
    const onMove = (e: MouseEvent) => {
      s.qx((e.clientX / window.innerWidth) * 2 - 1);
      s.qy((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);

    // Per-frame sphere renderer — pure software rasteriser
    const renderOrb = (t: number) => {
      const { OFF: O, img, field, FS, parallax } = s;
      const data = img.data;
      const px = parallax.x, py = parallax.y;
      const rot = t * 0.030 + px * 0.16;
      const vdrift = py * 0.04;
      const TEX = 0.20, EPS = 1 / FS, BUMP = 7.5;
      let Lx = 0.64 + px * 0.12, Ly = -0.24 + py * 0.12, Lz = 0.66;
      const Ll = 1 / Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz);
      Lx *= Ll; Ly *= Ll; Lz *= Ll;
      const inv = 2 / O;
      const samp = (uu: number, vv: number) => {
        uu -= Math.floor(uu); vv -= Math.floor(vv);
        const fx = uu * FS, fy = vv * FS;
        const x0 = fx | 0, y0 = fy | 0, x1 = (x0 + 1) % FS, y1 = (y0 + 1) % FS;
        const tx = fx - x0, ty = fy - y0;
        const a = field[y0 * FS + x0], b = field[y0 * FS + x1],
              c = field[y1 * FS + x0], d2 = field[y1 * FS + x1];
        return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d2 * tx) * ty;
      };
      const surf = (u: number, v: number) =>
        samp(u, v) * 0.50 + samp(u * 3, v * 3 + 0.37) * 0.30
        + samp(u * 9, v * 9 + 0.11) * 0.14 + samp(u * 23, v * 23 + 0.61) * 0.06;
      let i = 0;
      for (let y = 0; y < O; y++) {
        const ny = (y + 0.5) * inv - 1;
        for (let x = 0; x < O; x++, i += 4) {
          const nx = (x + 0.5) * inv - 1;
          const r2 = nx * nx + ny * ny;
          if (r2 > 1.0) { data[i + 3] = 0; continue; }
          const nz = Math.sqrt(1 - r2);
          const lon = Math.atan2(nx, nz) * TEX + rot;
          const lat = asinL(ny) * TEX + 0.5 + vdrift;
          const h0 = surf(lon, lat);
          const hu = surf(lon + EPS, lat);
          const hv = surf(lon, lat + EPS);
          const maria = samp(lon, lat);
          let albedo = 0.48 + (maria - 0.5) * 0.95 + (h0 - 0.5) * 0.30;
          if (albedo < 0.06) albedo = 0.06; else if (albedo > 1) albedo = 1;
          let Nx = nx - (hu - h0) * BUMP;
          let Ny = ny - (hv - h0) * BUMP;
          let Nz = nz;
          const nl = 1 / Math.sqrt(Nx * Nx + Ny * Ny + Nz * Nz);
          Nx *= nl; Ny *= nl; Nz *= nl;
          const d = Nx * Lx + Ny * Ly + Nz * Lz;
          let lit = (d + 0.05) / 0.26;
          if (lit < 0) lit = 0; else if (lit > 1) lit = 1;
          const direct = d > 0 ? d : 0;
          let inten = 0.04 + lit * (0.34 + 0.66 * direct);
          const limb = 0.62 + 0.38 * nz;
          const shade = albedo * inten * limb;
          let R = shade * 92, G = shade * 102, B = shade * 120;
          if (r2 > 0.9 && direct > 0) {
            const rm = (r2 - 0.9) / 0.1;
            const gg = rm * rm * direct * 16;
            R += gg * 0.8; G += gg * 0.9; B += gg * 1.0;
          }
          data[i]     = R > 255 ? 255 : R;
          data[i + 1] = G > 255 ? 255 : G;
          data[i + 2] = B > 255 ? 255 : B;
          data[i + 3] = 255;
        }
      }
    };

    // Composite draw — halo → sphere → grain
    const draw = (t: number) => {
      const { ctx: c, W, H, orbDia, dpr, parallax: par, anim, offcanvas, octx: oc2, img, grain } = s;
      if (!c) return;
      const rev = anim.reveal;
      const cx = W / 2 + par.x * 12 * dpr;
      const cy = H * 0.48 + par.y * 10 * dpr;

      c.globalCompositeOperation = "source-over";
      c.fillStyle = "#000";
      c.fillRect(0, 0, W, H);

      if (rev > 0.001) {
        const g1 = c.createRadialGradient(cx, cy, orbDia * 0.48, cx, cy, orbDia * 1.25);
        g1.addColorStop(0, `rgba(116,134,170,${0.045 * rev})`);
        g1.addColorStop(1, "rgba(90,110,150,0)");
        c.globalCompositeOperation = "lighter";
        c.fillStyle = g1;
        c.fillRect(0, 0, W, H);
        c.globalCompositeOperation = "source-over";

        renderOrb(t);
        oc2.putImageData(img, 0, 0);
        const ds = orbDia * (0.96 + 0.04 * rev);
        c.save();
        c.globalAlpha = rev;
        c.imageSmoothingEnabled = true;
        c.imageSmoothingQuality = "high";
        c.drawImage(offcanvas, cx - ds / 2, cy - ds / 2, ds, ds);
        c.restore();
      }

      const pat = s.grainPattern || (s.grainPattern = c.createPattern(grain, "repeat"));
      c.save();
      c.globalCompositeOperation = "overlay";
      c.globalAlpha = 0.04;
      c.translate((Math.random() * 160) | 0, (Math.random() * 160) | 0);
      c.fillStyle = pat!;
      c.fillRect(-200, -200, W + 400, H + 400);
      c.restore();
    };

    const loop = (ts: number) => {
      draw(ts / 1000);
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      (s.timers as ReturnType<typeof setTimeout>[]).forEach(clearTimeout);
      gsap.killTweensOf(s.anim);
      gsap.killTweensOf(s.parallax);
    };
  }, []);

  // Trigger sphere reveal once the app loading screen is done
  useEffect(() => {
    const s = stateRef.current;
    if (!loaded || !s.anim) return;
    gsap.to(s.anim, { reveal: 1, duration: 2.3, ease: "power2.out" });
  }, [loaded]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
    />
  );
}
