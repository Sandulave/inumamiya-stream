import type { NextConfig } from "next";

images: {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  domains: [
    'static-cdn.jtvnw.net',     // Video/clip thumbnails
    'clips-media-assets2.twitch.tv' // クリップ埋め込み用サムネ（念のため）
    // 既存のドメイン...
  ]
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

