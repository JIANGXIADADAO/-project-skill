---
name: project-init
description: Dialog-based project initialization. Creates PLAN.md, flow.yaml, and TASKS.md by asking the user targeted questions about their project. Use when starting a new vibecoding project, setting up a new version, or when user says "init project", "setup project", "project init".
---

# Project Init

Dialog-based setup that produces PLAN.md, flow.yaml, and TASKS.md for the current version.

## Step 1: Determine context

Read `.claude-project/state.json` if it exists. If not, create the `.claude-project/` directory and bootstrap:

```json
{
  "project_name": "",
  "current_version": "v1",
  "created_at": "",
  "last_verify": null,
  "last_verify_result": null,
  "file_snapshots": {}
}
```

If state.json exists and has a current_version, work in that version's folder. Create the version folder (e.g. `v1/`) if it doesn't exist.

## Step 2: Ask questions one at a time

Ask these questions sequentially, one at a time:

1. **Project name**: "What is the project called?"
2. **One-line purpose**: "In one sentence, what does this project do?"
3. **Tech stack**: "What's the tech stack? (e.g. React+Node, Python Flask, vanilla HTML/JS)"
4. **Features for this version**: "List the features for this version. For each feature, tell me:
   - Feature name
   - What it does (one sentence)
   - Does it depend on another feature?
   - How do you know it works? (verification: what should happen when it works correctly)"

Guide the user to think in terms of independent, verifiable units. Each feature gets an ID (F001, F002, ...).

If user says a feature depends on another, note it. If they aren't sure about dependencies, help them think it through: "Does feature B need feature A to be working before B can function?"

## Step 3: Generate flow.yaml

Write to `.claude-project/flow.yaml`:

```yaml
features:
  - id: F001
    name: "{feature name}"
    description: "{one sentence}"
    depends_on: []
    verification: "{how to verify it works}"
    status: planned
```

Status is always `planned` for new features.

## Step 4: Generate PLAN.md

Write to `{version}/PLAN.md`:

```markdown
# {Project Name} — {Version} Plan

**Purpose**: {one-line purpose}
**Tech stack**: {tech stack}
**Created**: {date}

## Features

| ID | Feature | Depends On | Status |
|----|---------|------------|--------|
| F001 | ... | — | planned |
```

## Step 5: Generate TASKS.md

Write to `{version}/TASKS.md`:

```markdown
# {Version} Tasks

## F001 — {Feature Name}
- [ ] Scaffold module
- [ ] Implement core logic
- [ ] Connect dependencies
- [ ] Verify: {verification criteria}
```

One task group per feature.

## Step 6: Generate FLOW.md

Render `{version}/FLOW.md` from flow.yaml. See `scripts/render-flow.js` in the project skill directory for deterministic rendering. If the script is not available, produce this structure manually:

```markdown
# {Project Name} — Feature Map

## Features
{list each feature with id, name, description, dependencies, verification, status}

## Dependency Graph
{Mermaid graph showing feature dependencies}
```

## Step 7: Finalize

Update state.json with project_name and created_at. Tell user:

"Done. `{version}/` is ready:
- PLAN.md — your plan
- FLOW.md — feature map
- TASKS.md — task checklist
- `.claude-project/flow.yaml` — machine-readable feature data

Start coding, then run `/project-verify` to check features."
