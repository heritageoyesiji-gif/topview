"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HeroSectionProps {
  loaded: boolean;
  onOpenContact: () => void;
}

export default function HeroSection({ loaded, onOpenContact }: HeroSectionProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const btnRef  = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => { video.currentTime = 0; video.play().catch(() => {}); };
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    gsap.fromTo(textRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.15 });
    gsap.fromTo(btnRef.current,  { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.4 });
  }, [loaded]);

  return (
    <section className="section-full relative flex flex-col items-center justify-center md:justify-end pb-0 md:pb-20 bg-black" id="hero">
      <div className="absolute inset-0 z-0">
        {/* Hidden on mobile — saves the 87MB download */}
        <video
          ref={videoRef}
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="hidden md:block w-full h-full object-cover"
        />
        {/* Mobile gradient background */}
        <div className="md:hidden absolute inset-0 bg-linear-to-b from-[#0a0a0a] via-[#111] to-black" />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent" />
      </div>

      <div className="relative z-10 text-center max-w-3xl px-6 flex flex-col items-center gap-6 md:gap-0">
        {/* Mobile-only headline */}
        <h1
          className="display font-black uppercase text-white leading-[0.9] md:hidden"
          style={{ fontSize: "clamp(5rem, 22vw, 7rem)" }}
        >
          Top<br />View
        </h1>

        <div ref={textRef} style={{ opacity: 0 }} className="md:mb-8">
          <p className="font-sans text-white/55 text-[11px] font-medium uppercase tracking-[0.3em]">
            The Authority on the Next Digital Generation
          </p>
        </div>
        <div ref={btnRef} style={{ opacity: 0 }}>
          <button
            onClick={onOpenContact}
            className="liquid-glass font-sans inline-flex items-center gap-3 h-14 px-10 rounded-full text-[13px] font-bold uppercase tracking-[0.15em]
              border border-white/35 text-white hover:bg-white hover:text-black active:scale-95 transition-all duration-300"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  );
}
