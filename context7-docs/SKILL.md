---
name: context7-docs
description: Delegates documentation lookups to a specialized sub-agent to manage context window size. This skill should be used when needing to retrieve library or framework documentation from Context7. The sub-agent searches, finds relevant information, and returns a focused summary rather than loading full documentation into the main context. Triggers include needing docs for a library, looking up API references, finding code examples, or researching how to use a package.
---

# Context7 Documentation Lookup

This skill delegates documentation searches to a sub-agent, keeping the main conversation context lean while still providing accurate, up-to-date library documentation.

## When to Use This Skill

- Looking up documentation for any programming library or framework
- Finding code examples for specific functionality
- Researching API usage patterns
- Getting current documentation (beyond training data cutoff)

## Core Workflow

### Step 1: Identify the Documentation Need

Extract from the user's request:
1. **Library/package name** - The specific library to look up (e.g., "React", "FastAPI", "lodash")
2. **Query focus** - What specific information is needed (e.g., "how to use useEffect cleanup", "authentication middleware setup")
3. **Context requirements** - Any version constraints or specific use case details

### Step 2: Launch Documentation Sub-Agent

Spawn a sub-agent using the Task tool with the following configuration:

```
Task tool parameters:
- subagent_type: "general-purpose"
- model: "haiku" (for efficiency on straightforward lookups)
- description: "Fetch [library] docs"
- prompt: [See prompt template below]
```

**Sub-Agent Prompt Template:**

```
You are a documentation research assistant. Your task is to find and summarize documentation.

## Research Request
- Library: {library_name}
- Query: {specific_query}
- Version (if specified): {version}

## Instructions

1. First, use `mcp__context7__resolve-library-id` to find the Context7 library ID:
   - libraryName: "{library_name}"
   - query: "{specific_query}"

2. If a matching library is found, use `mcp__context7__query-docs` with:
   - libraryId: [the resolved ID]
   - query: "{specific_query}"

3. If Context7 doesn't have the library (no results or poor match), fall back to WebSearch:
   - Search for "{library_name} {specific_query} documentation"
   - Fetch the most relevant documentation page

## Output Format

Provide a focused summary with:

### Summary
[2-3 sentence overview of the answer]

### Key Information
[Bullet points of the most relevant facts, APIs, or patterns]

### Code Examples
[Include 1-2 relevant code snippets if available, properly formatted]

### Source
[Library ID used or URL fetched]

---

Keep the response focused and practical. Include enough context to understand the examples but avoid unnecessary verbosity.
```

### Step 3: Process and Present Results

When the sub-agent returns:

1. **Verify relevance** - Ensure the returned information addresses the original query
2. **Present to user** - Share the summarized documentation
3. **Offer follow-up** - Ask if more detail is needed on any specific aspect

If the sub-agent found no results:
- Inform the user that documentation wasn't found
- Suggest alternative search terms or library names
- Offer to try a web search with different keywords

## Example Usage

**User request:** "How do I set up authentication in FastAPI?"

**Sub-agent prompt:**
```
Library: FastAPI
Query: authentication setup, OAuth2, JWT tokens
```

**Expected response format:**
```
### Summary
FastAPI provides built-in OAuth2 support with password flow and JWT tokens through the `fastapi.security` module.

### Key Information
- Use `OAuth2PasswordBearer` for token-based auth
- `OAuth2PasswordRequestForm` handles login form data
- Combine with `python-jose` for JWT encoding/decoding
- Dependency injection via `Depends()` for route protection

### Code Examples
[Relevant code snippet]

### Source
/tiangolo/fastapi
```

## Configuration Options

### Model Selection

- **haiku** (default): Fast, cost-effective for straightforward lookups
- **sonnet**: Use when the query is complex or requires deeper analysis
- **opus**: Rarely needed; use only for highly nuanced documentation research

### Fallback Behavior

The sub-agent will automatically fall back to web search if:
- Context7 doesn't have the requested library
- The library ID resolution returns no good matches
- The documentation query returns insufficient results

## References

- See `references/query-patterns.md` for common query formulations and optimization tips
