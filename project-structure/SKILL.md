---
name: project-structure
description: Scan the project directory and generate/update PROJECT_STRUCTURE.md with directory tree and module descriptions. Use when code structure changes, user says "update structure", "project structure", or after adding/removing files.
---

# Project Structure

Scan the project directory and generate or update `{version}/PROJECT_STRUCTURE.md`.

## Step 1: Read context

Read `.claude-project/state.json` to get `current_version`. If it doesn't exist, say: "No project found. Run `/project-init` first."

## Step 2: Scan the project

Scan all files and directories, excluding:
- `v1/`, `v2/`, ... (version doc folders)
- `.claude-project/`
- `node_modules/`, `.git/`, `__pycache__/`, `.venv/`, `dist/`, `build/`, `.next/`
- Hidden files (`.env`, `.gitignore`) unless critical to structure
- Binary/image files

Build a directory tree. For each file, note its purpose based on filename and a quick skim of the first few lines.

## Step 3: Generate PROJECT_STRUCTURE.md

Write to `{version}/PROJECT_STRUCTURE.md`:

```markdown
# {Project Name} — Project Structure ({version})

**Generated**: {timestamp}
**Source root**: {project root}

## Directory Tree

project/
├── src/
│   ├── components/
│   │   ├── Header.tsx      — App header with nav
│   │   └── Footer.tsx      — Site footer
│   ├── pages/
│   │   ├── Home.tsx        — Landing page
│   │   └── Dashboard.tsx   — User dashboard (F002)
│   └── utils/
│       └── api.ts          — API client helpers
├── public/
│   └── index.html          — Entry HTML
└── package.json            — Dependencies and scripts
```

## Module → Feature Mapping

| Module/File | Feature ID | Feature Name |
|-------------|-----------|--------------|
| src/pages/Dashboard.tsx | F002 | Dashboard display |
```

## Step 4: Annotate with feature IDs

Cross-reference each file with `.claude-project/flow.yaml`. If a file maps to a known feature, tag it with the feature ID (like `F002` above).

## Step 5: Update snapshots

Update `file_snapshots` in state.json with current file hashes. Compute a quick hash from file path + modification time (no need to read file contents):

```
file_snapshots: { "src/pages/Home.tsx": "2026-05-14T10:30:00", ... }
```

Use mtime from `stat` rather than reading and hashing file contents.

## Step 6: Report

Tell user: "PROJECT_STRUCTURE.md updated for {version}. {N} files mapped to {M} features."
