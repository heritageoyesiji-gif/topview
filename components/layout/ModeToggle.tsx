"use client";

interface ModeToggleProps {
  mode: "talent" | "marketing";
  onToggle: () => void;
  onDark?: boolean;
}

export default function ModeToggle({ mode, onToggle, onDark = false }: ModeToggleProps) {
  const activeCls = onDark
    ? "bg-white text-black"
    : "bg-black text-white";

  const ghostCls = onDark
    ? "border border-white/25 text-white/55 hover:text-white hover:border-white/50"
    : "border border-black/20 text-black/45 hover:text-black hover:border-black/40";

  const base = "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-95";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => mode !== "talent" && onToggle()}
        className={`${base} ${mode === "talent" ? activeCls : ghostCls}`}
      >
        Talent
      </button>
      <button
        onClick={() => mode !== "marketing" && onToggle()}
        className={`${base} ${mode === "marketing" ? activeCls : ghostCls}`}
      >
        Marketing
      </button>
    </div>
  );
}
