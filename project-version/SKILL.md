---
name: project-version
description: Seal the current version, run final verification, generate CHANGELOG, and bootstrap the next version folder with inherited flow.yaml. Use when user says "new version", "version up", "seal version", "v2", "next version", or version is complete.
---

# Project Version

Seal the current version and bootstrap the next one.

## Step 1: Pre-flight

Read `.claude-project/state.json` and `.claude-project/flow.yaml`.

Tell user: "This will seal {current_version} and create {next_version}. Current state: {summary of completed/total features}."

## Step 2: Final verification

Run a full verification pass (same logic as `/project-verify`):
- Verify all implemented features.
- Record results.
- If any feature is broken, ask: "F{ID} is still broken. Seal anyway? (y/n)"

## Step 3: Generate CHANGELOG

Write `{current_version}/CHANGELOG.md`:

```markdown
# {version} Changelog

**Sealed**: {date}
**Features**: {complete}/{total} verified

## Completed
- F001 — Login
- F002 — Dashboard

## Known issues
- F003 — Create project (broken: form validation error)

## Migration notes
- {any notes for the next version}
```

## Step 4: Bootstrap next version

Create `{next_version}/` folder (e.g., v1 → v2). Write:

**PLAN.md** — skeleton with carried-over items:
```markdown
# {Project Name} — {next_version} Plan

## Carried over from {current_version}
- F003 — Create project (broken)
```

**TASKS.md** — only carried-over items as unchecked tasks.

**FLOW.md** — rendered from the full flow.yaml.

**CHANGELOG.md** — empty, ready for this version's changes.

## Step 5: Inherit flow.yaml

The flow.yaml at `.claude-project/flow.yaml` keeps ALL features across versions. Do NOT delete v1 features.

Update statuses:
- Features that were `verified` or `implemented` in v1 → stay as-is (they are the baseline)
- Features that were `broken` or `planned` → stay as-is (carried over)

## Step 6: Update state.json

```json
{
  "current_version": "{next_version}",
  "last_verify": null,
  "last_verify_result": null,
  "file_snapshots": {}
}
```

Reset verify state and snapshots for the new version.

## Step 7: Report

```
=== {current_version} sealed, {next_version} ready ===

v1/CHANGELOG.md — 2 completed, 1 carried over
v2/PLAN.md — skeleton with carried-over items
v2/TASKS.md — carried-over tasks
v2/FLOW.md — full feature map (4 features)

Next: Run /project-init to plan new features for {next_version}.
```
