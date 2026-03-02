---
name: issue-creator
description: Creates well-structured development issues from various sources including PRDs, feature requests, bug reports, or technical specifications. Generates Linear-ready issues with BDD acceptance criteria, testing requirements, and dependency ordering. Use when user wants to create development tasks, break down requirements, convert documents to issues, or prepare sprint backlogs. Triggers include "create issues from", "break down into tasks", "convert to tickets", "generate development issues", "make Linear issues".
---

# Issue Creator

Creates professional development issues from any requirements source - PRDs, feature requests, technical specs, or bug reports. Generates properly structured issues with BDD-ready acceptance criteria, comprehensive testing requirements, and intelligent dependency ordering.

## Workflow Decision Tree

1. **User provides source material** → Identify type and ask about scope
2. **Analyze content structure** → Extract features, bugs, or requirements
3. **Generate issues** → Create structured issues with all required fields
4. **Order by dependencies** → Arrange in logical development sequence
5. **Output or integrate** → Provide issues in requested format or create in Linear

## Step 1: Source Identification & Scope

First, identify the source type:
- **PRD/Requirements Doc** → Feature breakdown approach
- **Bug Report** → Investigation and fix approach  
- **Feature Request** → User story approach
- **Technical Spec** → Implementation task approach
- **Meeting Notes** → Action item extraction

Then ask the user:
- "What parts should I convert to issues?" (if document is large)
- "What level of granularity do you prefer?" 
  - **Epic-level**: High-level features (5-10 issues total)
  - **Feature-level**: Individual features (15-30 issues)
  - **Task-level**: Detailed implementation tasks (40+ issues)
- "Do you have a preferred issue naming convention?"
- "What type of issues should I create?" (feature, bug, task, story)

## Step 2: Content Analysis

Analyze the source material to extract:

### Functional Requirements
- Core features and capabilities
- User journeys and workflows
- Business rules and logic
- Data requirements

### Technical Requirements
- Architecture decisions
- Integration points
- Performance requirements
- Security requirements

### Non-Functional Requirements
- Scalability needs
- Reliability requirements
- Usability standards
- Compliance requirements

## Step 3: Issue Generation

For each identified work item, create an issue with:

### Required Fields

**Title**: Action-oriented, specific
- Good: "Implement multi-channel price suggestion API"
- Bad: "Pricing feature"

**Description**: 
```markdown
## Overview
[Context from PRD explaining why this is needed]

## Requirements
[Specific requirements extracted from PRD]

## Context
[Related PRD sections or references]
```

**Acceptance Criteria** (BDD-ready format):
```markdown
- [ ] Given [initial context], when [action], then [expected outcome]
- [ ] System validates [specific validation]
- [ ] Error handling for [edge case]
- [ ] Performance meets [specific metric]
- [ ] [Additional criteria as needed]
```

**Testing Requirements**:
```markdown
**Unit Tests:**
- Test: [Component/function] handles [scenario]
- Test: Validation for [input/field]
- Test: Error cases return appropriate responses

**Integration Tests:**
- Test: API endpoint returns correct response
- Test: Database operations complete successfully
- Test: External service integration works

**E2E Tests (if applicable):**
- Scenario: User completes [workflow]
- Scenario: System handles [failure gracefully]
```

### Optional Fields (when applicable)

**Dependencies**: Other issues that must be completed first

**Technical Notes**: Implementation considerations from PRD

**API Contracts**: If interfaces are defined in PRD

**Estimated Effort**: Based on complexity indicators

## Step 4: Dependency Ordering

Organize issues in development sequence:

### Phase 1: Foundation
- Database schema and models
- Core infrastructure
- Authentication/authorization
- Base configurations

### Phase 2: Backend Services
- Business logic implementation
- API endpoints
- Data processing services
- Integration services

### Phase 3: Frontend Components
- UI components
- User workflows
- Forms and validation
- State management

### Phase 4: Integration & Polish
- Third-party integrations
- Performance optimization
- Error handling improvements
- Analytics and monitoring

### Phase 5: Testing & Documentation
- E2E test scenarios
- Performance testing
- Documentation updates
- Deployment configuration

## Step 5: Linear Integration

If Linear MCP connection is available:

1. **Check connection**: "I can create these issues directly in Linear. Would you like me to do that?"

2. **If yes, gather configuration**:
   - List available projects and teams
   - Show available workflow states
   - Display available labels and priorities

3. **Ask user to select**:
   - Target project or team
   - Initial status (e.g., "Backlog", "Todo", "Ready")
   - Priority for issues
   - Any labels to apply
   - Whether to link dependencies

4. **Create issues**:
   - Create in dependency order
   - Add issue links for dependencies
   - Apply selected labels and priority
   - Set to chosen initial state

## Issue Templates

### Feature Implementation
```markdown
## Overview
[Why this feature is needed - from source material]

## Acceptance Criteria
- [ ] Given a user with [role], when [action], then [outcome]
- [ ] System validates that [validation rule]
- [ ] Performance: [Operation] completes in <[time]
- [ ] Error handling: [Edge case] shows [error message]

## Testing Requirements
**Unit Tests:**
- Test: [Function] correctly [behavior]
- Test: Input validation rejects [invalid input]

**Integration Tests:**
- Test: Feature integrates with [system]
- Test: Data persists correctly to database

**E2E Tests:**
- Test: Complete user journey from [start] to [finish]

## Technical Notes
- [Implementation consideration]
- [Performance requirement]
- [Security consideration]

## Dependencies
- Blocked by: #[issue] - [Database schema must be updated]
```

### Bug Fix
```markdown
## Problem Description
[What is broken and how it affects users]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What currently happens]

## Acceptance Criteria
- [ ] Bug no longer reproducible following steps above
- [ ] Fix does not introduce regression in [related feature]
- [ ] Root cause documented
- [ ] Fix includes preventive measures

## Testing Requirements
**Unit Tests:**
- Test: Add test case that reproduces the bug
- Test: Verify fix resolves the issue

**Regression Tests:**
- Test: Related functionality still works
- Test: Performance not degraded

## Technical Notes
- Suspected root cause: [hypothesis]
- Affected versions: [versions]
- Workaround available: [yes/no, details]
```

### Technical Task
```markdown
## Objective
[What needs to be accomplished technically]

## Technical Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## Acceptance Criteria
- [ ] Implementation follows [pattern/standard]
- [ ] Code passes all linting rules
- [ ] Test coverage >80%
- [ ] Documentation updated
- [ ] Performance benchmarks met

## Testing Requirements
**Unit Tests:**
- Test: Core functionality works as specified
- Test: Edge cases handled correctly

**Performance Tests:**
- Test: Meets latency requirements
- Test: Handles expected load

## Dependencies
- Requires: [prerequisite work]
- Impacts: [downstream systems]
```

### User Story
```markdown
## Story
As a [user type]
I want [functionality]
So that [benefit/value]

## Acceptance Criteria
- [ ] Given [context], when [action], then [outcome]
- [ ] User can [specific capability]
- [ ] System provides [feedback/confirmation]
- [ ] Feature is accessible on [devices/platforms]

## Testing Requirements
**User Acceptance Tests:**
- Scenario: [Happy path workflow]
- Scenario: [Alternative path]
- Scenario: [Error handling]

**Usability Tests:**
- Test: Feature discoverable by new users
- Test: Workflow completable in <X clicks

## Design Notes
- Mockups: [link to designs]
- User research: [findings summary]
```

### API Endpoint
```markdown
## Endpoint
`[METHOD] /api/v1/[resource]`

## Purpose
[What this endpoint does - from PRD]

## Request/Response
\```typescript
// Request
interface [Resource]Request {
  // fields from PRD
}

// Response  
interface [Resource]Response {
  // fields from PRD
}
\```

## Acceptance Criteria
- [ ] Accepts valid [resource] data
- [ ] Returns [status] on success
- [ ] Validates all required fields
- [ ] Handles auth correctly
- [ ] Implements rate limiting

## Testing Requirements
**Unit Tests:**
- Test: Validation logic for each field
- Test: Business logic calculations

**Integration Tests:**
- Test: 200 response for valid request
- Test: 400 response for invalid data
- Test: 401 for unauthorized
- Test: 429 for rate limit exceeded
```

### Database Migration
```markdown
## Overview
[What data structure is being added/modified]

## Changes
- [ ] Add table: [table_name]
- [ ] Add columns: [column details]
- [ ] Add indexes: [index details]
- [ ] Add constraints: [constraint details]

## Acceptance Criteria
- [ ] Migration runs without errors
- [ ] Rollback works correctly
- [ ] No data loss on existing tables
- [ ] Performance impact acceptable

## Testing Requirements
- Test: Migration on empty database
- Test: Migration with existing data
- Test: Rollback restores previous state
- Test: Indexes improve query performance
```

## Quality Guidelines

### Writing Effective Acceptance Criteria

**Good criteria are**:
- Specific and measurable
- Written in Given-When-Then or checklist format
- Include both positive and negative cases
- Reference specific values/thresholds from PRD

**Examples**:
```markdown
✅ Good: Given a price >£30, when routing decision made, then item marked for e-commerce centre
❌ Bad: Expensive items are routed appropriately

✅ Good: API responds in <200ms for 95% of requests under normal load
❌ Bad: API is fast
```

### Extracting from Different Sources

**From PRDs/Requirements Docs**:
- Functional requirements → Feature issues
- User journeys → User story issues
- Technical specifications → Implementation tasks
- Non-functional requirements → Technical debt or infrastructure issues

**From Bug Reports**:
- Problem description → Bug fix issue
- Steps to reproduce → Acceptance criteria
- Affected users → Priority level
- Workarounds → Technical notes

**From Feature Requests**:
- User need → User story
- Requested functionality → Acceptance criteria
- Business value → Issue priority
- Success metrics → Testing requirements

**From Technical Specs**:
- API contracts → API endpoint issues
- Data models → Database migration issues
- Architecture decisions → Infrastructure issues
- Performance requirements → Technical tasks

**From Meeting Notes**:
- Action items → Task issues
- Decisions → Documentation issues
- Follow-ups → Investigation tasks
- Deadlines → Issue priorities

### Dependency Detection Patterns

Look for these indicators in PRDs:
- "Requires", "depends on", "after", "needs"
- "Uses data from", "calls", "integrates with"
- Sequential workflow steps
- Technical prerequisites (DB → API → UI)

## Configuration

Default settings (can be overridden by user):
- **Granularity**: Feature-level
- **Include estimates**: Yes (T-shirt sizes)
- **Testing requirements**: Always included
- **BDD format**: Preferred for criteria
- **Dependency linking**: Automatic
- **Issue naming**: "[Feature] - [Specific Task]"

## References

For complex scenarios:
- See `references/issue-patterns.md` for common patterns
- See `references/bdd-examples.md` for BDD criteria examples
- See `references/estimation-guide.md` for effort estimation
