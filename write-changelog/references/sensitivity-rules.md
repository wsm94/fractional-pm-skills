# Sensitivity Filtering Rules

Apply these rules when writing release notes to ensure no sensitive or internal implementation details leak into public-facing output.

## Categories of Sensitive Information

### 1. Environment and Configuration

Never include:
- Environment variable names or values (e.g. ANTHROPIC_API_KEY, SUPABASE_URL, DATABASE_URL)
- Configuration file paths (e.g. .env.local, config/production.yml)
- Port numbers, hostnames, IP addresses
- Feature flag names or internal toggle identifiers

### 2. Authentication and Security

Never include:
- API keys, tokens, secrets, or passwords
- OAuth client IDs or secrets
- JWT structure, claims, or token formats
- Security middleware or validation logic details
- Row Level Security policy names or structures
- Details of the vulnerability being fixed (describe impact only)

### 3. Code Structure and Architecture

Never include:
- File paths (e.g. src/lib/ai/agent.ts, components/ChatDrawer.tsx)
- Function, method, or class names (e.g. validateThreadOwnership, handleToolUse)
- Import paths or module names
- Directory structure details
- Interface or type names
- Package or library names unless they are user-facing products

### 4. Database and Data

Never include:
- Table names, column names, or schema details
- Migration file names or contents
- Query patterns or SQL snippets
- Index names or database internal identifiers
- Data model or ORM entity names

### 5. Infrastructure and Services

Never include:
- Internal service names or URLs
- API endpoint paths (e.g. /api/chat, /api/tasks)
- Deployment configuration or hosting details
- CI/CD pipeline details
- Third-party service integration details beyond the public service name

### 6. Project Management

Never include:
- Internal ticket or issue numbers (ORG-86, JIRA-123, GH-42)
- Sprint names or team names
- Internal stakeholder names
- Internal process references or meeting notes

## Transformation Examples

These examples show how to convert developer-facing commit messages into public-facing release notes:

| Commit Message | BAD (Too Technical) | GOOD (Public-Facing) |
|---|---|---|
| fix: validate thread_id ownership to prevent cross-user summary leakage | Fixed thread_id validation in /api/chat/summary endpoint | Fixed an issue where conversation summaries could appear in the wrong account |
| feat: add search_threads tool, semantic search, supabase client refactor | Added search_threads tool with pgvector semantic search in Supabase | You can now search across your conversations using natural language |
| fix: use canonical Tailwind v4 class z-100 instead of z-[100] | Fixed Tailwind CSS z-index class from z-[100] to z-100 | Fixed a visual layering issue in the interface |
| refactor: migrate middleware.ts to proxy convention (Next.js 16) | Migrated middleware.ts to Next.js 16 proxy convention | Improved application compatibility and reliability |
| feat: add rate limiting, input sanitisation, and usage tracking | Added rate limiting with express-rate-limit and input sanitization middleware | Added additional security protections to keep your data safe |
| fix: configurable site URL for signup emails | Fixed SITE_URL env var for Supabase email redirects | Fixed an issue where sign-up confirmation emails could redirect incorrectly |
| feat: improve text contrast and readability across the app | Updated Tailwind theme void-* color tokens for WCAG contrast | Improved text readability across the entire application |

## Decision Framework for Inclusion

Not all commits belong in the changelog. Use this framework:

**Include as individual entries:**
- New user-visible features or capabilities
- Bug fixes that affected user experience
- Performance improvements users would notice
- Security fixes (describe impact, not the vulnerability)

**Merge into a single entry:**
- Multiple commits that contribute to the same feature or fix
- Several small UI tweaks (combine as "Various interface improvements")

**Exclude entirely:**
- Internal refactors with no user-facing change
- Dependency updates (unless security-related)
- Documentation-only changes
- CI/CD pipeline changes
- Code style or linting changes
- Developer tooling changes
- Test additions or modifications
