"use client";

import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import LoadingScreen from "@/components/layout/LoadingScreen";
import Header from "@/components/layout/Header";
import ContactDialog from "@/components/layout/ContactDialog";
import HeroSection from "@/components/talent/HeroSection";
import StatementSection from "@/components/talent/StatementSection";
import InlineVideoText from "@/components/talent/InlineVideoText";
import ServiceCards from "@/components/talent/ServiceCards";
import BrandCollaborations from "@/components/talent/BrandCollaborations";
import TalentRoster from "@/components/talent/TalentRoster";
import FooterCTA from "@/components/talent/FooterCTA";
import MarketingPage from "@/components/marketing/MarketingPage";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [mode, setMode] = useState<"talent" | "marketing">("talent");
  const [transitioning, setTransitioning] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const talentRef = useRef<HTMLDivElement>(null);
  const marketingRef = useRef<HTMLDivElement>(null);

  const handleLoadComplete = useCallback(() => {
    setLoading(false);
    setTimeout(() => {
      setHeroLoaded(true);
      ScrollTrigger.refresh();
    }, 150);
  }, []);

  const handleToggle = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);

    const afterTransition = (next: "talent" | "marketing") => {
      window.scrollTo({ top: 0, behavior: "instant" });
      setMode(next);
      setTransitioning(false);
      requestAnimationFrame(() => {
        gsap.set(talentRef.current, { x: 0 });
        gsap.set(marketingRef.current, { x: 0 });
        ScrollTrigger.refresh();
      });
    };

    // power4.inOut — sharper acceleration, heavier landing than power3
    const ease = "power4.inOut";
    const duration = 1.0;

    if (mode === "talent") {
      gsap.timeline({ onComplete: () => afterTransition("marketing") })
        .to(talentRef.current, { x: "-100vw", duration, ease })
        .fromTo(marketingRef.current, { x: "100vw" }, { x: 0, duration, ease }, "<");
    } else {
      gsap.timeline({ onComplete: () => afterTransition("talent") })
        .to(marketingRef.current, { x: "100vw", duration, ease })
        .fromTo(talentRef.current, { x: "-100vw" }, { x: 0, duration, ease }, "<");
    }
  }, [mode, transitioning]);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadComplete} />}
      {!loading && (
        <Header
          mode={mode}
          onToggle={handleToggle}
          onOpenContact={() => setContactOpen(true)}
        />
      )}
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />

      <div className="relative w-full overflow-x-hidden">
        <div
          ref={talentRef}
          style={{ display: mode === "talent" || transitioning ? "block" : "none" }}
        >
          <HeroSection loaded={heroLoaded} onOpenContact={() => setContactOpen(true)} />
          <StatementSection />
          <InlineVideoText onOpenContact={() => setContactOpen(true)} />
          <ServiceCards />
          <BrandCollaborations />
          <TalentRoster />
          <FooterCTA onOpenContact={() => setContactOpen(true)} />
        </div>

        <div
          ref={marketingRef}
          style={{ display: mode === "marketing" || transitioning ? "block" : "none" }}
        >
          <MarketingPage
            visible={mode === "marketing"}
            onOpenContact={() => setContactOpen(true)}
          />
        </div>
      </div>
    </>
  );
}
