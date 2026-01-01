// src/components/Clips.tsx
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { config } from "@/content/config";
import type { ClipItem, Clip } from "@/types";

type ClipsProps = {
  visible?: boolean;
};

export function Clips({ visible = true }: ClipsProps) {
  const [clips, setClips] = useState<ClipItem[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [canAnimate, setCanAnimate] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  useEffect(() => {
    let canceled = false;

    const fetchClips = async () => {
      try {
        // top-clips APIからクリップを取得（再生回数順に3つ）
        const res = await fetch("/api/top-clips?count=3");
        
        if (!res.ok) {
          console.error(`[Clips] Failed to fetch clips: ${res.status}`);
          if (!canceled) {
            setLoading(false);
          }
          return;
        }

        const data = await res.json();
        const apiClips: Clip[] = data.clips || [];

        // Clip型をClipItem型に変換
        const clipItems: ClipItem[] = apiClips.map((clip) => ({
          title: clip.title,
          href: clip.url,
          thumbnail: clip.thumbnail,
        }));

        if (!canceled) {
          setClips(clipItems);
        }

        // サムネイルの処理
        const results = await Promise.all(
          clipItems.map(async (c) => {
            // サムネイルが既にAPIから取得できている場合はそれを使用
            if (c.thumbnail) {
              // 外部URLの場合はプロキシ経由で取得
              if (c.thumbnail.startsWith("http")) {
                const proxied = `/api/img?url=${encodeURIComponent(c.thumbnail)}`;
                return [c.href, proxied] as const;
              }
              return [c.href, c.thumbnail] as const;
            }

            // サムネイルがない場合はフォールバック画像
            return [c.href, "/ogp.png"] as const;
          })
        );

        if (!canceled) {
          const map = Object.fromEntries(results);
          setThumbs(map);
          setLoading(false);
        }
      } catch (error) {
        console.error("[Clips] Error fetching clips:", error);
        if (!canceled) {
          setLoading(false);
        }
      }
    };

    fetchClips();

    return () => {
      canceled = true;
    };
  }, []);

  // 起動演出完了後、QRコードアニメーション完了後、アーカイブアニメーション完了後にアニメーション開始
  useEffect(() => {
    if (shouldReduceMotion) {
      setCanAnimate(true);
      return;
    }

    // クリップのアニメーション開始タイミングをconfigから取得
    const timer = setTimeout(() => {
      setCanAnimate(true);
    }, config.animation.clips.startDelay);

    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -20, // 左から
      y: shouldReduceMotion ? 0 : 12,  // QRコードと同じ
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : (i * config.animation.clips.cardStagger) / 1000,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  // visibleがfalseの場合はinvisibleクラスで非表示（レイアウトは維持）
  const isVisible = visible && canAnimate;
  const shouldHide = !visible || (!canAnimate && !shouldReduceMotion);

  return (
    <div
      className={[
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        shouldHide ? "invisible pointer-events-none" : "",
      ].join(" ")}
      aria-hidden={shouldHide}
    >
      {clips.map((c, index) => (
        <motion.a
          key={c.href}
          href={c.href}
          target="_blank"
          rel="noreferrer"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={cardVariants}
          custom={index}
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
                const img = e.currentTarget as HTMLImageElement;
                console.error(`[Clips] Image load error for ${c.href}:`, img.src);
                if (img.src !== "/ogp.png") {
                  img.src = "/ogp.png";
                }
              }}
              onLoad={() => {
                console.log(`[Clips] Image loaded successfully for ${c.href}:`, thumbs[c.href] ?? c.thumbnail);
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
        </motion.a>
      ))}
    </div>
  );
}

