# Query Patterns for Context7 Documentation Lookup

This reference provides guidance on formulating effective queries for Context7 and fallback web searches.

## Effective Query Formulation

### Be Specific Over General

**Good queries:**
- "React useEffect cleanup function examples"
- "FastAPI dependency injection with database sessions"
- "lodash debounce with leading and trailing options"

**Poor queries:**
- "React hooks" (too broad)
- "FastAPI" (no specific topic)
- "lodash functions" (not actionable)

### Include Context Keywords

When the user's request implies a specific use case, include relevant keywords:

| User Intent | Query Enhancement |
|-------------|-------------------|
| Error handling | Add "error", "exception", "try-catch" |
| Performance | Add "optimization", "performance", "efficient" |
| Testing | Add "testing", "mock", "unit test" |
| TypeScript | Add "typescript", "types", "typing" |
| Async operations | Add "async", "await", "promise" |

## Common Library ID Patterns

Context7 library IDs follow the pattern `/org/project`. Common examples:

| Library | Likely Context7 ID |
|---------|-------------------|
| React | `/facebook/react` |
| Next.js | `/vercel/next.js` |
| FastAPI | `/tiangolo/fastapi` |
| Express | `/expressjs/express` |
| Django | `/django/django` |
| Vue | `/vuejs/vue` |
| Svelte | `/sveltejs/svelte` |
| Prisma | `/prisma/prisma` |
| tRPC | `/trpc/trpc` |

Always use `resolve-library-id` first rather than guessing.

## Handling Ambiguous Requests

### Multiple Possible Libraries

When a query could apply to multiple libraries:

1. Check if user specified a tech stack elsewhere in conversation
2. Ask for clarification if truly ambiguous
3. Default to the most popular/mainstream option

### Version-Specific Documentation

Some queries are version-sensitive:

- "React Server Components" → Requires React 18+
- "Next.js App Router" → Requires Next.js 13+
- "Vue Composition API" → Vue 3 preferred

Include version context in the query when relevant.

## Web Search Fallback Strategies

When Context7 doesn't have the library:

### Primary Search Pattern
```
"{library} {topic} documentation official"
```

### Alternative Patterns
```
"{library} {topic} guide"
"{library} {topic} examples"
"{library} {topic} tutorial"
```

### Preferred Documentation Sources

Prioritize results from:
1. Official documentation sites (docs.*, *.dev)
2. GitHub repositories (README, wiki)
3. Reputable tutorial sites (MDN, Real Python, etc.)

Avoid:
- Stack Overflow answers (often outdated)
- Random blog posts (quality varies)
- AI-generated content farms

## Query Complexity Assessment

Use this to decide on model selection:

### Use Haiku (Default)
- Single library lookups
- Specific function/method documentation
- Code example retrieval
- API reference lookups

### Consider Sonnet
- Comparing multiple approaches
- Architecture/design pattern questions
- Integration between multiple libraries
- Complex configuration scenarios

### Rare Cases for Opus
- Deep architectural analysis
- Novel integration patterns not well-documented
- Synthesizing across multiple complex sources

## Summarization Guidelines

When the sub-agent returns results, the summary should:

1. **Lead with the answer** - Don't bury the key information
2. **Include working code** - Examples should be copy-paste ready
3. **Note gotchas** - Mention common pitfalls if documented
4. **Cite the source** - Include the library ID or URL for reference

### Summary Length Targets

| Query Type | Target Length |
|------------|---------------|
| Simple API lookup | 100-200 words |
| How-to guide | 200-400 words |
| Complex integration | 400-600 words |

Err on the side of conciseness while ensuring completeness.
