# task

## 1. 入力定義
- `description`: サブタスク短文説明（3-5語目安）。
- `prompt`: サブエージェントに渡す実行指示。
- `subagent_type`: サブエージェント種別。
- `task_id`: 既存サブタスク継続時のセッション ID（省略可）。
- `command`: この task を引き起こしたコマンド（省略可）。

## 2. 出力定義
- `title`: `description`。
- `output`: `task_id` と `<task_result>` を含むテキスト。
- `metadata.sessionId`: サブエージェントセッション ID。
- `metadata.model.providerID`: 実行モデル provider。
- `metadata.model.modelID`: 実行モデル ID。
- `metadata.summary[]`: サブセッションで発生した tool 実行要約。
- `metadata.summary[].id`: tool part ID。
- `metadata.summary[].tool`: ツール名。
- `metadata.summary[].state.status`: 実行状態。
- `metadata.summary[].state.title`: 完了時タイトル（ある場合）。

## 3. JSON 例
```json
{
  "description": "Explore API handlers",
  "prompt": "Search codebase and summarize all API routes",
  "subagent_type": "explore"
}
```

## 4. その他特記事項
- `task_id` を指定すると既存サブセッションを再利用。
- サブエージェント側では `todowrite`/`todoread` は禁止される。
