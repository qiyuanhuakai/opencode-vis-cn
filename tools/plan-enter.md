# plan-enter

## 1. 入力定義
- 入力パラメータなし（空オブジェクト）。

## 2. 出力定義
- `title`: `Switching to plan agent`。
- `output`: plan モードへ切り替える案内文。
- `metadata`: 空オブジェクト。

## 3. JSON 例
```json
{}
```

## 4. その他特記事項
- 実装上の tool id は `plan_enter`。
- ユーザー確認（Yes/No）を行い、承認時は plan agent 用の synthetic user message を生成。
