// src/components/StyleCards.tsx
import { config } from "@/content/config";

export function StyleCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {config.styleCards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div className="text-sm font-semibold">{card.title}</div>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {card.items.map((it) => (
              <li key={it} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

