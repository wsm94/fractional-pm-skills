# Linear Issue Status Configuration Guide

## How to Configure

1. Open Linear in your browser
2. Go to **Settings** (gear icon in the bottom-left)
3. Under your team, click **Workflow** (or **Issue statuses & automations** depending on your Linear version)
4. You'll see statuses grouped into categories: **Backlog**, **Unstarted**, **Started**, **Completed**, and **Cancelled**

## Required Statuses

Add the following statuses in their respective categories. Click the **+** button within each category to add a new status.

### Backlog Category

| Status | Description |
|--------|-------------|
| **Discovered** | Very high-level description, incomplete issue. Needs refinement before development. |

### Unstarted Category

| Status | Description |
|--------|-------------|
| **Refined** | Issue has been fleshed out with implementation detail, edge cases, and technical approach. Ready for development but not yet prioritised. |
| **Todo** | Issue has been prioritised and is ready to be picked up for development. |

### Started Category

| Status | Description |
|--------|-------------|
| **In Review** | Development work is complete. Waiting for human review of the implementation. |

### Completed Category

| Status | Description |
|--------|-------------|
| **On Preview** | Deployed to the preview/staging environment for final validation. |
| **On Production** | Released to production. This is the terminal state. |

## Default Statuses to Remove (Optional)

Linear creates default statuses that may conflict with this workflow. Consider removing or archiving:

- **Backlog** — replaced by **Discovered**
- **In Progress** — replaced by **In Review** (we skip "In Progress" because Claude Code handles development; the next human touchpoint is review)
- **Done** — replaced by **On Production**

To remove a status: hover over it and click the trash icon. If issues exist in that status, Linear will ask you to move them first.

## Status Order

Within each category, drag statuses to reorder them. The recommended order matches the issue lifecycle:

1. Discovered (Backlog)
2. Refined (Unstarted)
3. Todo (Unstarted)
4. In Review (Started)
5. On Preview (Completed)
6. On Production (Completed)

## Verification

After configuring, come back to Claude Code and confirm. The setup skill will call `list_issue_statuses` to verify all 6 statuses are present in the correct categories.

## Troubleshooting

- **Status in wrong category**: You cannot move a status between categories. Delete it and recreate it in the correct category.
- **Can't delete a status**: Move all issues out of that status first (Linear will prompt you).
- **Status name already exists**: Linear may have a default with the same name (e.g., "Todo"). If it's in the right category, you can keep it. If it's in the wrong category, rename the existing one first, then create the new one.
