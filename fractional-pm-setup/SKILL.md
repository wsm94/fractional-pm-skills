---
name: fractional-pm-setup
description: Bootstraps a development environment with the complete Fractional PM product management workflow. Sets up git, CLAUDE.md, installs all Fractional PM skills globally, configures Linear MCP integration, and establishes issue statuses. This skill should be used when starting a new project with the Fractional PM workflow, setting up PM skills, or when user says "set up fractional PM", "bootstrap PM workflow", "install PM skills", or "/fractional-pm-setup".
---

# Fractional PM Setup

Bootstrap a project with the full Fractional PM development workflow in 5 steps. This skill is conversational — guide the user through each step, confirm before taking actions, and handle errors gracefully.

## Prerequisites

- Git installed
- Claude Code running in VS Code
- Internet access (for cloning skills repo and Linear MCP)

## Workflow

Execute these 5 steps in order. Each step checks its own state and skips if already complete (safe to re-run).

---

## Step 1: Git & CLAUDE.md Check

### Git

1. Run `git rev-parse --is-inside-work-tree` to check if the current directory is a git repo
2. If **not** a git repo:
   - Ask the user: "This directory is not a git repository. Should I initialize one?"
   - If yes: run `git init`
   - If no: warn that some features require git and continue

### CLAUDE.md

1. Check if `CLAUDE.md` exists in the project root
2. If it **does not exist**: note that a new one will be created in Step 3
3. If it **exists**: read the current content and ask the user:
   - **Append** — keep existing content, add the workflow as a new section below
   - **Replace** — overwrite entirely with the workflow content
   - **Skip** — don't modify CLAUDE.md at all

Store the user's choice for use in Step 3.

---

## Step 2: Clone Skills Repo & Install

### Clone

1. Check if `~/.claude/skill-repos/fractional-pm-skills/` already exists
2. If it exists:
   - Verify it's a git repo with the correct remote (`https://github.com/wsm94/fractional-pm-skills`)
   - Run `git pull` to update to latest
   - Tell the user: "Skills repo already cloned. Updated to latest."
3. If it does not exist:
   - Run `mkdir -p ~/.claude/skill-repos/`
   - Run `git clone https://github.com/wsm94/fractional-pm-skills.git ~/.claude/skill-repos/fractional-pm-skills/`

### Install Symlinks

Run the bundled script to create symlinks from the cloned repo into the global skills directory:

```bash
bash <skill-directory>/scripts/setup-symlinks.sh ~/.claude/skill-repos/fractional-pm-skills ~/.claude/skills
```

The script handles:
- Existing correct symlinks (skips with "OK")
- Windows symlink fallbacks (tries `ln -s`, then `cmd /c mklink /D`, then copies as last resort)
- Reports status per skill

**Skills installed:**
- ideation-expertise
- product-manager
- issue-creator
- issue-review
- context7-docs
- diagram-skill
- docs-agent
- wp-to-sanity-astro
- write-changelog
- fractional-pm-setup

Show the user the results table from the script output.

---

## Step 3: Update CLAUDE.md

1. Load the workflow content from `<skill-directory>/references/workflow-content.md`
2. Apply the user's choice from Step 1:

   **Append**: Read existing CLAUDE.md, add a horizontal rule separator, then append the workflow content below existing content. Write the combined result.

   **Replace**: Write the workflow content as the entire CLAUDE.md.

   **Create new**: Write the workflow content as a new CLAUDE.md (when no CLAUDE.md existed).

   **Skip**: Do nothing, inform the user.

3. Show the user a summary of what was added (section headers, not full content).

---

## Step 4: Linear MCP Setup

This is the most involved step. Be conversational and patient — some sub-steps require user action.

### 4.1 Check Existing Connection

Try calling `mcp__linear-server__list_teams`. If it succeeds, the Linear MCP is already configured and authenticated — skip to sub-step 4.5 (status verification).

### 4.2 Install Linear MCP

Tell the user: "I'll add the Linear MCP server to your global Claude Code configuration."

Run:
```bash
claude mcp add --transport http --scope user linear-server https://mcp.linear.app/mcp
```

### 4.3 Authenticate

Tell the user:

> The Linear MCP uses OAuth for authentication. Please:
> 1. Run `/mcp` in your Claude Code session
> 2. Find "linear-server" in the list
> 3. Click "Authenticate" — this will open your browser
> 4. Log in to Linear and authorise the connection
> 5. Come back here and let me know when it's done

Wait for the user to confirm before proceeding. This step cannot be automated.

### 4.4 Verify Connection

After the user confirms authentication:
1. Call `mcp__linear-server__list_teams`
2. If successful: show the teams found and ask the user which team to configure
3. If it fails: suggest the user re-run `/mcp` and try authenticating again

### 4.5 Configure Issue Statuses

1. Call `mcp__linear-server__list_issue_statuses` for the selected team
2. Compare the existing statuses against the required set:

   | Status | Category | Description |
   |--------|----------|-------------|
   | Discovered | Backlog | Very high-level description, incomplete issue |
   | Refined | Unstarted | Issue fleshed out and ready for development |
   | Todo | Unstarted | Issue prioritised and ready to be picked up |
   | In Review | Started | Dev work complete, waiting for human review |
   | On Preview | Completed | Deployed to preview environment |
   | On Production | Completed | Released |

3. Report which statuses already exist and which are missing
4. If statuses are missing, load `<skill-directory>/references/linear-status-guide.md` and present the user with step-by-step instructions for adding them manually in Linear (the MCP cannot create workflow states)
5. After the user confirms they've made the changes, call `mcp__linear-server__list_issue_statuses` again to verify
6. Report the final status match

---

## Step 5: Verification & Summary

Run final checks and present a summary:

### Checks

1. **Skills**: for each expected skill, verify `~/.claude/skills/<name>/SKILL.md` exists
2. **Linear MCP**: call `mcp__linear-server__list_teams` to confirm connection
3. **Linear statuses**: call `mcp__linear-server__list_issue_statuses` and check all 6 are present
4. **CLAUDE.md**: check the file exists and contains the workflow section header

### Summary Output

Present a clear summary:

```
## Setup Complete

### Skills Installed
- ideation-expertise ......... OK
- product-manager ............ OK
- issue-creator .............. OK
- issue-review ............... OK
- context7-docs .............. OK
- diagram-skill .............. OK
- docs-agent ................. OK
- wp-to-sanity-astro ......... OK
- write-changelog ............ OK
- fractional-pm-setup ........ OK

### Linear MCP
- Connection: Connected
- Team: [Team Name]
- Statuses: 6/6 configured

### CLAUDE.md
- Workflow section: Added

### Next Steps
- **Greenfield**: Start ideation in Claude Web, then place outputs in docs/reference/
- **Brownfield**: Place your PRD/specs in docs/reference/
- **Create a Linear project**: Run /product-manager with your PRD
- **Generate issues**: Run /issue-creator
- **Review issues**: Run /issue-review
```

---

## Idempotency

This skill is safe to run multiple times. Each step checks existing state:

| Component | Already exists? | Behaviour |
|-----------|----------------|-----------|
| Git repo | Yes | Skip init |
| CLAUDE.md | Yes | Ask user preference |
| Skills repo clone | Yes | `git pull` to update |
| Symlinks (correct) | Yes | Skip |
| Symlinks (wrong target) | Yes | Re-link |
| Linear MCP | Configured | Skip to auth check |
| Linear auth | Authenticated | Skip to status check |
| Linear statuses | All match | Report "already configured" |
