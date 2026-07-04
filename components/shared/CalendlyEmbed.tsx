"use client";

import { CALENDLY_URL } from "@/lib/config";

// Dark-theme + inline-embed params so the Calendly UI matches the modal
function buildSrc(base: string) {
  const sep = base.includes("?") ? "&" : "?";
  const params = new URLSearchParams({
    embed_type: "Inline",
    hide_gdpr_banner: "1",
    background_color: "0c0c0c",
    text_color: "ffffff",
    primary_color: "ffffff",
  });
  return `${base}${sep}${params.toString()}`;
}

// Built at module load so the iframe src is present in the initial HTML —
// the browser preloads the calendar before the modal is ever opened.
const SRC = CALENDLY_URL ? buildSrc(CALENDLY_URL) : "";

export default function CalendlyEmbed() {
  if (!CALENDLY_URL) {
    return (
      <div className="calendly-placeholder">
        <div className="calendly-placeholder-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <p className="calendly-placeholder-title">Live calendar goes here</p>
        <p className="calendly-placeholder-sub">
          Add the Calendly link in <code>lib/config.ts</code> to enable real bookings.
        </p>
      </div>
    );
  }

  return (
    <iframe
      className="calendly-embed"
      src={SRC}
      title="Book a call"
      loading="eager"
    />
  );
}
