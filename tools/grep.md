# grep

## 1. 入力定義
- `pattern`: 検索に使う正規表現。
- `path`: 検索ディレクトリ（省略時は既定ディレクトリ）。
- `include`: 対象ファイル絞り込み glob（例: `*.ts`）。

## 2. 出力定義
- `title`: `pattern`。
- `output`: 検索結果テキスト（`Found N matches` + ファイル別行番号）。
- `metadata.matches`: 返却マッチ件数。
- `metadata.truncated`: 上限で打ち切りが発生したか。

## 3. JSON 例
```json
{
  "pattern": "function\\s+\\w+",
  "path": "/home/user/project",
  "include": "*.ts"
}
```

## 4. その他特記事項
- 内部で `ripgrep` 実行（`--field-match-separator=|`）し、結果を整形。
- Exit code 2 でも出力があれば結果扱い（壊れたシンボリックリンク等を許容）。
