# /project — Claude Code 项目管理技能集

一套面向 vibecoding 工作流的项目管理技能，为 Claude Code 提供从项目初始化到版本发布的完整管理能力。

## 技能列表

| 技能 | 用途 |
|------|------|
| `/project` | 菜单路由，统一入口 |
| `/project-init` | 对话式项目初始化，生成 PLAN.md、flow.yaml、TASKS.md |
| `/project-structure` | 扫描项目目录，生成/更新 PROJECT_STRUCTURE.md，建立文件到功能的映射 |
| `/project-verify` | 按 flow.yaml 验证标准检查所有功能 |
| `/project-fix` | 报告 bug → 定位根因 → 约束修复 → 自动验证下游依赖 |
| `/project-status` | 项目进度总览：功能完成度、任务状态、未验证变更检测 |
| `/project-version` | 封版 → 最终验证 → 生成 CHANGELOG → 启动下一版本 |
| `/project-paper` | 从项目累积文档（PLAN、FLOW、STRUCTURE、CHANGELOG）生成报告或论文 |
| `/project-checkpoint` | 保存断点到 CLAUDE.md，下次会话从中断处继续 |

## 安装

将本仓库所有目录复制到 Claude Code 的 skills 目录：

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

## 工作流

```
/project-init        → 创建项目骨架
/project-structure   → 扫描代码结构
   ↓（写代码、写代码、写代码……）
/project-verify      → 验证功能实现
/project-fix         → 修复问题（循环）
/project-status      → 查看进度
/project-version     → 封版发布
/project-paper       → 导出文档
```

也可直接输入 `/project` 进入菜单选择，或直接调用任意子技能。

## 设计思路

所有技能共享 `.claude-project/state.json` 和 `.claude-project/flow.yaml` 作为唯一数据源。功能以 ID（F001, F002, …）追踪，记录依赖关系、验证标准和状态。fix 和 verify 技能利用依赖图，在代码变更时自动检查受影响的下游功能，避免修一个坏一片。
