# edit

## 1. 入力定義
- `filePath`: 編集対象ファイルの絶対パス（相対も許容されるが内部で解決）。
- `oldString`: 置換前文字列。
- `newString`: 置換後文字列（`oldString` と異なる必要あり）。
- `replaceAll`: 全一致置換するか（省略時 false）。

## 2. 出力定義
- `title`: 編集したファイルのワークツリー相対パス。
- `output`: 実行結果テキスト（必要に応じ LSP エラー含む）。
- `metadata.diff`: 編集差分。
- `metadata.filediff.file`: ファイルパス。
- `metadata.filediff.before`: 変更前内容。
- `metadata.filediff.after`: 変更後内容。
- `metadata.filediff.additions`: 追加行数。
- `metadata.filediff.deletions`: 削除行数。
- `metadata.diagnostics`: LSP 診断情報。

## 3. JSON 例
```json
{
  "filePath": "/home/user/project/src/app.ts",
  "oldString": "console.log('old')",
  "newString": "console.log('new')",
  "replaceAll": false
}
```

## 4. その他特記事項
- 厳密一致だけでなく、空白/インデント/エスケープ差異を吸収する複数リプレーサを順番適用。
- 複数一致時はエラーになり、より長い文脈での再試行を促す。
