#!/usr/bin/env bash
# TDD Guard Hook — PreToolUse[Edit|Write|NotebookEdit]
# Blocks implementation edits when no corresponding test file exists.
#
# Based on:
# https://github.com/jha0313/YOUTUBE/blob/main/harness_demo/scripts/hooks/tdd-guard.sh
#
# The source script checks .tool_input.file_path. This version also supports
# apply-patch style input where changed paths are carried in .tool_input.command
# (defensive — kept for compatibility with patch-style tool inputs).

set -u

INPUT=$(cat)

if [ -z "$INPUT" ]; then
  exit 0
fi

PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
PYTHON_CMD=()

for candidate in python3 python; do
  if command -v "$candidate" >/dev/null 2>&1 && "$candidate" -c 'import json' >/dev/null 2>&1; then
    PYTHON_CMD=("$candidate")
    break
  fi
done

if [ "${#PYTHON_CMD[@]}" -eq 0 ] && command -v py >/dev/null 2>&1 && py -3 -c 'import json' >/dev/null 2>&1; then
  PYTHON_CMD=(py -3)
fi

if [ "${#PYTHON_CMD[@]}" -eq 0 ]; then
  exit 0
fi

deny() {
  local reason="$1"
  "${PYTHON_CMD[@]}" - "$reason" <<'PY'
import json
import sys

payload = json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": sys.argv[1],
    }
}, ensure_ascii=False)
# Windows 로케일과 무관하게 항상 UTF-8 바이트로 출력한다.
sys.stdout.buffer.write(payload.encode("utf-8"))
sys.stdout.buffer.write(b"\n")
PY
}

PATHS=$(
  "${PYTHON_CMD[@]}" - "$INPUT" <<'PY'
import json
import re
import sys

try:
    payload = json.loads(sys.argv[1])
except Exception:
    sys.exit(0)

tool_input = payload.get("tool_input") or {}
items = []

for key in ("file_path", "path", "filename"):
    value = tool_input.get(key)
    if isinstance(value, str) and value:
        items.append(("update", value))

command = tool_input.get("command") or tool_input.get("cmd") or ""
if isinstance(command, str):
    for line in command.splitlines():
        match = re.match(r"^\*\*\* (Add|Update|Delete) File: (.+)$", line)
        if match:
            items.append((match.group(1).lower(), match.group(2).strip()))
            continue
        match = re.match(r"^\*\*\* Move to: (.+)$", line)
        if match:
            items.append(("update", match.group(1).strip()))

seen = set()
for action, path in items:
    key = (action, path)
    if key in seen:
        continue
    seen.add(key)
    print(f"{action}\t{path}")
PY
)

if [ -z "$PATHS" ]; then
  exit 0
fi

has_test_for() {
  local file_path="$1"
  local dir_name base_name parent_dir ext

  dir_name=$(dirname "$file_path")
  base_name=$(basename "$file_path" | sed -E 's/\.(ts|tsx|js|jsx)$//')
  parent_dir=$(dirname "$dir_name")

  for ext in ts tsx js jsx; do
    [ -f "${dir_name}/${base_name}.test.${ext}" ] && return 0
    [ -f "${dir_name}/${base_name}.spec.${ext}" ] && return 0
    [ -f "${dir_name}/__tests__/${base_name}.test.${ext}" ] && return 0
    [ -f "${dir_name}/__tests__/${base_name}.spec.${ext}" ] && return 0
    [ -f "${parent_dir}/__tests__/${base_name}.test.${ext}" ] && return 0
    [ -f "${parent_dir}/__tests__/${base_name}.spec.${ext}" ] && return 0
    [ -f "${PROJECT_ROOT}/src/__tests__/${base_name}.test.${ext}" ] && return 0
    [ -f "${PROJECT_ROOT}/src/__tests__/${base_name}.spec.${ext}" ] && return 0
  done

  return 1
}

while IFS=$'\t' read -r action file_path; do
  [ -z "$file_path" ] && continue
  [ "$action" = "delete" ] && continue

  # Windows 경로(역슬래시) 정규화 — */layout.tsx, */page.tsx, */types/* 같은
  # 슬래시 기반 면제 패턴과 dirname/basename 테스트 탐색이 cross-platform에서
  # 동작하도록 한다 (PO 승인, 부트스트랩 Phase 0).
  file_path=$(printf '%s' "$file_path" | tr '\\' '/')

  # 비ASCII(한글 "코덱스") 상위 경로가 has_test_for의 [ -f ] 탐색을 깨므로, /src/ 기준
  # 상대 경로로 바꾼다(글로브 매칭이라 인코딩 무관, 훅 cwd=repo 루트라 상대 [ -f ] OK).
  case "$file_path" in
    */src/*) file_path="src/${file_path#*/src/}" ;;
  esac

  case "$file_path" in
    *test*|*spec*|*.test.*|*.spec.*|*__tests__*) continue ;;
  esac

  case "$file_path" in
    *.json|*.css|*.scss|*.md|*.yml|*.yaml|*.env*|*.config.*|*tailwind*|*postcss*|*next.config*|*tsconfig*) continue ;;
  esac

  case "$file_path" in
    */types/*|*/types.ts|*/types.d.ts) continue ;;
  esac

  case "$file_path" in
    */layout.tsx|*/layout.ts|*/page.tsx|*/page.ts|*/loading.tsx|*/error.tsx|*/not-found.tsx|*/globals.css) continue ;;
  esac

  case "$file_path" in
    *.ts|*.tsx|*.js|*.jsx)
      if ! has_test_for "$file_path"; then
        base_name=$(basename "$file_path" | sed -E 's/\.(ts|tsx|js|jsx)$//')
        deny "TDD GUARD: '${base_name}'에 대한 테스트 파일이 존재하지 않습니다. 구현 코드를 작성하기 전에 테스트를 먼저 작성하세요. (테스트 파일 예: ${base_name}.test.ts)"
        exit 0
      fi
      ;;
  esac
done <<< "$PATHS"

exit 0
