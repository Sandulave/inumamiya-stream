import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { config } from "@/content/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://inumamiya-stream.vercel.app";
const ogImageVersion = process.env.NEXT_PUBLIC_OG_IMAGE_VERSION ?? "1";
const ogImagePath = `/ogp.png?v=${ogImageVersion}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: config.site.title,
  description: config.site.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: config.site.title,
    description: config.site.description,
    url: "/",
    type: "website",
    siteName: "INUMAMIYA STREAM",
    locale: "ja_JP",
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        alt: config.site.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.site.title,
    description: config.site.description,
    images: [
      {
        url: ogImagePath,
        alt: config.site.title,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-neutral-100 tracking-tight`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
