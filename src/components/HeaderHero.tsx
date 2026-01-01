// src/components/HeaderHero.tsx
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { config } from "@/content/config";
import { Pill } from "./Pill";
import type { CTA } from "@/types";

type TwitchStatus = {
  isLive: boolean;
  title?: string;
};

export function HeaderHero() {
  const ctas: readonly CTA[] = config.hero.ctas;
  const shouldReduceMotion = useReducedMotion();

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [twitchStatus, setTwitchStatus] = useState<TwitchStatus>({ isLive: false });

  // 起動演出制御
  const [canAnimate, setCanAnimate] = useState(false);
  const [showConnecting, setShowConnecting] = useState(false);

  // 本番用ハイライト（中心から広がる光）
  const [showHighlight, setShowHighlight] = useState(false);

  // 起動演出 → 遅延 → アニメ解禁 → ハイライト
  useEffect(() => {
    if (shouldReduceMotion) {
      setCanAnimate(true);
      return;
    }

    setCanAnimate(false);
    setShowConnecting(true);

    const connectingTimer = setTimeout(() => {
      setShowConnecting(false);
    }, 300);

    const animateTimer = setTimeout(() => {
      // ① アニメ解禁
      setCanAnimate(true);

      // ② 少し遅らせてハイライト（1フレーム以上ずらす）
      setTimeout(() => {
        setShowHighlight(true);

        // ③ ハイライトは短時間で消す（本番用）
        setTimeout(() => {
          setShowHighlight(false);
        }, 380);
      }, 50);
    }, 3500); // ← あなたの設定値（好きに調整OK）

    return () => {
      clearTimeout(connectingTimer);
      clearTimeout(animateTimer);
    };
  }, [shouldReduceMotion]);

  // Twitch状態取得
  useEffect(() => {
    let canceled = false;

    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/twitch/status");
        if (!res.ok) return;
        const data = (await res.json()) as TwitchStatus;
        if (!canceled) setTwitchStatus(data);
      } catch {}
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);

    return () => {
      canceled = true;
      clearInterval(interval);
    };
  }, []);

  // プロフィール画像
  useEffect(() => {
    let canceled = false;

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user-profile");
        if (!res.ok) return;
        const data = await res.json();
        if (!canceled && data.profile_image_url) {
          const url = data.profile_image_url.startsWith("http")
            ? `/api/img?url=${encodeURIComponent(data.profile_image_url)}`
            : data.profile_image_url;
          setProfileImageUrl(url);
        }
      } catch {}
    };

    fetchProfile();
    return () => {
      canceled = true;
    };
  }, []);

  // バリアント
  const heroVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
      filter: shouldReduceMotion ? "none" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
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
      scale: shouldReduceMotion ? 1 : 0.92,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7,
        delay: shouldReduceMotion ? 0 : 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const qrCardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : 0.8 + i * 0.12,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <motion.section
      initial="hidden"
      animate={canAnimate ? "visible" : "hidden"}
      variants={heroVariants}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur"
    >
      {/* ===== 本番用：中心から広がる白い光 ===== */}
      {showHighlight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.28, 0] }}
          transition={{ duration: 0.42, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.55), transparent 60%)",
          }}
        />
      )}

      {/* 背景の薄い光（元からあったやつ） */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_60%_20%,rgba(255,255,255,0.30),transparent_55%)]" />

      <div className="relative flex flex-col gap-6 z-10">
        <div className="flex items-center gap-2">
          {showConnecting ? (
            <Pill tone="blue">
              <span className="text-xs font-semibold">CONNECTING…</span>
            </Pill>
          ) : (
            config.twitch.enabled && (
              <Pill tone="red">
                <span className="text-xs font-semibold text-white/70">
                  {twitchStatus.isLive ? "ON AIR" : "OFF AIR"}
                </span>
              </Pill>
            )
          )}

          {twitchStatus.isLive && twitchStatus.title && (
            <span className="text-xs tracking-[0.35em] text-white/70 truncate max-w-[400px]">
              {twitchStatus.title}
            </span>
          )}
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

          {/* レイアウト確保 + フェードイン */}
          <motion.div
            initial="hidden"
            animate={canAnimate ? "visible" : "hidden"}
            variants={profileImageVariants}
            className="flex items-center justify-center md:justify-end min-h-[256px] w-[256px]"
          >
            {profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImageUrl}
                alt="Profile"
                className="h-64 w-64 object-cover"
              />
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qr.qrUrl}
                    alt={`${qr.label} QR Code`}
                    className="w-full h-full object-contain"
                  />
                  {qr.logoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qr.logoUrl}
                        alt="Logo"
                        className="w-9 h-9 rounded-full border-3 border-white bg-white object-cover"
                      />
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
