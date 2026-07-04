"use client";

import { Component, createRef, RefObject } from "react";
import gsap from "gsap";

type P = Record<string, never>;
type S = { hidden: boolean };

export default class MoonLoadScreen extends Component<P, S> {
  state: S = { hidden: false };

  private overlayRef: RefObject<HTMLDivElement | null> = createRef();
  private canvasRef:  RefObject<HTMLCanvasElement | null> = createRef();
  private loaderRef:  RefObject<HTMLDivElement | null>  = createRef();

  private OFF = 384;
  private parallax = { x: 0, y: 0 };
  private anim     = { reveal: 0 };
  private timers: ReturnType<typeof setTimeout>[] = [];

  private ctx:       CanvasRenderingContext2D | null = null;
  private offcanvas: HTMLCanvasElement | null = null;
  private octx:      CanvasRenderingContext2D | null = null;
  private img:       ImageData | null = null;

  private W = 0; private H = 0; private dpr = 1; private orbDia = 0;
  private grain: HTMLCanvasElement | null = null;
  private grainPattern: CanvasPattern | null = null;
  private field: Float32Array | null = null;
  private FS = 256;
  private LUTN = 2048;
  private ASIN: Float32Array | null = null;

  private raf:      number | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private qx:       ((v: number) => any) | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private qy:       ((v: number) => any) | null = null;
  private loop:     ((ts: number) => void) | null = null;
  private onResize: (() => void) | null = null;
  private onMove:   ((e: MouseEvent) => void) | null = null;

  /* ── lifecycle ── */

  componentDidMount() {
    if (sessionStorage.getItem("tv_intro_shown")) {
      this.setState({ hidden: true });
      return;
    }
    document.body.style.overflow = "hidden";
    this.buildAsin();
    this.buildField();
    this.buildGrain();

    const cv = this.canvasRef.current!;
    this.ctx = cv.getContext("2d");
    const oc = document.createElement("canvas");
    oc.width = oc.height = this.OFF;
    this.offcanvas = oc;
    this.octx = oc.getContext("2d");
    this.img = this.octx!.createImageData(this.OFF, this.OFF);

    this.onResize = () => this.resize();
    this.resize();
    window.addEventListener("resize", this.onResize);

    this.qx = gsap.quickTo(this.parallax, "x", { duration: 0.9, ease: "power2.out" }) as (v: number) => unknown;
    this.qy = gsap.quickTo(this.parallax, "y", { duration: 0.9, ease: "power2.out" }) as (v: number) => unknown;

    this.onMove = (e: MouseEvent) => {
      this.qx!((e.clientX / window.innerWidth)  * 2 - 1);
      this.qy!((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", this.onMove);

    this.loop = (ts: number) => { this.draw(ts / 1000); this.raf = requestAnimationFrame(this.loop!); };
    this.raf = requestAnimationFrame(this.loop);

    this.runLoading();
  }

  componentWillUnmount() { this.cleanup(); }

  /* ── animation sequence ── */

  private runLoading() {
    const L = this.loaderRef.current!;
    this.timers.forEach(clearTimeout); this.timers = [];
    this.anim.reveal = 0;
    gsap.killTweensOf(this.anim);
    L.style.display = "flex";
    gsap.set(L, { opacity: 1 });

    this.timers.push(setTimeout(() => {
      gsap.to(L, { opacity: 0, duration: 0.8, ease: "power2.inOut", onComplete: () => { L.style.display = "none"; } });
      this.timers.push(setTimeout(() => this.startReveal(), 150));
    }, 1000));
  }

  private startReveal() {
    gsap.to(this.anim, {
      reveal: 1, duration: 2.3, ease: "power2.out",
      onComplete: () => { this.timers.push(setTimeout(() => this.exit(), 350)); },
    });
  }

  private exit() {
    const el = this.overlayRef.current;
    if (!el) return;
    gsap.to(el, {
      opacity: 0, duration: 0.7, ease: "power2.inOut",
      onComplete: () => {
        document.body.style.overflow = "";
        sessionStorage.setItem("tv_intro_shown", "1");
        this.cleanup();
        this.setState({ hidden: true });
      },
    });
  }

  private cleanup() {
    if (this.raf)      cancelAnimationFrame(this.raf);
    if (this.onResize) window.removeEventListener("resize", this.onResize);
    if (this.onMove)   window.removeEventListener("mousemove", this.onMove);
    this.timers.forEach(clearTimeout);
    gsap.killTweensOf(this.anim);
    gsap.killTweensOf(this.parallax);
  }

  /* ── canvas setup ── */

  private resize() {
    const cv = this.canvasRef.current; if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width  = Math.round(cv.clientWidth  * dpr);
    cv.height = Math.round(cv.clientHeight * dpr);
    this.W = cv.width; this.H = cv.height; this.dpr = dpr;
    this.orbDia = Math.min(this.W, this.H) * 0.26;
    this.grainPattern = null;
  }

  private buildAsin() {
    const N = 2048, L = new Float32Array(N + 1);
    for (let i = 0; i <= N; i++) L[i] = Math.asin(-1 + (2 * i) / N);
    this.LUTN = N; this.ASIN = L;
  }

  private asinL(x: number) {
    let idx = ((x + 1) * 0.5 * this.LUTN) | 0;
    if (idx < 0) idx = 0; else if (idx > this.LUTN) idx = this.LUTN;
    return this.ASIN![idx];
  }

  private buildField() {
    const FS = 256;
    const p = new Uint8Array(512), perm = new Uint8Array(256);
    for (let i = 0; i < 256; i++) perm[i] = i;
    let s = 1337 >>> 0;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    for (let i = 255; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; const t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
    for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const grad = (h: number, x: number, y: number) => { const u = (h & 1) ? -x : x; const v = (h & 2) ? -y : y; return u + v; };
    const lp   = (a: number, b: number, t: number) => a + (b - a) * t;
    const noise = (x: number, y: number, per: number) => {
      const fx = Math.floor(x), fy = Math.floor(y);
      const X = fx & 255, Y = fy & 255, xf = x - fx, yf = y - fy;
      const u = fade(xf), v = fade(yf);
      const X0 = X % per, X1 = (X + 1) % per, Y0 = Y % per, Y1 = (Y + 1) % per;
      const aa = p[p[X0] + Y0], ab = p[p[X0] + Y1], ba = p[p[X1] + Y0], bb = p[p[X1] + Y1];
      return lp(lp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u), lp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u), v);
    };

    const field = new Float32Array(FS * FS);
    let mn = 1e9, mx = -1e9;
    for (let y = 0; y < FS; y++) for (let x = 0; x < FS; x++) {
      let amp = 1, freq = 2, sum = 0, norm = 0;
      for (let o = 0; o < 5; o++) { sum += amp * noise((x / FS) * freq, (y / FS) * freq, freq); norm += amp; amp *= 0.5; freq *= 2; }
      const e = sum / norm; field[y * FS + x] = e;
      if (e < mn) mn = e; if (e > mx) mx = e;
    }
    const inv = 1 / (mx - mn);
    for (let i = 0; i < field.length; i++) field[i] = (field[i] - mn) * inv;
    this.field = field; this.FS = FS;
  }

  private buildGrain() {
    const g = document.createElement("canvas"); g.width = g.height = 160;
    const gx = g.getContext("2d")!; const id = gx.createImageData(160, 160); const d = id.data;
    for (let i = 0; i < d.length; i += 4) { const n = (Math.random() * 255) | 0; d[i] = d[i+1] = d[i+2] = n; d[i+3] = 255; }
    gx.putImageData(id, 0, 0); this.grain = g;
  }

  /* ── render loop ── */

  private renderOrb(t: number) {
    const OFF = this.OFF, data = this.img!.data, F = this.field!, FS = this.FS;
    const px = this.parallax.x, py = this.parallax.y;
    const rot = t * 0.030 + px * 0.16, vdrift = py * 0.04;
    const TEX = 0.20, EPS = 1 / FS, BUMP = 7.5;
    let Lx = 0.64 + px * 0.12, Ly = -0.24 + py * 0.12, Lz = 0.66;
    const Ll = 1 / Math.sqrt(Lx*Lx + Ly*Ly + Lz*Lz); Lx *= Ll; Ly *= Ll; Lz *= Ll;
    const inv = 2 / OFF;
    const samp = (uu: number, vv: number) => {
      uu -= Math.floor(uu); vv -= Math.floor(vv);
      const fx = uu * FS, fy = vv * FS, x0 = fx | 0, y0 = fy | 0, x1 = (x0+1) % FS, y1 = (y0+1) % FS;
      const tx = fx - x0, ty = fy - y0;
      const a = F[y0*FS+x0], b = F[y0*FS+x1], c = F[y1*FS+x0], d2 = F[y1*FS+x1];
      return (a*(1-tx) + b*tx)*(1-ty) + (c*(1-tx) + d2*tx)*ty;
    };
    const surf = (u: number, v: number) =>
      samp(u,v)*0.50 + samp(u*3,v*3+0.37)*0.30 + samp(u*9,v*9+0.11)*0.14 + samp(u*23,v*23+0.61)*0.06;

    let i = 0;
    for (let y = 0; y < OFF; y++) {
      const ny = (y + 0.5) * inv - 1;
      for (let x = 0; x < OFF; x++, i += 4) {
        const nx = (x + 0.5) * inv - 1, r2 = nx*nx + ny*ny;
        if (r2 > 1.0) { data[i+3] = 0; continue; }
        const nz = Math.sqrt(1 - r2);
        const lon = Math.atan2(nx, nz) * TEX + rot, lat = this.asinL(ny) * TEX + 0.5 + vdrift;
        const h0 = surf(lon, lat), hu = surf(lon + EPS, lat), hv = surf(lon, lat + EPS);
        const maria = samp(lon, lat);
        let albedo = 0.48 + (maria - 0.5)*0.95 + (h0 - 0.5)*0.30;
        if (albedo < 0.06) albedo = 0.06; else if (albedo > 1) albedo = 1;
        let Nx = nx - (hu - h0)*BUMP, Ny = ny - (hv - h0)*BUMP, Nz = nz;
        const nl = 1 / Math.sqrt(Nx*Nx + Ny*Ny + Nz*Nz); Nx *= nl; Ny *= nl; Nz *= nl;
        const d = Nx*Lx + Ny*Ly + Nz*Lz;
        let lit = (d + 0.05) / 0.26; if (lit < 0) lit = 0; else if (lit > 1) lit = 1;
        const direct = d > 0 ? d : 0;
        const shade = albedo * (0.04 + lit*(0.34 + 0.66*direct)) * (0.62 + 0.38*nz);
        let R = shade*92, G = shade*102, B = shade*120;
        if (r2 > 0.9 && direct > 0) { const rm = (r2-0.9)/0.1, gg = rm*rm*direct*16; R += gg*0.8; G += gg*0.9; B += gg; }
        data[i]   = R > 255 ? 255 : R;
        data[i+1] = G > 255 ? 255 : G;
        data[i+2] = B > 255 ? 255 : B;
        data[i+3] = 255;
      }
    }
  }

  private draw(t: number) {
    const ctx = this.ctx, W = this.W, H = this.H; if (!ctx) return;
    const rev = this.anim.reveal, dia = this.orbDia;
    const cx = W / 2 + this.parallax.x * 12 * this.dpr;
    const cy = H * 0.48 + this.parallax.y * 10 * this.dpr;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);

    if (rev > 0.001) {
      const g1 = ctx.createRadialGradient(cx, cy, dia*0.48, cx, cy, dia*1.25);
      g1.addColorStop(0, `rgba(116,134,170,${0.045 * rev})`);
      g1.addColorStop(1, "rgba(90,110,150,0)");
      ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      this.renderOrb(t);
      this.octx!.putImageData(this.img!, 0, 0);
      const ds = dia * (0.96 + 0.04 * rev);
      ctx.save();
      ctx.globalAlpha = rev;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(this.offcanvas!, cx - ds/2, cy - ds/2, ds, ds);
      ctx.restore();
    }

    const pat = this.grainPattern || (this.grainPattern = ctx.createPattern(this.grain!, "repeat")!);
    ctx.save();
    ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = 0.04;
    ctx.translate((Math.random()*160)|0, (Math.random()*160)|0);
    ctx.fillStyle = pat; ctx.fillRect(-200, -200, W+400, H+400);
    ctx.restore();
  }

  /* ── render ── */

  render() {
    if (this.state.hidden) return null;
    return (
      <div
        ref={this.overlayRef}
        style={{ position: "fixed", inset: 0, zIndex: 10000, background: "#000", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        <canvas
          ref={this.canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        />
        <div
          ref={this.loaderRef}
          style={{ position: "absolute", inset: 0, zIndex: 30, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "22px" }}
        >
          <div style={{ color: "#fff", fontSize: "15px", letterSpacing: "0.42em", fontWeight: 600, opacity: 0.92 }}>
            TOPVIEW
          </div>
          <div className="moon-spinner" />
        </div>
      </div>
    );
  }
}
