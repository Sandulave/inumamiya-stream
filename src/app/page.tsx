// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { config } from "@/content/config";
import { Background } from "@/components/Background";
import { AccessGate } from "@/components/AccessGate";
import { HeaderHero } from "@/components/HeaderHero";
import { Ticker } from "@/components/Ticker";
import { Section } from "@/components/Section";
import { Highlights } from "@/components/Highlights";
import { LatestArchive } from "@/components/LatestArchive";
import { Clips } from "@/components/Clips";
import { StyleCards } from "@/components/StyleCards";
import { Message } from "@/components/Message";
import { Footer } from "@/components/Footer";

export default function Page() {
  useEffect(() => {
    document.title = config.site.title;
  }, []);

  return (
    <main className="min-h-screen text-white">
      <Background />

      <div className="relative mx-auto max-w-5xl px-5 pb-20 pt-8">
        <AccessGate>
          <HeaderHero />
          {config.ticker.enabled && <Ticker />}

          <div className="mt-8 space-y-10">
            {config.sections.highlights.enabled && (
              <Section title={config.sections.highlights.title}>
                <Highlights />
              </Section>
            )}

            {config.sections.clips.enabled && (
              <Section title={config.sections.clips.title}>
                <Clips />
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
    </main>
  );
}
