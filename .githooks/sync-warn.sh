#!/bin/sh
# 문서 sync drift 경고 훅
# - 짝꿍 한쪽만 staged면 경고 출력 (기본 = 경고만, 차단 아님)
# - 매핑은 .githooks/sync-pairs.tsv 참조 (DOC_MAP.md §2와 동일)
# - hub(1:N) 한글 원본(예: TRD)은 역방향 경고를 생략한다 (false-positive 방지)
# - 강제 차단은 SYNC_WARN_STRICT=1일 때만. 우회는 SYNC_WARN_SKIP=1
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
tab="$(printf '\t')"

while IFS="$(printf '\t')" read -r left right || [ -n "$left" ]; do
  # comment·blank skip
  case "$left" in ''|'#'*) continue;; esac
  [ -z "${right:-}" ] && continue

  left_staged=0
  right_staged=0
  printf '%s\n' "$staged" | grep -Fx -- "$left" >/dev/null 2>&1 && left_staged=1
  printf '%s\n' "$staged" | grep -Fx -- "$right" >/dev/null 2>&1 && right_staged=1

  if [ "$left_staged" -eq 1 ] && [ "$right_staged" -eq 0 ]; then
    # 정방향: 영문 정본만 staged → 항상 경고 (진짜 drift)
    drift_count=$((drift_count + 1))
    drift_msgs="${drift_msgs}  - ${left}  →  ${right} 도 같이 sync 필요\n"
  elif [ "$right_staged" -eq 1 ] && [ "$left_staged" -eq 0 ]; then
    # 역방향: 한글 원본만 staged. 이 원본이 여러 영문 정본의 공통 출처(hub)면
    # 어느 slice가 바뀌었는지 알 수 없으므로 mirror 전부를 요구하지 않고 생략.
    right_count=$(grep -cF -- "${tab}${right}" "$pairs_file" 2>/dev/null || true)
    [ "${right_count:-0}" -gt 1 ] && continue
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

# 커밋은 대부분 Claude Code(비대화형)가 대행 → y/N 프롬프트는 두지 않는다.
# (이전엔 /dev/tty가 '열리지만' read가 EOF → 무고하게 exit 1로 하드블록되는 버그가 있었다.)
# 기본 = 경고만 출력하고 통과. 강제 차단은 명시 옵트인(SYNC_WARN_STRICT=1)일 때만.
if [ "${SYNC_WARN_STRICT:-0}" = "1" ]; then
  printf 'commit 중단 (SYNC_WARN_STRICT=1). /sync-docs 후 재시도하거나 SYNC_WARN_SKIP=1로 우회.\n'
  exit 1
fi
printf '(경고만 — commit은 진행됩니다. 강제 차단하려면 SYNC_WARN_STRICT=1)\n'
exit 0
