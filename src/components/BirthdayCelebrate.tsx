"use client";

import { useEffect, useState, useRef } from "react";
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

  // 今日が誕生日かどうかを判定
  const isBirthday = birthday ? (() => {
    const now = new Date();
    const jp = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const m = jp.getMonth() + 1;
    const d = jp.getDate();
    return m === birthday.month && d === birthday.day;
  })() : false;

  useEffect(() => {
    // 誕生日の場合のみクラッカーを発射
    let t1: NodeJS.Timeout | undefined;
    if (isBirthday) {
      // クラッカーが既に発射されている場合はスキップ（1回だけ発射）
      if (!confettiFiredRef.current) {
        confettiFiredRef.current = true;

        // Happy Birthday!表示から0.5秒後にクラッカーを発射（1回だけ）
        t1 = setTimeout(() => {
          // 派手なクラッカーを1回発射
          confetti({
            particleCount: 200,
            spread: 120,
            startVelocity: 60,
            origin: { y: 0.7 },
            ticks: 300,
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'],
            shapes: ['circle', 'square'],
            scalar: 1.2,
          });

          // canvas-confettiが作成するcanvas要素のz-indexを設定（白い背景の上に表示）
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const canvases = document.querySelectorAll('canvas');
              canvases.forEach((canvas) => {
                const htmlCanvas = canvas as HTMLElement;
                if (htmlCanvas.style.position === 'fixed' || !htmlCanvas.style.position) {
                  htmlCanvas.style.zIndex = '10002';
                }
              });
            });
          });
        }, 500);
      }
    }

    // 2秒後にフェードアウト開始
    const t2 = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // 3秒後に完全に非表示にしてコールバック実行
    const t3 = setTimeout(() => {
      setShow(false);
      onCompleteRef.current?.();
    }, 3000);

    return () => {
      if (t1) clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isBirthday, birthday]);

  if (!show) return null;

  return (
    <>
      {/* 白い背景オーバーレイ */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#ffffff",
          zIndex: 10000,
          transition: "opacity 1s ease-out",
          opacity: fadeOut ? 0 : 1,
          pointerEvents: fadeOut ? "none" : "auto",
        }}
      >
        {/* メッセージ */}
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
            zIndex: 10001,
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 14,
              background: "transparent",
              color: "#000000",
              fontSize: 20,
              fontWeight: "bold",
              letterSpacing: 0.2,
              animation: "fadePop 900ms ease-out both",
              transition: "opacity 1s ease-out",
              opacity: fadeOut ? 0 : 1,
            }}
          >
            {isBirthday ? "🎂 Happy Birthday!" : "INUMAMIYA"}
          </div>

          <style>{`
            @keyframes fadePop {
              from { opacity: 0; transform: translateY(10px) scale(0.98); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
