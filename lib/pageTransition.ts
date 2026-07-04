export function transitionTo(href: string, bgColor: string, navigate: () => void) {
  const el = document.getElementById("pg-overlay") as HTMLElement | null;
  if (!el) { navigate(); return; }

  el.style.background = bgColor;
  el.style.transition = "none";
  el.style.transform = "translateX(100%)";

  // Force reflow, then slide in to cover screen
  el.getBoundingClientRect();
  el.style.transition = "transform 0.28s cubic-bezier(0.76, 0, 0.24, 1)";
  el.style.transform = "translateX(0)";

  setTimeout(navigate, 260);
}
