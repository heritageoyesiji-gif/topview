import type Lenis from "@studio-freight/lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Freeze page scroll (native + Lenis smooth scroll) while a modal is open. */
export function lockScroll() {
  document.body.style.overflow = "hidden";
  window.__lenis?.stop();
}

/** Restore page scroll after a modal closes. */
export function unlockScroll() {
  document.body.style.overflow = "";
  window.__lenis?.start();
}
