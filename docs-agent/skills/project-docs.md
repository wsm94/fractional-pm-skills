# Project Documentation Skill

Provides context-aware access to project documentation stored in `docs/`. Use this skill when you need to understand how the project works, find specific information, or get oriented in the codebase.

## When to Use This Skill

- When starting work on an unfamiliar part of the codebase
- When you need to understand how components interact
- When looking for API endpoints or database schema
- When checking project conventions before writing code
- When you need architectural context for a decision

## Retrieval Modes

### Query Mode (Default)

Ask a natural language question. The skill searches documentation and returns relevant excerpts.

**Examples:**
- "How does payment processing work?"
- "What's the authentication flow?"
- "How are orders stored in the database?"

**Behavior:**
1. Search `docs/` for relevant content
2. Return focused excerpts that answer the question
3. Include file references for deeper reading

### Section Mode

Request a specific documentation section by name.

**Examples:**
- "Show me the API reference"
- "Get the database schema docs"
- "Load the iOS architecture overview"

**Behavior:**
1. Load the requested file from `docs/`
2. Return the full content
3. If file doesn't exist, suggest alternatives

### Summary Mode

Get a compressed overview of a topic or the whole project.

**Examples:**
- "Summarize the project architecture"
- "Give me a quick overview of the web app"
- "Brief summary of conventions"

**Behavior:**
1. Load relevant documentation
2. Compress to key points only
3. Optimize for minimal context usage

## Documentation Structure

The `docs/` directory typically contains:

```
docs/
├── index.md           # Project overview, links to all sections
├── architecture.md    # System design, component relationships
├── data-flow.md      # How data moves through the system
├── api-reference.md  # API endpoints, request/response formats
├── database.md       # Schema, relationships, RLS policies
├── conventions.md    # Code patterns, naming, style
└── [app-name]/       # Per-app documentation (monorepos)
```

## Response Format

When returning documentation:

1. **Be concise** - Only return what's needed to answer the question
2. **Cite sources** - Reference which doc file information came from
3. **Suggest follow-up** - If there's related documentation, mention it
4. **Note gaps** - If docs don't cover something, say so

## Integration with Coding Tasks

When working on code:
- Query relevant docs BEFORE making changes
- Check conventions docs for patterns to follow
- Reference API docs when working with endpoints
- Check database docs before schema changes

## Keeping Docs Current

If you notice documentation is outdated or missing:
- Note it in your response
- Suggest running `/update-docs` to regenerate
- The `.last-update` file shows when docs were last generated
