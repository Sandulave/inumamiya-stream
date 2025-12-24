// src/app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { config } from "@/content/config";

type CTA = { label: string; href: string };

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

function Background() {
  // 背景のON/OFF（設定から）
  const scan = config.theme.scanlines ? "bg-scanlines" : "";
  const grid = config.theme.grid ? "bg-grid" : "";

  return (
    <div className={`pointer-events-none fixed inset-0 ${scan} ${grid}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.35),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(239,68,68,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(245,158,11,0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.65),rgba(2,6,23,0.92))]" />
    </div>
  );
}

function HeaderHero() {
  const ctas: readonly CTA[] = config.hero.ctas;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur"
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_60%_20%,rgba(255,255,255,0.30),transparent_55%)]" />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Pill tone="red">{config.hero.liveTag}</Pill>
            <span className="text-xs tracking-[0.35em] text-white/70">NEWSROOM</span>
          </div>
          <Pill tone="amber">{config.hero.breakingTag}</Pill>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {config.hero.name}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {config.hero.subtitle}
          </p>
        </div>

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
              <span className="ml-2 text-white/50 transition group-hover:text-white/80">↗</span>
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Ticker() {
  const items = useMemo(() => config.ticker.items, []);
  const duration = config.ticker.speedSeconds;

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div
        className="ticker flex w-max items-center gap-8 px-4 py-2 text-xs tracking-wide text-white/85"
        style={{ ["--ticker-duration" as any]: `${duration}s` }}
      >
        {/* ループ用に2回並べる */}
        {[...items, ...items].map((t, i) => (
          <span key={`${t}-${i}`} className="inline-flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <h2 className="text-xs font-semibold tracking-[0.35em] text-white/70">
          {title}
        </h2>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        {children}
      </div>
    </section>
  );
}

function Highlights() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {config.highlights.map((h) => (
        <motion.div
          key={h.title}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.35 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div className="text-sm font-semibold">{h.title}</div>
          <div className="mt-2 text-sm leading-relaxed text-white/75">{h.body}</div>
        </motion.div>
      ))}
    </div>
  );
}

function Clips() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {config.clips.map((c) => (
        <a
          key={c.href + c.title}
          href={c.href}
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
        >
          <div className="text-sm font-semibold text-white/90">{c.title}</div>
          <div className="mt-2 text-xs text-white/60">
            {c.href.replace("https://", "")}
          </div>
          <div className="mt-3 inline-flex items-center text-xs text-white/70">
            Open <span className="ml-2 opacity-60 transition group-hover:opacity-100">↗</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function StyleCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {config.styleCards.map((card) => (
        <div key={card.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">{card.title}</div>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {card.items.map((it) => (
              <li key={it} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Message() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm leading-relaxed whitespace-pre-line text-white/80">
        {config.message.body}
      </div>
      <div className="mt-4 text-right text-xs tracking-wide text-white/60">
        {config.message.signature}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="pt-2 text-center text-xs text-white/45">
      © {new Date().getFullYear()} · Unofficial fan-made page.
    </div>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "red" | "amber" | "blue";
  children: React.ReactNode;
}) {
  const cls =
    tone === "red"
      ? "bg-red-500/20 text-red-100 border-red-400/20"
      : tone === "amber"
      ? "bg-amber-500/20 text-amber-100 border-amber-400/20"
      : "bg-blue-500/20 text-blue-100 border-blue-400/20";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

function AccessGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // publicなら即解放
    if (config.access.mode === "public") {
      setUnlocked(true);
      setReady(true);
      return;
    }

    // rememberがtrueなら localStorage を見る
    if (config.access.remember) {
      try {
        const v = localStorage.getItem(config.access.rememberKey);
        if (v === "ok") setUnlocked(true);
      } catch {
        // ignore
      }
    }
    setReady(true);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (input === config.access.password) {
      setUnlocked(true);
      if (config.access.remember) {
        try {
          localStorage.setItem(config.access.rememberKey, "ok");
        } catch {
          // ignore
        }
      }
      return;
    }
    setError("パスワードが違います。");
  };

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  // password mode
  return (
    <div className="relative">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="text-sm font-semibold tracking-[0.25em] text-white/70">ACCESS</div>
        <h2 className="mt-2 text-2xl font-bold">パスワード入力</h2>
        <p className="mt-2 text-sm text-white/70">
          このページは限定公開です。共有されたパスワードを入力してください。
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="password"
            className="w-full flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/20"
            placeholder="Password"
          />
          <button
            type="submit"
            className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Enter
          </button>
        </form>

        {error && <div className="mt-3 text-sm text-red-200">{error}</div>}

        <div className="mt-6 text-xs text-white/45">
          ※公開/限定の切替は <span className="font-mono text-white/70">src/content/config.ts</span> の{" "}
          <span className="font-mono text-white/70">access.mode</span> を変更するだけでOKです。
        </div>
      </div>
    </div>
  );
}
