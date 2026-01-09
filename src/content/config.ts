// src/content/config.ts
export const config = {
  access: {
    mode: "public" as "password" | "public", // ← "public" にすると誰でも見れる
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
    profileMarqueeImages: ["/profile/inu_kao1.png", "/profile/inu_kao2.png", "/profile/inu_kao3.jpeg", "/profile/inu_kao4.jpg"], // プロフィール画像マーキーに表示する追加画像URL（string[]）
    profileMarqueeScrollSpeed: 1, // スクロール速度（px/frame）
    ctas: [
      { label: "Twitch", href: "https://www.twitch.tv/inumamiya" },
      { label: "X", href: "https://x.com/inu_no_gohan" },
      { label: "WISH LIST", href: "https://www.amazon.co.jp/hz/wishlist/ls/2ZT0QCKYJFK2B?ref_=wl_share" },
      { label: "うｐろだ", href: "https://ux.getuploader.com/NewInumamiya/" },
    ],
    qrCodes: [
      { label: "Discord", href: "https://discord.gg/CcRNgETs7W", qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://discord.gg/CcRNgETs7W")}`, logoUrl: "/logo_Discord.png" },
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
    isLive: false, // テスト用: trueにすると強制的にON AIRを表示（API取得値よりも優先）
    url: "https://www.twitch.tv/inumamiya",
  },

  sections: {
    highlights: { enabled: true, title: "ARCHIVE" },
    clips: { enabled: true, title: "RECOMMENDED CLIPS" },
    style: { enabled: true, title: "PC SPEC" },
    message: { enabled: false, title: "MESSAGE" },
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
  {
    title: "OS",
    items: [
      "Windows 11 Home 64bit（ディスク付属）",
      "セットアップにMicrosoftアカウントが必要",
      "Officeなし / セキュリティソフトなし（標準機能）",
    ],
  },
  {
    title: "CPU",
    items: [
      "AMD Ryzen 7 9700X",
      "8コア / 16スレッド",
      "定格 3.8GHz / Boost 最大 5.5GHz",
    ],
  },
  {
    title: "CPUクーラー",
    items: [
      "ID-COOLING ヒートパイプ式",
      "120mm PWM Fan（静音FAN）",
      "型番: FROZN-A410",
    ],
  },
  {
    title: "GPU",
    items: [
      "NVIDIA GeForce RTX 5070 Ti",
      "16GB VRAM",
      "出力: HDMI ×1 / DisplayPort ×3（3スロット占有）",
    ],
  },
  {
    title: "マザーボード",
    items: [
      "ASUS TUF GAMING B650-PLUS WIFI（ATX）",
      "有線: 2.5GBASE-T",
      "無線: Wi-Fi 6 / Bluetooth 5.2",
    ],
  },
  {
    title: "メモリ",
    items: [
      "DDR5-5600 16GB",
      "型番: MTC8C1084S1UC56BD1",
      "※動作クロックは組み合わせにより異なる場合あり",
    ],
  },
  {
    title: "ストレージ",
    items: [
      "WD Black SN7100 1TB（M.2 Gen4 / NVMe）",
      "読込 最大 7250MB/s",
      "書込 最大 6900MB/s",
    ],
  },
  {
    title: "電源・ケース",
    items: [
      "電源: 750W 80PLUS GOLD（CWT製 GPW750SB）",
      "ATX3.1 準拠",
      "ケース: G-GEAR プレミアムミドルタワー（フロント12cmファン×1）",
    ],
  },
  {
    title: "その他",
    items: [
      "GPUサポートホルダー付属（66JDGPUFLD）",
      "Officeなし",
      "下取りサービスなし",
    ],
  },
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
    month: 3, // 1-12
    day: 26,   // 1-31
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
