#!/bin/bash
# PostToolUse hook: Edit/Write 후 해당 파일을 Prettier로 자동 포맷팅한다.
# .claude/ 하위 파일과 포맷팅 대상이 아닌 확장자는 제외한다.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

if [[ "$FILE_PATH" == *"/.claude/"* ]]; then
  exit 0
fi

case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.mjs|*.cjs|*.json|*.astro|*.svelte|*.css|*.html)
    cd "$CLAUDE_PROJECT_DIR" && npx prettier --write "$FILE_PATH" 2>/dev/null
    ;;
esac

exit 0
