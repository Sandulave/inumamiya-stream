// src/components/Pill.tsx
import type { PillTone } from "@/types";

type PillProps = {
  tone: PillTone;
  children: React.ReactNode;
};

type PillPropsWithLive = PillProps & {
  isLive?: boolean;
};

export function Pill({ tone, children, isLive }: PillPropsWithLive) {
  const cls =
    tone === "red"
      ? isLive
        ? "bg-red-500/30 text-red-50 border-red-400/40 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
        : "bg-red-500/20 text-red-100 border-red-400/20"
      : tone === "amber"
      ? "bg-amber-500/20 text-amber-100 border-amber-400/20"
      : "bg-blue-500/20 text-blue-100 border-blue-400/20";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls} ${isLive ? 'animate-pulse-glow' : ''}`}
      style={isLive ? { animation: 'live-pulse 2s ease-in-out infinite' } : undefined}
    >
      {children}
    </span>
  );
}

