// src/components/LatestArchive.tsx
import { useEffect, useState } from "react";
import type { Video } from "@/types";

export function LatestArchive() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    const fetchLatestVideos = async () => {
      try {
        // 最新3つの動画を取得
        const res = await fetch("/api/latest-video?count=3");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
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

  if (error || videos.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <div key={video.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <a href={video.url} target="_blank" rel="noreferrer" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbs[video.url] ?? video.thumbnail ?? "/ogp.png"}
              alt={video.title}
              className="w-full aspect-video object-cover rounded-lg mb-3"
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src !== "/ogp.png") {
                  img.src = "/ogp.png";
                }
              }}
            />
            <h3 className="text-md font-bold text-white/90 mb-2">{video.title}</h3>
            <p className="text-xs text-white/60">
              {new Date(video.createdAt).toLocaleDateString()} ·{" "}
              {video.viewCount.toLocaleString()} views
            </p>
          </a>
        </div>
      ))}
    </div>
  );
}

