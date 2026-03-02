# The Fractional PM — Claude Code Skills

A collection of Claude Code skills for product management and development workflows, shared as a companion to [The Fractional PM](https://www.youtube.com/@TheFractionalPM) YouTube channel.

These skills give Claude specialized knowledge for tasks like ideation, writing PRDs, creating issues, reviewing tickets, generating docs, and more. They're plain markdown files — no code, no dependencies, no build step.

## Available Skills

| Skill | What it does |
|-------|-------------|
| **[ideation-expertise](ideation-expertise/)** | Structured brainstorming and problem-space exploration. Guided 5-phase interview producing an Ideation Document. |
| **[product-manager](product-manager/)** | Discovery interviews and PRD generation. Explores your codebase in VS Code, creates UI mockups in Web/Desktop. |
| **[issue-creator](issue-creator/)** | Converts PRDs, feature requests, or specs into development issues with BDD acceptance criteria and dependency ordering. |
| **[issue-review](issue-review/)** | Reviews issues against your actual codebase for technical accuracy, missing edge cases, and scope assessment. |
| **[context7-docs](context7-docs/)** | Delegates library/framework documentation lookups to a sub-agent so your main conversation stays lean. |
| **[diagram-skill](diagram-skill/)** | Round-trip Mermaid-to-Excalidraw editing — export, visually edit, import back. |
| **[docs-agent](docs-agent/)** | Generates and queries project documentation from your codebase (`/update-docs`, `/docs`). |
| **[wp-to-sanity-astro](wp-to-sanity-astro/)** | WordPress-to-Sanity/Astro migration with content conversion, Astro pages, and Vercel redirect config. |
| **[write-changelog](write-changelog/)** | Generates marketing-friendly release notes from git history with semver tagging and sensitivity filtering. |
| **[fractional-pm-setup](fractional-pm-setup/)** | Bootstraps a project with the full Fractional PM workflow — installs all skills, configures Linear MCP, sets up issue statuses, and updates CLAUDE.md. |

## Quick Start

Run the **fractional-pm-setup** skill in any repo to get everything configured at once:

1. Open your project in VS Code with Claude Code
2. Say: "set up fractional PM" or run `/fractional-pm-setup`
3. The skill walks you through: git init, skill installation, CLAUDE.md setup, Linear MCP connection, and issue status configuration

## How They Work Together

The core skills form a product development pipeline, managed through Linear via the MCP integration:

```
Ideation → PRD → Issues → Refinement → Development → Review → Deploy
```

1. **Ideation Expertise** — brainstorm and explore the problem space (Claude Web)
2. **Product Manager** — turn that into a formal PRD and create a Linear project
3. **Issue Creator** — break the PRD into Linear issues (status: Discovered) with BDD acceptance criteria
4. **Issue Review** — validate issues against your codebase before implementation

A parallel **refinement thread** picks up Discovered issues, explores the codebase, and fleshes them out to Refined status. **Reactive work** (bugs, corrections, small tasks) feeds back from human review into the development loop.

### Linear Issue Lifecycle

```
Discovered → Refined → Todo → In Review → On Preview → On Production
```

## Installation

### Automated (Recommended)

Use the **fractional-pm-setup** skill to install everything automatically. It clones this repo, symlinks all skills into your global Claude skills directory, configures the Linear MCP, and sets up your project's CLAUDE.md.

If you already have the setup skill installed, just say "set up fractional PM" in any project.

### Manual — Claude Code (VS Code Extension)

Clone this repo and symlink (or copy) the skill folders you want into your skills directory:

```bash
# Clone
git clone https://github.com/wsm94/fractional-pm-skills.git ~/.claude/skill-repos/fractional-pm-skills

# Symlink all skills (macOS / Linux)
for skill in ~/.claude/skill-repos/fractional-pm-skills/*/; do
  ln -s "$skill" ~/.claude/skills/$(basename "$skill")
done
```

On Windows (Git Bash), the setup script handles symlink fallbacks automatically:

```bash
bash ~/.claude/skill-repos/fractional-pm-skills/fractional-pm-setup/scripts/setup-symlinks.sh \
  ~/.claude/skill-repos/fractional-pm-skills \
  ~/.claude/skills
```

### Manual — Claude Desktop

Copy the skill folders into:

```bash
# macOS
~/Library/Application Support/Claude/skills/

# Windows
%APPDATA%\Claude\skills\
```

Then restart Claude Desktop.

### Manual — Claude Web (claude.ai)

Compress a skill folder to `.zip`, then go to **Settings → Capabilities → Upload Skill** and drag it in.

## Skill Structure

Each skill is a folder with a `SKILL.md` (required) and optional supporting directories:

```
skill-name/
├── SKILL.md          # Main instructions with YAML frontmatter
├── references/       # Supporting docs loaded on demand
├── scripts/          # Executable automation (bash, python)
└── assets/           # Templates, boilerplate, binary files
```

The YAML frontmatter `description` field contains the trigger phrases that tell Claude when to activate the skill.

## License

Provided as-is for use with Claude. Feel free to fork, modify, and adapt to your own workflows.
