"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { config } from "@/content/config";
import { Background } from "@/components/Background";
import { AccessGate } from "@/components/AccessGate";
import { HeaderHero } from "@/components/HeaderHero";
import { Ticker } from "@/components/Ticker";
import { Section } from "@/components/Section";
import { LatestArchive } from "@/components/LatestArchive";
import { Clips } from "@/components/Clips";
import { StyleCards } from "@/components/StyleCards";
import { Games } from "@/components/Games";
import { Message } from "@/components/Message";
import { Footer } from "@/components/Footer";
import { BirthdayCelebrate } from "@/components/BirthdayCelebrate";

export default function Page() {
  const [showContent, setShowContent] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pageGlossRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = config.site.title;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSections(true);
    }, config.animation.archive.startDelay);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(".lux-card")
    );
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", `${Math.max(0, Math.min(100, x))}%`);
        card.style.setProperty("--my", `${Math.max(0, Math.min(100, y))}%`);
      };

      const onLeave = () => {
        card.style.setProperty("--mx", "50%");
        card.style.setProperty("--my", "50%");
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [showSections, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || !pageGlossRef.current) return;

    let rafId: number | null = null;

    const onMove = (e: MouseEvent) => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        const el = pageGlossRef.current;
        if (!el) return;
        el.style.setProperty("--px", `${Math.max(0, Math.min(100, x))}%`);
        el.style.setProperty("--py", `${Math.max(0, Math.min(100, y))}%`);
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  const sectionMotion = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    animate: showSections
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.5,
      delay: shouldReduceMotion ? 0 : delay,
    },
  });

  return (
    <main className="rave-max min-h-screen bg-[#020617] text-white">
      <BirthdayCelebrate
        birthday={{ month: config.birthday.month, day: config.birthday.day }}
        onComplete={() => setShowContent(true)}
      />

      <div
        style={{
          opacity: showContent ? 1 : 0,
          filter: showContent ? "none" : "blur(6px)",
          transform: showContent
            ? "none"
            : "translateY(12px) scale(0.988)",
          transition:
            "opacity 900ms cubic-bezier(0.22,1,0.36,1), filter 900ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <Background />
        <div
          ref={pageGlossRef}
          className="pointer-events-none fixed inset-0"
          style={{
            opacity: showContent ? 1 : 0,
            transition: "opacity 900ms ease-out",
            mixBlendMode: "soft-light",
            filter: "blur(4.8px)",
            background:
              "radial-gradient(400px circle at var(--px,50%) var(--py,8%), rgba(255,250,230,0.31) 0%, rgba(255,235,194,0.125) 42%, rgba(255,224,163,0) 78%), radial-gradient(1080px circle at var(--px,50%) var(--py,8%), rgba(255,224,163,0.145) 0%, rgba(255,224,163,0.042) 48%, rgba(255,224,163,0) 86%), radial-gradient(circle at 50% 8%, rgba(255,224,163,0.082), transparent 60%)",
          }}
        />

        <div className="pachinko-shell pachinko-content relative mx-auto max-w-5xl px-5 pb-20 pt-8">
          <div className="light-rail light-rail-top" aria-hidden />
          <div className="light-rail light-rail-bottom" aria-hidden />
          <AccessGate>
            <div className="jackpot-rail">
              <HeaderHero />
              {config.ticker.enabled && <Ticker />}
            </div>

            <div className="mt-8 space-y-10">
              {config.sections.games.enabled && (
                <motion.div {...sectionMotion(0)}>
                  <Section title={config.sections.games.title}>
                    <Games visible={showSections} />
                  </Section>
                </motion.div>
              )}

              {config.sections.highlights.enabled && (
                <motion.div {...sectionMotion(0.12)}>
                  <Section title={config.sections.highlights.title}>
                    <LatestArchive visible={showSections} />
                  </Section>
                </motion.div>
              )}

              {config.sections.clips.enabled && (
                <motion.div {...sectionMotion(0.24)}>
                  <Section title={config.sections.clips.title}>
                    <Clips visible={showSections} />
                  </Section>
                </motion.div>
              )}

              {config.sections.style.enabled && (
                <motion.div {...sectionMotion(0.36)}>
                  <Section title={config.sections.style.title}>
                    <StyleCards />
                  </Section>
                </motion.div>
              )}

              {config.sections.message.enabled && (
                <motion.div {...sectionMotion(0.48)}>
                  <Section title={config.sections.message.title}>
                    <Message />
                  </Section>
                </motion.div>
              )}

              <Footer />
            </div>
          </AccessGate>
        </div>
      </div>
    </main>
  );
}
