"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import ContactModal from "@/components/shared/ContactModal";

/* ── Talent data ── */
const TALENTS = [
  {
    id: "enzo",
    num: "01",
    name: "ENZO",
    tagline: "The next breakout creator",
    video: "/videos/talentroster-1.mp4",
    what: "Content creator and entertainer known for viral moments and unfiltered authenticity. Enzo connects with his audience through raw, relatable storytelling.",
    platforms: ["YouTube", "TikTok", "Instagram"],
    socials: { instagram: "https://www.instagram.com/rynenzo?igsh=MTQ5eGZyYnAwa2cyaw==", tiktok: "#", youtube: "#" },
  },
  {
    id: "sebtakespics",
    num: "02",
    name: "sebtakespics",
    tagline: "Genre redefining artist",
    video: "/videos/talentroster-2.mp4",
    what: "Visual storyteller and photographer pushing the boundaries of digital art. Known for his distinct aesthetic that bridges photography and internet culture.",
    platforms: ["Instagram", "TikTok"],
    socials: { instagram: "https://www.instagram.com/sebtakespix?igsh=aXBkcXhocXFteWR0", tiktok: "#" },
  },
  {
    id: "justin-richburg",
    num: "03",
    name: "Justin Richburg",
    tagline: "Long-form storytelling at scale",
    video: "/videos/talentroster-3.mp4",
    what: "Long-form creator with a deeply loyal audience built through compelling, narrative-driven content. Justin turns everyday moments into must-watch stories.",
    platforms: ["YouTube", "Twitch", "Instagram"],
    socials: { instagram: "https://www.instagram.com/justin_richburg?igsh=MTByNW5xa3QwNTdheA==", youtube: "#", twitch: "#" },
  },
  {
    id: "swoosh-god",
    num: "04",
    name: "Swoosh God",
    tagline: "A voice that moves audiences",
    video: "/videos/talentroster-4.mp4",
    what: "Cultural commentator and entertainer with a community built around honest, unfiltered conversation. A voice at the intersection of sports, culture, and entertainment.",
    platforms: ["YouTube", "TikTok", "X"],
    socials: { instagram: "https://www.instagram.com/swooshgod?igsh=MTB3NXQxaDkzZWdqZA==", tiktok: "#", youtube: "#", twitter: "#" },
  },
  {
    id: "che-igbo",
    num: "05",
    name: "Che Igbo",
    tagline: "The face of the NY Knicks",
    video: "/videos/talentroster-5.mp4",
    what: "Sports personality at the intersection of basketball culture, entertainment, and digital media. Che brings the energy of NY to audiences worldwide.",
    platforms: ["Instagram", "TikTok", "YouTube"],
    socials: { instagram: "https://www.instagram.com/cheigbo?igsh=MWl5NnNtd2xvdGtxdQ==", tiktok: "#", youtube: "#" },
  },
];

/* ── Social icons ── */
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.06a8.16 8.16 0 0 0 4.78 1.53V7.14a4.85 4.85 0 0 1-1.02-.45z"/>
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
    </svg>
  );
}
function TwitterXIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function TwitchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: <InstagramIcon />,
  tiktok: <TikTokIcon />,
  youtube: <YouTubeIcon />,
  twitter: <TwitterXIcon />,
  twitch: <TwitchIcon />,
};

/* ── Individual talent card ── */
function TalentCard({ talent, index }: { talent: typeof TALENTS[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`talent-card${expanded ? " expanded" : ""}`}
      onClick={() => setExpanded(v => !v)}
    >
      <video src={talent.video} muted loop playsInline preload="metadata" autoPlay />

      <span className="talent-num">{talent.num}</span>

      <div className="talent-toggle-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>

      <div className="talent-card-body">
        <h3 className="talent-card-name">{talent.name}</h3>
        <p className="talent-card-tagline">{talent.tagline}</p>

        <div className="talent-drawer">
          <div className="talent-drawer-inner">
            <div className="talent-drawer-content">
              <p className="talent-what">{talent.what}</p>

              <div className="talent-platforms">
                {talent.platforms.map(p => (
                  <span key={p} className="talent-platform-tag">{p}</span>
                ))}
              </div>

              <div className="talent-social-row" onClick={e => e.stopPropagation()}>
                {Object.entries(talent.socials).map(([platform, href]) => (
                  <a key={platform} href={href} className="talent-social-link" aria-label={platform} target="_blank" rel="noopener noreferrer">
                    {SOCIAL_ICONS[platform]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function TalentPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const openModal  = useCallback(() => { setModalOpen(true);  document.body.style.overflow = "hidden"; }, []);
  const closeModal = useCallback(() => { setModalOpen(false); document.body.style.overflow = "";       }, []);

  return (
    <>
      <SiteHeader
        activePill="talent"
        onTalentClick={() => router.push("/")}
        onMarketingClick={() => router.push("/marketing")}
        onOpenContact={openModal}
      />

      {/* Hero */}
      <section className="talent-hero">
        <video className="hero-video" src="/videos/hero.mp4" autoPlay loop muted playsInline />
        <div className="hero-overlay-top" />
        <div className="hero-overlay-bottom" />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center" }}>
          <p className="talent-page-label">TopView Agency</p>
          <h1 className="talent-page-title">Talent<br />Management</h1>
          <p className="talent-page-subtitle">
            TopView represents some of the internet&apos;s most influential artists,
            creators and entrepreneurs.
          </p>
        </div>
      </section>

      {/* Talent grid */}
      <div className="talent-grid">
        {TALENTS.map((talent, i) => (
          <TalentCard key={talent.id} talent={talent} index={i} />
        ))}
      </div>

      <SiteFooter onOpenContact={openModal} />

      <ContactModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}
