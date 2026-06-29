import { cn } from "@/lib/utils";

interface ShineCardProps {
  className?: string;
  children: React.ReactNode;
}

export default function ShineCard({ className, children }: ShineCardProps) {
  return (
    <div className={cn("shine-border relative rounded-2xl bg-white/[0.03] p-6", className)}>
      {children}
    </div>
  );
}
