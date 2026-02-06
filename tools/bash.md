# bash

## 1. 入力定義
- `command`: 実行するシェルコマンド全文。
- `timeout`: タイムアウト（ミリ秒、省略可）。
- `workdir`: 実行ディレクトリ（省略時はインスタンスの既定ディレクトリ）。
- `description`: コマンドの短い説明（5-10語程度）。

## 2. 出力定義
- `title`: `description`。
- `output`: 標準出力/標準エラーを連結したテキスト。
- `metadata.output`: 出力の先頭（長すぎる場合は切り詰め）。
- `metadata.exit`: プロセス終了コード。
- `metadata.description`: 入力の `description`。

## 3. JSON 例
```json
{
  "command": "pytest tests",
  "workdir": "/home/user/project",
  "timeout": 120000,
  "description": "Run Python test suite"
}
```

## 4. その他特記事項
- コマンドは tree-sitter-bash で解析され、必要に応じて権限確認が走る。
- タイムアウト/中断時は `output` に `<bash_metadata>` が追記される。
