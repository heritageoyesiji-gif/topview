"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MousePointer2, ArrowRight, ChevronDown } from "lucide-react";

const marketingServices = [
  { title: "AI Automation",    num: "01" },
  { title: "Business Branding", num: "02" },
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
      className="fixed top-0 left-0 right-0 z-50 flex items-center
        h-14 md:h-20 px-5 md:px-12
        bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/[0.07]"
    >
      {/* Left: mode pill + services dropdown */}
      <div className="flex items-center gap-5">
        <div
          className="liquid-glass flex items-center gap-1.5 p-1 rounded-full shrink-0"
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

      {/* Center: logo — absolute so it never squeezes the left pill */}
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 select-none"
      >
        <img
          src="/logos/topview-white.png"
          alt="TopView"
          className="h-8 md:h-10 w-auto"
        />
      </Link>

      {/* Right: icon + CTA — grouped so hovering either turns both white */}
      <div
        className="group flex items-center gap-2.5 ml-auto cursor-none"
        onClick={onOpenContact}
      >
        <button
          aria-label="Contact"
          className="liquid-glass w-11 h-11 rounded-full flex items-center justify-center shrink-0
            text-white/55 group-hover:bg-white group-hover:text-[#111] group-hover:border-transparent
            transition-all duration-300"
        >
          <MousePointer2
            size={14} strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:rotate-[20deg]"
          />
        </button>

        <button
          className="liquid-glass hidden md:inline-flex items-center gap-3 h-11 px-8 rounded-full shrink-0
            text-white text-[12px] font-semibold uppercase tracking-wider
            group-hover:bg-white group-hover:text-[#111] group-hover:border-transparent
            active:scale-95 transition-all duration-300 whitespace-nowrap"
        >
          Get in Touch
          <ArrowRight
            size={14} strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
    </header>
  );
}
