// src/components/Section.tsx
type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export function Section({ title, children }: SectionProps) {
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

