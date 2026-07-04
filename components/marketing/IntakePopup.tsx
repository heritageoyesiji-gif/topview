"use client";

import { useState, useEffect, useCallback } from "react";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

const STORAGE_KEY = "mkt_intake_dismissed";
const SHOW_DELAY_MS = 3000;

export default function IntakePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
  }, []);

  // Show once per session after a short delay.
  // In development we always show it (ignore the dismissed flag) so it's
  // easy to review on localhost; in production it stays once-per-session.
  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem(STORAGE_KEY); } catch {}
    if (seen && process.env.NODE_ENV === "production") return;
    const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Lock page scroll (native + Lenis) while open
  useEffect(() => {
    if (open) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [open]);

  // Escape to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [dismiss]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setTimeout(() => setOpen(false), 2600);
  }

  return (
    <div
      className={`mkt-pop${open ? " open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
      aria-hidden={!open}
    >
      <div className="mkt-pop-card" role="dialog" aria-modal="true" aria-label="Free growth audit">
        <button className="mkt-pop-close" onClick={dismiss} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="mkt-pop-media" aria-hidden="true">
          <img src="/images/hero-poster.jpg" alt="" />
        </div>

        <div className="mkt-pop-body">
          {sent ? (
            <div className="mkt-pop-success">
              <div className="mkt-pop-success-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="mkt-pop-title">You&apos;re In.</h2>
              <p className="mkt-pop-sub">Check your inbox — your growth audit is on the way.</p>
            </div>
          ) : (
            <>
              <span className="mkt-pop-eyebrow">
                <span className="mkt-pop-dot" />
                Free Growth Audit
              </span>
              <h2 className="mkt-pop-title">Unlock Your<br />Growth Potential.</h2>
              <p className="mkt-pop-sub">
                Drop your email and we&apos;ll send a free teardown of where your
                brand is leaving growth on the table.
              </p>
              <form className="mkt-pop-form" onSubmit={handleSubmit}>
                <input
                  className="mkt-pop-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
                <button type="submit" className="mkt-pop-submit">
                  Get My Free Audit
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                  </svg>
                </button>
              </form>
              <p className="mkt-pop-fine">No spam. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
