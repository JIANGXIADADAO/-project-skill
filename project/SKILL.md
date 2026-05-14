---
name: project
description: Menu-driven project management for vibecoding projects. Routes to init, verify, fix, status, version, structure, and paper sub-skills. Use when user says /project, "project management", wants to manage a vibecoding project workflow.
---

# Project Management

Menu router for vibecoding project management. All sub-skills can be called directly or via this menu.

## On invocation

1. Read `.claude-project/state.json` to get `current_version`. If it doesn't exist, say: "No project found. Run `/project-init` to set up a new project."
2. Display:

```
=== Project Management ===
Current version: {current_version}

1. project-init      — Create PLAN, flow.yaml, TASKS
2. project-structure — Scan codebase, update PROJECT_STRUCTURE.md
3. project-verify    — Verify all features against flow.yaml
4. project-fix       — Report a bug, locate root cause, fix, auto-verify downstream
5. project-status    — Progress overview and unverified-change detection
6. project-version   — Seal current version, bootstrap next version
7. project-paper     — Generate paper/report from project docs

Enter a number (1-7), or run /project-<name> directly to skip this menu.
```

3. After user picks a number, tell them: "Run `/project-{name}` to continue."

Do NOT forward to the sub-skill yourself. This skill is only the menu.

## Direct commands

All sub-skills accept direct invocation:
`/project-init`, `/project-structure`, `/project-verify`, `/project-fix`, `/project-status`, `/project-version`, `/project-paper`
