"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

export default function StatementSection() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const innerRef      = useRef<HTMLDivElement>(null);
  const line1Ref      = useRef<HTMLDivElement>(null);
  const line2Ref      = useRef<HTMLDivElement>(null);
  const line3Ref      = useRef<HTMLDivElement>(null);

  // Fit each line to full container width
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    function fitLines() {
      const style = getComputedStyle(inner!);
      const available =
        inner!.getBoundingClientRect().width -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);

      [line1Ref, line2Ref, line3Ref].forEach(ref => {
        const el = ref.current;
        if (!el) return;
        el.style.fontSize = "100px";
        const scale = available / el.scrollWidth;
        el.style.fontSize = `${100 * scale}px`;
      });
    }

    fitLines();
    const ro = new ResizeObserver(fitLines);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  // GSAP scroll reveal
  useEffect(() => {
    if (!containerRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });
    [line1Ref, line2Ref, line3Ref].forEach((ref, i) => {
      if (!ref.current) return;
      tl.fromTo(
        ref.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
        i === 0 ? 0 : "<0.15"
      );
    });
    return () => { tl.scrollTrigger?.kill(); };
  }, []);

  const iconCls = "inline-block align-middle relative top-[-0.05em] ml-[0.12em]";

  return (
    <section
      className="section-full flex items-center justify-center bg-black overflow-clip"
      ref={containerRef}
      id="statement"
    >
      <div className="w-full px-6 md:px-12" ref={innerRef}>

        {/* Line 1 — left */}
        <div className="overflow-hidden text-left">
          <div
            ref={line1Ref}
            className="display font-black uppercase text-white whitespace-nowrap leading-[0.9]"
          >
            The Voice
            <MicIcon className={`${iconCls} w-[0.72em] h-[0.72em]`} />
          </div>
        </div>

        {/* Line 2 — right */}
        <div className="overflow-hidden text-right">
          <div
            ref={line2Ref}
            className="display font-black uppercase text-white whitespace-nowrap leading-[0.9]"
          >
            Behind Tomorrow&apos;s
          </div>
        </div>

        {/* Line 3 — center */}
        <div className="overflow-hidden text-center">
          <div
            ref={line3Ref}
            className="display font-black uppercase text-white whitespace-nowrap leading-[0.9]"
          >
            Stars
            <StarIcon className={`${iconCls} w-[0.72em] h-[0.72em]`} />
          </div>
        </div>

      </div>
    </section>
  );
}
