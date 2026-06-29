"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MousePointer2, ArrowRight, ChevronDown } from "lucide-react";

const marketingServices = [
  { title: "AI Automation",    num: "01" },
  { title: "Website Design",   num: "02" },
  { title: "SEO Optimization", num: "03" },
  { title: "DevOps",           num: "04" },
];

interface HeaderProps {
  mode: "talent" | "marketing";
  onToggle: () => void;
  onOpenContact: () => void;
}

export default function Header({ mode, onToggle, onOpenContact }: HeaderProps) {
  const headerRef    = useRef<HTMLElement>(null);
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!servicesOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [servicesOpen]);

  // Close when switching away from marketing
  useEffect(() => {
    if (mode !== "marketing") setServicesOpen(false);
  }, [mode]);

  const scrollToServices = () => {
    const el = document.getElementById("marketing-services");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setServicesOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center
        h-14 md:h-20 px-5 md:px-12
        bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/[0.07]"
    >
      {/* Col 1 — left: mode pill + services dropdown */}
      <div className="flex items-center gap-5">
        <div
          className="liquid-glass flex items-center gap-0.75 p-0.75 rounded-full shrink-0"
          style={{ background: "rgba(255,255,255,0.09)" }}
        >
          <button
            onClick={() => mode !== "talent" && onToggle()}
            className={`inline-flex items-center h-7 md:h-9 px-4 md:px-7 rounded-full text-[10px] md:text-[12px] font-semibold uppercase tracking-wider
              transition-all duration-300 whitespace-nowrap
              ${mode === "talent"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white/85"
              }`}
          >
            Talent
          </button>
          <button
            onClick={() => mode !== "marketing" && onToggle()}
            className={`inline-flex items-center h-7 md:h-9 px-4 md:px-7 rounded-full text-[10px] md:text-[12px] font-semibold uppercase tracking-wider
              transition-all duration-300 whitespace-nowrap
              ${mode === "marketing"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white/85"
              }`}
          >
            Marketing
          </button>
        </div>

        {/* Services dropdown — marketing mode only */}
        {mode === "marketing" && (
          <div ref={dropdownRef} className="relative hidden md:block">
            <button
              onClick={() => setServicesOpen(o => !o)}
              className="flex items-center gap-1.5 text-white/45 hover:text-white
                text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-300 whitespace-nowrap"
            >
              Services
              <ChevronDown
                size={11}
                strokeWidth={2.5}
                className={`transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {servicesOpen && (
              <div
                className="absolute top-[calc(100%+10px)] left-0 rounded-xl overflow-hidden min-w-55 z-50 py-1
                  border border-black/8 shadow-lg"
                style={{ background: "#fff" }}
              >
                {marketingServices.map(({ title, num }) => (
                  <button
                    key={title}
                    onClick={scrollToServices}
                    className="w-full flex items-center justify-between px-5 py-3 text-left
                      text-black/50 hover:text-black hover:bg-black/[0.04]
                      text-[11px] font-sans uppercase tracking-[0.18em] transition-colors duration-200"
                  >
                    <span>{title}</span>
                    <span className="text-black/25 font-mono text-[10px] ml-4">[{num}]</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Col 2 — center: logo */}
      <a
        href="/"
        className="font-bold text-white text-[15px] tracking-[0.22em] uppercase select-none"
      >
        TopView
      </a>

      {/* Col 3 — right: icon button + CTA */}
      <div className="flex items-center justify-end gap-2.5">
        <button
          aria-label="Contact"
          onClick={onOpenContact}
          className="liquid-glass w-9 h-9 rounded-full flex items-center justify-center shrink-0
            text-white/55 hover:text-white transition-colors duration-300"
          style={{ background: "rgba(255,255,255,0.09)" }}
        >
          <MousePointer2 size={13} strokeWidth={1.5} />
        </button>

        <button
          onClick={onOpenContact}
          className="liquid-glass hidden md:inline-flex items-center gap-3 h-11 px-8 rounded-full shrink-0
            text-white text-[12px] font-semibold uppercase tracking-wider
            hover:brightness-125 active:scale-95 transition-all duration-300 whitespace-nowrap"
        >
          Get in Touch
          <ArrowRight size={13} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}
