"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Users, Mic, Film } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    Icon: Users,
    title: "Talent Management",
    description: "Full-service management for the world's leading digital creators — from brand strategy to deal negotiation.",
    video: "/videos/talent-1.mp4",
  },
  {
    Icon: Mic,
    title: "Brand Partnerships",
    description: "Connecting creators with brands that align with their audience. Authentic campaigns that convert.",
    video: "/videos/talentroster-4.mp4",
  },
  {
    Icon: Film,
    title: "Media Production",
    description: "In-house production for podcasts, video content, and digital campaigns built for scale.",
    video: "/videos/talent-3.mp4",
  },
];

function LazyVideo({ src, className }: { src: string; className: string }) {
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

  return <video ref={ref} src={src} loop muted playsInline preload="none" className={className} />;
}

export default function ServiceCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef   = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", toggleActions: "play none none reverse" },
      });
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        tl.fromTo(card, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, i === 0 ? 0 : "<0.1");
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-16 md:py-24 gap-10 md:gap-12 bg-black" id="services">
      <div>
        <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4 font-sans">What We Do</p>
        <h2 className="display font-black uppercase text-white text-[clamp(2.5rem,6vw,6rem)]">Talent</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {cards.map(({ Icon, title, description, video }, i) => (
          <div
            key={title}
            ref={el => { if (el) cardsRef.current[i] = el; }}
            className="group relative rounded-2xl overflow-hidden flex flex-col justify-end min-h-80 md:min-h-96"
          >
            <div className="absolute inset-0 bg-[#111]">
              <LazyVideo
                src={video}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
            </div>

            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                backgroundImage: "radial-gradient(transparent, transparent, rgba(255,255,255,0.2), transparent, transparent)",
                backgroundSize: "300% 300%",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "destination-out",
                padding: "1px",
                animation: "shine-border 14s linear infinite",
              }}
            />

            <div className="relative z-10 p-4 md:p-5 transition-opacity duration-500 group-hover:opacity-0">
              <div className="liquid-glass rounded-xl p-5 md:p-6 flex flex-col gap-4">
                <div className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-white uppercase tracking-widest text-sm mb-2">{title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed font-sans">{description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
