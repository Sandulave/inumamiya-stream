// src/app/api/twitch/status/route.ts
import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/twitchAuth";
import { getTwitchUserId } from "@/lib/twitchUserId";

export const runtime = "nodejs";

type TwitchStreamResponse = {
  data: Array<{
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: "live" | "";
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    is_mature: boolean;
  }>;
};

export async function GET(req: Request) {
  try {
    const channelLogin = process.env.TWITCH_CHANNEL_LOGIN;
    const clientId = process.env.TWITCH_CLIENT_ID;

    if (!channelLogin) {
      console.error("[twitch/status] TWITCH_CHANNEL_LOGIN is not set");
      // エラー時は非配信として返す（フォールバック）
      return NextResponse.json(
        {
          isLive: false,
          title: undefined,
          startedAt: undefined,
        },
        { status: 200 }
      );
    }

    if (!clientId) {
      console.error("[twitch/status] TWITCH_CLIENT_ID is not set");
      // エラー時は非配信として返す（フォールバック）
      return NextResponse.json(
        {
          isLive: false,
          title: undefined,
          startedAt: undefined,
        },
        { status: 200 }
      );
    }

    // ユーザーIDを取得（user_loginから）
    let userId: string | null = null;
    try {
      userId = await getTwitchUserId(channelLogin);
    } catch (error) {
      console.error(`[twitch/status] Error getting user ID for ${channelLogin}:`, error);
    }

    if (!userId) {
      console.error(`[twitch/status] Failed to get user ID for: ${channelLogin}`);
      // エラー時は非配信として返す（フォールバック）
      return NextResponse.json(
        {
          isLive: false,
          title: undefined,
          startedAt: undefined,
        },
        { status: 200 }
      );
    }

    let token: string;
    try {
      token = await getAppAccessToken();
    } catch (error) {
      console.error("[twitch/status] Error getting access token:", error);
      // エラー時は非配信として返す（フォールバック）
      return NextResponse.json(
        {
          isLive: false,
          title: undefined,
          startedAt: undefined,
        },
        { status: 200 }
      );
    }

    // Streams APIを使って配信状況を取得
    let res: Response;
    try {
      res = await fetch(
        `https://api.twitch.tv/helix/streams?user_id=${userId}`,
        {
          headers: {
            "Client-ID": clientId,
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("[twitch/status] Error fetching from Twitch API:", error);
      // エラー時は非配信として返す（フォールバック）
      return NextResponse.json(
        {
          isLive: false,
          title: undefined,
          startedAt: undefined,
        },
        { status: 200 }
      );
    }

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error(`[twitch/status] Twitch API error: ${res.status}`, errorText);
      // エラー時は非配信として返す（フォールバック）
      return NextResponse.json(
        {
          isLive: false,
          title: undefined,
          startedAt: undefined,
        },
        { status: 200 }
      );
    }

    let data: TwitchStreamResponse;
    try {
      data = (await res.json()) as TwitchStreamResponse;
    } catch (error) {
      console.error("[twitch/status] Error parsing Twitch API response:", error);
      // エラー時は非配信として返す（フォールバック）
      return NextResponse.json(
        {
          isLive: false,
          title: undefined,
          startedAt: undefined,
        },
        { status: 200 }
      );
    }

    const stream = data.data?.[0];

    // 配信中の場合はtypeが"live"
    if (stream && stream.type === "live") {
      return NextResponse.json({
        isLive: true,
        title: stream.title,
        startedAt: stream.started_at,
      });
    }

    // 配信していない場合
    return NextResponse.json({
      isLive: false,
      title: undefined,
      startedAt: undefined,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch stream status";
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("[twitch/status] Unexpected error:", message, stack);
    // エラー時は非配信として返す（フォールバック）
    return NextResponse.json(
      {
        isLive: false,
        title: undefined,
        startedAt: undefined,
      },
      { status: 200 }
    );
  }
}

