"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { transitionTo } from "@/lib/pageTransition";
import { BRAND_LOGOS as TALENT_LOGOS } from "@/lib/logos";
import CalendlyEmbed from "@/components/shared/CalendlyEmbed";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

/* ─────────────────────────────────────────
   Carousel hook — shared by both carousels
───────────────────────────────────────── */
function useCarousel(
  trackRef: React.RefObject<HTMLDivElement | null>,
  prevRef: React.RefObject<HTMLButtonElement | null>,
  nextRef: React.RefObject<HTMLButtonElement | null>,
  dotsRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const track    = trackRef.current;
    const prevBtn  = prevRef.current;
    const nextBtn  = nextRef.current;
    const dotsWrap = dotsRef.current;
    if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

    const cards = [...track.querySelectorAll<HTMLElement>(".c-card")];
    const GAP = 12;
    let active = 0;

    // Build dot nav
    dotsWrap.innerHTML = "";
    cards.forEach((_, i) => {
      const d = document.createElement("button");
      d.className = "c-dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", () => go(i));
      dotsWrap.appendChild(d);
    });

    function layout(animate: boolean) {
      const parent = track!.parentElement as HTMLElement;
      const vw = parent.offsetWidth;
      const peek = vw < 768 ? 28 : 100;
      const AW = Math.max(vw - 2 * (peek + GAP) - 40, Math.floor(vw * 0.7));
      const x = -(active * (peek + GAP)) + (vw - AW) / 2;

      cards.forEach((card, i) => {
        const w = i === active ? AW : peek;
        card.style.transition = animate ? "width 0.75s cubic-bezier(0.87,0,0.13,1)" : "none";
        card.style.width = w + "px";
        card.classList.toggle("active", i === active);
        card.classList.toggle("inactive", i !== active);
      });

      track!.style.transition = animate ? "transform 0.75s cubic-bezier(0.87,0,0.13,1)" : "none";
      track!.style.transform = `translateX(${x}px)`;

      [...dotsWrap!.querySelectorAll<HTMLElement>(".c-dot")].forEach((d, i) => {
        d.classList.toggle("active", i === active);
      });

      cards.forEach((card, i) => {
        const vid = card.querySelector("video");
        if (!vid) return;
        if (i === active) vid.play().catch(() => {});
        else vid.pause();
      });

      prevBtn!.disabled = active === 0;
      nextBtn!.disabled = active === cards.length - 1;
    }

    function go(i: number) {
      active = Math.max(0, Math.min(cards.length - 1, i));
      layout(true);
    }

    cards.forEach((card, i) => {
      card.addEventListener("click", () => { if (i !== active) go(i); });
    });
    prevBtn.addEventListener("click", () => go(active - 1));
    nextBtn.addEventListener("click", () => go(active + 1));

    let pointerX = 0;
    track.addEventListener("pointerdown", (e: PointerEvent) => { pointerX = e.clientX; });
    track.addEventListener("pointerup", (e: PointerEvent) => {
      const dx = e.clientX - pointerX;
      if (Math.abs(dx) > 60) go(dx < 0 ? active + 1 : active - 1);
    });

    layout(false);
    const onResize = () => layout(false);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      dotsWrap.innerHTML = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}


/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
export default function Page() {
  const router = useRouter();
  const [mode, setMode] = useState<"talent" | "marketing">("talent");

  // Modal state
  const [modalOpen, setModalOpen]       = useState(false);
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [formSent, setFormSent]         = useState(false);
  const [formName, setFormName]         = useState("");
  const [formEmail, setFormEmail]       = useState("");
  const [formMessage, setFormMessage]   = useState("");

  // Refs
  const stmtInnerRef     = useRef<HTMLDivElement>(null);
  const footerWrapRef    = useRef<HTMLDivElement>(null);
  const footerSectionRef = useRef<HTMLElement>(null);

  // Roster carousel refs
  const rosterTrackRef = useRef<HTMLDivElement>(null);
  const rosterPrevRef  = useRef<HTMLButtonElement>(null);
  const rosterNextRef  = useRef<HTMLButtonElement>(null);
  const rosterDotsRef  = useRef<HTMLDivElement>(null);

  // Collab carousel refs
  const collabTrackRef = useRef<HTMLDivElement>(null);
  const collabPrevRef  = useRef<HTMLButtonElement>(null);
  const collabNextRef  = useRef<HTMLButtonElement>(null);
  const collabDotsRef  = useRef<HTMLDivElement>(null);

  // ── Fit-to-width: statement lines
  useEffect(() => {
    const inner = stmtInnerRef.current;
    if (!inner) return;
    function fitLines() {
      const style = getComputedStyle(inner!);
      const available =
        inner!.getBoundingClientRect().width -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      inner!.querySelectorAll<HTMLElement>(".stmt-line").forEach(line => {
        line.style.fontSize = "100px";
        const scale = available / line.scrollWidth;
        line.style.fontSize = 100 * scale + "px";
      });
    }
    fitLines();
    const ro = new ResizeObserver(fitLines);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  // ── Iris reveal
  useEffect(() => {
    const wrap    = footerWrapRef.current;
    const section = footerSectionRef.current;
    if (!wrap || !section) return;
    wrap.style.transition = "clip-path 1.2s cubic-bezier(0.77, 0, 0.18, 1)";
    wrap.style.clipPath   = "circle(0% at 50% 40%)";
    const obs = new IntersectionObserver(([e]) => {
      wrap.style.clipPath = e.isIntersecting
        ? "circle(150% at 50% 40%)"
        : "circle(0% at 50% 40%)";
    }, { threshold: 0.35 });
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  const openModal = useCallback(() => {
    setModalOpen(true);
    lockScroll();
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    unlockScroll();
  }, []);

  // ── Escape key closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeModal]);

  // ── Carousels
  useCarousel(rosterTrackRef, rosterPrevRef, rosterNextRef, rosterDotsRef);
  useCarousel(collabTrackRef, collabPrevRef, collabNextRef, collabDotsRef);

  // ── Lazy-load carousel videos when section comes into view
  useEffect(() => {
    const selectors = ["#roster", "#collaborations"];
    const observers = selectors.map((selector) => {
      const section = document.querySelector(selector);
      if (!section) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        section.querySelectorAll("video").forEach((v) => {
          (v as HTMLVideoElement).preload = "auto";
        });
        obs.disconnect();
      }, { rootMargin: "600px 0px" });
      obs.observe(section);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      closeModal();
      setTimeout(() => {
        setFormSent(false);
        setSelectedPill(null);
        setFormName("");
        setFormEmail("");
        setFormMessage("");
      }, 400);
    }, 1800);
  }

  return (
    <>
      {/* ── Header ── */}
      <header>
        <div className="header-left">
          <div className="pill-wrap glass">
            <button
              className={`pill-btn ${mode === "talent" ? "active" : "inactive"}`}
              onClick={() => setMode("talent")}
            >
              Talent
            </button>
            <button
              className={`pill-btn ${mode === "marketing" ? "active" : "inactive"}`}
              onClick={() => transitionTo("/marketing", "#ffffff", () => router.push("/marketing"))}
            >
              Marketing
            </button>
          </div>
        </div>

        <a href="#" className="logo">
          <img src="/logos/topview-white.png" alt="TopView" style={{ height: "76px", width: "auto" }} />
        </a>

        <div className="header-right">
          <div className="btn-group" onClick={openModal}>
            <button className="icon-btn glass">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
              </svg>
            </button>
            <button className="cta-btn glass">
              Get in Touch
              <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Page 1: Hero ── */}
      <section className="hero">
        <video className="hero-video" autoPlay loop muted playsInline preload="metadata" poster="/images/hero-poster-mobile.jpg">
          <source src="/videos/topviewmobile.mp4" media="(max-width: 767px)" type="video/mp4" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay-top" />
        <div className="hero-overlay-bottom" />
        <div className="hero-content">
          <div className="btn-group hero-book-call" onClick={openModal}>
            <button className="icon-btn glass">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
              </svg>
            </button>
            <button className="cta-btn glass">
              Book a Call
              <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
          <p className="tagline">The Authority on the Next Digital Generation</p>
        </div>
      </section>

      {/* ── Page 2: Statement ── */}
      <section className="statement">
        <div className="statement-inner" ref={stmtInnerRef}>
          <div className="stmt-line left" data-reveal data-d="1">
            The Voice
            <svg className="stmt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          <div className="stmt-line right" data-reveal data-d="2">Behind Tomorrow&apos;s</div>
          <div className="stmt-line center" data-reveal data-d="3">
            Stars
            <svg className="stmt-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Brand Logo Marquee ── */}
      <section className="brand-logos" aria-label="Brand partners">
        <div className="brand-logos-inner">
          <div className="brand-logos-track">
            {[...TALENT_LOGOS, ...TALENT_LOGOS].map((logo, i) => (
              <div key={i} className="brand-logo-item">
                <img
                  src={logo.src}
                  alt={logo.name}
                  style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Page 3: Inline Video Text ── */}
      <section className="inline-text">
        <h2 className="inline-heading">
          <div className="heading-line" data-reveal data-d="1">
            <span>TopView</span>
            <span className="vid-wrap"><video src="/videos/talent-1.mp4" autoPlay loop muted playsInline preload="none" /></span>
            <span>Represents</span>
          </div>
          <div className="heading-line" data-reveal data-d="2">
            <span>The Voices</span>
            <span className="vid-wrap"><video src="/videos/talent-2.mp4" autoPlay loop muted playsInline preload="none" /></span>
            <span>Shaping</span>
          </div>
          <div className="heading-line" data-reveal data-d="3">
            <span>Culture</span>
            <span className="vid-wrap"><video src="/videos/talent-3.mp4" autoPlay loop muted playsInline preload="none" /></span>
            <span>Online</span>
          </div>
        </h2>

        <div className="btn-group" data-reveal data-d="4" onClick={openModal}>
          <button className="icon-btn glass">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
            </svg>
          </button>
          <button className="cta-btn glass">
            Get in Touch
            <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ── Page 4: Service Cards ── */}
      <section className="services">
        <div className="services-header" data-reveal>
          <h2 className="services-title">What We Do</h2>
          <p className="services-subtitle">We represent some of the most influential creators, artists and brands on the internet.</p>
        </div>

        <div className="cards-grid">
          {/* Card 1 — Talent Management → links to /talent */}
          <div className="card" data-reveal="scale" data-d="1" onClick={() => router.push("/talent")} style={{ cursor: "pointer" }}>
            <div className="card-video">
              <video src="/videos/talent-1.mp4" autoPlay loop muted playsInline />
            </div>
            <div className="card-overlay" />
            <div className="explore-badge">
              <svg className="explore-ring" viewBox="0 0 130 130">
                <defs><path id="cp-1" d="M65,65 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0"/></defs>
                <text fontSize="12.5" fill="white" fontFamily="Helvetica Neue,Arial,sans-serif" fontWeight="600" letterSpacing="3">
                  <textPath href="#cp-1">EXPLORE / EXPLORE / EXPLORE /</textPath>
                </text>
              </svg>
              <div className="explore-arrow">↗</div>
            </div>
            <div className="card-content">
              <div className="card-icon-wrap">
                <div className="card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
              </div>
              <div className="card-text">
                <h3 className="card-title">Talent Management</h3>
                <p className="card-desc">Full-service management for the world&apos;s leading digital creators — from brand strategy to deal negotiation.</p>
              </div>
            </div>
          </div>

          {/* Card 2 — Brand Partnerships */}
          <div className="card" data-reveal="scale" data-d="2">
            <div className="card-video">
              <video src="/videos/talentroster-4.mp4" autoPlay loop muted playsInline />
            </div>
            <div className="card-overlay" />
            <div className="explore-badge">
              <svg className="explore-ring" viewBox="0 0 130 130">
                <defs><path id="cp-2" d="M65,65 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0"/></defs>
                <text fontSize="12.5" fill="white" fontFamily="Helvetica Neue,Arial,sans-serif" fontWeight="600" letterSpacing="3">
                  <textPath href="#cp-2">EXPLORE / EXPLORE / EXPLORE /</textPath>
                </text>
              </svg>
              <div className="explore-arrow">↗</div>
            </div>
            <div className="card-content">
              <div className="card-icon-wrap">
                <div className="card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </div>
              </div>
              <div className="card-text">
                <h3 className="card-title">Brand Partnerships</h3>
                <p className="card-desc">Connecting creators with brands that align with their audience. Authentic campaigns that convert.</p>
              </div>
            </div>
          </div>

          {/* Card 3 — Media Production */}
          <div className="card" data-reveal="scale" data-d="3">
            <div className="card-video">
              <video src="/videos/talent-3.mp4" autoPlay loop muted playsInline />
            </div>
            <div className="card-overlay" />
            <div className="explore-badge">
              <svg className="explore-ring" viewBox="0 0 130 130">
                <defs><path id="cp-3" d="M65,65 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0"/></defs>
                <text fontSize="12.5" fill="white" fontFamily="Helvetica Neue,Arial,sans-serif" fontWeight="600" letterSpacing="3">
                  <textPath href="#cp-3">EXPLORE / EXPLORE / EXPLORE /</textPath>
                </text>
              </svg>
              <div className="explore-arrow">↗</div>
            </div>
            <div className="card-content">
              <div className="card-icon-wrap">
                <div className="card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                    <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
                    <line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/>
                    <line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/>
                    <line x1="17" y1="7" x2="22" y2="7"/>
                  </svg>
                </div>
              </div>
              <div className="card-text">
                <h3 className="card-title">Media Production</h3>
                <p className="card-desc">In-house production for podcasts, video content, and digital campaigns built for scale.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Page 5: Talent Roster Carousel ── */}
      <section className="carousel-section" id="roster">
        <div className="carousel-header">
          <div data-reveal>
            <p className="carousel-label">Our Roster</p>
            <h2 className="carousel-title">The Talent</h2>
          </div>
          <div className="carousel-arrows">
            <button className="carousel-arrow" ref={rosterPrevRef} disabled>←</button>
            <button className="carousel-arrow" ref={rosterNextRef}>→</button>
          </div>
        </div>

        <div className="carousel-track-wrap">
          <div className="carousel-track" ref={rosterTrackRef}>
            <div className="c-card active">
              <video src="/videos/talentroster-1.mp4" poster="/images/posters/talentroster-1.jpg" muted loop playsInline preload="none" />
              <div className="c-overlay" />
              <div className="c-content">
                <div className="c-inner">
                  <div className="explore-circle">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <defs><path id="rp1" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
                      <text fill="rgba(255,255,255,0.65)" fontSize="8" letterSpacing="2.8"><textPath href="#rp1">EXPLORE · EXPLORE · EXPLORE · EXPLORE ·</textPath></text>
                    </svg>
                    <div className="explore-center"><div className="explore-btn">↗</div></div>
                  </div>
                  <div className="c-text">
                    <span className="c-badge">TopView Talent</span>
                    <h3 className="c-name">ENZO</h3>
                    <p className="c-tagline">The next breakout creator</p>
                    <span className="c-stat">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                      45M+ impressions generated
                    </span>
                  </div>
                </div>
              </div>
              <span className="c-num">01</span>
            </div>

            <div className="c-card inactive">
              <video src="/videos/talentroster-2.mp4" poster="/images/posters/talentroster-2.jpg" muted loop playsInline preload="none" />
              <div className="c-overlay" />
              <div className="c-content">
                <div className="c-inner">
                  <div className="explore-circle">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <defs><path id="rp2" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
                      <text fill="rgba(255,255,255,0.65)" fontSize="8" letterSpacing="2.8"><textPath href="#rp2">EXPLORE · EXPLORE · EXPLORE · EXPLORE ·</textPath></text>
                    </svg>
                    <div className="explore-center"><div className="explore-btn">↗</div></div>
                  </div>
                  <div className="c-text">
                    <span className="c-badge">TopView Talent</span>
                    <h3 className="c-name">sebtakespics</h3>
                    <p className="c-tagline">Genre redefining artist</p>
                    <span className="c-stat">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                      60M+ streams generated
                    </span>
                  </div>
                </div>
              </div>
              <span className="c-num">02</span>
            </div>

            <div className="c-card inactive">
              <video src="/videos/talentroster-3.mp4" poster="/images/posters/talentroster-3.jpg" muted loop playsInline preload="none" />
              <div className="c-overlay" />
              <div className="c-content">
                <div className="c-inner">
                  <div className="explore-circle">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <defs><path id="rp3" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
                      <text fill="rgba(255,255,255,0.65)" fontSize="8" letterSpacing="2.8"><textPath href="#rp3">EXPLORE · EXPLORE · EXPLORE · EXPLORE ·</textPath></text>
                    </svg>
                    <div className="explore-center"><div className="explore-btn">↗</div></div>
                  </div>
                  <div className="c-text">
                    <span className="c-badge">TopView Talent</span>
                    <h3 className="c-name">Justin Richburg</h3>
                    <p className="c-tagline">Long-form storytelling at scale</p>
                    <span className="c-stat">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                      100M+ impressions generated
                    </span>
                  </div>
                </div>
              </div>
              <span className="c-num">03</span>
            </div>

            <div className="c-card inactive">
              <video src="/videos/talentroster-4.mp4" poster="/images/posters/talentroster-4.jpg" muted loop playsInline preload="none" />
              <div className="c-overlay" />
              <div className="c-content">
                <div className="c-inner">
                  <div className="explore-circle">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <defs><path id="rp4" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
                      <text fill="rgba(255,255,255,0.65)" fontSize="8" letterSpacing="2.8"><textPath href="#rp4">EXPLORE · EXPLORE · EXPLORE · EXPLORE ·</textPath></text>
                    </svg>
                    <div className="explore-center"><div className="explore-btn">↗</div></div>
                  </div>
                  <div className="c-text">
                    <span className="c-badge">TopView Talent</span>
                    <h3 className="c-name">Swoosh God</h3>
                    <p className="c-tagline">A voice that moves audiences</p>
                    <span className="c-stat">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                      80M+ views generated
                    </span>
                  </div>
                </div>
              </div>
              <span className="c-num">04</span>
            </div>

            <div className="c-card inactive">
              <video src="/videos/talentroster-5.mp4" poster="/images/posters/talentroster-5.jpg" muted loop playsInline preload="none" />
              <div className="c-overlay" />
              <div className="c-content">
                <div className="c-inner">
                  <div className="explore-circle">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <defs><path id="rp5" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
                      <text fill="rgba(255,255,255,0.65)" fontSize="8" letterSpacing="2.8"><textPath href="#rp5">EXPLORE · EXPLORE · EXPLORE · EXPLORE ·</textPath></text>
                    </svg>
                    <div className="explore-center"><div className="explore-btn">↗</div></div>
                  </div>
                  <div className="c-text">
                    <span className="c-badge">TopView Talent</span>
                    <h3 className="c-name">Che Igbo</h3>
                    <p className="c-tagline">The face of the NY Knicks</p>
                    <span className="c-stat">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                      120M+ impressions generated
                    </span>
                  </div>
                </div>
              </div>
              <span className="c-num">05</span>
            </div>
          </div>
        </div>

        <div className="carousel-dots" ref={rosterDotsRef} />
      </section>

        <section className="portfolio-link-section" aria-label="Our portfolio">
          <a
            href="https://topview-social-media.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-link-card"
          >
            <div className="portfolio-link-copy">
              <span className="portfolio-link-label">Our Portfolio</span>
              <h3>Our Works</h3>
            </div>

            <div className="portfolio-link-action">
              <div className="portfolio-link-arrow" aria-hidden="true">↗</div>
              <span className="cta-btn glass portfolio-link-btn">
                Explore
                <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </div>
          </a>
        </section>

        {/* ── Page 6: Brand Collaborations Carousel ── */}
        <section className="carousel-section" id="collaborations">
        <div className="carousel-header">
          <div data-reveal>
            <p className="carousel-label">What We Do</p>
            <h2 className="carousel-title">Brand<br />Collaborations</h2>
          </div>
          <div className="carousel-arrows">
            <button className="carousel-arrow" ref={collabPrevRef} disabled>←</button>
            <button className="carousel-arrow" ref={collabNextRef}>→</button>
          </div>
        </div>

        <div className="carousel-track-wrap">
          <div className="carousel-track" ref={collabTrackRef}>
            <div className="c-card active">
              <img src="/images/work/pumarishi.jpg" alt="Champs Sports × Puma" />
              <div className="c-overlay" />
              <div className="c-content">
                <div className="c-inner">
                  <div className="explore-circle">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <defs><path id="cp1" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
                      <text fill="rgba(255,255,255,0.65)" fontSize="8" letterSpacing="2.8"><textPath href="#cp1">EXPLORE · EXPLORE · EXPLORE · EXPLORE ·</textPath></text>
                    </svg>
                    <div className="explore-center"><div className="explore-btn">↗</div></div>
                  </div>
                  <div className="c-text">
                    <span className="c-badge">Brand Activation</span>
                    <h3 className="c-name">Champs Sports × Puma</h3>
                    <p className="c-tagline">3M+ YouTube views · 10M impressions in one year</p>
                  </div>
                </div>
              </div>
              <span className="c-num">01</span>
            </div>

            <div className="c-card inactive">
              <video src="/videos/cheigboups.mp4" poster="/images/posters/cheigboups.jpg" muted loop playsInline preload="none" />
              <div className="c-overlay" />
              <div className="c-content">
                <div className="c-inner">
                  <div className="explore-circle">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <defs><path id="cp2" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
                      <text fill="rgba(255,255,255,0.65)" fontSize="8" letterSpacing="2.8"><textPath href="#cp2">EXPLORE · EXPLORE · EXPLORE · EXPLORE ·</textPath></text>
                    </svg>
                    <div className="explore-center"><div className="explore-btn">↗</div></div>
                  </div>
                  <div className="c-text">
                    <span className="c-badge">Talent Integration</span>
                    <h3 className="c-name">NY Knicks × UPS</h3>
                    <p className="c-tagline">Karl-Anthony Towns delivers Knicks championship gear across NYC</p>
                  </div>
                </div>
              </div>
              <span className="c-num">02</span>
            </div>

            <div className="c-card inactive">
              <video src="/videos/enzobrand.mp4" poster="/images/posters/enzobrand.jpg" muted loop playsInline preload="none" />
              <div className="c-overlay" />
              <div className="c-content">
                <div className="c-inner">
                  <div className="explore-circle">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <defs><path id="cp3" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
                      <text fill="rgba(255,255,255,0.65)" fontSize="8" letterSpacing="2.8"><textPath href="#cp3">EXPLORE · EXPLORE · EXPLORE · EXPLORE ·</textPath></text>
                    </svg>
                    <div className="explore-center"><div className="explore-btn">↗</div></div>
                  </div>
                  <div className="c-text">
                    <span className="c-badge">Content Creation</span>
                    <h3 className="c-name">Timmyxtream</h3>
                    <p className="c-tagline">Authentic content at the intersection of sport and culture</p>
                  </div>
                </div>
              </div>
              <span className="c-num">03</span>
            </div>

            <div className="c-card inactive">
              <video src="/videos/talent-1.mp4" muted loop playsInline preload="none" />
              <div className="c-overlay" />
              <div className="c-content">
                <div className="c-inner">
                  <div className="explore-circle">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <defs><path id="cp4" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
                      <text fill="rgba(255,255,255,0.65)" fontSize="8" letterSpacing="2.8"><textPath href="#cp4">EXPLORE · EXPLORE · EXPLORE · EXPLORE ·</textPath></text>
                    </svg>
                    <div className="explore-center"><div className="explore-btn">↗</div></div>
                  </div>
                  <div className="c-text">
                    <span className="c-badge">Digital Growth</span>
                    <h3 className="c-name">Distribution</h3>
                    <p className="c-tagline">Creators in front of the right audiences</p>
                  </div>
                </div>
              </div>
              <span className="c-num">04</span>
            </div>
          </div>
        </div>

        <div className="carousel-dots" ref={collabDotsRef} />
      </section>

      {/* ── Page 7: Footer CTA ── */}
      <section className="footer-cta" id="footer" ref={footerSectionRef}>
        <video className="footer-bg-video" src="/videos/footer.mp4" autoPlay loop muted playsInline preload="none" />

        <div className="footer-content-wrap" ref={footerWrapRef}>
          <div className="footer-bg-overlay" />

          <div className="footer-panels">
            {/* Left: Request Roster */}
            <div className="footer-panel" id="footerLeftBtn" onClick={openModal}>
              <div className="explore-badge">
                <svg className="explore-ring" viewBox="0 0 130 130">
                  <defs><path id="fp1" d="M65,65 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0"/></defs>
                  <text fontSize="12.5" fill="white" fontFamily="Helvetica Neue,Arial,sans-serif" fontWeight="600" letterSpacing="3">
                    <textPath href="#fp1">EXPLORE / EXPLORE / EXPLORE /</textPath>
                  </text>
                </svg>
                <div className="explore-arrow">↗</div>
              </div>
              <div>
                <span className="footer-big-line" data-reveal>Request</span>
                <span className="footer-big-line" data-reveal data-d="1">
                  Roster
                  <svg className="footer-line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Right: Get In Touch */}
            <div className="footer-panel footer-panel-right" id="footerRightBtn" onClick={openModal}>
              <div className="explore-badge">
                <svg className="explore-ring" viewBox="0 0 130 130">
                  <defs><path id="fp2" d="M65,65 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0"/></defs>
                  <text fontSize="12.5" fill="white" fontFamily="Helvetica Neue,Arial,sans-serif" fontWeight="600" letterSpacing="3">
                    <textPath href="#fp2">SAY HELLO / SAY HELLO / SAY HELLO /</textPath>
                  </text>
                </svg>
                <div className="explore-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
                  </svg>
                </div>
              </div>
              <div>
                <span className="footer-big-line" data-reveal data-d="1">
                  <svg className="footer-line-icon footer-cursor-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
                  </svg>
                  Get In
                </span>
                <span className="footer-big-line" data-reveal data-d="2">Touch</span>
              </div>
            </div>
          </div>

          {/* Footer bar */}
          <div className="footer-bar">
            <div className="footer-bar-content">
              <nav className="footer-nav">
                <a href="#">Talent</a>
                <a href="#">Marketing</a>
                <a href="#" onClick={(e) => { e.preventDefault(); openModal(); }}>Contact</a>
              </nav>
              <p className="footer-tagline">The Next Digital<br />Generation</p>
              <div className="footer-socials">
                <a href="https://www.instagram.com/topview0?igsh=b2ZuZHNoaDBhMGVu" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter / X">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" aria-label="TikTok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.06a8.16 8.16 0 0 0 4.78 1.53V7.14a4.85 4.85 0 0 1-1.02-.45z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-copyright">
              <span>© 2026 TopView</span>
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Modal ── */}
      <div
        className={`contact-modal${modalOpen ? " open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="contact-panel" data-lenis-prevent>
          {/* Left: brand */}
          <div className="contact-left">
            <div>
              <p className="contact-agency-tag">TopView Agency</p>
              <h2 className="contact-heading">Let&apos;s<br />Talk.</h2>
              <p className="contact-desc">Book a call at a time that works for you — or drop us a message and we&apos;ll take it from there.</p>
            </div>
            <div className="contact-meta">
              <a href="mailto:hello@topview.agency" className="contact-email">hello@topview.agency</a>
              <span className="contact-locations">Lagos · London</span>
            </div>
          </div>

          {/* Right: form */}
          <div className="contact-right">
            <button className="contact-close" onClick={closeModal}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Success state */}
            {formSent && (
              <div className="contact-success visible">
                <div className="contact-success-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4.5 4.5L16 6" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="contact-sent-title">Sent.</p>
                <p className="contact-sent-sub">We&apos;ll be in touch shortly.</p>
              </div>
            )}

            {/* Book a call + message form */}
            {!formSent && (
              <>
                <div className="contact-field">
                  <label className="contact-label">Book a call</label>
                  <CalendlyEmbed />
                </div>

                <div className="contact-or">Prefer to send a message?</div>

                <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-row">
                  <div className="contact-field">
                    <label className="contact-label">Name</label>
                    <input
                      className="contact-input"
                      type="text"
                      placeholder="Your name"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="contact-field">
                    <label className="contact-label">Email</label>
                    <input
                      className="contact-input"
                      type="email"
                      placeholder="your@email.com"
                      value={formEmail}
                      onChange={e => setFormEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="contact-field">
                  <label className="contact-label">I&apos;m reaching out about</label>
                  <div className="contact-pills">
                    {["Talent", "Campaigns", "Web / Software", "Other"].map(pill => (
                      <button
                        key={pill}
                        type="button"
                        className={`contact-pill${selectedPill === pill ? " active" : ""}`}
                        onClick={() => setSelectedPill(selectedPill === pill ? null : pill)}
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="contact-field">
                  <label className="contact-label">Message</label>
                  <textarea
                    className="contact-input contact-textarea"
                    rows={4}
                    placeholder="Tell us about your project, timeline, or anything else..."
                    value={formMessage}
                    onChange={e => setFormMessage(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "4px" }}>
                  <button type="submit" className="contact-submit">
                    Send Message
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
                    </svg>
                  </button>
                </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
