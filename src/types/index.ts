// src/types/index.ts
export type ClipItem = {
  title: string;
  href: string;
  thumbnail?: string;
};

export type Video = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  createdAt: string;
  viewCount: number;
};

export type Clip = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  viewCount: number;
  createdAt: string;
};

export type CTA = {
  label: string;
  href: string;
};

export type PillTone = "red" | "amber" | "blue";

export type TwitchTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type TwitchVideoResponse = {
  data: Array<{
    id: string;
    title: string;
    url: string;
    thumbnail_url: string;
    created_at: string;
    view_count: number;
  }>;
};

export type TwitchClipResponse = {
  data: Array<{
    id: string;
    title: string;
    url: string;
    thumbnail_url: string;
    view_count: number;
    created_at: string;
  }>;
};

export type TwitchOEmbedResponse = {
  thumbnail_url?: string;
};

