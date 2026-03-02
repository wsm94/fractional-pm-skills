# PRD Structure & Style Guide

Complete reference for generating Product Requirements Documents.

## PRD Structure

### 1. Executive Summary
- **Product Overview**: 2-3 sentence description
- **Background & Context**: Current state and business need
- **Objectives**: Primary goals and success metrics (use tables)
- **Scope**: What's in, what's out

### 2. Problem Statement & User Personas
- **Problem Definition**: Clear articulation of user pain point
- **User Personas**: Primary and secondary users
  - Name, context, needs, pain points
- **Use Cases**: Concrete scenarios

### 3. UI Mockups & Designs (if created in Web Chat)

Include links to interactive mockups with:
- Purpose of each screen
- Link to interactive artifact
- Key features demonstrated
- States shown (default, loading, error, empty, success)
- Design system used
- Design decisions made

Example format:
```markdown
### 3.1 Main Dashboard
**Purpose:** Primary user interface showing key metrics
**Mockup:** [View Interactive Mockup](computer://...)
**Key Features:**
- Real-time stats
- Quick actions
- Activity feed

**States Demonstrated:**
- Default with data
- Loading state
- Empty state
- Error state
```

### 4. Functional Requirements

Organize by feature area or user flow:

```markdown
### F-XXX: [Feature Name]
**Priority:** P0 (Critical) / P1 (High) / P2 (Medium) / P3 (Low)
**Status:** Not Started / In Progress / Complete

**Description:**
[Clear description]

**Acceptance Criteria:**
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2
- [ ] Edge case handling

**Technical Notes:**
- Implementation approach
- Dependencies
- Performance considerations
```

### 5. User Experience Flow

Use mermaid diagrams or numbered steps:

```markdown
### Primary Flow: [Flow Name]
1. User action
   ↓
2. System response
   ↓
3. Next step
```

### 6. Data Requirements
- **Schema/Models**: TypeScript interfaces, database schemas
- **API Contracts**: Request/response formats
- **Validation Rules**: Required fields, formats, constraints

### 7. Technical Specifications
- **Technology Stack**: What's being used and why
- **Architecture**: How components fit together
- **API Endpoints**: Methods, paths, parameters
- **Dependencies**: External libraries, services
- **Security Considerations**: Auth, validation, data protection

### 8. Testing Requirements
- **Unit Tests**: Key functions to test
- **Integration Tests**: System interactions
- **Edge Cases**: Specific scenarios to test
- **Performance Tests**: Load, stress, limits

### 9. Success Metrics & KPIs

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| [Metric] | [Value] | [Value] |

### 10. Implementation Plan

**Phase 1: [Name] (Timeline)**
- Task 1
- Task 2

**Phase 2: [Name] (Timeline)**
- Task 3
- Task 4

### 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk] | High/Med/Low | [Strategy] |

### 12. Future Enhancements
- Phase 2 features
- Long-term considerations
- Scalability plans

### 13. Appendices
- Glossary
- Code examples
- API documentation
- References
- Change log

## Code Examples

Use realistic, implementation-ready code:

**Good:**
```typescript
interface ListingSurvey {
  employeeId: string;
  surveyPeriod: {
    year: number;
    quarter?: number;
  };
}

POST /api/v1/listings/create
Request: {
  "title": string,
  "description": string,
  "price": number
}
```

**Avoid:**
- Pseudo-code
- Incomplete types
- Vague comments

## Style Guidelines

### Tone
- Professional but conversational
- Clear and direct
- Action-oriented
- Define jargon in glossary

### Formatting
- Markdown headers (##, ###, ####) for hierarchy
- Tables for structured data
- Checkboxes [ ] for acceptance criteria
- Code blocks with language tags
- Mermaid diagrams for flows
- Emoji sparingly (✅ ❌ ⚠️)

### Length
- Executive summary: 300-500 words
- Feature requirements: Detailed, with subsections
- Total: 2000-8000 words depending on complexity
- Favor specificity over brevity

### Prioritization
- **P0 (Critical)**: Must-have for launch, blocking
- **P1 (High)**: Important for UX, should have
- **P2 (Medium)**: Nice to have, can defer
- **P3 (Low)**: Future enhancement

## Environment-Specific Guidance

### In Claude Code
1. Explore codebase structure before questions
2. Identify existing patterns
3. Reference actual file paths
4. Suggest integration points from real code
5. Use project's existing tech stack
6. Check for similar features

Example language:
- "I can see you're using Next.js 15 with TypeScript..."
- "Looking at your components in `src/features/`..."
- "You're using shadcn/ui, so I'll suggest that pattern..."

### In Web Chat
1. Ask about tech stack explicitly
2. Request existing PRD examples
3. Ask for architecture diagrams
4. Clarify conventions and patterns
5. Request deployment environment info

Example questions:
- "What's your tech stack?"
- "Do you have existing PRDs I can reference?"
- "What's your architecture/deployment setup?"

## Requirements Quality

**Good Example:**
```markdown
### F-001: Bulk CSV Upload
**Priority:** P0 (Critical)

**Description:**
Users upload CSV with multiple listings. Each row = one item 
with columns: title, description, category, condition, 
price_ebay, price_vinted, image_url.

**Acceptance Criteria:**
- [ ] Accepts CSV up to 10MB
- [ ] Validates headers match template
- [ ] Processes up to 500 items
- [ ] Shows progress bar (every 10 items)
- [ ] Returns detailed error report
- [ ] Allows download of failed items
- [ ] Creates draft listings for valid items
- [ ] Completes in <30s for 100 items

**Technical Notes:**
- Streaming CSV parser for large files
- Process in batches of 50
- Store job status in database
- Send webhook on completion
```

**Bad Example:**
```markdown
### Bulk Upload
Users upload multiple items.
- Support CSV
- Make it fast
- Handle errors
```

## Common Pitfalls

**Don't:**
1. Jump to solutions - Interview first
2. Assume implementation - Ask about constraints
3. Write vague requirements - Be specific and testable
4. Ignore edge cases - Probe for unusual scenarios
5. Forget existing code - Consider integration
6. Skip user perspective - Keep needs central
7. Over-engineer MVP - Distinguish must-have from nice-to-have
8. Forget testing - Include test requirements
9. Ignore data - Define schemas and validation
10. Skip "why" - Include business context
