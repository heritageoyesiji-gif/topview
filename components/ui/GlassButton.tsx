import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, size = "md", variant = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "liquid-glass glass inline-flex items-center justify-center font-medium uppercase tracking-widest rounded-full transition-all duration-300",
          "hover:bg-white/10 hover:border-white/25 active:scale-95",
          {
            "px-4 py-2 text-xs": size === "sm",
            "px-6 py-3 text-sm": size === "md",
            "px-8 py-4 text-base": size === "lg",
          },
          variant === "outline" && "border border-white/20",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export default GlassButton;
