# read

## 1. 入力定義
- `filePath`: 読み込むファイルパス。
- `offset`: 読み開始行（0-based、省略可）。
- `limit`: 読み込み行数（省略時 2000）。

## 2. 出力定義
- `title`: 対象ファイルのワークツリー相対パス。
- `output`: `<file>` タグ内に行番号付き本文を含むテキスト。
- `metadata.preview`: 先頭プレビュー文字列。
- `metadata.truncated`: 行数/バイト制限で切り詰められたか。
- `metadata.loaded[]`: 追加 instruction が読み込まれたファイル一覧（ある場合）。
- `attachments[]`: 画像/PDF の場合に付与される file part。

## 3. JSON 例
```json
{
  "filePath": "/home/user/project/src/main.ts",
  "offset": 0,
  "limit": 200
}
```

## 4. その他特記事項
- 画像/PDF はテキスト本文ではなく添付として返す。
- 1 行 2000 文字、総量 50KB の上限あり。
