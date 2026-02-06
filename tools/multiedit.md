# multiedit

## 1. 入力定義
- `filePath`: 編集対象ファイル。
- `edits[]`: 順次適用する編集配列。
- `edits[].filePath`: 定義上は存在（実行時は主に `filePath` が使われる）。
- `edits[].oldString`: 置換前文字列。
- `edits[].newString`: 置換後文字列。
- `edits[].replaceAll`: 全一致置換フラグ（省略可）。

## 2. 出力定義
- `title`: 編集対象の相対パス。
- `output`: 最後に適用した `edit` の出力テキスト。
- `metadata.results[]`: 各 `edit` 実行の metadata 配列。

## 3. JSON 例
```json
{
  "filePath": "/home/user/project/src/app.ts",
  "edits": [
    {
      "filePath": "/home/user/project/src/app.ts",
      "oldString": "foo",
      "newString": "bar"
    },
    {
      "filePath": "/home/user/project/src/app.ts",
      "oldString": "baz",
      "newString": "qux",
      "replaceAll": true
    }
  ]
}
```

## 4. その他特記事項
- 内部的に `edit` を順番に呼び出すラッパー。
- 前段編集の結果が後段編集の入力になる。
