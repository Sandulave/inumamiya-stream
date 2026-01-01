// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { config } from "@/content/config";
import { Background } from "@/components/Background";
import { AccessGate } from "@/components/AccessGate";
import { HeaderHero } from "@/components/HeaderHero";
import { Ticker } from "@/components/Ticker";
import { Section } from "@/components/Section";
import { LatestArchive } from "@/components/LatestArchive";
import { Clips } from "@/components/Clips";
import { StyleCards } from "@/components/StyleCards";
import { Message } from "@/components/Message";
import { Footer } from "@/components/Footer";
import { BirthdayCelebrate } from "@/components/BirthdayCelebrate";

export default function Page() {
  // 今日が誕生日かどうかを判定（初期レンダリング時）
  const now = new Date();
  const jp = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const m = jp.getMonth() + 1;
  const d = jp.getDate();
  const isBirthday = m === config.birthday.month && d === config.birthday.day;

  const [showContent, setShowContent] = useState(false); // 常に初期は非表示
  const [showSections, setShowSections] = useState(false); // 起動演出とQRコード完了まで非表示

  useEffect(() => {
    document.title = config.site.title;
  }, []);

  // 起動演出完了後、QRコードアニメーション完了後にセクションを表示
  useEffect(() => {
    // アーカイブの開始タイミングをconfigから取得
    const timer = setTimeout(() => {
      setShowSections(true);
    }, config.animation.archive.startDelay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen text-white">
      <BirthdayCelebrate 
        birthday={{ month: config.birthday.month, day: config.birthday.day }}
        onComplete={() => setShowContent(true)} 
      />
      
      <div style={{ opacity: showContent ? 1 : 0, transition: "opacity 0.5s ease-in" }}>
        <Background />

        <div className="relative mx-auto max-w-5xl px-5 pb-20 pt-8">
          <AccessGate>
            <HeaderHero />
          {config.ticker.enabled && <Ticker />}

          <div className="mt-8 space-y-10">
            {config.sections.highlights.enabled && (
              <Section title={config.sections.highlights.title}>
                <LatestArchive visible={showSections} />
              </Section>
            )}

            {config.sections.clips.enabled && (
              <Section title={config.sections.clips.title}>
                <Clips visible={showSections} />
              </Section>
            )}

            {config.sections.style.enabled && (
              <Section title={config.sections.style.title}>
                <StyleCards />
              </Section>
            )}

            {config.sections.message.enabled && (
              <Section title={config.sections.message.title}>
                <Message />
              </Section>
            )}

            <Footer />
          </div>
        </AccessGate>
        </div>
      </div>
    </main>
  );
}
