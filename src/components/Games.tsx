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
        <motion.article
          key={game.href}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={cardVariants}
          custom={index}
          // DOM rule aligned with ARCHIVE/CLIPS:
          // outer card frame + inner link + media/body split.
          className="lux-card game-card group overflow-hidden rounded-xl border border-white/10 bg-white/5"
        >
          <a href={game.href} target="_blank" rel="noreferrer" className="block">
            {game.thumbnail && (
              <div className="card-media relative overflow-hidden border-b border-white/10 bg-black/25">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/img?url=${encodeURIComponent(game.thumbnail)}`}
                  alt={game.title}
                  className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-70" />
                <span className="card-chip pointer-events-none absolute left-2 top-2">
                  GAME
                </span>
              </div>
            )}

            <div className="card-body p-4">
              <div className="card-kicker mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-white/62">
                {index === 0 ? "PICK UP" : "PLAY READY"}
              </div>
              <div className="card-title text-sm font-semibold text-white/95">
                {game.title}
              </div>
              {game.subtitle && (
                <div className="card-meta mt-2 text-xs text-white/68">
                  {game.subtitle}
                </div>
              )}
              <div className="card-action game-action mt-4 inline-flex items-center text-xs font-medium text-white/78">
                プレイする
                <span className="ml-2 opacity-70 transition group-hover:opacity-100">
                  &gt;
                </span>
              </div>
            </div>
          </a>
        </motion.article>
      ))}
    </div>
  );
}
