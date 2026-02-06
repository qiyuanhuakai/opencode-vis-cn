# batch

## 1. 入力定義
- `tool_calls[]`: 並列実行するツール呼び出し配列（最大 25 件）。
- `tool_calls[].tool`: ツール名。
- `tool_calls[].parameters`: そのツールに渡すパラメータ。

## 2. 出力定義
- `title`: 実行成功件数を含む要約。
- `output`: 成功/失敗件数のメッセージ。
- `attachments[]`: 成功したサブツールの添付を集約。
- `metadata.totalCalls`: 実行対象総数。
- `metadata.successful`: 成功件数。
- `metadata.failed`: 失敗件数。
- `metadata.tools[]`: 入力で指定されたツール名一覧。
- `metadata.details[].tool`: ツール名。
- `metadata.details[].success`: 成否。

## 3. JSON 例
```json
{
  "tool_calls": [
    {
      "tool": "glob",
      "parameters": {
        "pattern": "src/**/*.ts"
      }
    },
    {
      "tool": "grep",
      "parameters": {
        "pattern": "TODO",
        "path": "/home/user/project"
      }
    }
  ]
}
```

## 4. その他特記事項
- `batch` 自身のネスト呼び出しは禁止。
- 各サブツールの `running/completed/error` は個別の tool part として更新される。
