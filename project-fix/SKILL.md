---
name: project-fix
description: Fix a reported issue using flow.yaml and PROJECT_STRUCTURE.md for context. Locates the affected module, analyzes root cause, fixes only relevant code, then auto-verifies the fixed feature and all downstream dependencies. Use when user reports a bug, says "fix this", "something broke", or describes unexpected behavior.
---

# Project Fix

Fix reported issues with full project context. Never "patch blindly" — always trace through the feature map first.

## Step 1: Understand the problem

Ask the user to describe the issue:
- What did you do?
- What happened vs. what did you expect?
- Which feature is affected?

## Step 2: Load context

Read these files:
1. `.claude-project/flow.yaml` — feature map and dependencies
2. `{version}/PROJECT_STRUCTURE.md` — file-to-feature mapping
3. `.claude-project/state.json` — current version

## Step 3: Locate the affected module

Cross-reference the reported symptom with flow.yaml to identify the feature ID (e.g., F002). Then use PROJECT_STRUCTURE.md to find the exact files involved.

Display to user: **"This affects F{ID}: {name}. Files: {file list}. Dependents: {list of features that depend on this}."**

## Step 4: Analyze root cause

Read the relevant source files. Trace the logic to find the root cause, not just the symptom. Ask:
- Is the bug in this feature's own code?
- Is it in a dependency that this feature relies on?
- Is it a data/state issue?
- Is it a logic error?

Report the root cause to the user before touching any code: **"Root cause: {explanation}."**

## Step 5: Fix — constrained to the module

Fix only files within the affected module. Do NOT modify:
- Unrelated features' files
- Dependent features' files (unless the root cause is actually there)
- The feature map, structure doc, or config files

If the fix requires changes outside the module boundary, flag it to the user first: **"This fix touches F004 which F002 doesn't depend on. OK to proceed?"**

## Step 6: Auto-verify after fix

After applying the fix, run verification automatically:

1. Verify the fixed feature against its `verification` criteria in flow.yaml.
2. Identify all downstream features (those that `depends_on` the fixed feature — direct AND transitive).
3. Verify each downstream feature.
4. Report:

```
=== Fix Summary ===
Fixed: F002 — Dashboard data loading (line 45: missing await)
Root cause: async call without await

Verification:
  F002 Dashboard    ✓ pass
  F003 Create proj  ✓ pass (dependent, unaffected)
  F005 Dashboard edit ✓ pass (dependent, unaffected)
```

## Step 7: Update state

If verification passes, update the feature status in flow.yaml to `verified`. Update state.json `last_verify`.

## Guardrails

- Never fix by adding a workaround. Fix the root cause.
- Never refactor unrelated code "while we're here."
- If two root causes are possible, ask the user before picking one.
- Always show the fix location (file:line) in the summary.
