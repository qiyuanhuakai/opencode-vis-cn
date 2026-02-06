# lsp

## 1. 入力定義
- `operation`: 実行する LSP 操作。
- `filePath`: 対象ファイルパス（絶対/相対）。
- `line`: 行番号（1-based）。
- `character`: 文字位置（1-based）。

## 2. 出力定義
- `title`: `{operation} {relativePath}:{line}:{character}`。
- `output`: 結果 JSON 文字列（空なら `No results found ...`）。
- `metadata.result`: LSP 生結果配列。

## 3. JSON 例
```json
{
  "operation": "goToDefinition",
  "filePath": "src/main.ts",
  "line": 12,
  "character": 8
}
```

## 4. その他特記事項
- operation は次のいずれか: `goToDefinition`, `findReferences`, `hover`, `documentSymbol`, `workspaceSymbol`, `goToImplementation`, `prepareCallHierarchy`, `incomingCalls`, `outgoingCalls`。
- 該当言語の LSP クライアントが無い場合はエラー。
