# Copilot / AI Agent Instructions for inumamiya-stream

短く実用的に：このリポジトリは Next.js (app router) ベースの静的/軽量サイトです。AI エージェントは以下を優先して扱ってください。

- **プロジェクト全体像**: Next 16 の App Router 構成で、UI は `src/content/config.ts` の設定に強く依存する構成（UI は設定駆動）。主要ページは `src/app/page.tsx`、ルートレイアウトは `src/app/layout.tsx`。
- **API エンドポイント**: `src/app/api/clip-thumb/route.ts` は外部クリップページをフェッチし、Twitch Helix API を優先して `thumbnail` を返します。開発用に `?debug=true` を付けると Helix の生レスポンス（`helix`）と OGP（`ogp`）を返します。フロントエンドは `/api/clip-thumb?url=...` を呼ぶ想定で、Twitch CDN の画像は `/api/img?url=...` 経由でプロキシして読み込むと CORS/Referer 問題を回避できます。
- **重要な編集箇所**: コンテンツや表示切替は `src/content/config.ts` を編集するだけで反映される（例：`access.mode` を `public` にするとパスワード保護解除）。

- **ビルド / 開発フロー**:
  - 開発: `npm run dev`（`next dev`）
  - ビルド: `npm run build`（`next build`）
  - 起動: `npm run start`（`next start`）
  - Lint: `npm run lint`（プロジェクトは `eslint` のみをスクリプトで呼ぶ）
  - Tests: `npm run test`（`vitest` を使用、`npm install` 後に実行してください）

- **言語・ツールチェーン**:
  - TypeScript（`tsconfig.json` は `strict: true`、`noEmit: true`）
  - TailwindCSS (`tailwindcss` v4)、PostCSS、Autoprefixer
  - `next/font` を使ったフォント管理（例: `src/app/layout.tsx`）
  - パスエイリアス: `@/*` -> `./src/*`（`tsconfig.json`）

- **コードパターン / 慣習（このリポジトリ固有）**:
  - 設定駆動 UI: 多くのビューは `config` オブジェクトを中心に描画（`src/content/config.ts` を最初に参照）。
  - クライアント/サーバ分離: `page.tsx` は `"use client"` を利用してクライアントサイドで動作する部分がある一方、`src/app/api/*/route.ts` は Next の Server Function（Edge/Server）として外部フェッチを行う。
  - サムネイル取得のフォールバック: クリップのサムネは `config.clips[].thumbnail` が最優先。未定義ならフロントが `/api/clip-thumb` を呼び、見つからなければ `/ogp.png` を使う。

- **変更時の注意点**:
  - `access.password` は開発用に `src/content/config.ts` にデフォルトが置かれていますが、本番では `NEXT_PUBLIC_ACCESS_PASSWORD` を使って上書きしてください（`.env.local` に設定し、シークレットを公開リポジトリへコミットしないこと）。 `.env.example` を参照してください。
  - `tsconfig.json` の `noEmit: true` によりビルド出力は next が管理するため、型チェックやビルド挙動は Next のルールに従います。

- **デバッグ / 追加作業のヒント**:
  - クリップサムネ取得が壊れたら、まず `src/app/api/clip-thumb/route.ts` の fetch の User-Agent と正規表現（`og:image`）を確認。
  - 表示の切替や文言修正は `src/content/config.ts` の該当フィールドを編集すればよい（例: `ticker.items`, `hero.ctas`, `sections.*.enabled`）。

- **参考ファイル**（実例）:
  - `src/content/config.ts` — UI を作る主要データ。
  - `src/app/page.tsx` — 設定駆動でコンポーネントをレンダリングするパターン（`Clips` での `/api/clip-thumb` 呼び出しを参照）。
  - `src/app/api/clip-thumb/route.ts` — サーバサイドの簡易スクレイピング/プロキシ。
  - `src/app/layout.tsx` — フォントとグローバルレイアウト設定。

作業後は変更箇所の影響を `npm run dev` で確認し、`/api/clip-thumb` の挙動はブラウザから直接呼んで JSON を検証してください。

もしここに不足しているローカルの開発コマンドや CI 設定があれば教えてください。追記してマージします。
