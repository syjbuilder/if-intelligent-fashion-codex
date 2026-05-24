#!/usr/bin/env bash
# Main Branch Guard — PreToolUse[Bash]
# Blocks `git commit` / `git push` when current branch is `main`.
# Allows chained commands that first branch off (`git checkout -b ...` / `git switch -c ...`).
#
# CRITICAL 근거: CLAUDE.md "main 브랜치에 직접 push하지 않는다. 모든 변경은 별도 브랜치에서 작업하고 PR로 검토 후 merge한다."

set -u

INPUT=$(cat)
if [ -z "$INPUT" ]; then
  exit 0
fi

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
sys.stdout.buffer.write(payload.encode("utf-8"))
sys.stdout.buffer.write(b"\n")
PY
}

COMMAND=$(
  "${PYTHON_CMD[@]}" - "$INPUT" <<'PY'
import json
import sys

try:
    payload = json.loads(sys.argv[1])
except Exception:
    sys.exit(0)

tool_input = payload.get("tool_input") or {}
cmd = tool_input.get("command") or ""
if isinstance(cmd, str):
    print(cmd)
PY
)

if [ -z "$COMMAND" ]; then
  exit 0
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

if [ "$CURRENT_BRANCH" != "main" ]; then
  exit 0
fi

# Allow if the command creates a new branch first (chained "branch then commit/push" flow).
if echo "$COMMAND" | grep -Eq 'git[[:space:]]+(checkout[[:space:]]+-b|switch[[:space:]]+-c)'; then
  exit 0
fi

# Block git commit (including --amend)
if echo "$COMMAND" | grep -Eq '(^|[^a-zA-Z_-])git[[:space:]]+commit([[:space:]]|$)'; then
  deny "MAIN BRANCH GUARD: 현재 main 브랜치입니다. main에 직접 commit할 수 없습니다 (CLAUDE.md CRITICAL). 먼저 새 브랜치로 분기하세요 — 예: 'git checkout -b feat/<작업명>' 후 다시 시도하세요. 사용자에게 '어떤 브랜치명으로 분기할까요?'라고 물어보세요."
  exit 0
fi

# Block git push (any form: push origin main, push --force, etc.)
if echo "$COMMAND" | grep -Eq '(^|[^a-zA-Z_-])git[[:space:]]+push([[:space:]]|$)'; then
  deny "MAIN BRANCH GUARD: 현재 main 브랜치입니다. main을 직접 push할 수 없습니다 (CLAUDE.md CRITICAL). 먼저 분기하고 PR을 통해 검토받은 후 merge하세요. 사용자에게 분기 절차를 안내하세요."
  exit 0
fi

exit 0
