---
name: harness-review
description: Review workflow for Harness framework project changes. Use when the user requests review of current changes, a migration, or implementation work against CLAUDE.md CRITICAL rules, docs/ARCHITECTURE.md structure, docs/ADR.md technology decisions, design-layer compliance (docs/UI_GUIDE.md / docs/DATA_MODEL.md / docs/API_CONTRACTS.md / docs/AI_PIPELINE.md as applicable), test coverage, and buildability.
---

# Harness Review

## Overview

Use this workflow to review a Harness framework project for architecture drift, ADR violations, missing tests, CRITICAL rule violations, and build/test failures.

## Workflow

1. Read the governing documents first.
   Start with `CLAUDE.md` and `docs/DOC_MAP.md` (governance index). Baseline reads (every review):

   - `CLAUDE.md`
   - `docs/PRD.md`
   - `docs/ARCHITECTURE.md`
   - `docs/ADR.md`
   - `docs/UI_GUIDE.md`

   When the change touches the area, also read:

   - DB schema or RLS: `docs/DATA_MODEL.md`
   - API endpoints: `docs/API_CONTRACTS.md`
   - AI look generation or product matching: `docs/AI_PIPELINE.md`

2. Inspect the current changes.
   Use `git status --short`, `git diff --stat`, and focused diffs for changed files. Include untracked files that are part of the requested work.

3. Validate the checklist:
   - Architecture compliance: does the change follow `docs/ARCHITECTURE.md`?
   - Technology compliance: does the change stay within `docs/ADR.md`?
   - UI/Design compliance: if the change touches UI, does it follow `docs/UI_GUIDE.md` (no AI slop anti-patterns)?
   - Data/API/AI contracts: if the change touches that area, does it match `docs/DATA_MODEL.md` / `docs/API_CONTRACTS.md` / `docs/AI_PIPELINE.md`?
   - Tests: are new or changed behaviors covered by tests?
   - CRITICAL rules: does the change obey all CRITICAL rules in `CLAUDE.md`?
   - Buildability: do the relevant build, lint, or test commands pass?

4. Run verification commands when feasible.
   Prefer the commands listed in `CLAUDE.md`. If a command cannot be run because dependencies, credentials, or external services are unavailable, state that explicitly in the review.

5. Report actionable findings first.
   Prioritize concrete bugs, regressions, missing tests, and rule violations. Include file and line references where available. If there are no findings, say so clearly and mention any verification that could not be completed.

## Output Format

Include this checklist table after the findings:

| Item | Result | Notes |
|------|--------|-------|
| Architecture compliance | OK/FAIL/N-A | {detail} |
| Technology compliance | OK/FAIL/N-A | {detail} |
| UI/Design compliance | OK/FAIL/N-A | {detail} |
| Data/API/AI contracts | OK/FAIL/N-A | {detail} |
| Tests | OK/FAIL/N-A | {detail} |
| CRITICAL rules | OK/FAIL/N-A | {detail} |
| Buildability | OK/FAIL/N-A | {detail} |

When a violation exists, provide a concrete fix direction. Keep summary secondary to findings.
