// src/components/Ticker.tsx
import { useMemo } from "react";
import type { CSSProperties } from "react";
import { config } from "@/content/config";

export function Ticker() {
  const items = useMemo(() => config.ticker.items, []);
  const duration = config.ticker.speedSeconds;

  const tickerStyle = {
    ["--ticker-duration"]: `${duration}s`,
  } as CSSProperties & Record<`--${string}`, string>;

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div
        className="ticker flex w-max items-center gap-8 px-4 py-2 text-xs tracking-wide text-white/85"
        style={tickerStyle}
      >
        {[...items, ...items].map((t, i) => (
          <span key={`${t}-${i}`} className="inline-flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

