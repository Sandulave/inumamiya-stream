// src/app/api/latest-video/route.ts
import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/twitchAuth";
import { getTwitchUserId } from "@/lib/twitchUserId";
import type { TwitchVideoResponse } from "@/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
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

    const url = new URL(req.url);
    const countParam = url.searchParams.get("count") ?? "1";
    const count = Math.min(Math.max(parseInt(countParam, 10) || 1, 1), 10); // 1-10の範囲に制限

    const res = await fetch(
      `https://api.twitch.tv/helix/videos?user_id=${userId}&type=archive&first=${count}`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error(`[latest-video] Twitch API error: ${res.status}`, errorText);
      return NextResponse.json(
        { error: `Twitch API error: ${res.status}`, detail: errorText },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    const data = (await res.json()) as TwitchVideoResponse;
    const videos = data.data ?? [];

    if (videos.length === 0) {
      return NextResponse.json({ video: null, videos: [] });
    }

    // サムネイルURLはテンプレートの {width}×{height} を実際のサイズに置換
    const processedVideos = videos.map((vid) => ({
      id: vid.id,
      title: vid.title,
      url: vid.url,
      thumbnail: vid.thumbnail_url
        .replace("%{width}", "480")
        .replace("%{height}", "272"),
      createdAt: vid.created_at,
      viewCount: vid.view_count,
    }));

    // 後方互換性のため、最初の動画をvideoとして返す
    return NextResponse.json({
      video: processedVideos[0],
      videos: processedVideos,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch latest video";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
