"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const heroLines = ["We Build", "What The", "Internet", "Talks About"];

const services = [
  {
    title: "AI Automation",
    num: "01",
    desc: "Intelligent workflows, content pipelines, and AI-powered systems that scale your output without scaling headcount.",
    tags: ["GPT Integrations", "Workflow Automation", "Content Scaling"],
  },
  {
    title: "Website Design",
    num: "02",
    desc: "Conversion-first websites and landing pages built to perform at every scroll — from brand to checkout.",
    tags: ["UI/UX Design", "Landing Pages", "E-Commerce"],
  },
  {
    title: "SEO Optimization",
    num: "03",
    desc: "Organic reach that compounds. We build search presence that works long after the campaign ends.",
    tags: ["Technical SEO", "Content Strategy", "Local & National"],
  },
  {
    title: "DevOps",
    num: "04",
    desc: "Infrastructure, CI/CD pipelines, and backend systems engineered to scale with your growth trajectory.",
    tags: ["Cloud Infrastructure", "CI/CD", "Performance"],
  },
];

const stats = [
  { value: "200+", label: "Brands Scaled" },
  { value: "50M+", label: "Combined Reach" },
  { value: "5+",   label: "Years in Market" },
];

const marqueeText = [
  "Brand Awareness", "Viral Campaigns", "Content Strategy",
  "Social Growth", "Digital Marketing", "Audience Building",
  "Creator Economy", "Influencer Marketing",
];

const projects = [
  {
    client: "Fresh Prep Co.",
    category: "AI Automation",
    tag: "Campaign Strategy",
    year: "2024",
    image: "/images/work/meal-prep.jpg",
  },
  {
    client: "Civil Law Group",
    category: "Website Design",
    tag: "Web + App",
    year: "2024",
    image: "/images/work/law-firm.jpg",
  },
  {
    client: "Moroccan Tea Co.",
    category: "Website Design",
    tag: "Packaging + Brand",
    year: "2025",
    image: "/images/work/moroccan-tea.jpg",
  },
  {
    client: "Nomad Tax",
    category: "Website Design",
    tag: "Product Design",
    year: "2025",
    image: "/images/work/nomad-tax.jpg",
  },
  {
    client: "Bud Light",
    category: "AI Automation",
    tag: "Campaign Strategy",
    year: "2024",
    image: "/images/work/bud-light.jpg",
  },
  {
    client: "Schiffer Health",
    category: "SEO Optimization",
    tag: "E-Commerce",
    year: "2025",
    image: "/images/work/colostrum.jpg",
  },
  {
    client: "Fitness Girls",
    category: "AI Automation",
    tag: "Brand Campaign",
    year: "2025",
    image: "/images/work/fitness-girls.jpg",
  },
];

interface MarketingPageProps {
  visible: boolean;
  onOpenContact: () => void;
}

export default function MarketingPage({ visible, onOpenContact }: MarketingPageProps) {
  const linesRef      = useRef<HTMLDivElement[]>([]);
  const subRef        = useRef<HTMLParagraphElement>(null);
  const btnRef        = useRef<HTMLDivElement>(null);
  const proofRef      = useRef<HTMLDivElement>(null);
  const textMarqRef   = useRef<HTMLDivElement>(null);
  const imgMarqRef    = useRef<HTMLDivElement>(null);
  const statsRef      = useRef<HTMLDivElement[]>([]);
  const workHeadRef   = useRef<HTMLDivElement>(null);
  const workItemsRef  = useRef<HTMLDivElement[]>([]);
  const svcRef        = useRef<HTMLDivElement[]>([]);
  const ctaSectionRef = useRef<HTMLElement>(null);
  const ctaLeftRef    = useRef<HTMLButtonElement>(null);
  const ctaRightRef   = useRef<HTMLButtonElement>(null);
  const footerVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = footerVideoRef.current;
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
    const el = textMarqRef.current;
    if (!el) return;
    const total = el.scrollWidth / 2;
    const t = gsap.to(el, { x: -total, duration: 28, ease: "none", repeat: -1 });
    return () => { t.kill(); };
  }, []);

  useEffect(() => {
    const el = imgMarqRef.current;
    if (!el) return;
    const total = el.scrollWidth / 2;
    const t = gsap.to(el, { x: -total, duration: 45, ease: "none", repeat: -1 });
    return () => { t.kill(); };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const ctx = gsap.context(() => {
      gsap.set(linesRef.current, { y: "110%" });
      gsap.set([subRef.current, btnRef.current, proofRef.current], { opacity: 0, y: 20 });
      gsap.timeline()
        .to(linesRef.current, { y: "0%", duration: 1.0, ease: "power4.out", stagger: 0.09 })
        .to(subRef.current,   { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .to(btnRef.current,   { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
        .to(proofRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
    });
    return () => ctx.revert();
  }, [visible]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const statsTl = gsap.timeline({
        scrollTrigger: { trigger: statsRef.current[0], start: "top 80%", toggleActions: "play none none reverse" },
      });
      statsRef.current.forEach((el, i) => {
        if (!el) return;
        statsTl.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, i === 0 ? 0 : "<0.1");
      });

      gsap.fromTo(workHeadRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: workHeadRef.current, start: "top 80%", toggleActions: "play none none reverse" } }
      );

      workItemsRef.current.forEach((item) => {
        if (!item) return;
        gsap.fromTo(item,
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none reverse" } }
        );
      });

      svcRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 82%", toggleActions: "play none none reverse" } }
        );
      });

      if (ctaLeftRef.current && ctaRightRef.current) {
        gsap.timeline({
          scrollTrigger: { trigger: ctaSectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
        })
          .fromTo(ctaLeftRef.current,  { xPercent: -100, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out" })
          .fromTo(ctaRightRef.current, { xPercent: 100, opacity: 0 },  { xPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out" }, "<");
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-black">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="section-full flex flex-col items-start justify-end pb-16 md:pb-20 px-6 md:px-16 relative overflow-hidden">
        <span
          className="absolute right-[-2%] top-1/2 -translate-y-1/2 display font-black uppercase text-black/4 select-none pointer-events-none"
          style={{ fontSize: "clamp(10rem, 28vw, 30rem)", lineHeight: 1 }}
          aria-hidden
        >
          MKT
        </span>

        <div className="relative z-10 w-full max-w-6xl">
          <p ref={subRef} style={{ opacity: 0 }} className="text-black/40 text-xs uppercase tracking-[0.3em] mb-8 font-sans">
            TopView Marketing
          </p>

          <div className="flex flex-col">
            {heroLines.map((line, i) => (
              <div key={i} className="overflow-hidden leading-none">
                <div
                  ref={el => { if (el) linesRef.current[i] = el; }}
                  className="display font-black uppercase text-black"
                  style={{ fontSize: "clamp(2.5rem, 9vw, 9rem)", transform: "translateY(110%)" }}
                >
                  {line}
                </div>
              </div>
            ))}
          </div>

          <div ref={btnRef} className="mt-10 flex flex-wrap items-center gap-4" style={{ opacity: 0 }}>
            <button
              onClick={onOpenContact}
              className="inline-flex items-center h-14 px-10 rounded-full text-[13px] font-bold uppercase tracking-[0.15em]
                bg-black text-white hover:bg-zinc-900 active:scale-95 transition-all duration-300"
            >
              Start a Project
            </button>
            <p className="text-black/40 text-xs font-sans">
              Digital marketing, design &amp; AI automation for brands built to lead.
            </p>
          </div>

          {/* Proof strip */}
          <div ref={proofRef} className="flex items-center gap-4 mt-8" style={{ opacity: 0 }}>
            <div className="flex -space-x-3">
              {projects.slice(0, 5).map((p, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-[#F8F6F2] overflow-hidden bg-zinc-200"
                  style={{ zIndex: 5 - i }}
                >
                  <img src={p.image} alt={p.client} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-black/40 text-xs font-sans uppercase tracking-widest">200+ brands scaled</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-black/6" />
      </section>

      {/* ── Image marquee ──────────────────────────────────────────── */}
      <div className="py-5 overflow-hidden bg-[#F0EDE7] border-y border-black/8">
        <div ref={imgMarqRef} className="flex gap-4 w-max">
          {[...projects, ...projects].map((p, i) => (
            <div
              key={i}
              className="group relative shrink-0 overflow-hidden bg-zinc-200"
              style={{ width: "208px", height: "140px", borderRadius: "10px" }}
            >
              <img
                src={p.image}
                alt={p.client}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-10 md:py-16 border-b border-black/6">
        <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-black/6">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              ref={el => { if (el) statsRef.current[i] = el; }}
              className="flex flex-col gap-1 md:gap-2 py-6 md:py-0 md:px-6 md:first:pl-0 md:last:pr-0 border-b border-black/6 last:border-b-0 md:border-b-0"
            >
              <span className="display font-black text-black" style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>
                {value}
              </span>
              <span className="text-black/40 text-xs uppercase tracking-widest font-sans">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Selected Work ─────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-14 md:py-24 flex flex-col gap-12 md:gap-16">

        <div ref={workHeadRef} className="flex items-end justify-between">
          <div>
            <p className="text-black/40 text-xs uppercase tracking-[0.3em] mb-4 font-sans">Portfolio</p>
            <h2 className="display font-black uppercase text-black" style={{ fontSize: "clamp(2.5rem,6vw,6rem)" }}>
              Selected Work
            </h2>
          </div>
          <span className="text-black/30 text-xs uppercase tracking-widest font-sans hidden md:block">
            {projects.length} Projects
          </span>
        </div>

        {/* 01 — Featured: full-width cinematic */}
        <div
          ref={el => { if (el) workItemsRef.current[0] = el; }}
          className="flex flex-col gap-4"
        >
          <div className="group relative w-full overflow-hidden" style={{ aspectRatio: "21/9" }}>
            <img
              src={projects[0].image}
              alt={projects[0].client}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <h3 className="display font-black uppercase text-white" style={{ fontSize: "clamp(1.5rem,4vw,4rem)" }}>
                {projects[0].client}
              </h3>
              <span className="text-white/50 text-xs font-sans uppercase tracking-widest hidden md:block">
                {projects[0].tag}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/35 text-xs font-mono">01</span>
            <span className="text-black/40 text-xs font-sans uppercase tracking-widest">{projects[0].category} · {projects[0].year}</span>
          </div>
        </div>

        {/* 02 + 03 — Two portrait cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {projects.slice(1, 3).map((p, i) => (
            <div
              key={p.client}
              ref={el => { if (el) workItemsRef.current[i + 1] = el; }}
              className="flex flex-col gap-4"
            >
              <div className="group relative w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <img
                  src={p.image}
                  alt={p.client}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="font-sans font-medium text-black text-sm">{p.client}</p>
                  <p className="text-black/40 text-xs font-sans uppercase tracking-widest mt-0.5">{p.tag}</p>
                </div>
                <span className="text-black/25 text-xs font-mono shrink-0 ml-4">0{i + 2}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 04 + 05 + 06 — Three square cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {projects.slice(3, 6).map((p, i) => (
            <div
              key={p.client}
              ref={el => { if (el) workItemsRef.current[i + 3] = el; }}
              className="flex flex-col gap-4"
            >
              <div className="group relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
                <img
                  src={p.image}
                  alt={p.client}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="font-sans font-medium text-black text-sm">{p.client}</p>
                  <p className="text-black/40 text-xs font-sans uppercase tracking-widest mt-0.5">{p.category}</p>
                </div>
                <span className="text-black/25 text-xs font-mono shrink-0 ml-4">0{i + 4}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 07 — More work: full-width landscape */}
        <div
          ref={el => { if (el) workItemsRef.current[6] = el; }}
          className="flex flex-col gap-4"
        >
          <div className="group relative w-full overflow-hidden" style={{ aspectRatio: "21/9" }}>
            <img
              src={projects[6].image}
              alt={projects[6].client}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <h3 className="display font-black uppercase text-white" style={{ fontSize: "clamp(1.5rem,4vw,4rem)" }}>
                {projects[6].client}
              </h3>
              <span className="text-white/50 text-xs font-sans uppercase tracking-widest hidden md:block">
                {projects[6].tag}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/35 text-xs font-mono">07</span>
            <span className="text-black/40 text-xs font-sans uppercase tracking-widest">{projects[6].category} · {projects[6].year}</span>
          </div>
        </div>

      </section>

      {/* ── Services ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-14 md:py-24 border-t border-black/6" id="marketing-services">
        <div className="mb-14">
          <p className="text-black/40 text-xs uppercase tracking-[0.3em] mb-4 font-sans">What We Build</p>
          <h2 className="display font-black uppercase text-black" style={{ fontSize: "clamp(2.5rem,6vw,6rem)" }}>Services</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-0 items-start">

          {/* Left — numbered service list */}
          <div className="flex-1 border-t border-black/8">
            {services.map(({ title, num, desc, tags }, i) => (
              <div
                key={title}
                ref={el => { if (el) svcRef.current[i] = el; }}
                className="group border-b border-black/8 py-9 md:py-12 cursor-default
                  hover:bg-black/[0.025] -mx-6 md:-mx-0 px-6 md:px-0 transition-colors duration-400"
              >
                {/* Top row: num + title + arrow */}
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-5 md:gap-8 flex-1 min-w-0">
                    <span className="text-black/25 text-xs font-mono tracking-wider mt-1.5 shrink-0">{num}</span>
                    <h3
                      className="display font-black uppercase text-black leading-[0.92] transition-colors duration-300"
                      style={{ fontSize: "clamp(2.2rem, 4.5vw, 5.5rem)" }}
                    >
                      {title}
                    </h3>
                  </div>
                  <svg
                    width="22" height="22" viewBox="0 0 22 22" fill="none"
                    className="shrink-0 mt-2 text-black/20 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                  >
                    <path d="M4 18L18 4M18 4H8M18 4V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Description + tags — reveal on hover */}
                <div className="ml-0 md:ml-[calc(1rem+2rem+1.25rem)] mt-4 flex flex-col gap-4
                  max-h-0 overflow-hidden opacity-0
                  group-hover:max-h-40 group-hover:opacity-100
                  transition-all duration-500 ease-in-out">
                  <p className="text-black/50 text-sm leading-relaxed font-sans max-w-lg">{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full border border-black/12
                          text-black/45 text-[11px] font-sans uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right — sticky CTA panel */}
          <div className="hidden md:flex md:w-84 shrink-0 sticky top-24 ml-16 flex-col gap-6 rounded-2xl bg-[#111] p-8">
            <div className="liquid-glass self-start inline-flex items-center gap-2 px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-white/70 text-[11px] font-sans uppercase tracking-[0.18em] whitespace-nowrap">
                Taking new clients
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h3
                className="display font-black uppercase text-white leading-none"
                style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.6rem)" }}
              >
                Let's build something they can't ignore.
              </h3>
              <p className="text-white/45 text-sm leading-relaxed font-sans">
                Walk us through your brand — we'll show you exactly where we'd take it.
              </p>
            </div>

            <button
              onClick={onOpenContact}
              className="inline-flex items-center justify-center h-14 w-full rounded-xl bg-white text-black
                text-[13px] font-bold uppercase tracking-[0.15em]
                hover:bg-white/90 active:scale-95 transition-all duration-300"
            >
              Start a Project
            </button>
          </div>

        </div>

        {/* Mobile-only CTA */}
        <div className="md:hidden mt-10 pt-8 border-t border-black/8">
          <button
            onClick={onOpenContact}
            className="inline-flex items-center justify-center h-14 w-full rounded-xl bg-black text-white
              text-[13px] font-bold uppercase tracking-[0.15em]
              hover:bg-zinc-900 active:scale-95 transition-all duration-300"
          >
            Start a Project
          </button>
        </div>

      </section>

      {/* ── Text marquee strip ────────────────────────────────────── */}
      <div className="py-5 bg-black overflow-hidden border-y border-white/5">
        <div ref={textMarqRef} className="flex whitespace-nowrap" style={{ width: "max-content" }}>
          {[...marqueeText, ...marqueeText].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-8 text-white/50 text-[11px] uppercase tracking-[0.25em] font-sans px-8">
              {item}
              <span className="text-white/20">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── CTA Footer ────────────────────────────────────────────── */}
      <section
        ref={ctaSectionRef}
        className="section-full flex flex-col items-center justify-center relative bg-black overflow-hidden"
        id="marketing-contact"
      >
        {/* Full-bleed video */}
        <div className="absolute inset-0 z-0">
          <video
            ref={footerVideoRef}
            src="/videos/footer.mp4"
            loop
            muted
            playsInline
            preload="none"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/62" />
        </div>

        <div className="relative z-10 w-full flex flex-col md:flex-row items-stretch">
          <button
            ref={ctaLeftRef}
            onClick={onOpenContact}
            className="flex-1 flex items-center justify-center p-10 md:p-16 text-center group md:border-r md:border-white/8"
          >
            <span
              className="display font-black uppercase text-white/20 group-hover:text-white transition-colors duration-500"
              style={{ fontSize: "clamp(2rem, 5.5vw, 5.5rem)" }}
            >
              Start a Project
            </span>
          </button>
          <button
            ref={ctaRightRef}
            onClick={onOpenContact}
            className="flex-1 flex items-center justify-center p-10 md:p-16 text-center group"
          >
            <span
              className="display font-black uppercase text-white/20 group-hover:text-white transition-colors duration-500"
              style={{ fontSize: "clamp(2rem, 5.5vw, 5.5rem)" }}
            >
              Say Hello
            </span>
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between text-white/25 text-xs uppercase tracking-widest font-sans">
          <span>© 2026 TopView</span>
          <span>Marketing &amp; Software</span>
        </div>
      </section>

    </div>
  );
}
