// src/components/AccessGate.tsx
import { useState, useLayoutEffect } from "react";
import { config } from "@/content/config";

type AccessGateProps = {
  children: React.ReactNode;
};

export function AccessGate({ children }: AccessGateProps) {
  // パブリックモードの場合は初期値をtrueに設定
  const [unlocked, setUnlocked] = useState(
    config.access.mode === "public"
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // クライアントサイドでのみlocalStorageをチェック
  // パスワードモードでrememberが有効な場合のみlocalStorageを確認
  // このケースでは、localStorageの読み取りは外部システム（ブラウザAPI）との同期なので、
  // useLayoutEffect内でのsetStateは適切です
  useLayoutEffect(() => {
    // パブリックモードの場合は既に初期値でtrueになっているので何もしない
    if (config.access.mode === "public") {
      return;
    }

    // パスワードモードでrememberが有効な場合のみlocalStorageを確認
    if (config.access.remember) {
      try {
        const v = localStorage.getItem(config.access.rememberKey);
        if (v === "ok") {
          // localStorageからの読み取りは外部システムとの同期なので、このsetStateは適切
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUnlocked(true);
        }
      } catch {
        // localStorageが使用できない場合は無視
      }
    }
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
          // localStorageが使用できない場合は無視
        }
      }
      return;
    }
    setError("パスワードが違います。");
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="text-sm font-semibold tracking-[0.25em] text-white/70">
          ACCESS
        </div>
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
            autoFocus
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
          ※公開/限定の切替は{" "}
          <span className="font-mono text-white/70">src/content/config.ts</span>{" "}
          の <span className="font-mono text-white/70">access.mode</span>{" "}
          を変更するだけでOKです。
        </div>
      </div>
    </div>
  );
}

