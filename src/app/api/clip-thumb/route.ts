// src/app/api/clip-thumb/route.ts
import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/twitchAuth";
import type { TwitchClipResponse } from "@/types";

export const runtime = "nodejs";

/**
 * クリップURLからクリップID（slug）を抽出
 * @param input クリップURL
 * @returns クリップID、またはnull
 */
function extractClipId(input: string): string | null {
  try {
    const u = new URL(input);

    // clips.twitch.tv/<slug>
    const m1 = u.pathname.match(/^\/([^/]+)$/);
    if (u.hostname === "clips.twitch.tv" && m1?.[1]) {
      return m1[1];
    }

    // www.twitch.tv/<channel>/clip/<slug>
    const m2 = u.pathname.match(/^\/[^/]+\/clip\/([^/]+)$/);
    if (
      (u.hostname === "www.twitch.tv" || u.hostname === "twitch.tv") &&
      m2?.[1]
    ) {
      return m2[1];
    }

    return null;
  } catch {
    return null;
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

    // クリップURLからクリップIDを抽出
    const clipId = extractClipId(url);
    if (!clipId) {
      console.warn(`[clip-thumb] Failed to extract clip ID from URL: ${url}`);
      return NextResponse.json({
        thumbnail: "/ogp.png",
        reason: "invalid clip URL",
      });
    }

    console.log(`[clip-thumb] Processing URL: ${url} -> clip ID: ${clipId}`);

    const clientId = process.env.TWITCH_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { error: "TWITCH_CLIENT_ID must be set", thumbnail: "/ogp.png" },
        { status: 500 }
      );
    }

    // Helix APIを使用してクリップ情報を取得
    const token = await getAppAccessToken();
    const helixUrl = `https://api.twitch.tv/helix/clips?id=${encodeURIComponent(clipId)}`;
    console.log(`[clip-thumb] Fetching from Helix API: ${helixUrl}`);

    try {
      const r = await fetch(helixUrl, {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`[clip-thumb] Helix API response status: ${r.status} ${r.statusText}`);

      if (!r.ok) {
        const errorText = await r.text().catch(() => "");
        console.error(`[clip-thumb] Helix API error: ${r.status}`, errorText);
        return NextResponse.json({
          thumbnail: "/ogp.png",
          reason: `helix ${r.status}`,
        });
      }

      const data = (await r.json()) as TwitchClipResponse;
      console.log(`[clip-thumb] Helix API response:`, JSON.stringify(data, null, 2));

      // クリップ情報を取得
      const clip = data.data?.[0];
      if (!clip || !clip.thumbnail_url) {
        console.warn(`[clip-thumb] No clip found or no thumbnail_url for clip ID: ${clipId}`);
        return NextResponse.json({
          thumbnail: "/ogp.png",
          reason: "clip not found or no thumbnail",
        });
      }

      // サムネイルURLをプロキシ経由で返す
      const proxied = `/api/img?url=${encodeURIComponent(clip.thumbnail_url)}`;
      console.log(`[clip-thumb] Returning proxied thumbnail: ${proxied}`);
      return NextResponse.json({ thumbnail: proxied });
    } catch (e) {
      const message = e instanceof Error ? e.message : "unknown";
      console.error(`[clip-thumb] Exception while fetching from Helix API:`, e);
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
