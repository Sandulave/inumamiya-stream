// src/components/Footer.tsx
export function Footer() {
  return (
    <div className="footer-rave rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white/60">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-200/70" />
        THANKS FOR VISITING
      </div>
      <div className="text-xs text-white/45">
        © {new Date().getFullYear()} · Unofficial fan-made page.
      </div>
    </div>
  );
}

