# Query Project Documentation

Quickly retrieve information from project documentation.

## Instructions

You are handling a documentation query. Use the project-docs skill to find and return relevant information.

### Query Processing

1. Parse the user's query from the command arguments: `$ARGUMENTS`
2. Determine the retrieval mode:
   - If query starts with "show" or "get" → Section mode
   - If query starts with "summarize" or "overview" → Summary mode
   - Otherwise → Query mode (default)

### Section Mode

Load and return the full content of a documentation file.

Map common requests to files:
- "api", "endpoints", "routes" → `docs/api-reference.md`
- "database", "schema", "tables" → `docs/database.md`
- "architecture", "system" → `docs/architecture.md`
- "conventions", "patterns", "style" → `docs/conventions.md`
- "data flow", "flow" → `docs/data-flow.md`

### Query Mode

Search documentation for relevant information:

1. Read `docs/index.md` to understand structure
2. Search relevant files for the query terms
3. Extract and return focused excerpts
4. Cite which file each excerpt came from

### Summary Mode

Provide a compressed overview:

1. Load the relevant documentation
2. Extract only key points
3. Return a concise summary (aim for <500 words)

### Response Format

Always include:
- The answer/content requested
- Source file references
- Suggestion to run `/update-docs` if docs seem stale

## Example Usage

```
/docs how does authentication work
/docs show api reference
/docs summarize the architecture
/docs what database tables store orders
```

## No Arguments

If no query is provided, return:
1. When docs were last updated (from `.last-update`)
2. List of available documentation sections
3. Example queries
