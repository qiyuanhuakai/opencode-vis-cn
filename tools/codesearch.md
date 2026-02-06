# codesearch

## 1. 入力定義
- `query`: API/SDK/ライブラリ調査用クエリ。
- `tokensNum`: 返却コンテキスト量（1000-50000、既定 5000）。

## 2. 出力定義
- `title`: `Code search: {query}`。
- `output`: 取得したコード文脈テキスト（見つからない場合は案内メッセージ）。
- `metadata`: 現状は空オブジェクト。

## 3. JSON 例
```json
{
  "query": "React useState hook examples",
  "tokensNum": 5000
}
```

## 4. その他特記事項
- 外部 MCP API（Exa）に POST し、SSE レスポンスの `data:` を解析して本文を返す。
- タイムアウト時は `Code search request timed out` エラー。
