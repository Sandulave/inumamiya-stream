// src/components/LatestArchive.tsx
import { useEffect, useState } from "react";
import type { Video } from "@/types";

export function LatestArchive() {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    const fetchLatestVideo = async () => {
      try {
        const res = await fetch("/api/latest-video");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        if (!canceled) {
          if (data.video) {
            setVideo(data.video);
          }
          setLoading(false);
        }
      } catch (e) {
        if (!canceled) {
          setError(e instanceof Error ? e.message : "Failed to load video");
          setLoading(false);
        }
      }
    };

    fetchLatestVideo();

    return () => {
      canceled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
        <div className="w-full aspect-video bg-white/10 rounded-lg mb-3" />
        <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    );
  }

  if (error || !video) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <a href={video.url} target="_blank" rel="noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full rounded-lg mb-3"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/ogp.png";
          }}
        />
        <h3 className="text-md font-bold">{video.title}</h3>
        <p className="text-xs text-white/60">
          {new Date(video.createdAt).toLocaleDateString()} ·{" "}
          {video.viewCount.toLocaleString()} views
        </p>
      </a>
    </div>
  );
}

