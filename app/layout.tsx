import type { Metadata } from "next";
import { Geist, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import PageTransitionOverlay from "@/components/layout/PageTransitionOverlay";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import MoonLoader from "@/components/layout/MoonLoader";
import Prefetcher from "@/components/layout/Prefetcher";
import { GoogleAnalytics } from "@next/third-parties/google";

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
  metadataBase: new URL("https://topview0.com"),
  openGraph: {
    title: "TopView — Talent Management",
    description: "The authority on the next generation of digital creators.",
    url: "https://topview0.com",
    siteName: "TopView",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TopView — Talent Management",
    description: "The authority on the next generation of digital creators.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://topview0.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${barlowCondensed.variable}`}>
      <body className="bg-black text-white antialiased overflow-x-hidden">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
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
        <GoogleAnalytics gaId="G-1MFY9XF70D" />
      </body>
    </html>
  );
}
