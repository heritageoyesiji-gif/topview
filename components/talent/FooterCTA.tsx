"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FooterCTAProps {
  onOpenContact: () => void;
}

export default function FooterCTA({ onOpenContact }: FooterCTAProps) {
  const sectionRef  = useRef<HTMLElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const footerRef   = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);

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
    )
    .fromTo(rightRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" },
      "<0.1"
    )
    .fromTo(footerRef.current,
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
      {/* Full-bleed video — covers the entire section */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="/videos/footer.mp4"
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/62" />
      </div>

      {/* ── CTA area — fills upper portion, text anchored to bottom ── */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row" style={{ minHeight: "62svh" }}>

        {/* Left: Request Roster */}
        <button
          onClick={onOpenContact}
          className="group flex-1 flex flex-col justify-end p-8 md:p-14 text-left
            border-b border-white/8 md:border-b-0 md:border-r md:border-white/8"
        >
          <div ref={leftRef} style={{ opacity: 0 }}>
            <div className="liquid-glass inline-block px-3.5 py-1.5 rounded-full mb-5">
              <p className="text-white/60 text-[10px] font-sans uppercase tracking-[0.25em]">
                01 · Talent Access
              </p>
            </div>
            <h2
              className="display font-black uppercase leading-none
                text-white/20 group-hover:text-white transition-colors duration-500"
              style={{ fontSize: "clamp(3rem, 7.5vw, 8rem)" }}
            >
              Request<br />Roster
            </h2>
          </div>
        </button>

        {/* Right: Get in Touch */}
        <button
          onClick={onOpenContact}
          className="group flex-1 flex flex-col justify-end p-8 md:p-14 md:items-end text-left md:text-right"
        >
          <div ref={rightRef} style={{ opacity: 0 }}>
            <div className="liquid-glass inline-block px-3.5 py-1.5 rounded-full mb-5">
              <p className="text-white/60 text-[10px] font-sans uppercase tracking-[0.25em]">
                02 · Partnership
              </p>
            </div>
            <h2
              className="display font-black uppercase leading-none
                text-white/20 group-hover:text-white transition-colors duration-500"
              style={{ fontSize: "clamp(3rem, 7.5vw, 8rem)" }}
            >
              Get In<br />Touch
            </h2>
          </div>
        </button>

      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="relative z-10 h-px bg-white/10" />

      {/* ── Footer row — sits below the divider over the same video ── */}
      <div
        ref={footerRef}
        style={{ opacity: 0 }}
        className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-y-10 px-8 md:px-14 py-12"
      >
        {/* Nav links */}
        <div className="flex flex-col gap-2.5">
          {["Talent", "Marketing", "Contact"].map((item) => (
            <span
              key={item}
              onClick={item === "Contact" ? onOpenContact : undefined}
              className="text-white/40 text-xs font-sans uppercase tracking-widest
                hover:text-white transition-colors duration-300 cursor-pointer w-fit"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Tagline — hidden on mobile, centered on desktop */}
        <div className="hidden md:flex flex-col items-center justify-start gap-1 pt-0.5">
          <p className="text-white/30 text-xs font-sans uppercase tracking-widest text-center">
            The Next Digital
          </p>
          <p className="text-white/30 text-xs font-sans uppercase tracking-widest text-center">
            Generation
          </p>
        </div>

        {/* Socials — right aligned */}
        <div className="flex flex-col gap-2.5 items-end">
          {["Instagram", "Twitter", "TikTok"].map((s) => (
            <a
              key={s}
              href="#"
              className="text-white/40 text-xs font-sans uppercase tracking-widest
                hover:text-white transition-colors duration-300"
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      {/* ── Copyright strip ─────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-white/8 px-8 md:px-14 py-5 flex items-center justify-between">
        <span className="text-white/20 text-[10px] font-sans uppercase tracking-widest">
          © 2026 TopView
        </span>
        <span className="text-white/20 text-[10px] font-sans uppercase tracking-widest">
          All Rights Reserved
        </span>
      </div>

    </footer>
  );
}
