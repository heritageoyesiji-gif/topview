"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function SiteFooter({ onOpenContact }: { onOpenContact: () => void }) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const wrap    = wrapRef.current;
    const section = sectionRef.current;
    if (!wrap || !section) return;
    wrap.style.transition = "clip-path 1.2s cubic-bezier(0.77, 0, 0.18, 1)";
    wrap.style.clipPath   = "circle(0% at 50% 40%)";
    const obs = new IntersectionObserver(([e]) => {
      wrap.style.clipPath = e.isIntersecting
        ? "circle(150% at 50% 40%)"
        : "circle(0% at 50% 40%)";
    }, { threshold: 0.35 });
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="footer-cta" id="footer" ref={sectionRef}>
      <video className="footer-bg-video" src="/videos/footer.mp4" autoPlay loop muted playsInline />

      <div className="footer-content-wrap" ref={wrapRef}>
        <div className="footer-bg-overlay" />

        <div className="footer-panels">
          <div className="footer-panel" onClick={onOpenContact}>
            <div className="explore-badge">
              <svg className="explore-ring" viewBox="0 0 130 130">
                <defs><path id="sfp1" d="M65,65 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0"/></defs>
                <text fontSize="12.5" fill="white" fontFamily="Helvetica Neue,Arial,sans-serif" fontWeight="600" letterSpacing="3">
                  <textPath href="#sfp1">EXPLORE / EXPLORE / EXPLORE /</textPath>
                </text>
              </svg>
              <div className="explore-arrow">↗</div>
            </div>
            <div>
              <span className="footer-big-line">Request</span>
              <span className="footer-big-line">
                Roster
                <svg className="footer-line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
            </div>
          </div>

          <div className="footer-panel footer-panel-right" onClick={onOpenContact}>
            <div className="explore-badge">
              <svg className="explore-ring" viewBox="0 0 130 130">
                <defs><path id="sfp2" d="M65,65 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0"/></defs>
                <text fontSize="12.5" fill="white" fontFamily="Helvetica Neue,Arial,sans-serif" fontWeight="600" letterSpacing="3">
                  <textPath href="#sfp2">SAY HELLO / SAY HELLO / SAY HELLO /</textPath>
                </text>
              </svg>
              <div className="explore-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
                </svg>
              </div>
            </div>
            <div>
              <span className="footer-big-line">
                <svg className="footer-line-icon footer-cursor-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
                </svg>
                Get In
              </span>
              <span className="footer-big-line">Touch</span>
            </div>
          </div>
        </div>

        <div className="footer-bar">
          <div className="footer-bar-content">
            <nav className="footer-nav">
              <Link href="/">Talent</Link>
              <Link href="/marketing">Marketing</Link>
              <button type="button" onClick={onOpenContact}>Contact</button>
            </nav>
            <p className="footer-tagline">The Next Digital<br />Generation</p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/topview0?igsh=b2ZuZHNoaDBhMGVu" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter / X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.06a8.16 8.16 0 0 0 4.78 1.53V7.14a4.85 4.85 0 0 1-1.02-.45z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-copyright">
            <span>© 2026 TopView</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </section>
  );
}
