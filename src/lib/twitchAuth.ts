// src/lib/twitchAuth.ts
import type { TwitchTokenResponse } from "@/types";

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

export async function getAppAccessToken(): Promise<string> {
  // キャッシュされたトークンが有効な場合（1分以上の余裕がある場合）はそれを返す
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set in environment variables"
    );
  }

  try {
    const res = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: "POST" }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      throw new Error(
        `Failed to get Twitch access token: ${res.status} ${errorText}`
      );
    }

    const data = (await res.json()) as TwitchTokenResponse;

    if (!data.access_token || !data.expires_in) {
      throw new Error("Invalid token response from Twitch API");
    }

    cachedToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    return data.access_token;
  } catch (error) {
    // キャッシュをクリアして再試行を促す
    cachedToken = null;
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get Twitch access token");
  }
}
