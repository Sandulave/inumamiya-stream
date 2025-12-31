// src/components/Clips.tsx
import { useEffect, useState } from "react";
import { config } from "@/content/config";
import type { ClipItem } from "@/types";

export function Clips() {
  const clips = config.clips as readonly ClipItem[];
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    const fetchThumbnails = async () => {
      try {
        const results = await Promise.all(
          clips.map(async (c) => {
            if (c.thumbnail) return [c.href, c.thumbnail] as const;

            const api = `/api/clip-thumb?url=${encodeURIComponent(c.href)}`;

            try {
              const r = await fetch(api);
              if (!r.ok) {
                return [c.href, "/ogp.png"] as const;
              }

              const j = await r.json();

              if (typeof j?.thumbnail === "string" && j.thumbnail.length > 0) {
                return [c.href, j.thumbnail] as const;
              }
            } catch {
              // エラー時はフォールバック画像を使用
            }

            return [c.href, "/ogp.png"] as const;
          })
        );

        if (!canceled) {
          const map = Object.fromEntries(results);
          setThumbs(map);
          setLoading(false);
        }
      } catch {
        if (!canceled) {
          setLoading(false);
        }
      }
    };

    fetchThumbnails();

    return () => {
      canceled = true;
    };
  }, [clips]);

  if (loading && clips.length > 0 && Object.keys(thumbs).length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clips.map((c) => (
          <div
            key={c.href}
            className="overflow-hidden rounded-xl border border-white/10 bg-white/5 animate-pulse"
          >
            <div className="aspect-video bg-white/10" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clips.map((c) => (
        <a
          key={c.href}
          href={c.href}
          target="_blank"
          rel="noreferrer"
          className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
        >
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbs[c.href] ?? c.thumbnail ?? "/ogp.png"}
              alt={c.title}
              className="h-auto w-full aspect-video object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/ogp.png";
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-70" />
            <div className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white/90 backdrop-blur">
              ▶ Clip
            </div>
          </div>

          <div className="p-4">
            <div className="text-sm font-semibold text-white/90">{c.title}</div>
            <div className="mt-2 text-xs text-white/60">
              {c.href.replace("https://", "")}
            </div>
            <div className="mt-3 inline-flex items-center text-xs text-white/70">
              Open{" "}
              <span className="ml-2 opacity-60 transition group-hover:opacity-100">
                ↗
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

