---
name: project-checkpoint
description: Save current project progress as a checkpoint in CLAUDE.md so the next session can resume from where you left off. Use when user says "checkpoint", "断点", "存档", "暂停项目", "/project-checkpoint", or is ending a session with incomplete progress.
---

# Project Checkpoint

Save a resume point so the next session picks up exactly where you left off.

## Step 1: Load context

Read `.claude-project/state.json`. If it doesn't exist, say: "No project found. Run `/project-init` first."

## Step 2: Ask what to save

Ask two questions, one at a time:

1. "**Where did you stop?** — Which feature or file were you working on? What was the last thing you did?"
2. "**What's next?** — What's the very next action to take? Be specific (e.g. 'Fix the login validation bug in src/auth/login.ts')."

## Step 3: Write checkpoint block

Append to `CLAUDE.md` at the end:

```markdown
<!-- PROJECT:RESUME -->
## 项目断点
**上次做到**：{user's answer to Q1}
**下一步**：{user's answer to Q2}
<!-- /PROJECT:RESUME -->
```

Use literal `<!-- PROJECT:RESUME -->` and `<!-- /PROJECT:RESUME -->` as delimiters — these are machine-readable markers.

## Step 4: Confirm

```
Checkpoint saved to CLAUDE.md.

Next session: just open this project. I'll read the checkpoint and delete it, then we continue from where you stopped.

现在可以安心关电脑了。
```
