// src/content/config.ts
export const config = {
  access: {
    mode: "public" as "password" | "public", // 竊・"public" 縺ｫ縺吶ｋ縺ｨ隱ｰ縺ｧ繧りｦ九ｌ繧・
    remember: true, // true: 縺薙・PC縺ｧ縺ｯ谺｡蝗樔ｻ･髯阪ヱ繧ｹ逵∫払・・ocalStorage・・
    rememberKey: "inumamiya_stream_access_v1",
  },

  site: {
    title: "INUMAMIYA | STREAM NEWSROOM",
    description: "ニュースルーム風プロフィールサイト",
  },

  hero: {
    liveTag: "ON AIR",
    breakingTag: "BREAKING NEWS",
    name: "いぬまみや",
    subtitle: "ネットや配信の話題を、ゆるくまとめるプロフィールページ。",
    logoUrl: "/logo.png", // QR繧ｳ繝ｼ繝我ｸｭ螟ｮ縺ｫ陦ｨ遉ｺ縺吶ｋ繝ｭ繧ｴ逕ｻ蜒上・繝代せ・・ublic繝輔か繝ｫ繝蜀・・繝代せ・・
    profileMarqueeImages: ["/profile/inu_kao1.png", "/profile/inu_kao2.png", "/profile/inu_kao3.jpeg", "/profile/inu_kao4.jpg"], // 繝励Ο繝輔ぅ繝ｼ繝ｫ逕ｻ蜒上・繝ｼ繧ｭ繝ｼ縺ｫ陦ｨ遉ｺ縺吶ｋ霑ｽ蜉逕ｻ蜒酋RL・・tring[]・・
    profileMarqueeScrollSpeed: 1, // 繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ騾溷ｺｦ・・x/frame・・
    ctas: [
      { label: "Twitch", href: "https://www.twitch.tv/inumamiya" },
      { label: "X", href: "https://x.com/inu_no_gohan" },
      { label: "WISH LIST", href: "https://www.amazon.co.jp/hz/wishlist/ls/2ZT0QCKYJFK2B?ref_=wl_share" },
      { label: "アップローダー", href: "https://ux.getuploader.com/NewInumamiya/" },
    ],
    qrCodes: [
      { label: "Discord", href: "https://discord.gg/CcRNgETs7W", qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://discord.gg/CcRNgETs7W")}`, logoUrl: "/logo_Discord.png" },
      { label: "YouTube", href: "https://www.youtube.com/channel/UC3K67dwtrnZFI_dVn5LYWGA", qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://www.youtube.com/channel/UC3K67dwtrnZFI_dVn5LYWGA")}`, logoUrl: "/logo_inu_youtube.png" },
      { label: "どもども動画", href: "https://www.youtube.com/channel/UCeaXl91nkdPp6isMzI548vg", qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://www.youtube.com/channel/UCeaXl91nkdPp6isMzI548vg")}`, logoUrl: "/logo_domodomo_douga.png" },
      { label: "LINE OPENCHAT", href: "https://line.me/ti/g2/nbHvs4pt-v_8nhwuRxD_o0CEAM1L1HiFBfpzqA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default", qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://line.me/ti/g2/nbHvs4pt-v_8nhwuRxD_o0CEAM1L1HiFBfpzqA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default")}`, logoUrl: "/logo_line.png" },
    ],
  },

  ticker: {
    enabled: true,
    speedSeconds: 7, // 蟆上＆縺・⊇縺ｩ騾溘＞
    items: [
      "NOW STREAMING: ゲーム / 雑談 / ネットの話題",
      "TOPICS: 今日のトレンド / コメント紹介 / ふりーとーく",
      "NOTICE: このページは非公式のファンサイトです",
    ],
  },

  twitch: {
    enabled: true,
    isLive: false, // 繝・せ繝育畑: true縺ｫ縺吶ｋ縺ｨ蠑ｷ蛻ｶ逧・↓ON AIR繧定｡ｨ遉ｺ・・PI蜿門ｾ怜､繧医ｊ繧ょ━蜈茨ｼ・
    url: "https://www.twitch.tv/inumamiya",
  },

  sections: {
    highlights: { enabled: true, title: "ARCHIVE" },
    clips: { enabled: true, title: "RECOMMENDED CLIPS" },
    games: { enabled: true, title: "INUMAMIYA GAMES" },
    style: { enabled: true, title: "PC SPEC" },
    message: { enabled: false, title: "MESSAGE" },
  },

  games: [
    {
      title: "黄色い犬くん走り幅跳び",
      subtitle: "ランキング対応！",
      href: "https://inumamiya.github.io/inu_no_takatobi/",
      thumbnail:
        "https://cdn.discordapp.com/attachments/1248325742983643166/1469580233349927069/2026-02-07_143838.png?ex=69a3dc3f&is=69a28abf&hm=b379547f5efee4c05b2eaa37c46cf0cf1cbef31f9faf33c536efa2e9166ee100&",
    },
    {
      title: "虹色いぬくんゲーム",
      subtitle: "",
      href: "https://inumamiya.github.io/inu-sui/",
      thumbnail:
        "https://media.discordapp.net/attachments/1248325742983643166/1469580447678992506/2026-02-07_130008.png?ex=69a3dc72&is=69a28af2&hm=447f1385ce2e9854f8852878d4dfcd82697a4c9384ca793aa3d9061221e61c72&=&format=webp&quality=lossless&width=971&height=908",
    },
    {
      title: "チェッカーシューティング 体験版",
      subtitle: "君はクリアできるか！？",
      href: "https://inumamiya.github.io/CHECKER_SHOOTING/",
      thumbnail:
        "https://cdn.discordapp.com/attachments/1248325742983643166/1469692287155175507/2026-02-07_224826.png?ex=69a4449a&is=69a2f31a&hm=b684b6bca02fdf7f022edcc6ace8078d657bb39ed42a7dcfe96808d668534063&",
    },
  ],

  // 譁・ｫ縺ｯ蠕後〒蟾ｮ縺玲崛縺・K・井ｻ翫・莉ｮ縺ｧ鄂ｮ縺・※縺ｾ縺呻ｼ・
  // highlights: [
  //   { title: "譎ゆｺ九・繝阪ャ繝医・隧ｱ鬘・, body: "繝医Ξ繝ｳ繝峨ｒ諡ｾ縺｣縺ｦ縲∝・縺九ｊ繧・☆縺城尅隲・∈關ｽ縺ｨ縺苓ｾｼ縺ｿ縺ｾ縺吶・ },
  //   { title: "繧ｳ繝｡繝ｳ繝医・貂ｩ蠎ｦ諢・, body: "繝√Ε繝・ヨ縺ｮ豬√ｌ縺ｫ蜷医ｏ縺帙※縲∝ｴ縺ｮ遨ｺ豌励′閾ｪ辟ｶ縺ｫ閧ｲ縺｡縺ｾ縺吶・ },
  //   { title: "邱ｩ諤･縺ｮ縺ゅｋ驟堺ｿ｡", body: "髮題ｫ・ｸｭ蠢・∵凾縲・ご繝ｼ繝繧・酔譎りｦ冶・縺ｪ縺ｩ縺ｧ繝ｪ繧ｺ繝繧剃ｽ懊ｊ縺ｾ縺吶・ },
  // ],

// clips: [
//   {
//     title: "繧ｯ繝ｪ繝・・1・亥ｾ後〒蟾ｮ縺玲崛縺茨ｼ・,
//     href: "https://www.twitch.tv/inumamiya/clip/IntelligentSolidFishBuddhaBar-RxjIfnJqJJWLs00w",
//     thumbnail: "https://clips-media-assets2.twitch.tv/IntelligentSolidFishBuddhaBar-RxjIfnJqJJWLs00w-preview-480x272.jpg",
//   },
//   {
//     title: "繧ｯ繝ｪ繝・・2・亥ｾ後〒蟾ｮ縺玲崛縺茨ｼ・,
//     href: "https://www.twitch.tv/inumamiya/clip/DirtyBoldBasenjiPJSalt-kRRBaf76JyjaM6tN",
//     thumbnail: "https://clips-media-assets2.twitch.tv/DirtyBoldBasenjiPJSalt-kRRBaf76JyjaM6tN-preview-480x272.jpg",
//   },
//   {
//     title: "繧ｯ繝ｪ繝・・3・亥ｾ後〒蟾ｮ縺玲崛縺茨ｼ・,
//     href: "https://www.twitch.tv/inumamiya/clip/CoweringMistyLionLeeroyJenkins-_BD57Lrdkex02cop",
//     thumbnail: "https://clips-media-assets2.twitch.tv/CoweringMistyLionLeeroyJenkins-_BD57Lrdkex02cop-preview-480x272.jpg",
//   },
// ],


  styleCards: [
    {
      title: "OS",
      items: [
        "Windows 11 Home 64bit",
        "Microsoftアカウント設定済み",
        "Officeなし",
      ],
    },
    {
      title: "CPU",
      items: [
        "AMD Ryzen 7 9700X",
        "8コア / 16スレッド",
        "3.8GHzベース / 5.5GHzブースト",
      ],
    },
    {
      title: "CPUクーラー",
      items: [
        "ID-COOLING 空冷クーラー",
        "120mm PWMファン",
        "型番: FROZN-A410",
      ],
    },
    {
      title: "GPU",
      items: [
        "NVIDIA GeForce RTX 5070 Ti",
        "16GB VRAM",
        "出力: HDMI / DisplayPort",
      ],
    },
    {
      title: "マザーボード",
      items: [
        "ASUS TUF GAMING B650-PLUS WIFI",
        "2.5GBASE-T LAN",
        "Wi-Fi 6 / Bluetooth 5.2",
      ],
    },
    {
      title: "メモリ",
      items: [
        "DDR5-5600 16GB",
        "Model: MTC8C1084S1UC56BD1",
        "シングル構成",
      ],
    },
    {
      title: "ストレージ",
      items: [
        "WD Black SN7100 1TB",
        "読込 最大 7250MB/s",
        "書込 最大 6900MB/s",
      ],
    },
    {
      title: "電源・ケース",
      items: [
        "750W 80PLUS GOLD 電源",
        "ATX 3.1対応",
        "G-GEARプレミアムミドルタワー",
      ],
    },
    {
      title: "備考",
      items: [
        "GPUサポートホルダー同梱",
        "Officeなし",
        "追加サービスなし",
      ],
    },
  ],


  message: {
    body:
      "ここまで見てくれてありがとうございます。\nのんびり更新していくので、気が向いたときにまた見に来てください。",
    signature: "from いぬまみや",
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
      delay: 3500, // 襍ｷ蜍墓ｼ泌・螳御ｺ・∪縺ｧ縺ｮ譎る俣・・s・・
    },
    profileImage: {
      startDelay: 1500, // QR繧ｳ繝ｼ繝牙ｮ御ｺ・ｾ後・髢句ｧ矩≦蟒ｶ・・s縲＿R繧ｳ繝ｼ繝画怙蠕後・繧ｫ繝ｼ繝牙ｮ御ｺ・ｾ鯉ｼ・
      duration: 3000, // 繧｢繝九Γ繝ｼ繧ｷ繝ｧ繝ｳ縺ｮ謖∫ｶ壽凾髢難ｼ・s縲√ｆ縺｣縺上ｊ陦ｨ遉ｺ・・
    },
    qrCodes: {
      startDelay: 350, // BOOT_DELAY蠕後・髢句ｧ矩≦蟒ｶ・・s・・
      cardStagger: 80, // 繧ｫ繝ｼ繝蛾俣縺ｮ驕・ｻｶ・・s・・
    },
    games: {
      cardStagger: 100,
    },
    archive: {
      startDelay: 4000, // 繝壹・繧ｸ繝ｭ繝ｼ繝峨°繧峨・髢句ｧ矩≦蟒ｶ・・s・・
      cardStagger: 100, // 繧ｫ繝ｼ繝蛾俣縺ｮ驕・ｻｶ・・s・・
    },
    clips: {
      startDelay: 4400, // 繝壹・繧ｸ繝ｭ繝ｼ繝峨°繧峨・髢句ｧ矩≦蟒ｶ・・s・・
      cardStagger: 100, // 繧ｫ繝ｼ繝蛾俣縺ｮ驕・ｻｶ・・s・・
    },
  },
} as const;
