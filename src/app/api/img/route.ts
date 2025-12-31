// src/app/api/img/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) return NextResponse.json({ error: "missing url" }, { status: 400 });

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  // SSRF対策：許可するホストを絞る（必要なら増やす）
  const allowedHosts = new Set([
    "static-cdn.jtvnw.net",
    "clips.twitch.tv",
    "www.twitch.tv",
  ]);

  if (!allowedHosts.has(target.hostname)) {
    return NextResponse.json({ error: "host not allowed" }, { status: 403 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        // たまにRefererで渋いところがあるので一応
        Referer: "https://clips.twitch.tv/",
      },
      // 画像はキャッシュしたい（必要に応じて調整）
      cache: "force-cache",
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        { error: `upstream ${upstream.status}`, detail: text.slice(0, 200) },
        { status: 502 }
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    const bytes = await upstream.arrayBuffer();

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "fetch failed", detail: message },
      { status: 500 }
    );
  }
}
