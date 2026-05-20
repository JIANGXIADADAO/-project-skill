# /project — Claude Code Project Management Skills

> [中文版](README_CN.md)

A suite of project-management skills for vibecoding workflows, covering everything from project initialization to version release.

## Skills

| Skill | Purpose |
|------|------|
| `/project` | Menu router — unified entry point for all sub-skills |
| `/project-init` | Dialog-based setup — generates PLAN.md, flow.yaml, TASKS.md |
| `/project-structure` | Scans the codebase, generates/updates PROJECT_STRUCTURE.md with file-to-feature mapping |
| `/project-verify` | Validates every feature against its verification criteria in flow.yaml |
| `/project-fix` | Bug report → root-cause analysis → constrained fix → auto-verify downstream dependents |
| `/project-status` | Progress dashboard: feature completion, task status, unverified-change detection |
| `/project-version` | Seal current version → final verification → CHANGELOG → bootstrap next version |
| `/project-paper` | Compile accumulated docs (PLAN, FLOW, STRUCTURE, CHANGELOG) into a paper or report |
| `/project-checkpoint` | Save a resume point to CLAUDE.md so the next session picks up where you left off |

## Installation

Copy all skill directories into Claude Code's skills folder:

```
~/.claude/skills/
├── project/
├── project-checkpoint/
├── project-fix/
├── project-init/
├── project-paper/
├── project-status/
├── project-structure/
├── project-verify/
└── project-version/
```

## Workflow

```
/project-init        → Scaffold the project skeleton
/project-structure   → Scan and map the codebase
   ↓ (code, code, code...)
/project-verify      → Validate features
/project-fix         → Fix issues (loop as needed)
/project-status      → Check progress
/project-version     → Seal and cut the next version
/project-paper       → Export documentation
```

Call `/project` anytime for the menu — or invoke any sub-skill directly.

## How It Works

Each skill reads `.claude-project/state.json` and `.claude-project/flow.yaml` as the shared source of truth. Features are tracked by ID (F001, F002, …) with explicit dependencies, verification criteria, and status. The fix and verify skills use this dependency graph to auto-check downstream features when something changes.
