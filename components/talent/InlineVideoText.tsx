"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface VideoClip {
  src: string;
  alt: string;
}

const clips: VideoClip[] = [
  { src: "/videos/talent-1.mp4", alt: "TopView talent 1" },
  { src: "/videos/talent-2.mp4", alt: "TopView talent 2" },
  { src: "/videos/talent-3.mp4", alt: "TopView talent 3" },
];

function InlineVideo({ src, alt }: VideoClip) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
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

  return (
    <span
      className="inline-block align-middle rounded-lg md:rounded-xl overflow-hidden mx-1.5 md:mx-2 bg-black/10"
      style={{
        height: "clamp(60px, 6vw, 80px)",
        width: "clamp(50px, 6vw, 100px)",
        verticalAlign: "middle",
      }}
      aria-label={alt}
    >
      <video
        ref={ref}
        src={src}
        poster={src.replace("/videos/", "/images/posters/").replace(".mp4", ".jpg")}
        loop
        muted
        playsInline
        preload="none"
        className="w-full h-full object-cover"
      />
    </span>
  );
}

interface InlineVideoTextProps {
  onOpenContact: () => void;
}

export default function InlineVideoText({
  onOpenContact,
}: InlineVideoTextProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 65%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      headingRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
    ).fromTo(
      btnRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "<0.4",
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-full flex flex-col items-start justify-center px-6 md:px-16 gap-10 md:gap-12 bg-black"
      id="showcase"
    >
      <h2
        ref={headingRef}
        className="display text-white font-black uppercase"
        style={{ fontSize: "clamp(2.75rem, 7vw, 7.5rem)" }}
      >
        <span>TopView</span>
        <InlineVideo {...clips[0]} />
        <span>Represents</span>
        <br />
        <span>The Voices</span>
        <InlineVideo {...clips[1]} />
        <span>Shaping</span>
        <br />
        <span>Culture</span>
        <InlineVideo {...clips[2]} />
        <span>Online</span>
      </h2>

      {/* Grouped btn-pair — hovering either turns both white, matching header CTA */}
      <div
        ref={btnRef}
        className="group flex items-center gap-2.5 cursor-none"
        onClick={onOpenContact}
      >
        <button
          aria-label="Contact"
          className="liquid-glass w-11 h-11 rounded-full flex items-center justify-center shrink-0
            text-white/55 group-hover:bg-white group-hover:text-[#111] group-hover:border-transparent
            transition-all duration-300"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:rotate-20">
            <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
          </svg>
        </button>

        <button
          className="liquid-glass inline-flex items-center gap-3 h-11 px-8 rounded-full shrink-0
            text-white text-[12px] font-semibold uppercase tracking-wider
            group-hover:bg-white group-hover:text-[#111] group-hover:border-transparent
            active:scale-95 transition-all duration-300 whitespace-nowrap"
        >
          Get in Touch
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-1">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
