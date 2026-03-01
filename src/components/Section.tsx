// src/components/Section.tsx
type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export function Section({ title, children }: SectionProps) {
  const t = title.toLowerCase();
  const toneClass = t.includes("games")
    ? "section-games"
    : t.includes("archive")
      ? "section-archive"
      : t.includes("clip")
        ? "section-clips"
        : t.includes("spec")
          ? "section-spec"
          : "section-default";

  return (
    <section className={`section-shell ${toneClass}`}>
      <div className="mb-3 flex items-center gap-2 sm:gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
        <h2 className="section-title-pill inline-flex max-w-full flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-center text-[10px] font-semibold tracking-[0.16em] text-white/78 sm:flex-none sm:px-3 sm:text-xs sm:tracking-[0.28em]">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-200/90 shadow-[0_0_10px_rgba(253,230,138,0.42)]" />
          {title}
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-200/70 shadow-[0_0_10px_rgba(125,211,252,0.35)]" />
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur sm:p-5">
        {children}
      </div>
    </section>
  );
}

