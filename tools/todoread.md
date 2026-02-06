# todoread

## 1. 入力定義
- 入力パラメータなし（空オブジェクト）。

## 2. 出力定義
- `title`: 未完了 todo 件数を含む要約。
- `output`: todo 配列の JSON 文字列。
- `metadata.todos[]`: todo 一覧。
- `metadata.todos[].id`: todo ID。
- `metadata.todos[].content`: 内容。
- `metadata.todos[].status`: `pending` / `in_progress` / `completed` / `cancelled`。
- `metadata.todos[].priority`: `high` / `medium` / `low`。

## 3. JSON 例
```json
{}
```

## 4. その他特記事項
- 主用途はセッション内 todo 状態の再取得。
