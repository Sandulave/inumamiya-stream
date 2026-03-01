// src/components/StyleCards.tsx
import { config } from "@/content/config";

export function StyleCards() {
  const iconByTitle: Record<string, string> = {
    OS: "OS",
    CPU: "CPU",
    GPU: "GPU",
    メモリ: "RAM",
    ストレージ: "SSD",
    "電源・ケース": "PWR",
  };
  const featuredTitles = new Set(["CPU", "GPU", "メモリ", "ストレージ"]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {config.styleCards.map((card) => (
        <div
          key={card.title}
          className={[
            "lux-card spec-card rounded-xl border border-white/10 bg-white/[0.06] p-4",
            featuredTitles.has(card.title)
              ? "spec-featured ring-1 ring-amber-100/18"
              : "",
          ].join(" ")}
        >
          {/* Keep the same UI grammar as cards in upper sections: label + title + body */}
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white/62">
            <span className="inline-flex min-w-7 justify-center rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] text-white/80">
              {iconByTitle[card.title] ?? "SPEC"}
            </span>
            STREAM SETUP
          </div>
          <div className="text-sm font-semibold text-white/94">{card.title}</div>
          <ul className="mt-3 space-y-2 text-sm text-white/76">
            {card.items.map((it, index) => (
              <li key={it} className="flex items-start gap-2">
                <span
                  className={[
                    "mt-1 h-1.5 w-1.5 rounded-full",
                    index === 0 ? "bg-amber-200/85" : "bg-white/55",
                  ].join(" ")}
                />
                <span className={index === 0 ? "text-white/90 font-medium" : ""}>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

