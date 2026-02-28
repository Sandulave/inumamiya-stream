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

const BOOT_DELAY_MS = config.animation.boot.delay;
const CONNECTING_MS = 300;
const HIGHLIGHT_ON_MS = 50;
const HIGHLIGHT_MS = 380;

export function HeaderHero() {
  const ctas: readonly CTA[] = config.hero.ctas;
  const shouldReduceMotion = useReducedMotion();

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [twitchStatus, setTwitchStatus] = useState<TwitchStatus>({
    isLive: false,
    title: undefined,
    startedAt: undefined,
  });

  // 笨・豈主屓縺ｮ襍ｷ蜍墓ｼ泌・繝ｻ驕・ｻｶ・医Μ繝ｭ繝ｼ繝牙性繧・・
  const [bootAnimationReady, setBootAnimationReady] = useState(false);
  const [showConnecting, setShowConnecting] = useState(!shouldReduceMotion);
  const [showHighlight, setShowHighlight] = useState(false);
  const canAnimate = shouldReduceMotion || bootAnimationReady;

  // 繧｢繝九Γ繝ｼ繧ｷ繝ｧ繝ｳ繧ｿ繧､繝溘Φ繧ｰ繧団onfig縺九ｉ蜿門ｾ・

  // 襍ｷ蜍補・驕・ｻｶ竊定｡ｨ遉ｺ竊偵ワ繧､繝ｩ繧､繝茨ｼ域ｯ主屓・・
  useEffect(() => {
    if (shouldReduceMotion) return;

    const t1 = setTimeout(() => setShowConnecting(false), CONNECTING_MS);
    let t3: ReturnType<typeof setTimeout> | null = null;
    let t4: ReturnType<typeof setTimeout> | null = null;

    const t2 = setTimeout(() => {
      setBootAnimationReady(true);
      t3 = setTimeout(() => {
        setShowHighlight(true);
        t4 = setTimeout(() => setShowHighlight(false), HIGHLIGHT_MS);
      }, HIGHLIGHT_ON_MS);
    }, BOOT_DELAY_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (t3) clearTimeout(t3);
      if (t4) clearTimeout(t4);
    };
  }, [shouldReduceMotion]);

  // Twitch驟堺ｿ｡迥ｶ豕√ｒ蜿門ｾ暦ｼ亥・蝗・+ 60遘偵＃縺ｨ・・
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

    // 蛻晏屓蜿門ｾ暦ｼ・ONNECTING縺ｮ逶ｴ蠕後↓・・
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

  // 繝励Ο繝輔ぅ繝ｼ繝ｫ逕ｻ蜒上ｒ蜿門ｾ・
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

  // 繝励Ο繝輔ぅ繝ｼ繝ｫ逕ｻ蜒上・繝ｼ繧ｭ繝ｼ逕ｨ縺ｮ迥ｶ諷・
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const scrollSpeedRef = useRef(config.hero.profileMarqueeScrollSpeed);

  // 逕ｻ蜒城・蛻励・貅門ｙ・・rofileImageUrl + config.hero.profileMarqueeImages・・
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

  // 2蜻ｨ蛻・・逕ｻ蜒城・蛻励ｒ菴懈・
  const doubledImages = useMemo(() => {
    if (allImages.length === 0) return [];
    return [...allImages, ...allImages];
  }, [allImages]);

  // 閾ｪ蜍輔せ繧ｯ繝ｭ繝ｼ繝ｫ蜃ｦ逅・
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
      const maxScroll = container.scrollWidth / 2; // 1蜻ｨ蛻・・蟷・

      if (currentScroll >= maxScroll) {
        // 1蜻ｨ蛻・せ繧ｯ繝ｭ繝ｼ繝ｫ縺励◆繧牙・鬆ｭ縺ｫ謌ｻ縺呻ｼ医す繝ｼ繝繝ｬ繧ｹ縺ｫ・・
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

  // 繝峨Λ繝・げ髢句ｧ・
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

  // 繝峨Λ繝・げ荳ｭ
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || shouldReduceMotion || allImages.length === 0) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const deltaX = dragStartXRef.current - e.clientX;
    container.scrollLeft = dragStartScrollLeftRef.current + deltaX;
  }, [isDragging, shouldReduceMotion, allImages.length]);

  // 繝峨Λ繝・げ邨ゆｺ・
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
    }
  }, [isDragging]);

  // 繝槭え繧ｹ繝ｪ繝ｼ繝匁凾縺ｫ繝峨Λ繝・げ迥ｶ諷九ｂ繝ｪ繧ｻ繝・ヨ
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

  // 譌｢蟄倅ｻ墓ｧ假ｼ喞onfig縺ｧ蠑ｷ蛻ｶON/OFF縺ｧ縺阪ｋ
  const isLive = Boolean(config.twitch.isLive || twitchStatus.isLive);
  const liveTitle = twitchStatus.title;

  // 繧｢繝九Γ繝ｼ繧ｷ繝ｧ繝ｳ繝舌Μ繧｢繝ｳ繝茨ｼ磯撕縺九↑繧ｺ繝ｼ繝逹蝨ｰ蜈･繧奇ｼ・
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
      scale: shouldReduceMotion ? 1 : 0.9, // 繧医ｊ蟆上＆縺城幕蟋具ｼ医ず繝ｯ・槭▲縺ｨ諡｡螟ｧ・・
      y: shouldReduceMotion ? 0 : 8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : config.animation.profileImage.duration / 1000,
        delay: shouldReduceMotion ? 0 : config.animation.profileImage.startDelay / 1000,
        ease: [0.25, 0.46, 0.45, 0.94] as const, // 繧医ｊ貊代ｉ縺九↑繧､繝ｼ繧ｸ繝ｳ繧ｰ・医ず繝ｯ・槭▲縺ｨ・・
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

  const liveBadgeInner = (
    <span className="relative flex items-center gap-2">
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
        {isLive && (
          <span className="absolute inset-0 w-2 h-2 rounded-full bg-red-500/25 animate-ping" />
        )}
        <span className="absolute inset-0 w-2 h-2 rounded-full bg-red-500/35 blur-sm" />
        <span className="relative w-2 h-2 rounded-full bg-red-500" />
      </motion.span>
      <span className="font-bold tracking-wide">{config.hero.liveTag}</span>
    </span>
  );

  const renderLiveBadge = () => {
    if (isLive) {
      return config.twitch.url ? (
        <a
          href={config.twitch.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Pill tone="red" isLive>
            {liveBadgeInner}
          </Pill>
        </a>
      ) : (
        <Pill tone="red" isLive>
          {liveBadgeInner}
        </Pill>
      );
    }

    // OFF AIR 蛛ｴ繧ゅΜ繝ｳ繧ｯ蠕ｩ豢ｻ
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
      {/* 譛ｬ逡ｪ逕ｨ・壻ｸｭ蠢・°繧牙ｺ・′繧狗區縺・・・磯≦蟒ｶ蠕後↓陦ｨ遉ｺ縲∵ｯ主屓・・*/}
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

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-1/3 top-0 h-full w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(255,219,153,0.02) 25%, rgba(255,224,163,0.18) 50%, rgba(255,219,153,0.02) 75%, transparent 100%)",
            filter: "blur(1px)",
          }}
          initial={{ x: "-130%" }}
          animate={canAnimate ? { x: "430%" } : { x: "-130%" }}
          transition={{
            duration: shouldReduceMotion ? 0 : 2.3,
            ease: "easeInOut",
            repeat: shouldReduceMotion ? 0 : Infinity,
            repeatDelay: shouldReduceMotion ? 0 : 1.0,
          }}
        />
      </div>

      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_60%_20%,rgba(255,255,255,0.30),transparent_55%)]" />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {showConnecting ? (
              <Pill tone="blue">
                <span className="text-xs font-semibold">CONNECTING...</span>
              </Pill>
            ) : (
              config.twitch.enabled && renderLiveBadge()
            )}

            {/* 繧ｿ繧､繝医Ν陦ｨ遉ｺ・夐・菫｡荳ｭ・逆itle縺ゅｊ */}
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
                  className="lux-card group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur hover:text-white"
                >
                  {c.label}
                  <span className="ml-2 text-white/50 transition group-hover:text-white/80">
                    &gt;
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* 繝励Ο繝輔ぅ繝ｼ繝ｫ逕ｻ蜒上・繝ｼ繧ｭ繝ｼ */}
          <motion.div
            initial="hidden"
            animate={canAnimate ? "visible" : "hidden"}
            variants={profileImageVariants}
            className="flex items-center justify-center md:justify-end min-h-[256px] w-[256px]"
          >
            <motion.div
              animate={
                canAnimate && !shouldReduceMotion
                  ? { scale: [1, 1.01, 1], y: [0, -1, 0] }
                  : { scale: 1, y: 0 }
              }
              transition={
                canAnimate && !shouldReduceMotion
                  ? { duration: 5.8, ease: "easeInOut", repeat: Infinity }
                  : { duration: 0 }
              }
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
                    cursor:
                      shouldReduceMotion || allImages.length === 0
                        ? "default"
                        : "grab",
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
          </motion.div>
        </div>

        {/* QR */}
        {config.hero.qrCodes && config.hero.qrCodes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-white/10">
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
                className="lux-card group flex flex-col items-center rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 text-center"
              >
                <span className="text-sm text-white/70 mb-2 sm:mb-3 group-hover:text-white/90 transition">
                  {qr.label}
                </span>
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center">
                  <img src={qr.qrUrl} alt={`${qr.label} QR Code`} className="w-full h-full object-contain" />
                  {qr.logoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <img src={qr.logoUrl} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border-2 sm:border-3 border-white bg-white object-cover" />
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


