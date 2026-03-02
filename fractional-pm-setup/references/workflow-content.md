## Development Workflow

### Project Types

- **Greenfield** — new project, starts from ideation in Claude Web
- **Brownfield** — existing project, skips ideation and enters at Handoff to Code

At any point, an ideation phase can run in parallel using Claude Web, feeding new specs back into `docs/reference/`.

### Phase 1: Ideation & Research (Claude Web)

*Greenfield only. Brownfield projects skip to Phase 2.*

Work happens in Claude Web to leverage extended thinking, web search, and conversational iteration.

**Outputs placed in `docs/reference/`:**

| Document | Format | Description |
|----------|--------|-------------|
| PRD (MVP) | Markdown | Product Requirements Document scoped to MVP |
| Brand Guidelines | HTML | Full brand identity — colours, typography, spacing, components |
| Demo Views | TSX/JSX | Key screens and layouts built with shadcn/ui components |
| Master Vision *(optional)* | Markdown | Long-term product direction and business context |

### Phase 2: Planning & Work Management (Claude Code + Linear MCP)

Work is split into **feature work** (proactive, PRD-driven) and **reactive work** (responsive, from human review).

#### Linear Issue Statuses

| Status | Meaning |
|--------|---------|
| Discovered | Very high-level description, incomplete issue |
| Refined | Issue fleshed out and ready for development |
| Todo | Issue prioritised and ready to be picked up |
| In Review | Dev work complete, waiting for human review |
| On Preview | Deployed to preview environment |
| On Production | Released |

#### Feature Work

1. Ingest the PRD from `docs/reference/`
2. Run `/product-manager` — digests the PRD, asks clarifying questions, creates a Linear project
3. Run `/issue-creator` — generates Linear issues (status: **Discovered**) with BDD acceptance criteria, dependencies, and ordering

#### Issue Refinement (Parallel Thread)

A dedicated second Claude Code thread runs alongside development for ticket refinement:

1. Pick up **Discovered** issues from Linear
2. Explore the codebase to understand implementation approach
3. Cross-reference PRD intent, existing patterns, and architecture
4. Flesh out ticket with implementation detail, edge cases, and technical approach
5. Move issue to **Refined** status

#### Reactive Work

Work emerging from human review of **In Review** issues:

- **Implementation corrections** — features not matching intent
- **Bugs** — defects found during review or testing
- **Small tasks** — tweaks, copy changes, minor improvements

Reactive issues are created directly in Linear at **Refined** or **Todo** status.

#### Issue Lifecycle

Discovered → Refined → Todo → In Review → On Preview → On Production
