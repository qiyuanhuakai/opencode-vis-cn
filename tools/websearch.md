# websearch

## 1. 入力定義
- `query`: 検索クエリ。
- `numResults`: 返却件数（省略時 8）。
- `livecrawl`: `fallback` / `preferred`（省略時 `fallback`）。
- `type`: `auto` / `fast` / `deep`（省略時 `auto`）。
- `contextMaxCharacters`: LLM 向けコンテキスト最大文字数（省略可）。

## 2. 出力定義
- `title`: `Web search: {query}`。
- `output`: 検索結果テキスト（見つからない場合は案内文）。
- `metadata`: 現状は空オブジェクト。

## 3. JSON 例
```json
{
  "query": "TypeScript project references",
  "numResults": 5,
  "type": "auto",
  "livecrawl": "fallback"
}
```

## 4. その他特記事項
- 外部 MCP API（Exa）へ POST し、SSE の `data:` 行から本文を抽出。
- タイムアウト時は `Search request timed out` エラー。
