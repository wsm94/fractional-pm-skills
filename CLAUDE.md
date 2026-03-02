# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Claude Skills Library** — a collection of modular skill packages that extend Claude's capabilities for specialized tasks. Skills are plain markdown files (not executable code) that provide Claude with domain-specific knowledge and procedural workflows.

There is no build system, test suite, or runtime. The repository is markdown-only.

## Skill Structure

Every skill follows this convention:

```
skill-name/
├── SKILL.md              # Main instructions (required) — YAML frontmatter + markdown body
└── references/           # Supporting documents loaded on demand
    └── *.md
```

The `docs-agent/` skill is an exception — it uses a different layout with `agents/`, `commands/`, `skills/` subdirectories and a `settings.local.json` for Claude Code permissions.

### SKILL.md Frontmatter

Every SKILL.md must have YAML frontmatter with `name` and `description` fields:

```yaml
---
name: skill-name
description: One-line description including trigger phrases.
---
```

The `description` field drives skill selection — it must include the trigger phrases and use cases that cause Claude to activate the skill.

## Skills in This Repo

The skills form a **product development lifecycle pipeline**:

1. **ideation-expertise** — Structured brainstorming and problem-space exploration (step 0)
2. **product-manager** — Discovery interviews and PRD generation (step 1)
3. **issue-creator** — PRD-to-issues breakdown with BDD acceptance criteria (step 2)
4. **issue-review** — Validates issues against actual codebase before implementation (step 3)

Supporting skills:
- **context7-docs** — Delegates doc lookups to a sub-agent to keep main context lean
- **diagram-skill** — Mermaid-to-Excalidraw round-trip editing
- **docs-agent** — Automated codebase documentation generation (`/update-docs`, `/docs` commands)
- **wp-to-sanity-astro** — WordPress-to-Sanity/Astro migration workflow
- **write-changelog** — Git-history-based release notes with semver tagging and sensitivity filtering

## Conventions When Editing Skills

- Keep SKILL.md files self-contained for their core workflow; put detailed reference material in `references/`.
- Skill descriptions must include trigger phrases so Claude can match user intent to the correct skill.
- Skills should be environment-aware (VS Code / Desktop / Web) where behavior differs.
- Reference files are loaded on demand — keep them focused on a single topic.
- The `assets/` directory (used by some skills) contains templates that the skill fills in during execution.

## Installation Paths

Skills are installed to different locations depending on the Claude environment:
- **Claude Desktop (macOS):** `~/Library/Application Support/Claude/skills/`
- **Claude Desktop (Windows):** `%APPDATA%\Claude\skills\`
- **VS Code Extension:** `~/.claude/skills/`
- **WSL:** `/mnt/skills/user/`
