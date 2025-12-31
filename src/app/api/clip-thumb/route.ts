// src/app/api/clip-thumb/route.ts
import { NextResponse } from "next/server";
import type { TwitchOEmbedResponse } from "@/types";

function canonicalClipUrl(input: string): string {
  // 受け取るのは例えば
  // https://www.twitch.tv/inumamiya/clip/IntelligentSolidFish...
  // https://clips.twitch.tv/IntelligentSolidFish...
  // のどっちでも来る想定

  try {
    const u = new URL(input);

    // clips.twitch.tv/<slug>
    const m1 = u.pathname.match(/^\/([^/]+)$/);
    if (u.hostname === "clips.twitch.tv" && m1?.[1]) {
      return `https://clips.twitch.tv/${m1[1]}`;
    }

    // www.twitch.tv/<channel>/clip/<slug>
    const m2 = u.pathname.match(/^\/[^/]+\/clip\/([^/]+)$/);
    if (
      (u.hostname === "www.twitch.tv" || u.hostname === "twitch.tv") &&
      m2?.[1]
    ) {
      return `https://clips.twitch.tv/${m2[1]}`;
    }

    // それ以外はそのまま
    return input;
  } catch {
    return input;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "missing url", thumbnail: "/ogp.png" },
        { status: 400 }
      );
    }

    const clipUrl = canonicalClipUrl(url);

    // oEmbed（認証不要）
    const oembed = `https://clips.twitch.tv/oembed?url=${encodeURIComponent(clipUrl)}`;

    try {
      const r = await fetch(oembed, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!r.ok) {
        // 例: clip削除やclip_missingなど
        return NextResponse.json({
          thumbnail: "/ogp.png",
          reason: `oembed ${r.status}`,
        });
      }

      const j = (await r.json()) as TwitchOEmbedResponse;

      // oEmbedのthumbnail_urlを「自前のimgプロキシ」に通す
      if (j.thumbnail_url && typeof j.thumbnail_url === "string") {
        const proxied = `/api/img?url=${encodeURIComponent(j.thumbnail_url)}`;
        return NextResponse.json({ thumbnail: proxied });
      }

      return NextResponse.json({
        thumbnail: "/ogp.png",
        reason: "no thumbnail_url",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "unknown";
      return NextResponse.json({
        thumbnail: "/ogp.png",
        reason: message,
      });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process clip URL";
    return NextResponse.json(
      { error: message, thumbnail: "/ogp.png" },
      { status: 500 }
    );
  }
}
