import { useEffect, useState } from "react";
import { config } from "@/content/config";

type AccessGateProps = {
  children: React.ReactNode;
};

type AccessStatusResponse = {
  unlocked: boolean;
  error?: string;
};

export function AccessGate({ children }: AccessGateProps) {
  const isPublic = config.access.mode === "public";
  const [unlocked, setUnlocked] = useState(isPublic);
  const [checking, setChecking] = useState(!isPublic);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isPublic) return;

    let canceled = false;
    const checkAccess = async () => {
      try {
        const res = await fetch("/api/access", { cache: "no-store" });
        if (!res.ok) {
          if (!canceled) {
            setUnlocked(false);
            setChecking(false);
            setError("Access status check failed.");
          }
          return;
        }

        const data = (await res.json()) as AccessStatusResponse;
        if (!canceled) {
          setUnlocked(Boolean(data.unlocked));
          setChecking(false);
        }
      } catch {
        if (!canceled) {
          setUnlocked(false);
          setChecking(false);
          setError("Failed to connect to access API.");
        }
      }
    };

    checkAccess();
    return () => {
      canceled = true;
    };
  }, [isPublic]);

  if (unlocked) return <>{children}</>;

  if (checking) {
    return (
      <div className="relative">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="text-sm text-white/70">Checking access...</div>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: input,
          remember: config.access.remember,
        }),
      });

      if (!res.ok) {
        setError("Password is incorrect.");
        setSubmitting(false);
        return;
      }

      setUnlocked(true);
    } catch {
      setError("Failed to unlock this page.");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="text-sm font-semibold tracking-[0.25em] text-white/70">
          ACCESS
        </div>
        <h2 className="mt-2 text-2xl font-bold">Password Required</h2>
        <p className="mt-2 text-sm text-white/70">
          Enter the password to continue.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="password"
            className="w-full flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/20"
            placeholder="Password"
            autoFocus
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Checking..." : "Enter"}
          </button>
        </form>

        {error && <div className="mt-3 text-sm text-red-200">{error}</div>}
      </div>
    </div>
  );
}
