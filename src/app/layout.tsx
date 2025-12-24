import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INUMAMIYA | STREAM NEWSROOM",
  description: "配信者・いぬまみやさんの活動を紹介する非公式ページ",
  openGraph: {
    title: "INUMAMIYA | STREAM NEWSROOM",
    description: "落ち着いた雑談と時事ネタ配信",
    url: "https://inumamiya-stream.vercel.app/",
    siteName: "INUMAMIYA STREAM",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "いぬまみや",
    description: "超おもろ配信",
    images: ["/ogp.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-neutral-100 tracking-tight`}>
        {children}
      </body>
    </html>
  );
}
