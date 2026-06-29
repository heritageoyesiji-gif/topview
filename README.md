# TopView — Talent & Marketing Agency Website

Dual-brand agency site built on Next.js 16 + GSAP + Lenis. One URL, two modes — **Talent** (dark/black) and **Marketing** (cream) — with a "clear the table" slide transition between them.

---

## Stack

| Layer         | Choice                                       |
| ------------- | -------------------------------------------- |
| Framework     | Next.js 16.2.9 (App Router)                  |
| Language      | TypeScript                                   |
| Styling       | Tailwind CSS v4                              |
| Animation     | GSAP 3 + ScrollTrigger                       |
| Smooth scroll | @studio-freight/lenis                        |
| Icons         | Lucide React                                 |
| Fonts         | Barlow Condensed (display) · Geist (body/UI) |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  layout.tsx          # Root layout — fonts, SmoothScrollProvider, CustomCursor
  page.tsx            # Orchestrator — mode state, loading state, slide transition
  globals.css         # Base styles, .display class, @keyframes, Lenis classes

components/
  layout/
    LoadingScreen.tsx         # Iris-wipe intro overlay (2.8s hold + 1s wipe)
    Header.tsx                # Fixed nav — 3-column: logo | toggle | CTA
    ModeToggle.tsx            # Two-pill toggle (Talent / Marketing)
    SmoothScrollProvider.tsx  # Lenis wired to GSAP RAF ticker
    CustomCursor.tsx          # Dot + ring cursor with mix-blend-difference

  talent/
    HeroSection.tsx       # Full-screen dark hero with background video
    StatementSection.tsx  # Giant scroll-triggered staggered headline
    InlineVideoText.tsx   # Headline with embedded inline video clips
    ServiceCards.tsx      # 3 dark cards with background video + shimmer border
    TalentRoster.tsx      # 4-column grid, video plays on hover
    FooterCTA.tsx         # Dark CTA footer — Request Roster / Get in Touch

  marketing/
    MarketingPage.tsx   # Hero · marquee · stats · 6 service cards · CTA footer

lib/
  utils.ts            # cn() utility (clsx + tailwind-merge)
```

---

## Video Files Required

Place these in `public/videos/`. Sections fall back to dark backgrounds until files are added.

| File                 | Used in                                           |
| -------------------- | ------------------------------------------------- |
| `load.mp4`           | LoadingScreen intro animation                     |
| `hero.mp4`           | HeroSection background · FooterCTA blurred bg     |
| `talentroster-1.mp4` | InlineVideoText clip 1 · TalentRoster cards 1 & 4 |
| `talentroster-2.mp4` | InlineVideoText clip 2 · TalentRoster card 2      |
| `talentroster-3.mp4` | InlineVideoText clip 3 · TalentRoster card 3      |
| `card-talent.mp4`    | ServiceCards — Talent Management                  |
| `card-brands.mp4`    | ServiceCards — Brand Partnerships                 |
| `card-media.mp4`     | ServiceCards — Media Production                   |

---

## Design Tokens

```
Talent page:    bg-black · text-white
Marketing page: bg-[#F8F6F2] · text-black

Display font:  Barlow Condensed 700/800/900 → .display class
Body/UI font:  Geist

Button system (consistent across all pages):
  Primary:  bg-white text-black (on dark) · bg-black text-white (on cream)
  Ghost:    border border-white/25 text-white/55 (on dark)
            border border-black/20 text-black/45 (on cream)
  Size:     px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest
```

---

## Key Architecture Notes

**Mode switching** (`page.tsx`) — GSAP slides talent to `-100vw` while marketing slides in from `+100vw` simultaneously. On complete: `window.scrollTo(0,0)` resets scroll position, `ScrollTrigger.refresh()` recalculates trigger positions, then `setMode()` swaps the visible div.

**Loading sequence** — LoadingScreen holds for 2.8s then iris-wipes away (radial-gradient mask `0% → 160%`). `onComplete` → `setLoading(false)` → Header mounts → 150ms → `heroLoaded=true` + `ScrollTrigger.refresh()`.

**Hero animation** — `HeroSection` accepts `loaded: boolean`. Elements start `opacity: 0` via inline style. GSAP fires only when `loaded` becomes true (post loading screen), guaranteeing the user sees the animation.

**Marketing re-entry** — `MarketingPage` receives `visible: boolean`. Hero lines animate every time `visible` flips `false → true`, so the page always reveals fresh on mode switch.

**Smooth scroll** — Lenis wired to GSAP ticker via a named function reference (required for `gsap.ticker.remove` to work). ScrollTrigger updates via `lenis.on("scroll", ScrollTrigger.update)`.

**Cursor** — Uses event delegation (`document.addEventListener("mouseover")`) so all links and buttons — including ones mounted after the cursor initialises — get the scale effect.

---

## Pending

- [ ] Real video files in `public/videos/`
- [ ] Contact form dialog (Radix UI Dialog already installed)
- [ ] Talent roster data from Payload CMS
- [ ] Individual talent profile pages at `/talent/[slug]`
