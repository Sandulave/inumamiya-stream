// src/components/HeaderHero.tsx
import { motion } from "framer-motion";
import { config } from "@/content/config";
import { Pill } from "./Pill";
import type { CTA } from "@/types";

export function HeaderHero() {
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
              <span className="ml-2 text-white/50 transition group-hover:text-white/80">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

