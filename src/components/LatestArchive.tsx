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

  // 「ページ表示開始からの経過」を測る
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
          const key = video.url; // 現状のまま（必要ならidキーに変更もOK）
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

  // 起動演出 + QR終了（合計4.7秒）に合わせる：マウントからの残り時間だけ待つ
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

  // ロード中はスケルトン表示（今のままでOK）
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse"
          >
            <div className="w-full aspect-video bg-white/10 rounded-lg mb-3" />
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
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
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={cardVariants}
          custom={index}
          className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
        >
          <a href={video.url} target="_blank" rel="noreferrer" className="block">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbs[video.url] ?? video.thumbnail ?? "/ogp.png"}
                alt={video.title}
                className="h-auto w-full aspect-video object-cover"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.src !== "/ogp.png") img.src = "/ogp.png";
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-70" />
              <div className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white/90 backdrop-blur">
                ▶ Archive
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm font-semibold text-white/90">{video.title}</div>
              <div className="mt-2 text-xs text-white/60">
                {new Date(video.createdAt).toLocaleDateString()} ·{" "}
                {video.viewCount.toLocaleString()} views
              </div>
            </div>
          </a>
        </motion.div>
      ))}
    </div>
  );
}
