#!/bin/sh
# 문서 sync drift 경고 훅
# - 짝꿍 한쪽만 staged면 경고 출력 + (TTY면) y/N 프롬프트
# - 매핑은 .githooks/sync-pairs.tsv 참조 (DOC_MAP.md §2와 동일)
# - block 아님 — 사용자가 N 선택하거나 짝꿍 모두 staging하면 통과
set -eu

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

# 의도적 우회 (예: 거울 짝꿍 매핑이 거칠어 false-positive일 때).
# 사용: SYNC_WARN_SKIP=1 git commit ...
if [ "${SYNC_WARN_SKIP:-0}" = "1" ]; then
  printf '[sync-warn] SYNC_WARN_SKIP=1 — 우회됨.\n'
  exit 0
fi

pairs_file=".githooks/sync-pairs.tsv"
if [ ! -f "$pairs_file" ]; then
  exit 0
fi

staged="$(git -c core.quotePath=false diff --cached --name-only)"
if [ -z "$staged" ]; then
  exit 0
fi

drift_count=0
drift_msgs=""

while IFS="$(printf '\t')" read -r left right || [ -n "$left" ]; do
  # comment·blank skip
  case "$left" in ''|'#'*) continue;; esac
  [ -z "${right:-}" ] && continue

  left_staged=0
  right_staged=0
  printf '%s\n' "$staged" | grep -Fx -- "$left" >/dev/null 2>&1 && left_staged=1
  printf '%s\n' "$staged" | grep -Fx -- "$right" >/dev/null 2>&1 && right_staged=1

  if [ "$left_staged" -eq 1 ] && [ "$right_staged" -eq 0 ]; then
    drift_count=$((drift_count + 1))
    drift_msgs="${drift_msgs}  - ${left}  →  ${right} 도 같이 sync 필요\n"
  elif [ "$right_staged" -eq 1 ] && [ "$left_staged" -eq 0 ]; then
    drift_count=$((drift_count + 1))
    drift_msgs="${drift_msgs}  - ${right}  →  ${left} 도 같이 sync 필요\n"
  fi
done < "$pairs_file"

if [ "$drift_count" -eq 0 ]; then
  exit 0
fi

printf '\n\033[33m[sync-warn] 문서 짝꿍 미동기 %d건 감지\033[0m\n' "$drift_count"
printf '%b' "$drift_msgs"
printf '(권장: 취소 → /sync-docs 실행 → 다시 commit)\n\n'

# /dev/tty 사용 가능 여부를 먼저 FD 열기로 확인 (실패하면 조용히 폴백).
has_tty=0
if { exec 3<>/dev/tty; } 2>/dev/null; then
  has_tty=1
  exec 3<&- 3>&-
fi

if [ "$has_tty" -eq 1 ]; then
  printf '그래도 이대로 계속할까요? [y/N] ' > /dev/tty
  ans=""
  read -r ans < /dev/tty || ans=""
  case "$ans" in
    y|Y|yes|YES|Yes)
      printf '계속 진행합니다.\n'
      exit 0
      ;;
    *)
      printf 'commit 중단. /sync-docs 후 다시 시도하세요.\n'
      exit 1
      ;;
  esac
fi

# non-interactive (CI·sandbox·Windows Bash 등): 경고만 출력, block 안 함
printf '(non-interactive — 경고만 출력, commit 진행)\n'
exit 0
