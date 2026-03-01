"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

type Props = {
  birthday?: { month: number; day: number };
  onComplete?: () => void;
};

export function BirthdayCelebrate({ birthday, onComplete }: Props) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const confettiFiredRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const isBirthday = birthday
    ? (() => {
        const now = new Date();
        const jp = new Date(
          now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
        );
        const month = jp.getMonth() + 1;
        const day = jp.getDate();
        return month === birthday.month && day === birthday.day;
      })()
    : false;

  useEffect(() => {
    if (!show) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [show]);

  useEffect(() => {
    let burstInterval: NodeJS.Timeout | undefined;

    if (isBirthday && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      const fireBurst = () => {
        confetti({
          particleCount: 120,
          spread: 110,
          startVelocity: 55,
          origin: { x: 0.5, y: 0.62 },
          ticks: 250,
          scalar: 1.15,
          colors: [
            "#f43f5e",
            "#f59e0b",
            "#facc15",
            "#22d3ee",
            "#60a5fa",
            "#f8fafc",
          ],
        });
      };

      const tBurst = setTimeout(() => {
        fireBurst();
        burstInterval = setInterval(fireBurst, 380);
      }, 520);

      const tStopBurst = setTimeout(() => {
        if (burstInterval) clearInterval(burstInterval);
      }, 2000);

      const tFade = setTimeout(() => setFadeOut(true), 2200);
      const tEnd = setTimeout(() => {
        setShow(false);
        onCompleteRef.current?.();
      }, 3200);

      return () => {
        clearTimeout(tBurst);
        clearTimeout(tStopBurst);
        clearTimeout(tFade);
        clearTimeout(tEnd);
        if (burstInterval) clearInterval(burstInterval);
      };
    }

    const tFade = setTimeout(() => setFadeOut(true), 2200);
    const tEnd = setTimeout(() => {
      setShow(false);
      onCompleteRef.current?.();
    }, 3200);

    return () => {
      clearTimeout(tFade);
      clearTimeout(tEnd);
    };
  }, [isBirthday]);

  if (!show) return null;

  return (
    <div
      className={`bi-overlay ${fadeOut ? "is-fade" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="bi-bg" />
      <div className="bi-grid" />
      <div className="bi-stage" aria-hidden>
        <div className="bi-flash" />
        <div className="bi-ring bi-ring-a" />
        <div className="bi-ring bi-ring-b" />
      </div>

      <div className="bi-slots" aria-hidden>
        <span>おもろ</span>
        <span>ジャックポット！</span>
      </div>

      <div className="bi-stage">
        <div className="bi-center">
          <p className="bi-top">WELCOME</p>
          <h1>{isBirthday ? "HAPPY BIRTHDAY" : "INUMAMIYA"}</h1>
          <p className="bi-bottom">
            {isBirthday ? "SPECIAL FEVER MODE" : "RUSH MODE START"}
          </p>
        </div>
      </div>

      <style>{`
        .bi-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          z-index: 10000;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #020617;
          opacity: 1;
          transition: opacity 900ms ease-out, filter 900ms ease-out;
        }
        .bi-overlay.is-fade {
          opacity: 0;
          filter: blur(5px);
          pointer-events: none;
        }
        .bi-bg {
          position: absolute;
          inset: -12%;
          background:
            radial-gradient(circle at 20% 18%, rgba(56, 189, 248, 0.60), transparent 36%),
            radial-gradient(circle at 78% 23%, rgba(244, 63, 94, 0.45), transparent 42%),
            radial-gradient(circle at 50% 78%, rgba(251, 191, 36, 0.34), transparent 48%),
            linear-gradient(160deg, #020617 0%, #1d0a36 50%, #030712 100%);
          animation: bi-bg-shift 2.2s ease-in-out infinite;
        }
        .bi-grid {
          position: absolute;
          inset: 0;
          opacity: 0.20;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.22) 1px, transparent 1px);
          background-size: 72px 72px;
          transform: perspective(680px) rotateX(48deg) translateY(18%);
          transform-origin: center top;
          animation: bi-grid-flow 1.4s linear infinite;
        }
        .bi-flash {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 300vmax;
          height: 300vmax;
          transform: translate(-50%, -50%);
          background:
            repeating-conic-gradient(
              from 0deg,
              rgba(255, 255, 255, 0.0) 0deg 18deg,
              rgba(255, 255, 255, 0.11) 18deg 24deg
            );
          mix-blend-mode: screen;
          filter: blur(1.5px);
          animation: bi-spin-center 5s linear infinite;
        }
        .bi-stage {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          pointer-events: none;
        }
        .bi-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 9999px;
          border: 2px solid rgba(255, 255, 255, 0.22);
          filter: drop-shadow(0 0 24px rgba(56, 189, 248, 0.40));
          pointer-events: none;
        }
        .bi-ring-a {
          width: min(62vmin, 560px);
          height: min(62vmin, 560px);
          animation: bi-ring-rotate 7s linear infinite;
        }
        .bi-ring-b {
          width: min(48vmin, 440px);
          height: min(48vmin, 440px);
          border-color: rgba(251, 191, 36, 0.34);
          animation: bi-ring-rotate-rev 5.4s linear infinite;
        }
        .bi-slots {
          position: fixed;
          top: clamp(56px, 16vh, 180px);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: clamp(14px, 2.8vw, 42px);
          padding: 10px 22px;
          max-width: min(94vw, 760px);
          border: 1px solid rgba(255,255,255,0.26);
          border-radius: 999px;
          background: rgba(3, 7, 18, 0.52);
          backdrop-filter: blur(6px);
          font-weight: 900;
          letter-spacing: 0.08em;
          font-size: clamp(20px, 3.8vw, 46px);
          color: #f8fafc;
          text-shadow: 0 0 18px rgba(14,165,233,0.7);
          animation: bi-slots-pulse 780ms steps(2, jump-none) infinite;
        }
        .bi-slots span {
          white-space: nowrap;
        }
        .bi-center {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #f8fafc;
          padding: 24px;
          width: min(92vw, 920px);
          transform: translateY(-4vh);
        }
        .bi-top {
          font-size: clamp(12px, 1.4vw, 18px);
          letter-spacing: 0.46em;
          font-weight: 700;
          margin-bottom: 12px;
          color: rgba(186, 230, 253, 0.95);
        }
        .bi-center h1 {
          margin: 0;
          display: inline-block;
          line-height: 1.02;
          font-size: clamp(36px, 7vw, 88px);
          font-weight: 900;
          letter-spacing: 0.06em;
          transform: translateX(-0.035em);
          color: #f8fafc;
          -webkit-text-fill-color: #f8fafc;
          text-shadow:
            0 0 1px rgba(255,255,255,0.56),
            0 0 12px rgba(56,189,248,0.16),
            0 0 18px rgba(251,146,60,0.12);
          -webkit-text-stroke: 0.45px rgba(248, 250, 252, 0.28);
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          filter: none;
          animation: bi-title-swell 2.2s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }
        .bi-bottom {
          margin-top: 10px;
          font-size: clamp(11px, 1.3vw, 18px);
          letter-spacing: 0.34em;
          font-weight: 700;
          color: rgba(254, 249, 195, 0.96);
        }
        @keyframes bi-bg-shift {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.08) rotate(-1.2deg); }
        }
        @keyframes bi-grid-flow {
          from { background-position: 0 0, 0 0; }
          to { background-position: 72px 0, 0 72px; }
        }
        @keyframes bi-spin-center {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes bi-ring-rotate {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes bi-ring-rotate-rev {
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes bi-title-swell {
          0%, 100% {
            transform: translateX(-0.035em) scale(1);
            filter: brightness(1);
          }
          22% {
            transform: translateX(-0.035em) translateY(-0.02em) scale(1.07);
            filter: brightness(1.2);
          }
          48% {
            transform: translateX(-0.035em) translateY(0.01em) scale(0.96);
            filter: brightness(0.95);
          }
          74% {
            transform: translateX(-0.035em) translateY(-0.01em) scale(1.04);
            filter: brightness(1.1);
          }
        }
        @keyframes bi-slots-pulse {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.74; filter: brightness(1.3); }
        }
        @media (max-width: 640px) {
          .bi-flash {
            width: 380vmax;
            height: 380vmax;
            filter: blur(2px);
          }
          .bi-slots {
            top: clamp(44px, 14vh, 120px);
            gap: 12px;
            letter-spacing: 0.06em;
            padding: 8px 14px;
            font-size: clamp(18px, 8vw, 28px);
          }
          .bi-center {
            width: min(94vw, 700px);
            padding: 12px;
            transform: translateY(-2vh);
          }
          .bi-bottom {
            letter-spacing: 0.22em;
          }
          .bi-ring-a {
            width: min(72vw, 420px);
            height: min(72vw, 420px);
          }
          .bi-ring-b {
            width: min(58vw, 340px);
            height: min(58vw, 340px);
          }
        }
        @media (max-width: 360px) {
          .bi-slots {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2px;
            text-align: center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bi-bg,
          .bi-grid,
          .bi-flash,
          .bi-ring-a,
          .bi-ring-b,
          .bi-center h1,
          .bi-slots {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
