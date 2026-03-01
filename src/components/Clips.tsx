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
  const [animationReady, setAnimationReady] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  useEffect(() => {
    let canceled = false;

    const fetchClips = async () => {
      try {
        // top-clips API縺九ｉ繧ｯ繝ｪ繝・・繧貞叙蠕暦ｼ亥・逕溷屓謨ｰ鬆・↓3縺､・・
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

        // Clip蝙九ｒClipItem蝙九↓螟画鋤
        const clipItems: ClipItem[] = apiClips.map((clip) => ({
          title: clip.title,
          href: clip.url,
          thumbnail: clip.thumbnail,
        }));

        if (!canceled) {
          setClips(clipItems);
        }

        // 繧ｵ繝繝阪う繝ｫ縺ｮ蜃ｦ逅・
        const results = await Promise.all(
          clipItems.map(async (c) => {
            // 繧ｵ繝繝阪う繝ｫ縺梧里縺ｫAPI縺九ｉ蜿門ｾ励〒縺阪※縺・ｋ蝣ｴ蜷医・縺昴ｌ繧剃ｽｿ逕ｨ
            if (c.thumbnail) {
              // 螟夜ΚURL縺ｮ蝣ｴ蜷医・繝励Ο繧ｭ繧ｷ邨檎罰縺ｧ蜿門ｾ・
              if (c.thumbnail.startsWith("http")) {
                const proxied = `/api/img?url=${encodeURIComponent(c.thumbnail)}`;
                return [c.href, proxied] as const;
              }
              return [c.href, c.thumbnail] as const;
            }

            // 繧ｵ繝繝阪う繝ｫ縺後↑縺・ｴ蜷医・繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ逕ｻ蜒・
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

  // 襍ｷ蜍墓ｼ泌・螳御ｺ・ｾ後＿R繧ｳ繝ｼ繝峨い繝九Γ繝ｼ繧ｷ繝ｧ繝ｳ螳御ｺ・ｾ後√い繝ｼ繧ｫ繧､繝悶い繝九Γ繝ｼ繧ｷ繝ｧ繝ｳ螳御ｺ・ｾ後↓繧｢繝九Γ繝ｼ繧ｷ繝ｧ繝ｳ髢句ｧ・
  useEffect(() => {
    if (shouldReduceMotion) return;

    // 繧ｯ繝ｪ繝・・縺ｮ繧｢繝九Γ繝ｼ繧ｷ繝ｧ繝ｳ髢句ｧ九ち繧､繝溘Φ繧ｰ繧団onfig縺九ｉ蜿門ｾ・
    const timer = setTimeout(() => {
      setAnimationReady(true);
    }, config.animation.clips.startDelay);

    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  const canAnimate = shouldReduceMotion || animationReady;
  const toClipMeta = (href: string) => {
    try {
      const u = new URL(href);
      return `${u.hostname.replace("www.", "")} · ${u.pathname.slice(0, 20)}${u.pathname.length > 20 ? "..." : ""}`;
    } catch {
      return href.replace("https://", "").slice(0, 28);
    }
  };

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
      x: shouldReduceMotion ? 0 : -20, // 蟾ｦ縺九ｉ
      y: shouldReduceMotion ? 0 : 12,  // QR繧ｳ繝ｼ繝峨→蜷後§
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

  // visible縺掲alse縺ｮ蝣ｴ蜷医・invisible繧ｯ繝ｩ繧ｹ縺ｧ髱櫁｡ｨ遉ｺ・医Ξ繧､繧｢繧ｦ繝医・邯ｭ謖・ｼ・
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
        <motion.article
          key={c.href}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={cardVariants}
          custom={index}
          // Keep the same wrapper responsibility as GAMES/ARCHIVE.
          className="lux-card clip-card group overflow-hidden rounded-xl border border-white/10 bg-white/5"
        >
          <a href={c.href} target="_blank" rel="noreferrer" className="block h-full">
            <div className="card-media relative overflow-hidden border-b border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbs[c.href] ?? c.thumbnail ?? "/ogp.png"}
                alt={c.title}
                className="h-auto w-full aspect-video object-cover transition duration-500 group-hover:scale-[1.03]"
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
              <div className="card-chip pointer-events-none absolute bottom-2 left-2">
                Clip
              </div>
            </div>

            <div className="card-body p-4">
              <div className="card-kicker mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-white/62">
                RECOMMENDED MOMENT
              </div>
              <div className="card-title text-sm font-semibold text-white/92">{c.title}</div>
              <div className="card-meta mt-2 text-xs text-white/62">
                {toClipMeta(c.href)}
              </div>
              <div className="card-action clip-action mt-3 inline-flex items-center rounded-full border border-amber-100/20 bg-amber-100/10 px-2.5 py-1 text-xs font-semibold text-amber-50/90">
                Open
                <span className="ml-2 opacity-60 transition group-hover:opacity-100">
                  &gt;
                </span>
              </div>
            </div>
          </a>
        </motion.article>
      ))}
    </div>
  );
}


