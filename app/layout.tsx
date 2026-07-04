import type { Metadata } from "next";
import { Geist, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import PageTransitionOverlay from "@/components/layout/PageTransitionOverlay";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import MoonLoader from "@/components/layout/MoonLoader";
import Prefetcher from "@/components/layout/Prefetcher";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "TopView — Talent Management",
  description: "The authority on the next generation of digital creators.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${barlowCondensed.variable}`}>
      <body className="bg-black text-white antialiased overflow-x-hidden">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Prefetcher />
        <MoonLoader />
        <PageTransitionOverlay />
        <ScrollRevealInit />
        <div
          id="pg-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            transform: "translateX(100%)",
            pointerEvents: "none",
          }}
        />
      </body>
    </html>
  );
}
