# apply_patch

## 1. 入力定義
- `patchText`: 適用するパッチ全文（`*** Begin Patch` ... `*** End Patch` 形式）。

## 2. 出力定義
- `title`: 実行結果の要約文。
- `output`: 更新ファイル一覧や LSP エラーを含む実行結果テキスト。
- `metadata.diff`: 全ファイル分の unified diff 文字列。
- `metadata.files[].filePath`: 変更対象の絶対パス。
- `metadata.files[].relativePath`: ワークツリー相対パス。
- `metadata.files[].type`: `add` / `update` / `move` / `delete`。
- `metadata.files[].diff`: そのファイルの diff。
- `metadata.files[].before`: 変更前コンテンツ。
- `metadata.files[].after`: 変更後コンテンツ。
- `metadata.files[].additions`: 追加行数。
- `metadata.files[].deletions`: 削除行数。
- `metadata.files[].movePath`: 移動先パス（move のとき）。
- `metadata.diagnostics`: LSP 診断情報。

## 3. JSON 例
```json
{
  "patchText": "*** Begin Patch\n*** Update File: src/app.ts\n@@\n-console.log('old')\n+console.log('new')\n*** End Patch"
}
```

## 4. その他特記事項
- パッチは内部パーサで検証され、hunk が無い場合や形式不正は失敗。
- 実行前に編集権限確認が入り、実行後に FileWatcher/LSP 更新まで行う。
