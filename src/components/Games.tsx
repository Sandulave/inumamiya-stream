import { motion, useReducedMotion } from "framer-motion";
import { config } from "@/content/config";

type GamesProps = {
  visible?: boolean;
};

export function Games({ visible = true }: GamesProps) {
  const shouldReduceMotion = useReducedMotion();
  const isVisible = visible || shouldReduceMotion;

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -16,
      y: shouldReduceMotion ? 0 : 10,
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion
          ? 0
          : (i * config.animation.games.cardStagger) / 1000,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  const shouldHide = !visible && !shouldReduceMotion;

  return (
    <div
      className={[
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        shouldHide ? "invisible pointer-events-none" : "",
      ].join(" ")}
      aria-hidden={shouldHide}
    >
      {config.games.map((game, index) => (
        <motion.a
          key={game.href}
          href={game.href}
          target="_blank"
          rel="noreferrer"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={cardVariants}
          custom={index}
          className="lux-card group rounded-xl border border-white/10 bg-white/5 p-4"
        >
          {game.thumbnail && (
            <div className="mb-3 overflow-hidden rounded-lg border border-white/10 bg-black/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/img?url=${encodeURIComponent(game.thumbnail)}`}
                alt={game.title}
                className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.035] group-hover:-translate-y-0.5"
                loading="lazy"
              />
            </div>
          )}
          <div className="text-sm font-semibold text-white/95">{game.title}</div>
          {game.subtitle && (
            <div className="mt-2 text-xs text-white/70">{game.subtitle}</div>
          )}
          <div className="mt-4 inline-flex items-center text-xs text-white/75">
            プレイする
            <span className="ml-2 opacity-70 transition group-hover:opacity-100">
              &gt;
            </span>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
