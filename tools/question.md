# question

## 1. 入力定義
- `questions[]`: 質問配列。
- `questions[].question`: 質問本文。
- `questions[].header`: 短い見出し。
- `questions[].options[]`: 選択肢配列。
- `questions[].options[].label`: 選択肢ラベル。
- `questions[].options[].description`: 選択肢説明。
- `questions[].multiple`: 複数選択可否（省略可）。

## 2. 出力定義
- `title`: `Asked N question(s)`。
- `output`: ユーザー回答を含む案内文。
- `metadata.answers[][]`: 各質問に対する回答ラベル配列。

## 3. JSON 例
```json
{
  "questions": [
    {
      "question": "どの方式で進めますか？",
      "header": "方針",
      "options": [
        { "label": "A案", "description": "シンプルに実装" },
        { "label": "B案", "description": "拡張性重視" }
      ]
    }
  ]
}
```

## 4. その他特記事項
- `custom` フィールドはツール内部で扱うため、入力スキーマ側では省かれている。
