---
name: project-status
description: Display project progress overview: feature completion, task status, verification state, and files changed since last verification. Detects if verification is needed. Use when user says "status", "progress", "how's the project", "project status", or "dashboard".
---

# Project Status

Quick health check and progress overview. This is also where "unverified changes" detection lives — no separate reminder system needed.

## Step 1: Load all data

Read:
1. `.claude-project/state.json`
2. `.claude-project/flow.yaml`
3. `{version}/TASKS.md`
4. `{version}/PROJECT_STRUCTURE.md`

## Step 2: Compute metrics

From flow.yaml:
- Total features, implemented, verified, broken, planned
- Dependency health: any broken feature that blocks others?

From TASKS.md:
- Total tasks, checked, unchecked
- Per-feature task completion

## Step 3: Detect changes since last verify

Compare `file_snapshots` in state.json against current file mtimes:
- List files changed since `last_verify`.
- Map changed files to features via PROJECT_STRUCTURE.md.
- Count: "N features have changed code since last verification."

If no `file_snapshots` exist yet, note: "Run `/project-structure` to enable change tracking."

## Step 4: Display

```
=== {Project Name} — {version} Status ===

Features:  2 implemented, 1 broken, 0 verified, 1 planned (4 total)
Tasks:     8/12 done (67%)
Last verify: 2026-05-14 10:30 — partial

▲ Unverified changes:
  src/pages/Dashboard.tsx → F002 (Dashboard)
  src/utils/api.ts       → F001, F002 (shared)

  Run /project-verify to validate.

Broken: F003 (Create project) — Run /project-fix to repair.
```

## Step 5: Flag thresholds

- If >3 files changed since last verify: strong recommendation to verify.
- If a broken feature has dependents: escalate ("F002 is broken — F003, F004, F005 depend on it").
- If no verify ever run: "This project has never been verified. Run `/project-verify`."

## Step 6: Update snapshots

Update `file_snapshots` in state.json to current mtimes, so future status calls can detect new changes. Don't wait for user to ask — update now.
