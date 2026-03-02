---
name: write-changelog
description: Generates versioned, marketing-friendly release notes from git history. This skill should be used after pushing to main to create a changelog entry. It analyzes the git diff since the last semver tag, determines the appropriate semver bump (major/minor/patch), writes public-facing release notes, appends to changelog/CHANGELOG.md, and creates a new git tag. Triggers include "write changelog", "write release notes", "create changelog", "tag a release", or the /write-changelog slash command.
---

# Write Changelog

Generate public-facing, marketing-friendly release notes by analyzing git history since the last semver tag. Determine the appropriate semver bump, write categorized release notes free of sensitive implementation details, and manage the changelog file and git tags.

## Prerequisites

Before starting the workflow, verify the following:

1. Confirm the current directory is a git repository: `git rev-parse --is-inside-work-tree`
2. Confirm the working tree is clean: `git status --porcelain` (should be empty)
3. Check the current branch. If not on `main`, warn the user and ask whether to proceed.
4. Confirm there are commits since the last tag (or that this is the first release).

If any prerequisite fails, inform the user and stop.

## Workflow

### Step 1: Find the Latest Semver Tag

```bash
git tag -l --sort=-v:refname "v*" | head -1
```

If no tags exist, this is the initial release. Find the root commit to use as the baseline:

```bash
git rev-list --max-parents=0 HEAD
```

Store the result as `LAST_TAG` (or `ROOT_COMMIT` for first releases).

### Step 2: Gather Changes

Run these commands to collect change data:

```bash
# Commit log (excluding merge commits)
git log ${LAST_TAG}..HEAD --pretty=format:"%h %s" --no-merges

# Stat summary
git diff ${LAST_TAG}..HEAD --stat

# Full diff for analysis (read internally, NEVER include in output)
git diff ${LAST_TAG}..HEAD
```

For first releases (no tags), replace `${LAST_TAG}` with the root commit hash.

Read the full diff to understand the nature of changes. Never include raw diff content, file paths, or code snippets in the changelog output.

### Step 3: Determine Semver Bump

Analyze commit messages and the diff to determine the version bump:

| Bump | Criteria | Examples |
|------|----------|---------|
| **Major** (X.0.0) | Breaking changes to user-facing behaviour; complete redesigns; removed features | "Users must re-authenticate"; "Dashboard completely redesigned" |
| **Minor** (x.Y.0) | New user-facing features; significant enhancements; new capabilities | New UI sections; new integrations; new workflows |
| **Patch** (x.y.Z) | Bug fixes; performance improvements; visual tweaks; security patches | Styling adjustments; dependency updates; refactors with no user-facing change |

Rules:
- Any breaking user-facing changes: bump major
- New features (even alongside fixes): bump minor
- Only fixes/refactors/chores: bump patch
- First release with no existing tags: start at `v0.1.0`
- When unsure between minor and patch, prefer minor if there are feature-type commits

**Present the proposed version to the user and ask for confirmation before proceeding.** Format: "Based on the changes, I recommend version **vX.Y.Z** (reason). The key changes are: [brief summary]. Does this look right?"

### Step 4: Write Release Notes

This is the most critical step. Load `references/sensitivity-rules.md` before writing.

Release notes must be:
- **Public-facing**: Written as if for a product blog or changelog page
- **Marketing-friendly**: Emphasize user benefits, not implementation details
- **Categorized**: Group into clear sections
- **Free of sensitive information**: Apply all sensitivity filtering rules

Use these categories (include only sections that have entries):

1. **New Features** - Entirely new capabilities
2. **Improvements** - Enhancements to existing features
3. **Bug Fixes** - Issues that have been resolved
4. **Security** - Security-related fixes (describe impact only, never vulnerability details)
5. **Performance** - Speed or efficiency improvements users would notice

Writing guidelines for each bullet point:
- Lead with the user benefit or outcome, not the technical change
- Use active voice ("You can now..." or "Tasks now load faster")
- Keep each item to 1-2 sentences maximum
- Do not reference file names, function names, database tables, API endpoints, or internal architecture
- Do not reference issue/ticket numbers (ORG-86, JIRA-123, etc.)
- Translate developer jargon into user-friendly language
- If only docs/config/CI changes exist since the last tag, inform the user and suggest skipping or doing a patch

Not all commits deserve a changelog entry:
- **Include**: User-visible features, user-visible bug fixes, noticeable performance improvements, security fixes
- **Exclude or merge**: Internal refactors, dependency updates (unless security-related), documentation changes, CI/CD changes, code style changes, developer tooling changes
- **Merge related commits**: If multiple commits relate to the same feature, write one bullet point

For large numbers of commits (50+), group by theme rather than listing every change. Aim for 5-15 bullet points total.

### Step 5: Write to Changelog File

Check if `changelog/CHANGELOG.md` exists in the project root:

- **Does not exist**: Create the `changelog/` directory and initialize the file using the format from `assets/changelog-template.md`, then add the first entry.
- **Exists**: Prepend the new version entry after the file header (newest entries at the top). Insert the new entry between the `# Changelog` header block and the first existing `## v...` entry. Preserve all existing content.

Each version entry format:

```markdown
## vX.Y.Z - YYYY-MM-DD

### New Features
- User-friendly description of new capability

### Improvements
- User-friendly description of enhancement

### Bug Fixes
- User-friendly description of resolved issue

---
```

Omit any category sections that have no entries for that version.

### Step 6: Create Git Tag

After writing the changelog:

1. Stage the changelog: `git add changelog/CHANGELOG.md`
2. Commit: `git commit -m "chore: release vX.Y.Z"`
3. Create an annotated tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
4. Report to the user: "Release vX.Y.Z is ready. The changelog has been updated and the tag created. To push: `git push && git push --tags`"

**Never push automatically.** Always let the user decide when to push.

## Edge Cases

- **First release**: No tags exist. Analyze all commits from the root. Start at v0.1.0.
- **No meaningful user-facing changes**: If only docs/config/CI changes since last tag, inform the user and suggest skipping or creating a minimal patch release.
- **Mixed commit styles**: Parse conventional commits where present. For non-conventional commits, analyze the diff to categorize.
- **Monorepo**: If the project has multiple packages, ask the user which area the release covers.

## Configuration Defaults

These defaults apply unless the user specifies otherwise:
- **Starting version** (no existing tags): `v0.1.0`
- **Tag prefix**: `v`
- **Changelog path**: `changelog/CHANGELOG.md`
- **Date format**: `YYYY-MM-DD`
- **Max bullet points per category**: 10 (summarize beyond that)
