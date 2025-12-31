// src/components/Message.tsx
import { config } from "@/content/config";

export function Message() {
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

