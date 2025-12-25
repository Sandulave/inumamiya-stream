// src/content/config.ts
export const config = {
  access: {
    mode: "password" as "password" | "public", // ← "public" にすると誰でも見れる
    password: "SHARED-PASS-1234", // ← 共通パス（あとから変更OK）
    remember: true, // true: このPCでは次回以降パス省略（localStorage）
    rememberKey: "inumamiya_stream_access_v1",
  },

  site: {
    title: "INUMAMIYA | STREAM NEWSROOM",
    description: "A newsroom-style profile site.",
  },

  hero: {
    liveTag: "LIVE",
    breakingTag: "BREAKING NEWS",
    name: "いぬまみや",
    subtitle: "ネットの話題を、落ち着いた雑談の温度で。",
    ctas: [
      { label: "Twitch", href: "https://www.twitch.tv/inumamiya" },
      // { label: "X", href: "https://x.com/xxxxx" },
    ],
  },

  ticker: {
    enabled: true,
    speedSeconds: 22, // 小さいほど速い
    items: [
      "NOW STREAMING: 雑談 / 時事 / ネットの話題",
      "TOPICS: 今日のトレンド / コメント拾い / ときどきゲーム",
      "NOTICE: 本ページは紹介用の非公式サイトです",
    ],
  },

  sections: {
    highlights: { enabled: true, title: "HIGHLIGHTS" },
    clips: { enabled: true, title: "RECOMMENDED CLIPS" },
    style: { enabled: true, title: "STREAM FORMAT" },
    message: { enabled: true, title: "MESSAGE" },
  },

  // 文章は後で差し替えOK（今は仮で置いてます）
  highlights: [
    { title: "時事・ネットの話題", body: "トレンドを拾って、分かりやすく雑談へ落とし込みます。" },
    { title: "コメントの温度感", body: "チャットの流れに合わせて、場の空気が自然に育ちます。" },
    { title: "緩急のある配信", body: "雑談中心、時々ゲームや同時視聴などでリズムを作ります。" },
  ],

clips: [
  {
    title: "クリップ1（後で差し替え）",
    href: "https://www.twitch.tv/inumamiya/clip/IntelligentSolidFishBuddhaBar-RxjIfnJqJJWLs00w",
    thumbnail: "https://clips-media-assets2.twitch.tv/IntelligentSolidFishBuddhaBar-RxjIfnJqJJWLs00w-preview-480x272.jpg",
  },
  {
    title: "クリップ2（後で差し替え）",
    href: "https://www.twitch.tv/inumamiya/clip/DirtyBoldBasenjiPJSalt-kRRBaf76JyjaM6tN",
    thumbnail: "https://clips-media-assets2.twitch.tv/DirtyBoldBasenjiPJSalt-kRRBaf76JyjaM6tN-preview-480x272.jpg",
  },
  {
    title: "クリップ3（後で差し替え）",
    href: "https://www.twitch.tv/inumamiya/clip/CoweringMistyLionLeeroyJenkins-_BD57Lrdkex02cop",
    thumbnail: "https://clips-media-assets2.twitch.tv/CoweringMistyLionLeeroyJenkins-_BD57Lrdkex02cop-preview-480x272.jpg",
  },
],


  styleCards: [
    { title: "雑談", items: ["ネットニュース", "エンタメ", "生活の小ネタ"] },
    { title: "ゲーム", items: ["その日の気分で", "ゆるくプレイ", "話題と一緒に"] },
    { title: "同時視聴", items: ["イベント", "大会", "話題コンテンツ"] },
  ],

  message: {
    body:
      "（ここに、いちごぱんさんの文章を後から入れられます）\n\nいつも楽しい時間をありがとうございます。これからも応援しています。",
    signature: "from いちごぱん",
  },

  theme: {
    scanlines: true,
    grid: true,
  },
} as const;
