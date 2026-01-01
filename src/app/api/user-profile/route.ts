// src/app/api/user-profile/route.ts
import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/twitchAuth";
import { getTwitchUserId } from "@/lib/twitchUserId";

type TwitchUserResponse = {
  data: Array<{
    id: string;
    login: string;
    display_name: string;
    profile_image_url: string;
  }>;
};

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

    // ユーザー情報を取得
    const res = await fetch(
      `https://api.twitch.tv/helix/users?id=${userId}`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error(`[user-profile] Twitch API error: ${res.status}`, errorText);
      return NextResponse.json(
        { error: `Twitch API error: ${res.status}`, detail: errorText },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    const data = (await res.json()) as TwitchUserResponse;
    const user = data.data?.[0];

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile_image_url: user.profile_image_url,
      display_name: user.display_name,
      login: user.login,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user profile";
    console.error("[user-profile] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

