// src/components/Pill.tsx
import type { PillTone } from "@/types";

type PillProps = {
  tone: PillTone;
  children: React.ReactNode;
};

export function Pill({ tone, children }: PillProps) {
  const cls =
    tone === "red"
      ? "bg-red-500/20 text-red-100 border-red-400/20"
      : tone === "amber"
      ? "bg-amber-500/20 text-amber-100 border-amber-400/20"
      : "bg-blue-500/20 text-blue-100 border-blue-400/20";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

