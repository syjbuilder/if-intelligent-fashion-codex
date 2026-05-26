---
name: harness-framework
description: Harness framework planning and execution workflow for projects that use CLAUDE.md, docs/ architecture notes, phases/index.json, phases/{task}/index.json, and stepN.md files. Use when the user requests Harness framework work — inspecting project intent, designing multi-step implementation plans, creating phase/step files, or running scripts/execute.py for a task.
---

# Harness Framework

## Overview

Use this workflow to turn a product or implementation request into Harness phase metadata and self-contained step files, then execute those steps through `scripts/execute.py` when requested.

## Workflow

1. Explore the repository before planning or editing.
   Start from `CLAUDE.md` and `docs/DOC_MAP.md` (governance index). Read the baseline docs every time: `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`, `docs/UI_GUIDE.md`. Read design-layer docs when the task touches that area: `docs/DATA_MODEL.md` (DB schema or RLS), `docs/API_CONTRACTS.md` (API endpoints), `docs/AI_PIPELINE.md` (look generation or product matching). Consult `docs/WORKFLOW.md` for daily-process scenarios. Use subagents only when the user explicitly asks for delegated or parallel agent work.

2. Discuss unresolved implementation decisions.
   If requirements, boundaries, architecture choices, or verification commands are unclear, present the concrete decision points to the user before creating step files.

3. Design steps when the user asks for an implementation plan.
   Split the task into small, self-contained steps. Each step must touch one layer or module where possible. If a change requires multiple modules, split it into separate steps unless doing so would make the work incoherent.

4. Create phase files when the user approves the plan or directly asks for files.
   Add or update `phases/index.json`, create `phases/{task-name}/index.json`, and create one `phases/{task-name}/step{N}.md` file per step.

5. Execute only when requested.
   Run `python scripts/execute.py {task-name}` for sequential execution, or `python scripts/execute.py {task-name} --push` when the user explicitly wants push behavior.

## Step Design Rules

- Keep scope minimal: one step should focus on one layer or module.
- Make every step self-contained: do not rely on earlier chat context. Put required docs, prior step outputs, file paths, decisions, and constraints inside the step file.
- Force context gathering: list the files the next Claude session must read before editing.
- Give signature-level guidance: specify interfaces, functions, classes, and invariants, but leave implementation details to the executing agent.
- Use executable acceptance criteria: write real commands such as `npm run build` and `npm test`, not abstract requirements.
- Make warnings specific: write "Do not do X. Reason: Y."
- Use kebab-case step names such as `project-setup`, `core-types`, or `api-layer`.

## File Formats

### `phases/index.json`

Create the top-level phase index if it does not exist. If it already exists, append a new item to `phases`.

```json
{
  "phases": [
    {
      "dir": "0-mvp",
      "status": "pending"
    }
  ]
}
```

- `dir`: task directory name.
- `status`: initial value is `pending`; later values are `completed`, `error`, or `blocked`.
- Do not create timestamp fields. `execute.py` owns `completed_at`, `failed_at`, and `blocked_at`.

### `phases/{task-name}/index.json`

```json
{
  "project": "<project-name>",
  "phase": "<task-name>",
  "steps": [
    { "step": 0, "name": "project-setup", "status": "pending" },
    { "step": 1, "name": "core-types", "status": "pending" },
    { "step": 2, "name": "api-layer", "status": "pending" }
  ]
}
```

- `project`: use the project name from `CLAUDE.md` when available.
- `phase`: must match the task directory name.
- `steps[].step`: zero-based sequence number.
- `steps[].name`: kebab-case slug.
- `steps[].status`: initial value is `pending`.
- Do not create `created_at` or `started_at`; `execute.py` owns them.

### `phases/{task-name}/step{N}.md`

Use this structure for each step:

````markdown
# Step {N}: {name}

## Files To Read

Read these files first and understand the architecture and design intent.

Baseline (every step):

- `CLAUDE.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `docs/UI_GUIDE.md`

When relevant to this step:

- DB schema or RLS work: `docs/DATA_MODEL.md`
- API endpoint add/change: `docs/API_CONTRACTS.md`
- AI look generation or product matching: `docs/AI_PIPELINE.md`

Navigation: `docs/DOC_MAP.md`

- {files created or modified by earlier steps}

## Task

{Concrete implementation instructions. Include file paths, function/class signatures, interface-level snippets, and required invariants.}

## Acceptance Criteria

```bash
npm run build
npm test
```

## Verification

1. Run the acceptance criteria commands.
2. Check the architecture checklist:
   - Does the work follow `docs/ARCHITECTURE.md`?
   - Does the work stay inside the stack and decisions in `docs/ADR.md`?
   - Does the work respect CRITICAL rules in `CLAUDE.md`?
   - If UI work: does it follow `docs/UI_GUIDE.md` (no AI slop anti-pattern violations)?
   - If DB / API / AI-pipeline work: does it match `docs/DATA_MODEL.md` / `docs/API_CONTRACTS.md` / `docs/AI_PIPELINE.md` respectively?
3. Update `phases/{task-name}/index.json` for this step:
   - Success: set `status` to `completed` and add a one-line `summary`.
   - Failure after three fix attempts: set `status` to `error` and add `error_message`.
   - User action needed: set `status` to `blocked`, add `blocked_reason`, and stop.

## Prohibited

- {Do not do X. Reason: Y.}
- Do not break existing tests.
````

The `summary` must be useful to later steps: mention changed files, generated artifacts, and key decisions.

## Execution Notes

`scripts/execute.py` is responsible for creating/checking out `feat-{task-name}`, injecting guardrails from `CLAUDE.md` and `docs/*.md`, passing completed step summaries forward, retrying failed work up to three times, separating code and metadata commits, and writing timestamps.

For recovery, set the failed or blocked step back to `pending`, remove `error_message` or `blocked_reason`, address the underlying cause, then rerun `scripts/execute.py`.
