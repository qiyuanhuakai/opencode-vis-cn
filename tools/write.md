# write

## 1. 入力定義
- `content`: 書き込む全文。
- `filePath`: 書き込み先ファイルパス（絶対推奨、相対も内部解決）。

## 2. 出力定義
- `title`: 対象ファイルのワークツリー相対パス。
- `output`: 実行結果テキスト（必要に応じ LSP エラー含む）。
- `metadata.filepath`: 書き込み先絶対パス。
- `metadata.exists`: 既存ファイルだったか。
- `metadata.diagnostics`: LSP 診断情報。

## 3. JSON 例
```json
{
  "filePath": "/home/user/project/src/config.ts",
  "content": "export const enabled = true\n"
}
```

## 4. その他特記事項
- 実装上は permission `edit` として確認される。
- 書き込み後に FileWatcher/LSP の更新と診断収集を行う。
