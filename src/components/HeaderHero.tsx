// src/components/HeaderHero.tsx
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { config } from "@/content/config";
import { Pill } from "./Pill";
import type { CTA } from "@/types";

type TwitchStatus = {
  isLive: boolean;
  title?: string;
  startedAt?: string;
};

export function HeaderHero() {
  const ctas: readonly CTA[] = config.hero.ctas;
  const shouldReduceMotion = useReducedMotion();

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [twitchStatus, setTwitchStatus] = useState<TwitchStatus>({
    isLive: false,
    title: undefined,
    startedAt: undefined,
  });

  // ✅ 毎回の起動演出・遅延（リロード含む）
  const [canAnimate, setCanAnimate] = useState(false);
  const [showConnecting, setShowConnecting] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  // アニメーションタイミングをconfigから取得
  const BOOT_DELAY_MS = config.animation.boot.delay;
  const CONNECTING_MS = 300;  // CONNECTING表示
  const HIGHLIGHT_ON_MS = 50; // アニメ解禁後、光を出すまで
  const HIGHLIGHT_MS = 380;   // 光の表示時間

  // 起動→遅延→表示→ハイライト（毎回）
  useEffect(() => {
    if (shouldReduceMotion) {
      setCanAnimate(true);
      return;
    }

    setCanAnimate(false);
    setShowConnecting(true);
    setShowHighlight(false);

    const t1 = setTimeout(() => setShowConnecting(false), CONNECTING_MS);

    const t2 = setTimeout(() => {
      setCanAnimate(true);

      const t3 = setTimeout(() => {
        setShowHighlight(true);

        const t4 = setTimeout(() => setShowHighlight(false), HIGHLIGHT_MS);
        return () => clearTimeout(t4);
      }, HIGHLIGHT_ON_MS);

      return () => clearTimeout(t3);
    }, BOOT_DELAY_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shouldReduceMotion]);

  // Twitch配信状況を取得（初回 + 60秒ごと）
  useEffect(() => {
    let canceled = false;

    const fetchTwitchStatus = async () => {
      try {
        const res = await fetch("/api/twitch/status");
        if (!res.ok) {
          console.error("[HeaderHero] Twitch status API error:", res.status, res.statusText);
          if (!canceled) setTwitchStatus({ isLive: false, title: undefined, startedAt: undefined });
          return;
        }
        const data = (await res.json()) as TwitchStatus;
        if (!canceled) setTwitchStatus(data);
      } catch (error) {
        console.error("[HeaderHero] Error fetching Twitch status:", error);
        if (!canceled) setTwitchStatus({ isLive: false, title: undefined, startedAt: undefined });
      }
    };

    // 初回取得（CONNECTINGの直後に）
    const initial = setTimeout(() => fetchTwitchStatus(), CONNECTING_MS);

    const interval = setInterval(() => {
      if (!canceled) fetchTwitchStatus();
    }, 60000);

    return () => {
      canceled = true;
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  // プロフィール画像を取得
  useEffect(() => {
    let canceled = false;

    const fetchProfileImage = async () => {
      try {
        const res = await fetch("/api/user-profile");
        if (!res.ok) return;
        const data = await res.json();
        if (!canceled && data.profile_image_url) {
          const imageUrl = data.profile_image_url.startsWith("http")
            ? `/api/img?url=${encodeURIComponent(data.profile_image_url)}`
            : data.profile_image_url;
          setProfileImageUrl(imageUrl);
        }
      } catch {}
    };

    fetchProfileImage();
    return () => {
      canceled = true;
    };
  }, []);

  // プロフィール画像マーキー用の状態
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const scrollSpeedRef = useRef(config.hero.profileMarqueeScrollSpeed);

  // 画像配列の準備（profileImageUrl + config.hero.profileMarqueeImages）
  const allImages = useMemo(() => {
    const images: string[] = [];
    if (profileImageUrl) {
      images.push(profileImageUrl);
    }
    if (config.hero.profileMarqueeImages) {
      images.push(...config.hero.profileMarqueeImages);
    }
    return images.length > 0 ? images : [];
  }, [profileImageUrl]);

  // 2周分の画像配列を作成
  const doubledImages = useMemo(() => {
    if (allImages.length === 0) return [];
    return [...allImages, ...allImages];
  }, [allImages]);

  // 自動スクロール処理
  useEffect(() => {
    if (shouldReduceMotion || !isHovered || isDragging || allImages.length === 0) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const scroll = () => {
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth / 2; // 1周分の幅

      if (currentScroll >= maxScroll) {
        // 1周分スクロールしたら先頭に戻す（シームレスに）
        container.scrollLeft = currentScroll - maxScroll;
      } else {
        container.scrollLeft += scrollSpeedRef.current;
      }

      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    animationFrameRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [shouldReduceMotion, isHovered, isDragging, allImages.length]);

  // ドラッグ開始
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || allImages.length === 0) return;
    setIsDragging(true);
    const container = scrollContainerRef.current;
    if (!container) return;
    dragStartXRef.current = e.clientX;
    dragStartScrollLeftRef.current = container.scrollLeft;
    container.style.cursor = "grabbing";
    e.preventDefault();
  }, [shouldReduceMotion, allImages.length]);

  // ドラッグ中
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || shouldReduceMotion || allImages.length === 0) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const deltaX = dragStartXRef.current - e.clientX;
    container.scrollLeft = dragStartScrollLeftRef.current + deltaX;
  }, [isDragging, shouldReduceMotion, allImages.length]);

  // ドラッグ終了
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
    }
  }, [isDragging]);

  // マウスリーブ時にドラッグ状態もリセット
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (isDragging) {
      setIsDragging(false);
      const container = scrollContainerRef.current;
      if (container) {
        container.style.cursor = "grab";
      }
    }
  }, [isDragging]);

  // 既存仕様：configで強制ON/OFFできる
  const isLive = Boolean(config.twitch.isLive || twitchStatus.isLive);
  const liveTitle = twitchStatus.title;

  // アニメーションバリアント（静かなズーム着地入り）
  const heroVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
      scale: shouldReduceMotion ? 1 : 0.985,
      filter: shouldReduceMotion ? "none" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0 : 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const profileImageVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.9, // より小さく開始（ジワ～っと拡大）
      y: shouldReduceMotion ? 0 : 8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : config.animation.profileImage.duration / 1000,
        delay: shouldReduceMotion ? 0 : config.animation.profileImage.startDelay / 1000,
        ease: [0.25, 0.46, 0.45, 0.94] as const, // より滑らかなイージング（ジワ～っと）
      },
    },
  };

  const qrCardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : (config.animation.qrCodes.startDelay + i * config.animation.qrCodes.cardStagger) / 1000,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const LiveDot = () => (
    <motion.span
      className="relative w-2 h-2"
      animate={
        isLive
          ? { x: [0, -1, 1, -1, 1, 0], y: [0, 1, -1, 1, -1, 0] }
          : { x: 0, y: 0 }
      }
      transition={
        isLive
          ? { duration: 0.18, ease: "linear", repeat: Infinity, repeatDelay: 1.2 }
          : { duration: 0 }
      }
    >
      {/* ✅ ピン円（広がる円）復活：配信中だけ */}
      {isLive && (
        <span className="absolute inset-0 w-2 h-2 rounded-full bg-red-500/25 animate-ping" />
      )}

      {/* ぼんやり光る外側 */}
      <span className="absolute inset-0 w-2 h-2 rounded-full bg-red-500/35 blur-sm" />
      {/* 本体 */}
      <span className="relative w-2 h-2 rounded-full bg-red-500" />
    </motion.span>
  );

  const LiveBadgeInner = () => (
    <span className="relative flex items-center gap-2">
      <LiveDot />
      <span className="font-bold tracking-wide">{config.hero.liveTag}</span>
    </span>
  );

  const LiveBadge = () => {
    if (isLive) {
      return config.twitch.url ? (
        <a
          href={config.twitch.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Pill tone="red" isLive>
            <LiveBadgeInner />
          </Pill>
        </a>
      ) : (
        <Pill tone="red" isLive>
          <LiveBadgeInner />
        </Pill>
      );
    }

    // OFF AIR 側もリンク復活
    return config.twitch.url ? (
      <a
        href={config.twitch.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center hover:opacity-80 transition-opacity"
      >
        <Pill tone="red">
          <span className="text-white/30 text-xs font-semibold">OFF AIR</span>
        </Pill>
      </a>
    ) : (
      <Pill tone="red">
        <span className="text-white/30 text-xs font-semibold">OFF AIR</span>
      </Pill>
    );
  };

  return (
    <motion.section
      initial="hidden"
      animate={canAnimate ? "visible" : "hidden"}
      variants={heroVariants}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur"
    >
      {/* 本番用：中心から広がる白い光（遅延後に表示、毎回） */}
      {showHighlight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.22, 0] }}
          transition={{ duration: 0.42, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.40), transparent 60%)",
          }}
        />
      )}

      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_60%_20%,rgba(255,255,255,0.30),transparent_55%)]" />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {showConnecting ? (
              <Pill tone="blue">
                <span className="text-xs font-semibold">CONNECTING…</span>
              </Pill>
            ) : (
              config.twitch.enabled && <LiveBadge />
            )}

            {/* タイトル表示：配信中＋titleあり */}
            {isLive && liveTitle && (
              <span className="text-xs tracking-[0.35em] text-white/70 truncate max-w-[400px]">
                {liveTitle}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:items-start">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              {config.hero.name}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              {config.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-3">
              {ctas.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10 hover:text-white"
                >
                  {c.label}
                  <span className="ml-2 text-white/50 transition group-hover:text-white/80">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* プロフィール画像マーキー */}
          <motion.div
            initial="hidden"
            animate={canAnimate ? "visible" : "hidden"}
            variants={profileImageVariants}
            className="flex items-center justify-center md:justify-end min-h-[256px] w-[256px]"
          >
            {allImages.length > 0 ? (
              <div
                ref={scrollContainerRef}
                className="w-[256px] h-[256px] overflow-x-auto overflow-y-hidden rounded-xl scrollbar-hide"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                  cursor: shouldReduceMotion || allImages.length === 0 ? "default" : "grab",
                }}
              >
                <div
                  className="flex h-full"
                  style={{
                    width: `${doubledImages.length * 256}px`,
                  }}
                >
                  {doubledImages.map((imgUrl, index) => (
                    <img
                      key={`${imgUrl}-${index}`}
                      src={imgUrl}
                      alt={`Profile ${index + 1}`}
                      className="h-[256px] w-[256px] flex-shrink-0 object-cover"
                      draggable={false}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 w-64 rounded-xl bg-white/5" />
            )}
          </motion.div>
        </div>

        {/* QR */}
        {config.hero.qrCodes && config.hero.qrCodes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/10">
            {config.hero.qrCodes.map((qr, index) => (
              <motion.a
                key={qr.href}
                href={qr.href}
                target="_blank"
                rel="noreferrer"
                initial="hidden"
                animate={canAnimate ? "show" : "hidden"}
                variants={qrCardVariants}
                custom={index}
                className="group flex flex-col items-center rounded-2xl bg-white/5 border border-white/10 p-4 text-center transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                <span className="text-sm text-white/70 mb-3 group-hover:text-white/90 transition">
                  {qr.label}
                </span>
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <img src={qr.qrUrl} alt={`${qr.label} QR Code`} className="w-full h-full object-contain" />
                  {qr.logoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <img src={qr.logoUrl} alt="Logo" className="w-9 h-9 rounded-full border-3 border-white bg-white object-cover" />
                    </div>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
