# glob

## 1. 入力定義
- `pattern`: 検索対象 glob パターン。
- `path`: 検索開始ディレクトリ（省略可）。

## 2. 出力定義
- `title`: 実際に検索したディレクトリ（ワークツリー相対）。
- `output`: マッチしたファイル絶対パスの改行リスト。
- `metadata.count`: 返却件数。
- `metadata.truncated`: 件数上限で打ち切られたか。

## 3. JSON 例
```json
{
  "pattern": "src/**/*.ts",
  "path": "/home/user/project"
}
```

## 4. その他特記事項
- 最大 100 件まで返却し、超過時は末尾に truncated 注意書き。
