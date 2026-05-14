---
name: project-paper
description: Generate a paper, report, or documentation from the project's accumulated docs (PLAN, FLOW, STRUCTURE, CHANGELOG across versions). Use when user says "generate paper", "write report", "project paper", "documentation", or wants to export project documentation.
---

# Project Paper

Compile project documentation into a structured paper or report.

## Step 1: Load all docs

Read across all versions:
- All `v*/PLAN.md`
- All `v*/FLOW.md`
- All `v*/CHANGELOG.md`
- Current `PROJECT_STRUCTURE.md`
- `.claude-project/flow.yaml`

## Step 2: Ask output format

"Generate as: (1) Technical report, (2) Academic paper, (3) README-style overview, (4) Portfolio case study?"

## Step 3: Assemble paper

Structure depends on format chosen. Default (technical report):

```markdown
# {Project Name} — Technical Report

## Abstract
{One-paragraph summary of the project, versions, and current state}

## 1. Introduction
{Problem statement, project purpose from PLAN.md}

## 2. Architecture
{From PROJECT_STRUCTURE.md and FLOW.md — directory layout, module map, feature dependency graph}

## 3. Features
{Each feature from flow.yaml: ID, name, description, verification criteria, status}

## 4. Version History
{Per-version summary from each CHANGELOG.md: what was added, what changed, what was fixed}

## 5. Current State
{Feature completion metrics, known issues, next steps from current PLAN.md}

## Appendix: Dependency Graph
{Mermaid diagram from flow.yaml}
```

## Step 4: Write output

Write to `{current_version}/PAPER.md`.

If user chose "portfolio case study", additionally generate a shorter `CASE_STUDY.md` in the same folder.

Tell user: "Paper written to `{current_version}/PAPER.md`."
