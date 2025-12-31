// src/app/api/latest-video/route.ts
import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/twitchAuth";
import type { TwitchVideoResponse } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  try {
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
      `https://api.twitch.tv/helix/videos?user_id=${userId}&type=archive&first=1`,
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

    const data = (await res.json()) as TwitchVideoResponse;
    const vid = data.data?.[0];

    if (!vid) {
      return NextResponse.json({ video: null });
    }

    // サムネイルURLはテンプレートの {width}×{height} を実際のサイズに置換
    const thumb = vid.thumbnail_url
      .replace("%{width}", "480")
      .replace("%{height}", "272");

    return NextResponse.json({
      video: {
        id: vid.id,
        title: vid.title,
        url: vid.url,
        thumbnail: thumb,
        createdAt: vid.created_at,
        viewCount: vid.view_count,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch latest video";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
