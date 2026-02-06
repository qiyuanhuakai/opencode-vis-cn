# todowrite

## 1. 入力定義
- `todos[]`: 更新後の todo 全体配列。
- `todos[].id`: todo ID。
- `todos[].content`: タスク説明。
- `todos[].status`: `pending` / `in_progress` / `completed` / `cancelled`。
- `todos[].priority`: `high` / `medium` / `low`。

## 2. 出力定義
- `title`: 未完了 todo 件数を含む要約。
- `output`: 反映された todo 配列の JSON 文字列。
- `metadata.todos[]`: 保存後の todo 一覧。

## 3. JSON 例
```json
{
  "todos": [
    {
      "id": "t1",
      "content": "Implement parser",
      "status": "in_progress",
      "priority": "high"
    },
    {
      "id": "t2",
      "content": "Write tests",
      "status": "pending",
      "priority": "medium"
    }
  ]
}
```

## 4. その他特記事項
- 入力は「差分」ではなく「全体状態」を渡す前提。
