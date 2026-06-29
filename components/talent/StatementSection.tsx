"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { text: "The Voice", align: "text-left" },
  { text: "Behind", align: "text-center" },
  { text: "Tomorrow's Stars", align: "text-right" },
];

export default function StatementSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    // Staggered with timeline offsets so reverse plays correctly in reverse order
    linesRef.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(
        el,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
        i === 0 ? 0 : "<0.15"
      );
    });
  }, []);

  return (
    <section
      className="section-full flex items-center justify-center px-6 md:px-16 bg-black"
      ref={containerRef}
      id="statement"
    >
      <div className="w-full max-w-7xl">
        {lines.map((line, i) => (
          <div key={i} className={`block overflow-hidden ${line.align}`}>
            <span
              ref={(el) => { if (el) linesRef.current[i] = el; }}
              className="display block text-[clamp(2rem,8vw,8rem)] font-black uppercase text-white"
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
