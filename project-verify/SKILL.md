---
name: project-verify
description: Verify all features against flow.yaml verification criteria. Checks each feature's implementation, reports pass/fail, and updates feature statuses. Use when user says "verify", "check features", "run verification", after completing a feature, or before version upgrades.
---

# Project Verify

Verify every feature in `.claude-project/flow.yaml` against its verification criteria.

## Step 1: Load context

Read `.claude-project/flow.yaml` and `.claude-project/state.json`. If flow.yaml is missing, say: "No flow.yaml found. Run `/project-init` first."

## Step 2: Verify each feature

For each feature in flow.yaml, starting from those with no dependencies (F001, then dependents):

1. Display: **"Verifying F{ID}: {name}"**
2. Show the verification criteria: **"Expected: {verification}"**
3. Check the implementation:
   - Read the relevant source files (cross-reference PROJECT_STRUCTURE.md to find them)
   - Trace the code logic against the verification criteria
   - If tests exist, note coverage
4. Ask user: **"Does F{ID} pass this check? (y/n/skip)"**
   - If `y` → mark `status: verified`
   - If `n` → mark `status: broken`, note the issue
   - If `skip` → leave status as-is

## Step 3: Dependency-aware ordering

Verify features in dependency order. If F003 depends on F001 and F002, verify F001 and F002 first. If a dependency is broken, flag all dependents as "at risk" before verifying them.

## Step 4: Update flow.yaml

Update each feature's status field. Write back to `.claude-project/flow.yaml`.

## Step 5: Update state.json

Set `last_verify` to current timestamp, `last_verify_result` to:
- `pass` — all implemented features verified OK
- `partial` — some features broken or skipped
- `fail` — critical features broken

## Step 6: Report

Output a summary table:

```
=== Verification Report — {version} ===

| ID | Feature | Status | Result |
|----|---------|--------|--------|
| F001 | Login | implemented | ✓ pass |
| F002 | Dashboard | implemented | ✗ broken — data not loading |
| F003 | Create project | planned | — skipped |

Pass: 1  Broken: 1  Skipped: 1
```

If any feature is broken, suggest: "Run `/project-fix` to address broken features."
