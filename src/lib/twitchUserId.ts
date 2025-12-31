// src/lib/twitchUserId.ts
import { getAppAccessToken } from "./twitchAuth";

type TwitchUserResponse = {
  data: Array<{
    id: string;
    login: string;
    display_name: string;
  }>;
};

/**
 * ユーザー名またはユーザーIDから数値のユーザーIDを取得する
 * @param userIdOrLogin ユーザーID（数値）またはユーザー名（文字列）
 * @returns 数値のユーザーID、またはnull（エラー時）
 */
export async function getTwitchUserId(
  userIdOrLogin: string
): Promise<string | null> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  if (!clientId) {
    console.error("[twitchUserId] TWITCH_CLIENT_ID is not set");
    return null;
  }

  // 数値のみの場合はそのまま返す
  if (/^\d+$/.test(userIdOrLogin)) {
    return userIdOrLogin;
  }

  // ユーザー名の場合は、Twitch APIからユーザーIDを取得
  try {
    const token = await getAppAccessToken();
    const res = await fetch(
      `https://api.twitch.tv/helix/users?login=${encodeURIComponent(userIdOrLogin)}`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error(
        `[twitchUserId] Failed to fetch user ID for ${userIdOrLogin}: ${res.status}`,
        errorText
      );
      return null;
    }

    const data = (await res.json()) as TwitchUserResponse;
    const user = data.data?.[0];

    if (!user) {
      console.error(`[twitchUserId] User not found: ${userIdOrLogin}`);
      return null;
    }

    return user.id;
  } catch (error) {
    console.error(`[twitchUserId] Error fetching user ID:`, error);
    return null;
  }
}

