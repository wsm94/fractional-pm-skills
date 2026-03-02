# Common Issues in Development Tickets

This document catalogs frequently missed items and patterns when writing development issues.

## Database & Models

### Missing Field Specifications

**Problem**: Issue mentions "add user preferences" but doesn't specify field types, constraints, or structure.

**Example Bad**:
```
Add user preferences to User model
```

**Example Good**:
```
Add to User model:
- preferences: Object
  - theme: String, enum ['light', 'dark'], default 'light'
  - notifications: Boolean, default true
  - language: String, enum ['en', 'es', 'fr'], default 'en'
```

### Forgotten Indexes

**Problem**: New query patterns added without considering indexes.

**Impact**: Performance degrades as data grows.

**Check for**: Any new queries on non-indexed fields, especially in loops or frequently called APIs.

### Migration Edge Cases

**Problem**: Migration assumes all existing records have certain data.

**Example**:
```typescript
// Bad - assumes all users have email
await User.updateMany({}, { 
  emailVerified: user.email.includes('@verified') 
});

// Good - handles missing email
await User.updateMany(
  { email: { $exists: true, $ne: null } },
  { emailVerified: false }
);
```

### Relationship Inconsistencies

**Problem**: Model relationships defined on one side but not bidirectional when needed.

**Example**: Order references User, but User doesn't have orders array when it should.

## APIs & Services

### Missing Status Codes

**Problem**: Issue only mentions "return error" without specifying HTTP status codes.

**Should specify**:
- 400 for validation errors
- 401 for authentication failures
- 403 for authorization failures
- 404 for not found
- 409 for conflicts
- 500 for server errors

### Undefined Error Messages

**Problem**: "Return error if invalid" without specifying what message users see.

**Better**: Specify exact error messages, including field-level validation errors.

### Pagination Forgotten

**Problem**: "List all X" endpoints without pagination parameters.

**Impact**: Works fine in development with 10 records, breaks production with 10,000.

**Always consider**: offset/limit or cursor-based pagination for any list endpoint.

### Race Conditions

**Problem**: Concurrent requests not considered.

**Common scenarios**:
- Two users booking the last seat simultaneously
- Concurrent updates to the same record
- Incrementing counters

**Solutions**: Optimistic locking, transactions, atomic operations.

## Frontend/UI

### Loading States

**Problem**: Issue describes happy path but forgets loading state.

**Missing**: 
- Skeleton screens
- Spinners
- Disabled buttons during submission
- Progress indicators

### Error Boundaries

**Problem**: New component added without considering error handling.

**Should specify**: What happens when API call fails, data is invalid, or component throws error.

### Empty States

**Problem**: Design shows populated lists, no guidance for empty state.

**Should include**: 
- Empty state messaging
- Call-to-action when empty
- First-time user guidance

### Mobile Considerations

**Problem**: Desktop-first design without mobile specifications.

**Often forgotten**:
- Touch target sizes (min 44x44px)
- Gesture handling
- Keyboard avoidance
- Safe areas (notches, home indicators)

## Integration & External Services

### Timeout Values

**Problem**: Integration added without timeout specifications.

**Should define**:
- Connection timeout
- Read timeout
- Total timeout
- Retry behavior

### API Key Management

**Problem**: "Integrate with X API" without addressing credential storage.

**Should specify**:
- Environment variables
- Secrets management
- Key rotation strategy
- Per-environment keys

### Webhook Reliability

**Problem**: Webhook handler doesn't consider delivery failures.

**Should handle**:
- Duplicate deliveries (idempotency)
- Out-of-order delivery
- Replay attacks
- Signature verification

### Rate Limiting

**Problem**: Third-party API integrated without rate limit handling.

**Should specify**:
- Request throttling
- Backoff strategy
- Queue management
- User feedback when limited

## Testing

### Forgotten Test Cases

**Common omissions**:
- Boundary values (0, negative, very large)
- Null/undefined inputs
- Malformed data
- Concurrent access
- Already-exists scenarios

### Missing Integration Tests

**Problem**: Unit tests specified but integration tests for critical paths omitted.

**Critical paths needing integration tests**:
- Payment processing
- Authentication flows
- Data import/export
- Third-party integrations

### Test Data Management

**Problem**: Tests rely on production-like data without specifying how to create it.

**Should include**:
- Seed data scripts
- Factory functions
- Mock data generators
- Cleanup procedures

## Security

### Input Sanitization

**Problem**: User input used directly without validation/sanitization.

**Common oversights**:
- SQL injection in raw queries
- XSS in rendered user content
- Path traversal in file operations
- Command injection in system calls

### Authentication Edge Cases

**Problem**: Auth implemented for happy path only.

**Often forgotten**:
- Expired tokens
- Revoked tokens
- Token refresh flow
- Concurrent sessions
- Remember me functionality

### Authorization Gaps

**Problem**: Permission checks on read but not on write, or vice versa.

**Pattern**: Every CRUD operation needs authorization check.

### Sensitive Data Logging

**Problem**: Logging added for debugging but logs passwords, tokens, PII.

**Should specify**: What fields to redact in logs.

## Performance

### N+1 Queries

**Problem**: Loop that queries database on each iteration.

**Example**:
```typescript
// Bad
const orders = await Order.find({});
for (const order of orders) {
  order.user = await User.findById(order.userId); // N+1!
}

// Good
const orders = await Order.find({}).populate('user');
```

### Missing Caching

**Problem**: Expensive computation or frequent query without caching consideration.

**Should specify**: Cache strategy, TTL, invalidation rules.

### Unbounded Queries

**Problem**: Query without limits that could return millions of records.

**Always add**: Pagination, limits, or streaming for large datasets.

### Large File Handling

**Problem**: File upload/download without size limits or streaming.

**Should specify**:
- Maximum file size
- Chunked upload/download
- Progress indicators
- Virus scanning

## DevOps

### Environment-Specific Config

**Problem**: Issue assumes single environment, doesn't address dev/staging/prod differences.

**Should specify**:
- Environment variables needed
- Config differences per environment
- Local development setup

### Missing Monitoring

**Problem**: New feature added without observability.

**Should include**:
- What metrics to track
- What to log
- What to alert on
- Dashboard requirements

### Deployment Dependencies

**Problem**: "Deploy feature X" without mentioning required infrastructure changes.

**Often forgotten**:
- Database migrations
- New environment variables
- New external services
- Feature flags
- Dependency updates

### Rollback Plan

**Problem**: Deployment steps defined but no rollback procedure.

**Should specify**:
- How to detect failure
- How to rollback
- Data migration rollback
- What gets lost in rollback

## Scope Creep Indicators

### Hidden Complexity

**Red flags**:
- "Simple" in title but description has 10+ requirements
- "Just" or "quick" combined with infrastructure changes
- "While we're at it" additions
- Multiple "and also" statements

### Mixed Concerns

**Problems**:
- Database migration + API changes + UI updates in single ticket
- Bug fix + new feature combined
- Refactoring + feature addition

**Better**: Separate into dependent tickets with clear order.

### Vague Acceptance Criteria

**Examples**:
- "Works correctly"
- "User can manage settings"
- "Improves performance"

**Should be**: Specific, measurable, testable.

## Ticket Splitting Patterns

### Split by Risk

**High risk**: Authentication, payment, data migration
**Low risk**: UI tweaks, logging additions

**Pattern**: Isolate high-risk changes for careful review.

### Split by Dependencies

**Pattern**: 
1. Foundation (models, migrations)
2. API layer
3. UI layer
4. Integration/glue code

### Split by Value

**Pattern**: 
1. Core functionality (MVP)
2. Nice-to-have features
3. Optimizations

### Split by Rollout

**Pattern**:
1. Backend changes (deploy first)
2. Frontend changes (deploy after backend stable)
3. Enable feature flag

## Recommended Issue Structure

### For Backend Issues

```markdown
## Objective
[One sentence: What business problem does this solve?]

## Acceptance Criteria
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2

## Database Changes
[Models, fields, indexes, migrations]

## API Changes
[Endpoints, request/response formats, status codes]

## Dependencies
[Other tickets, external services, libraries]

## Testing Requirements
[Unit tests, integration tests, test data]

## Edge Cases
[Known edge cases and how to handle them]

## Estimated Effort
[Hours/Story points]
```

### For Frontend Issues

```markdown
## Objective
[One sentence: What user need does this address?]

## User Flow
[Step-by-step user interaction]

## Acceptance Criteria
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2

## UI States
- Loading state
- Success state
- Error state
- Empty state

## API Integration
[Endpoints called, error handling]

## Responsive Design
[Mobile/tablet/desktop considerations]

## Accessibility
[Screen reader, keyboard navigation, ARIA]

## Testing Requirements
[Component tests, E2E scenarios]

## Estimated Effort
[Hours/Story points]
```

### For Integration Issues

```markdown
## Objective
[What systems are being integrated and why?]

## Integration Points
[APIs, webhooks, events]

## Data Flow
[Diagrams or descriptions of data movement]

## Acceptance Criteria
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2

## Configuration
[API keys, secrets, environment variables]

## Error Handling
[Timeouts, retries, fallbacks]

## Monitoring
[Metrics, logs, alerts]

## Testing Requirements
[Integration tests, mock services]

## Estimated Effort
[Hours/Story points]
```
