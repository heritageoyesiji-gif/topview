"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const GAP = 12;
const getPeekW = (vw: number) => vw < 768 ? 28 : 100;
const getAW = (vw: number) => {
  const pw = getPeekW(vw);
  return Math.max(vw - 2 * (pw + GAP) - (vw < 768 ? 0 : 40), Math.floor(vw * (vw < 768 ? 0.86 : 0.7)));
};

const items = [
  {
    num: "01",
    category: "Campaign Strategy",
    title: "Campaigns",
    description:
      "Data-driven social campaigns architected to generate cultural conversation and measurable ROI.",
    video: "/videos/hero.mp4",
  },
  {
    num: "02",
    category: "Talent Integration",
    title: "Activations",
    description:
      "Immersive brand experiences powered by TopView talent — authentic partnerships that audiences trust.",
    video: "/videos/card-talent.mp4",
  },
  {
    num: "03",
    category: "Content Production",
    title: "Media",
    description:
      "In-house production from concept to delivery. Podcasts, video series, and digital campaigns at scale.",
    video: "/videos/card-media.mp4",
  },
  {
    num: "04",
    category: "Digital Growth",
    title: "Distribution",
    description:
      "Amplification strategy across every platform — putting creators in front of the right audiences.",
    video: "/videos/hero.mp4",
  },
];

function ExploreCircle() {
  return (
    <div className="relative w-24 h-24 shrink-0 pointer-events-none select-none">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        style={{ animation: "explore-rotate 9s linear infinite" }}
        aria-hidden
      >
        <defs>
          <path
            id="bc-ep"
            d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
          />
        </defs>
        <text fill="rgba(255,255,255,0.65)" fontSize="8" letterSpacing="2.8">
          <textPath href="#bc-ep">
            EXPLORE · EXPLORE · EXPLORE · EXPLORE ·
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center">
          <ArrowUpRight size={14} className="text-white/80" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

export default function BrandCollaborations() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const isFirst = useRef(true);
  const pointerX = useRef(0);

  const applyLayout = useCallback((animate: boolean, idx: number) => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    const vw = container.offsetWidth;
    const pw = getPeekW(vw);
    const AW = getAW(vw);
    const x = -(idx * (pw + GAP)) + (vw - AW) / 2;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      if (animate)
        gsap.to(card, {
          width: i === idx ? AW : pw,
          duration: 0.75,
          ease: "power3.inOut",
        });
      else gsap.set(card, { width: i === idx ? AW : pw });
    });
    if (animate) gsap.to(track, { x, duration: 0.75, ease: "power3.inOut" });
    else gsap.set(track, { x });
  }, []);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      applyLayout(false, active);
    } else applyLayout(true, active);
  }, [active, applyLayout]);

  useEffect(() => {
    const onResize = () => applyLayout(false, active);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, applyLayout]);

  useEffect(() => {
    const handleEnded = (e: Event) => {
      const v = e.target as HTMLVideoElement;
      v.currentTime = 0;
      v.play().catch(() => {});
    };
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === active) {
        vid.play().catch(() => {});
        vid.addEventListener("ended", handleEnded);
      } else {
        vid.pause();
        vid.removeEventListener("ended", handleEnded);
      }
    });
    return () => {
      videoRefs.current.forEach(vid => { if (vid) vid.removeEventListener("ended", handleEnded); });
    };
  }, [active]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(
          titleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        )
        .fromTo(
          containerRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
          "<0.15",
        );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setActive((a) => Math.max(0, a - 1));
      if (e.key === "ArrowRight")
        setActive((a) => Math.min(items.length - 1, a + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const prev = () => setActive((a) => Math.max(0, a - 1));
  const next = () => setActive((a) => Math.min(items.length - 1, a + 1));

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center py-14 md:py-24 gap-8 md:gap-10 bg-black overflow-hidden"
      id="collaborations"
    >
      {/* Section header */}
      <div
        ref={titleRef}
        className="px-6 md:px-16 flex items-end justify-between"
      >
        <div>
          <p className="font-sans text-white/40 text-xs uppercase tracking-[0.3em] mb-4">
            What We Do
          </p>
          <h2 className="display font-black uppercase text-white text-[clamp(2.5rem,6vw,6rem)] leading-none">
            Brand
            <br />
            Collaborations
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={prev}
            disabled={active === 0}
            className="liquid-glass w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 disabled:opacity-20 transition-all duration-300"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            disabled={active === items.length - 1}
            className="liquid-glass w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 disabled:opacity-20 transition-all duration-300"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={containerRef}
        className="w-full select-none"
        onPointerDown={(e) => {
          pointerX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          const dx = e.clientX - pointerX.current;
          if (Math.abs(dx) > 60) dx < 0 ? next() : prev();
        }}
      >
        <div ref={trackRef} className="flex" style={{ gap: `${GAP}px` }}>
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <div
                key={i}
                ref={(el) => {
                  if (el) cardRefs.current[i] = el;
                }}
                onClick={() => {
                  if (!isActive) setActive(i);
                }}
                className={`group relative shrink-0 rounded-3xl overflow-hidden bg-zinc-900 h-100 md:h-140 ${!isActive ? "cursor-pointer" : ""}`}
              >
                {/* Video bg */}
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[i] = el;
                  }}
                  src={item.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    isActive
                      ? "opacity-55 group-hover:opacity-75"
                      : "opacity-20"
                  }`}
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 65%, rgba(0,0,0,0.2) 100%)"
                      : "rgba(0,0,0,0.55)",
                  }}
                />

                {/* Active card content — EXPLORE badge stays; text fades on hover */}
                {isActive && (
                  <div
                    className="absolute inset-0 flex items-center"
                    style={{
                      paddingLeft: "clamp(2rem, 10%, 6rem)",
                      animation: "card-content-in 0.5s ease 0.3s both",
                    }}
                  >
                    <div className="flex items-center gap-8 md:gap-12">
                      <ExploreCircle />
                      <div className="flex flex-col gap-3 transition-opacity duration-500 group-hover:opacity-0">
                        <div className="liquid-glass inline-block px-3 py-1 rounded-full mb-1">
                          <p className="text-white/65 text-[10px] uppercase tracking-[0.25em] font-sans">
                            {item.category}
                          </p>
                        </div>
                        <h3
                          className="display font-black uppercase text-white leading-none"
                          style={{ fontSize: "clamp(1.8rem, 4vw, 4rem)" }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="font-sans text-white/50 text-xs uppercase tracking-wider leading-relaxed"
                          style={{ maxWidth: "240px" }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="liquid-glass absolute bottom-5 right-5 px-2.5 py-1 rounded-full">
                  <span className="text-white/55 text-[10px] font-mono">
                    {item.num}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot nav */}
      <div className="flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-500 ${i === active ? "w-8 h-1 bg-white" : "w-2 h-1 bg-white/25 hover:bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
