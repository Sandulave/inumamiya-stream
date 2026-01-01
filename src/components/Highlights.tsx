// src/components/Highlights.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Video } from "@/types";

export function Highlights() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    const fetchLatestVideos = async () => {
      try {
        const res = await fetch("/api/latest-video?count=3");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("[Highlights] Failed to fetch videos:", res.status, errorData);
          if (!canceled) {
            setLoading(false);
          }
          return;
        }

        const data = await res.json();
        const fetchedVideos: Video[] = data.videos || [];
        
        if (!canceled) {
          setVideos(fetchedVideos);
          
          // サムネイルの処理
          const thumbnailMap: Record<string, string> = {};
          fetchedVideos.forEach((video) => {
            if (video.thumbnail) {
              // 外部URLの場合はプロキシ経由で取得
              if (video.thumbnail.startsWith("http")) {
                thumbnailMap[video.url] = `/api/img?url=${encodeURIComponent(video.thumbnail)}`;
              } else {
                thumbnailMap[video.url] = video.thumbnail;
              }
            } else {
              thumbnailMap[video.url] = "/ogp.png";
          }
          });
          setThumbs(thumbnailMap);
          setLoading(false);
        }
      } catch (e) {
        console.error("[Highlights] Error fetching videos:", e);
        if (!canceled) {
          setLoading(false);
        }
      }
    };

    fetchLatestVideos();

    return () => {
      canceled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse"
          >
            <div className="aspect-video bg-white/10 rounded-lg mb-3" />
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {videos.map((video) => (
        <motion.a
          key={video.id}
          href={video.url}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.35 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 group"
        >
          <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbs[video.url] ?? video.thumbnail ?? "/ogp.png"}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src !== "/ogp.png") {
                  img.src = "/ogp.png";
                }
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-70" />
            <div className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white/90 backdrop-blur">
              ▶ Archive
            </div>
          </div>
          <div className="text-sm font-semibold line-clamp-2 group-hover:text-white transition">
            {video.title}
          </div>
          <div className="mt-2 text-xs text-white/60">
            {new Date(video.createdAt).toLocaleDateString()} ·{" "}
            {video.viewCount.toLocaleString()} views
          </div>
        </motion.a>
      ))}
    </div>
  );
}

