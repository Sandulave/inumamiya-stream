// src/content/config.ts
export const config = {
  access: {
    mode: "password" as "password" | "public", // ← "public" にすると誰でも見れる
    // production では NEXT_PUBLIC_ACCESS_PASSWORD を使って上書きしてください（公開リポジトリへはシークレットをコミットしないこと）
    password: process.env.NEXT_PUBLIC_ACCESS_PASSWORD ?? "SHARED-PASS-1234",
    remember: true, // true: このPCでは次回以降パス省略（localStorage）
    rememberKey: "inumamiya_stream_access_v1",
  },

  site: {
    title: "INUMAMIYA | STREAM NEWSROOM",
    description: "A newsroom-style profile site.",
  },

  hero: {
    liveTag: "ON AIR",
    breakingTag: "BREAKING NEWS",
    name: "いぬまみや",
    subtitle: "ネットの話題を、落ち着いた雑談の温度で。",
    logoUrl: "/logo.png", // QRコード中央に表示するロゴ画像のパス（publicフォルダ内のパス）
    ctas: [
      { label: "Twitch", href: "https://www.twitch.tv/inumamiya" },
      { label: "X", href: "https://x.com/inu_no_gohan" },
      { label: "WISH LIST", href: "https://www.amazon.co.jp/hz/wishlist/ls/2ZT0QCKYJFK2B?ref_=wl_share" },
      { label: "うｐろだ", href: "https://ux.getuploader.com/NewInumamiya/" },
    ],
    qrCodes: [
      { label: "Discord", href: "https://discord.gg/7mqgDxey", qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://discord.gg/7mqgDxey")}`, logoUrl: "/logo_Discord.png" },
      { label: "YouTube", href: "https://www.youtube.com/channel/UC3K67dwtrnZFI_dVn5LYWGA", qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://www.youtube.com/channel/UC3K67dwtrnZFI_dVn5LYWGA")}`, logoUrl: "/logo_inu_youtube.png" },
      { label: "どもども動画部", href: "https://www.youtube.com/channel/UCeaXl91nkdPp6isMzI548vg", qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://www.youtube.com/channel/UCeaXl91nkdPp6isMzI548vg")}`, logoUrl: "/logo_domodomo_douga.png" },
      { label: "LINE OPENCHAT", href: "https://line.me/ti/g2/nbHvs4pt-v_8nhwuRxD_o0CEAM1L1HiFBfpzqA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default", qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://line.me/ti/g2/nbHvs4pt-v_8nhwuRxD_o0CEAM1L1HiFBfpzqA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default")}`, logoUrl: "/logo_line.png" },
    ],
  },

  ticker: {
    enabled: true,
    speedSeconds: 7, // 小さいほど速い
    items: [
      "NOW STREAMING: 雑談 / 時事 / ネットの話題",
      "TOPICS: 今日のトレンド / コメント拾い / ときどきゲーム",
      "NOTICE: 本ページは紹介用の非公式サイトです",
    ],
  },

  twitch: {
    enabled: true,
    isLive: true, // テスト用: trueにすると強制的にON AIRを表示（API取得値よりも優先）
    url: "https://www.twitch.tv/inumamiya",
  },

  sections: {
    highlights: { enabled: true, title: "ARCHIVE" },
    clips: { enabled: true, title: "RECOMMENDED CLIPS" },
    style: { enabled: true, title: "STREAM FORMAT" },
    message: { enabled: true, title: "MESSAGE" },
  },

  // 文章は後で差し替えOK（今は仮で置いてます）
  // highlights: [
  //   { title: "時事・ネットの話題", body: "トレンドを拾って、分かりやすく雑談へ落とし込みます。" },
  //   { title: "コメントの温度感", body: "チャットの流れに合わせて、場の空気が自然に育ちます。" },
  //   { title: "緩急のある配信", body: "雑談中心、時々ゲームや同時視聴などでリズムを作ります。" },
  // ],

// clips: [
//   {
//     title: "クリップ1（後で差し替え）",
//     href: "https://www.twitch.tv/inumamiya/clip/IntelligentSolidFishBuddhaBar-RxjIfnJqJJWLs00w",
//     thumbnail: "https://clips-media-assets2.twitch.tv/IntelligentSolidFishBuddhaBar-RxjIfnJqJJWLs00w-preview-480x272.jpg",
//   },
//   {
//     title: "クリップ2（後で差し替え）",
//     href: "https://www.twitch.tv/inumamiya/clip/DirtyBoldBasenjiPJSalt-kRRBaf76JyjaM6tN",
//     thumbnail: "https://clips-media-assets2.twitch.tv/DirtyBoldBasenjiPJSalt-kRRBaf76JyjaM6tN-preview-480x272.jpg",
//   },
//   {
//     title: "クリップ3（後で差し替え）",
//     href: "https://www.twitch.tv/inumamiya/clip/CoweringMistyLionLeeroyJenkins-_BD57Lrdkex02cop",
//     thumbnail: "https://clips-media-assets2.twitch.tv/CoweringMistyLionLeeroyJenkins-_BD57Lrdkex02cop-preview-480x272.jpg",
//   },
// ],


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

  birthday: {
    month: 1, // 1-12
    day: 1,   // 1-31
  },

  animation: {
    boot: {
      delay: 3500, // 起動演出完了までの時間（ms）
    },
    profileImage: {
      startDelay: 1500, // QRコード完了後の開始遅延（ms、QRコード最後のカード完了後）
      duration: 3000, // アニメーションの持続時間（ms、ゆっくり表示）
    },
    qrCodes: {
      startDelay: 350, // BOOT_DELAY後の開始遅延（ms）
      cardStagger: 80, // カード間の遅延（ms）
    },
    archive: {
      startDelay: 4000, // ページロードからの開始遅延（ms）
      cardStagger: 100, // カード間の遅延（ms）
    },
    clips: {
      startDelay: 4400, // ページロードからの開始遅延（ms）
      cardStagger: 100, // カード間の遅延（ms）
    },
  },
} as const;
