#!/usr/bin/env bash
# Secret Guard — PreToolUse[Write|Edit|NotebookEdit]
# Scans content being written for secret patterns (API keys, JWTs, tokens, DB URLs).
# Skips obvious placeholders (low entropy, hint words like "your-key-here").
#
# CRITICAL 근거: CLAUDE.md "시크릿(.env, API key, OAuth secret, 결제 secret, DB 접속 정보)은 절대 커밋하지 않는다."

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

"${PYTHON_CMD[@]}" - "$INPUT" <<'PY'
import json
import re
import sys

try:
    payload = json.loads(sys.argv[1])
except Exception:
    sys.exit(0)

tool_input = payload.get("tool_input") or {}
file_path = tool_input.get("file_path") or ""
contents = []

for key in ("content", "new_string", "new_source"):
    value = tool_input.get(key)
    if isinstance(value, str) and value:
        contents.append(value)

edits = tool_input.get("edits")
if isinstance(edits, list):
    for e in edits:
        if isinstance(e, dict):
            v = e.get("new_string")
            if isinstance(v, str) and v:
                contents.append(v)

if not contents:
    sys.exit(0)

joined = "\n".join(contents)

SECRET_PATTERNS = [
    ("OpenAI API 키", re.compile(r"sk-(?:proj-)?[A-Za-z0-9_-]{32,}")),
    ("JWT 토큰 (Supabase/OAuth)", re.compile(r"eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}")),
    ("AWS access key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("GitHub 토큰", re.compile(r"\bgh[pousr]_[A-Za-z0-9]{36,}\b")),
    ("Stripe 키", re.compile(r"\b(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{20,}\b")),
    ("postgresql URL (비밀번호 포함)", re.compile(r"postgres(?:ql)?://[^:\s/]+:[^@\s]{8,}@")),
]

GENERIC_ASSIGN = re.compile(
    r"(?im)^\s*(?:export\s+)?([A-Z][A-Z0-9_]*(?:_KEY|_SECRET|_TOKEN|_PASSWORD|_PASS|_PWD))\s*[:=]\s*[\"']?([A-Za-z0-9+/_=\-\.]{24,})[\"']?\s*$"
)

PLACEHOLDER_HINTS = re.compile(
    r"(?i)(your[-_ ]?(?:api[-_ ]?)?(?:key|token|secret)|placeholder|change[-_ ]?me|<[^>]+>|xxx+|\.\.\.|"
    r"insert[-_ ]?here|put[-_ ]?your|paste[-_ ]?here|dummy|fake|sample|TODO|FIXME|example|here$)"
)

def is_placeholder(value: str) -> bool:
    # 6+ repeated characters in a row → likely fake/test
    if re.search(r"(.)\1{5,}", value):
        return True
    # Real keys mix digit + upper + lower. Missing 2+ → likely placeholder.
    has_digit = any(c.isdigit() for c in value)
    has_upper = any(c.isupper() for c in value)
    has_lower = any(c.islower() for c in value)
    if sum([has_digit, has_upper, has_lower]) < 2:
        return True
    if PLACEHOLDER_HINTS.search(value):
        return True
    return False

def redact(s: str, head: int = 6, tail: int = 4) -> str:
    if len(s) <= head + tail:
        return s
    return f"{s[:head]}...{s[-tail:]}"

findings = []

for name, pattern in SECRET_PATTERNS:
    for m in pattern.finditer(joined):
        val = m.group(0)
        if is_placeholder(val):
            continue
        findings.append((name, redact(val)))

for m in GENERIC_ASSIGN.finditer(joined):
    var_name, value = m.group(1), m.group(2)
    if is_placeholder(value):
        continue
    findings.append((f"의심 시크릿 ({var_name})", redact(value)))

if not findings:
    sys.exit(0)

seen = set()
unique = []
for name, val in findings:
    key = (name, val)
    if key in seen:
        continue
    seen.add(key)
    unique.append((name, val))

lines = ["SECRET GUARD: 작성하려는 콘텐츠에 시크릿으로 보이는 값이 감지되었습니다."]
if file_path:
    lines.append(f"파일: {file_path}")
lines.append("감지된 항목:")
for name, val in unique[:5]:
    lines.append(f"  - {name}: {val}")
lines.append("")
lines.append("→ 시크릿은 파일에 직접 쓰지 않습니다. .env 파일(gitignore됨)에 넣고 환경변수로 읽도록 코드를 바꾸세요.")
lines.append("→ .env.example에는 'OPENAI_API_KEY=your-key-here' 같은 플레이스홀더만 둡니다.")
lines.append("→ 사용자에게 어떻게 처리할지 확인 후 다시 시도하세요.")

reason = "\n".join(lines)

output = json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }
}, ensure_ascii=False)
sys.stdout.buffer.write(output.encode("utf-8"))
sys.stdout.buffer.write(b"\n")
PY

exit 0
