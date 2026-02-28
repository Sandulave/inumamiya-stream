import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACCESS_COOKIE_NAME = "inumamiya_access_token";
const ACCESS_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 30;
const ACCESS_PAYLOAD = "access-granted-v1";

function getAccessPassword(): string | null {
  return process.env.ACCESS_PASSWORD ?? null;
}

function getCookieSecret(): string | null {
  return process.env.ACCESS_COOKIE_SECRET ?? process.env.ACCESS_PASSWORD ?? null;
}

function createAccessToken(secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(ACCESS_PAYLOAD)
    .digest("base64url");
}

async function hasValidAccessCookie(): Promise<boolean> {
  const secret = getCookieSecret();
  if (!secret) return false;

  const jar = await cookies();
  const token = jar.get(ACCESS_COOKIE_NAME)?.value;
  if (!token) return false;

  return token === createAccessToken(secret);
}

export async function GET() {
  return NextResponse.json({ unlocked: await hasValidAccessCookie() });
}

type UnlockBody = {
  password?: string;
  remember?: boolean;
};

export async function POST(req: Request) {
  const password = getAccessPassword();
  if (!password) {
    return NextResponse.json(
      { error: "ACCESS_PASSWORD must be set" },
      { status: 500 }
    );
  }

  const secret = getCookieSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "ACCESS_COOKIE_SECRET or ACCESS_PASSWORD must be set" },
      { status: 500 }
    );
  }

  let body: UnlockBody = {};
  try {
    body = (await req.json()) as UnlockBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.password !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ unlocked: true });
  const remember = body.remember !== false;

  res.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: createAccessToken(secret),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(remember ? { maxAge: ACCESS_COOKIE_TTL_SECONDS } : {}),
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ unlocked: false });
  res.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
