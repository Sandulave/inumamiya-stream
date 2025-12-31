// src/components/Background.tsx
import { config } from "@/content/config";

export function Background() {
  const scan = config.theme.scanlines ? "bg-scanlines" : "";
  const grid = config.theme.grid ? "bg-grid" : "";

  return (
    <div className={`pointer-events-none fixed inset-0 ${scan} ${grid}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.35),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(239,68,68,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(245,158,11,0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.65),rgba(2,6,23,0.92))]" />
    </div>
  );
}

