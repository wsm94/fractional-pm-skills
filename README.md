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

## How They Work Together

The core skills form a product development pipeline:

```
Ideation → PRD → Issues → Review
```

1. **Ideation Expertise** — brainstorm and explore the problem space
2. **Product Manager** — turn that into a formal PRD
3. **Issue Creator** — break the PRD into development issues
4. **Issue Review** — validate issues against your codebase before implementation

The other skills support you at any point in development.

## Installation

### Claude Code (VS Code Extension)

Copy the skill folders you want into your skills directory:

```bash
# macOS / Linux
~/.claude/skills/

# Windows
%USERPROFILE%\.claude\skills\
```

Then restart VS Code.

### Claude Desktop

Copy the skill folders into:

```bash
# macOS
~/Library/Application Support/Claude/skills/

# Windows
%APPDATA%\Claude\skills\
```

Then restart Claude Desktop.

### Claude Web (claude.ai)

Compress a skill folder to `.zip`, then go to **Settings → Capabilities → Upload Skill** and drag it in.

## Skill Structure

Each skill is a folder with a `SKILL.md` (required) and an optional `references/` directory:

```
skill-name/
├── SKILL.md          # Main instructions with YAML frontmatter
└── references/       # Supporting docs loaded on demand
```

The YAML frontmatter `description` field contains the trigger phrases that tell Claude when to activate the skill.

## License

Provided as-is for use with Claude. Feel free to fork, modify, and adapt to your own workflows.
