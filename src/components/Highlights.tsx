// src/components/Highlights.tsx
import { motion } from "framer-motion";
import { config } from "@/content/config";

export function Highlights() {
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
          <div className="mt-2 text-sm leading-relaxed text-white/75">
            {h.body}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

