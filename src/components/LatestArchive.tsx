// src/components/LatestArchive.tsx
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { config } from "@/content/config";
import type { Video } from "@/types";

type LatestArchiveProps = {
  visible?: boolean;
};

export function LatestArchive({ visible = true }: LatestArchiveProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // 縲後・繝ｼ繧ｸ陦ｨ遉ｺ髢句ｧ九°繧峨・邨碁℃縲阪ｒ貂ｬ繧・
  const mountedAtRef = useRef<number>(0);

  useEffect(() => {
    console.log("[LatestArchive]", {
      loading,
      shouldReduceMotion,
      canAnimate,
      t: typeof performance !== "undefined" ? performance.now() : Date.now(),
    });
  }, [loading, shouldReduceMotion, canAnimate]);
  

  useEffect(() => {
    mountedAtRef.current = typeof performance !== "undefined" ? performance.now() : Date.now();
  }, []);

  useEffect(() => {
    let canceled = false;

    const fetchLatestVideos = async () => {
      try {
        const res = await fetch("/api/latest-video?count=3");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data = await res.json();
        const fetchedVideos: Video[] = data.videos || [];

        if (canceled) return;

        setVideos(fetchedVideos);

        const thumbnailMap: Record<string, string> = {};
        fetchedVideos.forEach((video) => {
          const key = video.url; // 迴ｾ迥ｶ縺ｮ縺ｾ縺ｾ・亥ｿ・ｦ√↑繧永d繧ｭ繝ｼ縺ｫ螟画峩繧０K・・
          if (video.thumbnail) {
            thumbnailMap[key] = video.thumbnail.startsWith("http")
              ? `/api/img?url=${encodeURIComponent(video.thumbnail)}`
              : video.thumbnail;
          } else {
            thumbnailMap[key] = "/ogp.png";
          }
        });

        setThumbs(thumbnailMap);
        setLoading(false);
      } catch (e) {
        if (!canceled) {
          setError(e instanceof Error ? e.message : "Failed to load videos");
          setLoading(false);
        }
      }
    };

    fetchLatestVideos();
    return () => {
      canceled = true;
    };
  }, []);

  // 襍ｷ蜍墓ｼ泌・ + QR邨ゆｺ・ｼ亥粋險・.7遘抵ｼ峨↓蜷医ｏ縺帙ｋ・壹・繧ｦ繝ｳ繝医°繧峨・谿九ｊ譎る俣縺縺大ｾ・▽
  useEffect(() => {
    if (loading) return;

    if (shouldReduceMotion) {
      setCanAnimate(true);
      return;
    }

    const totalDelayMs = config.animation.archive.startDelay;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const elapsed = now - mountedAtRef.current;
    const remaining = Math.max(0, totalDelayMs - elapsed);

    const timer = window.setTimeout(() => setCanAnimate(true), remaining);
    return () => window.clearTimeout(timer);
  }, [loading, shouldReduceMotion]);

  // 繝ｭ繝ｼ繝我ｸｭ縺ｯ繧ｹ繧ｱ繝ｫ繝医Φ陦ｨ遉ｺ・井ｻ翫・縺ｾ縺ｾ縺ｧOK・・
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-white/10 bg-white/5 animate-pulse"
          >
            <div className="w-full aspect-video bg-white/10" />
            <div className="p-4">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || videos.length === 0) return null;

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -20,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : (i * config.animation.archive.cardStagger) / 1000,
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
      {videos.map((video, index) => (
        <motion.article
          key={video.id}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={cardVariants}
          custom={index}
          // DOM rule aligned with GAMES/CLIPS:
          // outer card frame + inner link + media/body split.
          className="lux-card archive-card group overflow-hidden rounded-xl border border-white/10 bg-white/5"
        >
          <a href={video.url} target="_blank" rel="noreferrer" className="block h-full">
            <div className="card-media relative overflow-hidden border-b border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbs[video.url] ?? video.thumbnail ?? "/ogp.png"}
                alt={video.title}
                className="h-auto w-full aspect-video object-cover transition duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.src !== "/ogp.png") img.src = "/ogp.png";
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-70" />
              <div className="card-chip pointer-events-none absolute bottom-2 left-2">
                Archive
              </div>
            </div>
            <div className="card-body p-4">
              <div className="card-kicker archive-kicker mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-white/62">
                LATEST STREAM
              </div>
              <div className="card-title text-sm font-semibold text-white/92">{video.title}</div>
              <div className="card-meta mt-2 text-xs text-white/62">
                {new Date(video.createdAt).toLocaleDateString()} •{" "}
                {video.viewCount.toLocaleString()} views
              </div>
              <div className="card-action archive-action mt-3 inline-flex items-center text-xs font-medium text-white/78">
                視聴する
                <span className="ml-2 opacity-65 transition group-hover:opacity-100">
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

