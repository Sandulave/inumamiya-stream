// src/app/api/top-clips/route.ts
import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/twitchAuth";
import { getTwitchUserId } from "@/lib/twitchUserId";
import type { TwitchClipResponse } from "@/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const countParam = url.searchParams.get("count") ?? "3";
    const count = Math.min(Math.max(parseInt(countParam, 10) || 3, 1), 100); // 1-100の範囲に制限

    const userIdOrLogin = process.env.TWITCH_USER_ID;
    const clientId = process.env.TWITCH_CLIENT_ID;

    if (!userIdOrLogin || !clientId) {
      return NextResponse.json(
        { error: "TWITCH_USER_ID and TWITCH_CLIENT_ID must be set" },
        { status: 500 }
      );
    }

    // ユーザー名からユーザーIDを取得（数値の場合はそのまま使用）
    const userId = await getTwitchUserId(userIdOrLogin);
    if (!userId) {
      return NextResponse.json(
        { error: `Failed to get user ID for: ${userIdOrLogin}` },
        { status: 500 }
      );
    }

    const token = await getAppAccessToken();

    // まず多くのクリップを取得してから、再生回数順にソートする
    // Twitch APIのsort=viewsは存在しないため、クライアント側でソートする
    // 上位3つを確実に取得するため、多めに取得してからソート
    const res = await fetch(
      `https://api.twitch.tv/helix/clips?broadcaster_id=${userId}&first=30`,
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
    // 再生回数順（降順）にソートして、上位count件を取得
    const sortedClips = (data.data ?? [])
      .map((clip) => ({
        id: clip.id,
        title: clip.title,
        url: clip.url,
        thumbnail: clip.thumbnail_url,
        viewCount: clip.view_count,
        createdAt: clip.created_at,
      }))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, count);

    return NextResponse.json({ clips: sortedClips });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch top clips";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
