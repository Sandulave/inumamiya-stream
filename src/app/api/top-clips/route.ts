// src/app/api/top-clips/route.ts
import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/twitchAuth";
import type { TwitchClipResponse } from "@/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const countParam = url.searchParams.get("count") ?? "3";
    const count = Math.min(Math.max(parseInt(countParam, 10) || 3, 1), 100); // 1-100の範囲に制限

    const userId = process.env.TWITCH_USER_ID;
    const clientId = process.env.TWITCH_CLIENT_ID;

    if (!userId || !clientId) {
      return NextResponse.json(
        { error: "TWITCH_USER_ID and TWITCH_CLIENT_ID must be set" },
        { status: 500 }
      );
    }

    const token = await getAppAccessToken();

    const res = await fetch(
      `https://api.twitch.tv/helix/clips?broadcaster_id=${userId}&first=${count}`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      return NextResponse.json(
        { error: `Twitch API error: ${res.status}`, detail: errorText },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    const data = (await res.json()) as TwitchClipResponse;
    const clips = (data.data ?? []).map((clip) => ({
      id: clip.id,
      title: clip.title,
      url: clip.url,
      thumbnail: clip.thumbnail_url,
      viewCount: clip.view_count,
      createdAt: clip.created_at,
    }));

    return NextResponse.json({ clips });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch top clips";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
