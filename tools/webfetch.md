# webfetch

## 1. 入力定義
- `url`: 取得対象 URL（`http://` または `https://`）。
- `format`: 返却形式。`text` / `markdown` / `html`（既定 `markdown`）。
- `timeout`: タイムアウト秒（最大 120、省略可）。

## 2. 出力定義
- `title`: `{url} ({content-type})`。
- `output`: 取得コンテンツ（format 指定に応じて変換済み）。
- `metadata`: 現状は空オブジェクト。

## 3. JSON 例
```json
{
  "url": "https://example.com",
  "format": "markdown",
  "timeout": 30
}
```

## 4. その他特記事項
- HTML を `markdown` 指定で取得した場合は Turndown で変換。
- 応答サイズは 5MB 上限。
- Cloudflare challenge(403)時は User-Agent を変えて再試行する実装がある。
