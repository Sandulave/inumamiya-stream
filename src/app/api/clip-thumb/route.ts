import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clipUrl = searchParams.get("url");

  if (!clipUrl) {
    return NextResponse.json(
      { error: "url parameter is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(clipUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await res.text();

    const match = html.match(
      /<meta property="og:image" content="([^"]+)"/
    );

    if (!match) {
      return NextResponse.json(
        { error: "thumbnail not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      thumbnail: match[1],
    });
  } catch (e) {
    return NextResponse.json(
      { error: "failed to fetch clip" },
      { status: 500 }
    );
  }
}
