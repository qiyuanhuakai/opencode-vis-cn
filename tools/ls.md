# ls

## 1. 入力定義
- `path`: 一覧表示するディレクトリ（省略可）。
- `ignore[]`: 追加で除外したい glob パターン。

## 2. 出力定義
- `title`: 対象ディレクトリ（ワークツリー相対）。
- `output`: ツリー形式のディレクトリ/ファイル一覧テキスト。
- `metadata.count`: 収集したファイル数。
- `metadata.truncated`: 上限で打ち切ったか。

## 3. JSON 例
```json
{
  "path": "/home/user/project",
  "ignore": ["dist/**", "coverage/**"]
}
```

## 4. その他特記事項
- 実装上の tool id は `list`。
- 既定で `node_modules`, `.git`, `dist`, `build` など多数の除外パターンが入る。
