# Issue Patterns and Anti-Patterns

## Common Issue Patterns

### 1. Infrastructure Setup Pattern
**When to use**: For database, configuration, or foundational work

```markdown
Title: Set up [infrastructure component] for [feature]

## Overview
Foundation work required before implementing [feature].

## Acceptance Criteria
- [ ] [Component] is configured and accessible
- [ ] Configuration is documented
- [ ] Environment variables are set
- [ ] Monitoring/logging is configured
- [ ] Rollback procedure is documented

## Testing Requirements
- Test: Configuration loads correctly
- Test: Service starts without errors
- Test: Health check endpoint responds
- Test: Rollback procedure works
```

### 2. CRUD Operations Pattern
**When to use**: For standard Create, Read, Update, Delete operations

```markdown
Title: Implement CRUD operations for [entity]

## Overview
Basic operations for managing [entity] records.

## Acceptance Criteria
- [ ] POST /[entities] creates new record
- [ ] GET /[entities]/:id retrieves single record
- [ ] GET /[entities] retrieves paginated list
- [ ] PUT /[entities]/:id updates existing record
- [ ] DELETE /[entities]/:id soft deletes record
- [ ] Appropriate validation on all endpoints
- [ ] Proper error responses for edge cases

## Testing Requirements
**Unit Tests:**
- Test: Each CRUD operation with valid data
- Test: Validation rejects invalid data
- Test: Proper handling of non-existent IDs

**Integration Tests:**
- Test: Database transactions complete
- Test: Concurrent operations handled correctly
```

### 3. Integration Pattern
**When to use**: For third-party service integrations

```markdown
Title: Integrate with [service] for [purpose]

## Overview
Connect to [service] API to enable [functionality].

## Acceptance Criteria
- [ ] Connection established with proper auth
- [ ] Rate limiting respected
- [ ] Error handling for service unavailability
- [ ] Retry logic with exponential backoff
- [ ] Circuit breaker pattern implemented
- [ ] Response data properly mapped

## Testing Requirements
- Test: Successful API calls
- Test: Auth failure handling
- Test: Rate limit handling
- Test: Service timeout handling
- Test: Mock responses for CI/CD
```

### 4. Data Migration Pattern
**When to use**: For database schema changes or data transformations

```markdown
Title: Migrate [data/schema] for [purpose]

## Overview
Update database to support [new feature/change].

## Migration Steps
1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]

## Acceptance Criteria
- [ ] Migration runs without data loss
- [ ] Rollback script provided and tested
- [ ] Performance impact documented
- [ ] Migration time estimated for production data volume
- [ ] Indexes updated appropriately

## Testing Requirements
- Test: Migration on empty database
- Test: Migration with sample data
- Test: Migration with edge case data
- Test: Rollback restores original state
- Test: Migration performance with large dataset
```

### 5. UI Component Pattern
**When to use**: For frontend component development

```markdown
Title: Build [component] for [feature]

## Overview
Create reusable component for [use case].

## Acceptance Criteria
- [ ] Component renders correctly in all states
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Loading states implemented
- [ ] Error states handled gracefully
- [ ] Props validated with appropriate types
- [ ] Component documented with examples

## Testing Requirements
- Test: Component renders without errors
- Test: Props affect rendering correctly
- Test: User interactions trigger correct callbacks
- Test: Accessibility requirements met
- Test: Visual regression tests pass
```

### 6. Background Job Pattern
**When to use**: For async processing, scheduled tasks, or long-running operations

```markdown
Title: Implement [job type] for [purpose]

## Overview
Background job to handle [async operation].

## Acceptance Criteria
- [ ] Job queued successfully
- [ ] Job processes within SLA
- [ ] Failed jobs retry with backoff
- [ ] Dead letter queue for permanent failures
- [ ] Job status trackable
- [ ] Idempotent execution

## Testing Requirements
- Test: Job completes successfully
- Test: Job handles failures gracefully
- Test: Retry logic works correctly
- Test: Concurrent job execution
- Test: Job timeout handling
```

## Anti-Patterns to Avoid

### 1. Vague Acceptance Criteria
❌ **Bad**: "System should be fast"
✅ **Good**: "API responds in <200ms for 95% of requests"

### 2. Missing Edge Cases
❌ **Bad**: Only happy path criteria
✅ **Good**: Include error handling, validation, boundary conditions

### 3. Untestable Requirements
❌ **Bad**: "Code should be clean"
✅ **Good**: "Code passes linting rules and has >80% test coverage"

### 4. Oversized Issues
❌ **Bad**: One issue for entire feature
✅ **Good**: Break into <5 day chunks

### 5. Missing Dependencies
❌ **Bad**: Issues in random order
✅ **Good**: Clear dependency chain identified

### 6. Ambiguous Titles
❌ **Bad**: "Fix the thing"
✅ **Good**: "Fix race condition in payment processing queue"

### 7. No Testing Requirements
❌ **Bad**: Acceptance criteria without tests
✅ **Good**: Specific test scenarios for each criterion

### 8. Mixing Concerns
❌ **Bad**: Backend + Frontend + Database in one issue
✅ **Good**: Separate issues for each layer

## Issue Sizing Guidelines

### Small (1-2 days)
- Single function or endpoint
- Clear requirements
- No external dependencies
- Minimal testing needed

### Medium (3-5 days)
- Multiple related functions
- Some integration work
- Standard patterns apply
- Normal testing requirements

### Large (5-10 days)
- Complete feature slice
- Multiple integrations
- Complex business logic
- Extensive testing needed

### Extra Large (>10 days)
- Should be broken down
- Create epic with sub-issues
- Each piece independently deployable

## Dependency Indicators

Look for these words/phrases that indicate dependencies:
- "After...", "Once...", "When...is complete"
- "Requires...", "Needs...", "Depends on..."
- "Uses data from...", "Calls...", "Integrates with..."
- "Based on...", "Built on top of...", "Extends..."

## Issue Grouping Strategies

### By Layer
1. Database/Model issues
2. API/Backend issues
3. Frontend/UI issues
4. Integration issues

### By Feature
1. Feature A - all layers
2. Feature B - all layers
3. Feature C - all layers

### By Sprint Goal
1. MVP/Core functionality
2. Enhancement round 1
3. Enhancement round 2
4. Polish and optimization

### By Risk
1. High-risk/unknowns first
2. Standard implementations
3. Nice-to-haves
4. Tech debt/cleanup