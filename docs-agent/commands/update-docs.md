# Update Project Documentation

Generate or update the project documentation in `docs/`.

## Instructions

You are running the documentation update process. Use the docs-generator agent guidelines to analyze the codebase and generate documentation.

### Step 1: Check Current State

First, determine if this is a fresh generation or an update:

1. Check if `docs/.last-update` exists
2. If it exists, read the last commit hash
3. Get the current commit hash with `git rev-parse HEAD`
4. If updating, get changed files with `git diff <last-hash> --name-only`

### Step 2: Analyze Scope

**For fresh generation:**
- Full codebase analysis
- Generate all documentation sections

**For incremental update:**
- Focus on changed areas
- Update only affected sections
- Preserve unchanged documentation

### Step 3: Generate Documentation

Create/update files in `docs/`:

1. **index.md** - Project overview and navigation
2. **architecture.md** - System design with mermaid diagrams
3. **data-flow.md** - How data moves through the system
4. **api-reference.md** - All API endpoints
5. **database.md** - Schema and relationships
6. **conventions.md** - Code patterns and style

For monorepos, create subdirectories for each app/package.

### Step 4: Update Tracking

Write to `docs/.last-update`:
```yaml
commit: <current-commit-hash>
timestamp: <current-ISO-timestamp>
sections_updated:
  - <list of files updated>
```

### Step 5: Report

Summarize what was documented/updated:
- New sections created
- Sections updated
- Any gaps or areas that need manual documentation

## Arguments

This command accepts optional arguments:

- `--full` - Force full regeneration even if docs exist
- `--section <name>` - Only update a specific section
- `--dry-run` - Show what would be updated without writing

## Example Usage

```
/update-docs              # Incremental update
/update-docs --full       # Full regeneration
/update-docs --section api-reference  # Update API docs only
```
