"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FooterCTAProps {
  onOpenContact: () => void;
}

// Rotating text + center icon badge
function ExploreBadge({ pathId, text, children }: { pathId: string; text: string; children: ReactNode }) {
  return (
    <div className="explore-badge">
      <svg className="explore-ring" viewBox="0 0 130 130">
        <defs>
          <path id={pathId} d="M65,65 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" />
        </defs>
        <text fontSize="12.5" fill="white" fontFamily="Helvetica Neue,Arial,sans-serif" fontWeight="600" letterSpacing="3">
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <div className="explore-arrow">{children}</div>
    </div>
  );
}

export default function FooterCTA({ onOpenContact }: FooterCTAProps) {
  const sectionRef  = useRef<HTMLElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const leftRef     = useRef<HTMLButtonElement>(null);
  const rightRef    = useRef<HTMLButtonElement>(null);
  const footerRef   = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);

  // Video play/pause on intersection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => { video.currentTime = 0; video.play().catch(() => {}); };
    video.addEventListener("ended", handleEnded);
    const observer = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? video.play().catch(() => {}) : video.pause(); },
      { rootMargin: "400px 0px", threshold: 0.1 }
    );
    observer.observe(video);
    return () => { observer.disconnect(); video.removeEventListener("ended", handleEnded); };
  }, []);

  // Bidirectional iris reveal via IntersectionObserver
  // Opens when scrolling down into view, closes when scrolling back up
  useEffect(() => {
    const wrap = wrapRef.current;
    const section = sectionRef.current;
    if (!wrap || !section) return;

    wrap.style.transition = "clip-path 1.2s cubic-bezier(0.77, 0, 0.18, 1)";
    wrap.style.clipPath = "circle(0% at 50% 40%)";

    const obs = new IntersectionObserver(
      ([entry]) => {
        wrap.style.clipPath = entry.isIntersecting
          ? "circle(150% at 50% 40%)"
          : "circle(0% at 50% 40%)";
      },
      { threshold: 0.35 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  // GSAP stagger for footer bar
  useEffect(() => {
    if (!sectionRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
    tl.fromTo(leftRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" }
    ).fromTo(rightRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" },
      "<0.1"
    ).fromTo(footerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative flex flex-col bg-black overflow-hidden"
      style={{ minHeight: "100svh" }}
      id="contact"
    >
      {/* Full-bleed video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="/videos/footer.mp4"
          poster="/images/posters/footer.jpg"
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/62" />
      </div>

      {/* Iris-clipped content wrapper */}
      <div ref={wrapRef} className="absolute inset-0 z-10 flex flex-col">
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        {/* ── CTA panels ── */}
        <div
          className="relative flex-1 flex flex-col md:flex-row"
          style={{ paddingTop: "88px", minHeight: "62svh" }}
        >
          {/* Left: Request Roster */}
          <button
            ref={leftRef}
            onClick={onOpenContact}
            className="footer-panel group flex-1 flex flex-col justify-end p-7 md:p-12 text-left
              border-b border-white/8 md:border-b-0
              relative overflow-hidden cursor-none"
            style={{ opacity: 0 }}
          >
            <ExploreBadge pathId="fp-left" text="EXPLORE / EXPLORE / EXPLORE /">
              ↗
            </ExploreBadge>

            <h2
              className="display font-semibold uppercase text-white leading-[0.95] whitespace-nowrap"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 7rem)" }}
            >
              Request<br />
              <span className="inline-flex items-center gap-[0.1em]">
                Roster
                <svg
                  style={{ width: "0.65em", height: "0.65em", flexShrink: 0, marginLeft: "0.1em" }}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
            </h2>
          </button>

          {/* Right: Get In Touch */}
          <button
            ref={rightRef}
            onClick={onOpenContact}
            className="footer-panel group flex-1 flex flex-col justify-end p-7 md:p-12 md:items-end text-left md:text-right
              relative overflow-hidden cursor-none"
            style={{ opacity: 0 }}
          >
            <ExploreBadge pathId="fp-right" text="SAY HELLO / SAY HELLO / SAY HELLO /">
              {/* Cursor-pointer icon — wiggles on panel hover via cursor-nudge in globals.css */}
              <svg
                className="footer-cursor-icon"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                width="20" height="20"
              >
                <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
              </svg>
            </ExploreBadge>

            <h2
              className="display font-semibold uppercase text-white leading-[0.95] whitespace-nowrap"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 7rem)" }}
            >
              <span className="inline-flex items-center gap-[0.1em]">
                <svg
                  className="footer-cursor-icon"
                  style={{ width: "0.65em", height: "0.65em", flexShrink: 0, marginRight: "0.1em" }}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
                </svg>
                Get In
              </span><br />
              Touch
            </h2>
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="relative h-px bg-white/10" />

        {/* ── Footer bar ── */}
        <div
          ref={footerRef}
          style={{ opacity: 0 }}
          className="relative grid grid-cols-2 md:grid-cols-3 gap-y-8 px-7 md:px-14 py-10"
        >
          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            {["Talent", "Marketing", "Contact"].map((item) => (
              <span
                key={item}
                onClick={item === "Contact" ? onOpenContact : undefined}
                className="footer-nav-link text-white/40 text-[11px] font-semibold uppercase tracking-[0.2em]
                  hover:text-white transition-colors duration-200 cursor-none w-fit relative"
              >
                {item}
              </span>
            ))}
          </nav>

          {/* Tagline — desktop only */}
          <div className="hidden md:flex flex-col items-center justify-start gap-1">
            <p className="text-white/30 text-[10px] font-sans uppercase tracking-widest text-center">
              The Next Digital
            </p>
            <p className="text-white/30 text-[10px] font-sans uppercase tracking-widest text-center">
              Generation
            </p>
          </div>

          {/* Socials — icon row, right-aligned */}
          <div className="flex items-start justify-end gap-5">
            <a href="#" aria-label="Instagram" className="text-white/40 hover:text-white transition-colors duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter / X" className="text-white/40 hover:text-white transition-colors duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" aria-label="TikTok" className="text-white/40 hover:text-white transition-colors duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.06a8.16 8.16 0 0 0 4.78 1.53V7.14a4.85 4.85 0 0 1-1.02-.45z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── Copyright ── */}
        <div className="relative border-t border-white/8 px-7 md:px-14 py-5 flex items-center justify-between">
          <span className="text-white/20 text-[10px] font-sans uppercase tracking-widest">© 2026 TopView</span>
          <span className="text-white/20 text-[10px] font-sans uppercase tracking-widest">All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}
