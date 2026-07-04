"use client";

import "./marketing.css";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { transitionTo } from "@/lib/pageTransition";
import { BRAND_LOGOS as PARTNER_LOGOS } from "@/lib/logos";
import Image from "next/image";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import ContactModal from "@/components/shared/ContactModal";
import IntakePopup from "@/components/marketing/IntakePopup";

/* ════════════════════════════════════════
   Marketing Page
   Build log — see README.md
   ✅ Section 1: Hero
   🔲 Section 2: Pain Point
   🔲 Section 3: Features Grid
   🔲 Section 4: Services
   🔲 Section 5: Case Studies
   🔲 Section 6: Portfolio / Latest Work
   🔲 Section 7: Process
   🔲 Section 8: Benefits
════════════════════════════════════════ */

export default function MarketingPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  /* Set light theme on body for this page */
  useEffect(() => {
    document.body.style.background = "#fff";
    document.body.style.color      = "#111";
    return () => {
      document.body.style.background = "";
      document.body.style.color      = "";
    };
  }, []);

  const openModal  = useCallback(() => { setModalOpen(true);  document.body.style.overflow = "hidden"; }, []);
  const closeModal = useCallback(() => { setModalOpen(false); document.body.style.overflow = "";       }, []);

  return (
    <div className="mkt-page">
      <SiteHeader
        activePill="marketing"
        onTalentClick={() => transitionTo("/", "#0d0d0d", () => router.push("/"))}
        onMarketingClick={() => {}}
        onOpenContact={openModal}
      />

      {/* ══ SECTION 1: HERO ══ */}
      <section className="mkt-hero">
        <div className="mkt-hero-left">

          {/* Availability badge */}
          <div className="mkt-badge" data-reveal>
            <span className="mkt-badge-dot" />
            Now taking brand campaigns
          </div>

          {/* Display headline */}
          <h1 className="mkt-hero-title" data-reveal data-d="1">
            Marketing<br />
            That <em>Actually</em><br />
            Moves The<br />
            Needle.
          </h1>

          <p className="mkt-hero-subtitle" data-reveal data-d="2">
            We help the world&apos;s best creators and brands build audiences,
            run campaigns, and scale what actually matters.
          </p>

          <div className="mkt-hero-actions" data-reveal data-d="3">
            <button className="mkt-btn-primary" onClick={openModal}>
              Work With Us
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
              </svg>
            </button>
            <button className="mkt-btn-secondary" onClick={() => {
              document.getElementById("mkt-work")?.scrollIntoView({ behavior: "smooth" });
            }}>
              See Our Work
            </button>
          </div>
        </div>

        {/* Decorative right side */}
        <div className="mkt-hero-right" aria-hidden="true">
          <svg className="mkt-hero-deco-svg" viewBox="0 0 480 560" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer ring */}
            <circle cx="240" cy="300" r="230" stroke="#efefef" strokeWidth="60"/>
            {/* Mid ring */}
            <circle cx="240" cy="300" r="150" stroke="#f5f5f5" strokeWidth="32"/>
            {/* Center fill */}
            <circle cx="240" cy="300" r="80" fill="#f7f7f7"/>
            {/* Accent dots */}
            <circle cx="440" cy="100" r="10" fill="#e8e8e8"/>
            <circle cx="60"  cy="80"  r="6"  fill="#e8e8e8"/>
            <circle cx="420" cy="480" r="7"  fill="#ebebeb"/>
            {/* Diagonal line detail */}
            <line x1="50"  y1="520" x2="430" y2="80"  stroke="#f0f0f0" strokeWidth="1"/>
            <line x1="100" y1="540" x2="460" y2="120" stroke="#f4f4f4" strokeWidth="1"/>
            {/* Small notch arcs */}
            <path d="M240 70 A230 230 0 0 1 460 280" stroke="#e4e4e4" strokeWidth="2" strokeLinecap="round"/>
            <path d="M240 530 A230 230 0 0 1 20 300"  stroke="#e4e4e4" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </section>

      {/* ══ LOGO MARQUEE ══ */}
      <section className="mkt-logos" aria-label="Partner brands">
        <div className="mkt-logos-inner">
          <div className="mkt-logos-track">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
              <div key={i} className="mkt-logo-item">
                <img
                  src={logo.src}
                  alt={logo.name}
                  style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 2: PAIN POINT ══ */}
      <section className="mkt-pain">
        <video
          className="mkt-pain-video"
          src="/videos/hero.mp4"
          autoPlay loop muted playsInline
        />
        <div className="mkt-pain-overlay" />

        <div className="mkt-pain-content">
          <div className="mkt-pain-label">Hello, we are TopView</div>
          <h2 className="mkt-pain-title">
            You&apos;re Putting<br />
            In The Work.<br />
            But The Results<br />
            <em>Aren&apos;t Keeping Up.</em>
          </h2>
          <p className="mkt-pain-sub">
            Most brands have the product. What they&apos;re missing is the right
            strategy, creative, and execution to actually move the needle online.
          </p>
        </div>
      </section>

      {/* ══ SECTION 3: FEATURES GRID ══ */}
      <section className="mkt-features">
        <p className="mkt-features-eyebrow">What We Do</p>

        <div className="mkt-features-grid">

          {/* AI Influencer Marketing */}
          <div className="mkt-feature-cell">
            <div className="mkt-feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/>
                <path d="M2 20c0-4 4-7 10-7"/>
                <path d="M19 16l-2 2 4 4"/>
                <circle cx="19" cy="13" r="2"/>
              </svg>
            </div>
            <span className="mkt-feature-label">AI Influencer Marketing</span>
          </div>

          {/* Influencer Marketing */}
          <div className="mkt-feature-cell">
            <div className="mkt-feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
            </div>
            <span className="mkt-feature-label">Influencer Marketing</span>
          </div>

          {/* AI Automation */}
          <div className="mkt-feature-cell">
            <div className="mkt-feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="mkt-feature-label">AI Automation</span>
          </div>

          {/* Lead Generation */}
          <div className="mkt-feature-cell">
            <div className="mkt-feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <span className="mkt-feature-label">Lead Generation</span>
          </div>

          {/* Business Branding */}
          <div className="mkt-feature-cell">
            <div className="mkt-feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
                <line x1="5" y1="7" x2="5" y2="7.01"/>
                <line x1="8" y1="7" x2="8" y2="7.01"/>
                <line x1="11" y1="7" x2="19" y2="7"/>
              </svg>
            </div>
            <span className="mkt-feature-label">Business Branding</span>
          </div>

          {/* Backend Development */}
          <div className="mkt-feature-cell">
            <div className="mkt-feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <span className="mkt-feature-label">Backend Development</span>
          </div>

        </div>
      </section>

      {/* ══ SECTION 4: SERVICES ══ */}
      <section className="mkt-services">
        <div className="mkt-services-intro">
          <p className="mkt-services-eyebrow">Our Services</p>
          <h2 className="mkt-services-title" data-reveal>
            Everything Your<br />Brand Needs<br />To Win Online.
          </h2>
          <p className="mkt-services-sub">
            Full-service solutions built for creators, brands, and businesses ready to grow.
          </p>
        </div>

        <div className="mkt-services-grid">

          {[
            {
              num: "01",
              name: "AI Influencer Marketing",
              desc: "Connecting brands with AI-matched creators for maximum reach and authentic, measurable engagement.",
            },
            {
              num: "02",
              name: "Influencer Marketing",
              desc: "Full-service influencer campaigns — from talent sourcing and briefing to content delivery and performance reporting.",
            },
            {
              num: "03",
              name: "AI Automation",
              desc: "Intelligent workflows that cut costs, save time, and keep your brand moving 24/7 without lifting a finger.",
            },
            {
              num: "04",
              name: "Lead Generation",
              desc: "Precision-targeted strategies that fill your pipeline with real, qualified prospects ready to convert.",
            },
            {
              num: "05",
              name: "Business Branding",
              desc: "Cinematic websites, product design, and packaging that make your brand impossible to scroll past.",
            },
            {
              num: "06",
              name: "Backend Development",
              desc: "Robust, scalable systems and APIs powering everything behind the scenes — built to last.",
            },
          ].map((svc) => (
            <div key={svc.num} className="mkt-svc-card" onClick={openModal}>
              <span className="mkt-svc-num">{svc.num}</span>
              <h3 className="mkt-svc-name">{svc.name}</h3>
              <p className="mkt-svc-desc">{svc.desc}</p>
              <div className="mkt-svc-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
                </svg>
              </div>
              <div className="mkt-svc-underline" />
            </div>
          ))}

        </div>
      </section>

      {/* ══ SECTION 5: CASE STUDIES ══ */}
      <section className="mkt-results">
        <div className="mkt-results-header">
          <p className="mkt-results-eyebrow">Results</p>
          <h2 className="mkt-results-title" data-reveal>
            Numbers That<br />Speak For<br />Themselves.
          </h2>
        </div>

        <div className="mkt-results-grid">
          {[
            {
              video: "/videos/talentroster-1.mp4",
              service: "Creator Campaigns",
              stat: "250M+",
              label: "Total Creator Views Generated",
              desc: "AI-matched influencer campaigns drove over 12 million organic views across brand partner content.",
              tags: ["AI Matching", "Creators", "Organic"],
            },
            {
              video: "/videos/talentroster-2.mp4",
              service: "Paid Media",
              stat: "7.5×",
              label: "Average Return On Ad Spend",
              desc: "Precision-targeted paid campaigns consistently outperform industry benchmarks across Meta and TikTok.",
              tags: ["Paid Ads", "Meta", "TikTok"],
            },
            {
              video: "/videos/talentroster-3.mp4",
              service: "AI Systems",
              stat: "85%",
              label: "Reduction In Manual Operations",
              desc: "Custom AI automation workflows cut client overhead by 68%, freeing teams to focus on what matters.",
              tags: ["Automation", "AI", "Workflows"],
            },
            {
              video: "/videos/talentroster-4.mp4",
              service: "Web & Development",
              stat: "5.4×",
              label: "Average Conversion Rate Uplift",
              desc: "Conversion-optimised websites and funnels tripled inbound lead quality and cut cost-per-acquisition.",
              tags: ["Design", "Dev", "CRO"],
            },
          ].map((c, i) => (
            <div key={c.stat} className="mkt-result-card" data-reveal="scale" data-d={String(i + 1)}>
              <video src={c.video} autoPlay loop muted playsInline />
              <div className="mkt-result-card-overlay" />
              <div className="mkt-result-inner">
                <span className="mkt-result-client">{c.service}</span>
                <div>
                  <p className="mkt-result-stat">{c.stat}</p>
                  <p className="mkt-result-label">{c.label}</p>
                  <div className="mkt-result-divider" />
                  <p className="mkt-result-desc">{c.desc}</p>
                  <div className="mkt-result-tags">
                    {c.tags.map(t => (
                      <span key={t} className="mkt-result-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SECTION 6: OUR WORK ══ */}
      <section className="mkt-work" id="mkt-work">
        {/* Header */}
        <div className="mkt-work-header">
          <div>
            <p className="mkt-work-eyebrow">Recognition</p>
            <h2 className="mkt-work-title" data-reveal>
              Accolades<br />(Impact).
            </h2>
          </div>
          <span className="mkt-work-count">07 Accolades</span>
        </div>

        {/* Accolade pills — expand on hover to reveal impact */}
        <div className="mkt-acc-grid">
          {[
            {
              img: "/images/work/bud-light.jpg",
              client: "Bud Light",
              service: "Influencer Marketing",
              blurb: "40M+ impressions across a national creator rollout.",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              ),
            },
            {
              img: "/images/work/colostrum.jpg",
              client: "Colostrum Co.",
              service: "Lead Generation",
              blurb: "3.2× qualified pipeline growth in 90 days.",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                </svg>
              ),
            },
            {
              img: "/images/work/fitness-girls.jpg",
              client: "FitFounders",
              service: "AI Influencer Marketing",
              blurb: "AI-matched creators drove 12M+ organic views.",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M5.6 5.6l12.8 12.8M3 12h18M5.6 18.4 18.4 5.6"/>
                </svg>
              ),
            },
            {
              img: "/images/work/law-firm.jpg",
              client: "Premier Legal",
              service: "Business Branding",
              blurb: "Rebrand that doubled inbound consultations.",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6"/><path d="M15.5 12.5 17 22l-5-3-5 3 1.5-9.5"/>
                </svg>
              ),
            },
            {
              img: "/images/work/meal-prep.jpg",
              client: "PrepNation",
              service: "AI Automation",
              blurb: "85% of operations automated end-to-end.",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              ),
            },
            {
              img: "/images/work/moroccan-tea.jpg",
              client: "Marrakech Tea Co.",
              service: "Brand Identity",
              blurb: "Packaging that tripled retail shelf pickup.",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ),
            },
            {
              img: "/images/work/nomad-tax.jpg",
              client: "NomadTax",
              service: "Business Branding",
              blurb: "Conversion-first build that halved cost-per-lead.",
              wide: true,
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
              ),
            },
          ].map((p, i) => (
            <div
              key={p.client}
              className={`mkt-acc-card${p.wide ? " mkt-acc-card--wide" : ""}`}
              data-reveal="scale"
              data-d={String((i % 2) + 1)}
              onClick={openModal}
            >
              <Image
                src={p.img}
                alt={p.client}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
              <div className="mkt-acc-overlay" />
              <div className="mkt-acc-body">
                <div className="mkt-acc-icon">{p.icon}</div>
                <h3 className="mkt-acc-title">{p.client}</h3>
                <div className="mkt-acc-reveal">
                  <div className="mkt-acc-reveal-inner">
                    <p className="mkt-acc-service">{p.service}</p>
                    <p className="mkt-acc-blurb">{p.blurb}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mkt-work-cta">
          <button className="mkt-portfolio-cta-btn" onClick={openModal}>
            Start A Project
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ══ SECTION 7: PROCESS ══ */}
      <section className="mkt-process">
        <div className="mkt-process-intro">
          <p className="mkt-process-eyebrow">How We Work</p>
          <h2 className="mkt-process-title" data-reveal>
            A Process Built<br />For Results.
          </h2>
        </div>

        <div className="mkt-process-steps">
          {[
            {
              num: "01",
              step: "Discover",
              desc: "We dig into your brand, audience, and goals. No templates — just a clear picture of where you are and where you need to be.",
            },
            {
              num: "02",
              step: "Strategize",
              desc: "We map out the exact playbook — channels, creatives, timelines, and KPIs — tailored to your growth objectives.",
            },
            {
              num: "03",
              step: "Create",
              desc: "Our team builds the assets, content, and systems needed to execute at a level your competitors won't be able to match.",
            },
            {
              num: "04",
              step: "Launch",
              desc: "We go live with precision. Coordinated rollouts across every relevant platform, with real-time monitoring from day one.",
            },
            {
              num: "05",
              step: "Scale",
              desc: "What works gets amplified. We double down on the signals that drive growth and cut what doesn't earn its keep.",
            },
          ].map((s, i) => (
            <div key={s.num} className="mkt-process-step" data-reveal="left" data-d={String(i + 1)}>
              <div className="mkt-process-step-left">
                <span className="mkt-process-num">{s.num}</span>
                <div className="mkt-process-line" aria-hidden="true" />
              </div>
              <div className="mkt-process-step-right">
                <h3 className="mkt-process-step-title">{s.step}</h3>
                <p className="mkt-process-step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mkt-process-cta">
          <button className="mkt-btn-primary" onClick={openModal}>
            Start Your Project
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ══ SECTION 8: BENEFITS ══ */}
      <section className="mkt-benefits">
        <div className="mkt-benefits-header">
          <p className="mkt-benefits-eyebrow">Why TopView</p>
          <h2 className="mkt-benefits-title" data-reveal>
            Built Different.<br />Built to Win.
          </h2>
          <p className="mkt-benefits-sub">
            Every agency promises results. We show up with the infrastructure,
            the talent, and the track record to deliver them.
          </p>
        </div>

        <div className="mkt-benefits-grid">
          {[
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
                </svg>
              ),
              title: "Data-Driven Decisions",
              desc: "Every move is backed by real-time analytics. We track what matters and cut what doesn't earn its place.",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3m-3.22-6.78-2.12 2.12M7.34 16.66l-2.12 2.12m0-14.56 2.12 2.12m9.32 9.32 2.12 2.12"/>
                </svg>
              ),
              title: "AI-Powered Speed",
              desc: "Campaigns built and launched faster using AI tools your competitors don't have access to yet.",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                </svg>
              ),
              title: "Full-Service Execution",
              desc: "Strategy, creative, and distribution under one roof. No fragmented handoffs. No gaps.",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              ),
              title: "Radical Transparency",
              desc: "Real dashboards. Real numbers. Weekly reporting so you always know exactly where your budget is going.",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"/>
                </svg>
              ),
              title: "Senior Team, Always",
              desc: "No juniors. No outsourcing. A dedicated senior team on your account from day one through every deliverable.",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ),
              title: "Proven Track Record",
              desc: "250M+ views. 7.5× ROAS. 85% ops reduction. Results you can verify — not case studies we wrote ourselves.",
            },
          ].map((b, i) => (
            <div key={b.title} className="mkt-benefit-card" data-reveal data-d={String((i % 3) + 1)}>
              <div className="mkt-benefit-icon">{b.icon}</div>
              <h3 className="mkt-benefit-title">{b.title}</h3>
              <p className="mkt-benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mkt-benefits-cta">
          <button className="mkt-btn-primary" onClick={openModal}>
            Work With Us
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
            </svg>
          </button>
          <button className="mkt-btn-ghost" onClick={openModal}>
            View Our Work
          </button>
        </div>
      </section>

      <SiteFooter onOpenContact={openModal} />
      <ContactModal isOpen={modalOpen} onClose={closeModal} />
      <IntakePopup />
    </div>
  );
}
