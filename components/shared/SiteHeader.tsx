"use client";

import Link from "next/link";

interface SiteHeaderProps {
  activePill?: "talent" | "marketing";
  onTalentClick?: () => void;
  onMarketingClick?: () => void;
  onOpenContact: () => void;
}

export default function SiteHeader({
  activePill = "talent",
  onTalentClick,
  onMarketingClick,
  onOpenContact,
}: SiteHeaderProps) {
  return (
    <header>
      <div className="header-left">
        <div className="pill-wrap glass">
          <button
            className={`pill-btn ${activePill === "talent" ? "active" : "inactive"}`}
            onClick={onTalentClick}
          >
            Talent
          </button>
          <button
            className={`pill-btn ${activePill === "marketing" ? "active" : "inactive"}`}
            onClick={onMarketingClick}
          >
            Marketing
          </button>
        </div>
      </div>

      <Link href="/" className="logo">
        <img src="/logos/topview-white.png" alt="TopView" style={{ height: "76px", width: "auto" }} />
      </Link>

      <div className="header-right">
        <div className="btn-group" onClick={onOpenContact}>
          <button className="icon-btn glass">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
            </svg>
          </button>
          <button className="cta-btn glass">
            Get in Touch
            <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
