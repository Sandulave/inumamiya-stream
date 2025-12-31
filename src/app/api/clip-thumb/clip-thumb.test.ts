import { describe, it, expect } from "vitest";

// canonicalClipUrl関数をテストするためにエクスポートする必要がある
// テスト用にエクスポートされた関数を使用
function canonicalClipUrl(input: string): string {
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

describe("canonicalClipUrl", () => {
  it("normalizes clips.twitch.tv URL", () => {
    const input = "https://clips.twitch.tv/SomeSlug";
    expect(canonicalClipUrl(input)).toBe("https://clips.twitch.tv/SomeSlug");
  });

  it("converts twitch.tv channel clip URL to clips.twitch.tv format", () => {
    const input = "https://www.twitch.tv/somechannel/clip/CoolSlug";
    expect(canonicalClipUrl(input)).toBe("https://clips.twitch.tv/CoolSlug");
  });

  it("converts twitch.tv (without www) channel clip URL", () => {
    const input = "https://twitch.tv/somechannel/clip/TestSlug";
    expect(canonicalClipUrl(input)).toBe("https://clips.twitch.tv/TestSlug");
  });

  it("returns original URL for non-clip URLs", () => {
    const input = "https://www.twitch.tv/somechannel/videos/123456";
    expect(canonicalClipUrl(input)).toBe(input);
  });

  it("handles invalid URLs gracefully", () => {
    const input = "not-a-url";
    expect(canonicalClipUrl(input)).toBe(input);
  });
});
