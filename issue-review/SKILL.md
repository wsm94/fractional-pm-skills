---
name: issue-review
description: Reviews Linear/GitHub issues for technical accuracy, codebase alignment, and completeness. Use when reviewing completed issue specifications before implementation, especially in Claude Code with project context. Checks for inconsistencies with actual code structure, database models, missing edge cases, and suggests ticket splitting or reordering when needed.
---

# Issue Review Skill

This skill provides comprehensive review of development issues (Linear, GitHub, etc.) by cross-referencing them against actual codebase structure, identifying gaps, and suggesting improvements.

## When to Use This Skill

Trigger this skill when:
- User says "review this issue/ticket"
- User mentions "check this against the codebase"
- User asks "does this issue make sense?"
- Working in Claude Code with project context available
- Before starting implementation on a complex issue
- After completing an issue specification

## Review Process

### Step 1: Understand the Issue Context

1. **Read the issue completely** - Understand objectives, acceptance criteria, and technical approach
2. **Identify key technical areas** - Database models, APIs, services, dependencies
3. **Note any referenced files or systems** - EPOS, APIs, external services

### Step 2: Cross-Reference with Codebase

For each technical component mentioned:

#### Database & Models
- **Check model existence**: Does the referenced model actually exist?
- **Verify field names**: Are field names spelled correctly?
- **Validate relationships**: Are referenced relationships actually defined?
- **Check schema assumptions**: Does the schema match what's described?
- **Type validation**: Are the data types compatible with operations described?

Example checks:
```bash
# Find model definitions
find . -name "*.model.ts" -o -name "*.schema.ts"

# Check specific model
grep -r "class ItemModel" --include="*.ts"

# Verify field exists
grep -r "wasteDetails" --include="*.model.ts"
```

#### APIs & Services
- **Verify service exists**: Is the service file present?
- **Check method signatures**: Do methods match what's expected?
- **Validate API contracts**: Do request/response formats align?
- **Check import paths**: Are relative paths correct?
- **Verify dependencies**: Are required libraries installed?

#### File Structure
- **Check paths**: Do referenced file paths exist?
- **Verify conventions**: Does the issue follow project naming conventions?
- **Validate structure**: Are new files going in the right directories?

### Step 3: Identify Technical Issues & Resolve Ambiguities

Look for these common problems:

#### Inconsistencies
- Model fields that don't exist
- Services that need to be created
- APIs that don't match current implementation
- Incorrect import paths
- Mismatched data types

#### Missing Details
- Error handling not specified
- Validation rules unclear
- Authentication/authorization not addressed
- Transaction handling not mentioned
- Race conditions not considered

#### Architectural Concerns
- Circular dependencies introduced
- Performance implications not addressed
- Scaling considerations missing
- Security implications overlooked

#### Intelligent Question Resolution

When you encounter ambiguities or missing information:

**FIRST: Check if you can answer from the codebase**
```bash
# Look for existing patterns
grep -r "similar_pattern" --include="*.ts"
find . -name "*related_feature*"

# Check existing implementations
# Can you infer the answer from how similar features work?
```

**Decision Framework:**

1. **Can answer from codebase** → Include answer in review with confidence note
   - Example: "Based on the UserModel implementation, this should follow the same pattern..."
   
2. **Multiple valid approaches exist** → Ask user for preference
   - Example: "Should this follow the pattern from FeatureA (transaction-based) or FeatureB (event-based)?"

3. **Business logic decision** → Ask user
   - Example: "When a user cancels mid-upload, should we: a) delete partial data, or b) save as draft?"

4. **Technical uncertainty that affects architecture** → Ask user
   - Example: "This endpoint will handle 1000+ req/sec. Should we add caching layer now or later?"

**Questioning Protocol:**

When you must ask questions:

- **Ask ONE question at a time** - Wait for answer before asking next
- **Provide context** - Explain why you're asking and how it affects the issue
- **Offer suggestions** - Based on codebase patterns when possible
- **Track answers** - Keep list of resolved questions to update issue at the end

**Format for questions:**
```markdown
❓ **Question [N/M]**: [Clear, specific question]

**Context**: Why this matters for the implementation

**Options** (based on codebase analysis):
a) [Option] - Pros: ... Cons: ...
b) [Option] - Pros: ... Cons: ...

**Recommendation**: [Your suggestion based on existing patterns]
```

**After all questions answered:**
- Update the issue with resolved information
- Document decisions made
- Note any assumptions for future reference

### Step 4: Review Edge Cases

Check if the issue addresses:

#### Data Edge Cases
- Empty/null values
- Very large datasets
- Concurrent modifications
- Data migration scenarios
- Backward compatibility

#### User Flow Edge Cases
- Partial failures in multi-step processes
- Offline/online sync conflicts
- User cancellation mid-flow
- Timeout scenarios
- Retry logic

#### Integration Edge Cases
- External service failures
- API rate limits
- Network timeouts
- Invalid responses
- Version mismatches

### Step 5: Assess Issue Scope & Estimate AI Implementation Time

Determine if the issue should be split and estimate completion time for AI-driven development:

#### AI-Driven Time Estimation

Estimate time for AI agent (Claude Code) implementation, not human developers. Consider:

**Simple tasks (15-45 minutes)**:
- Single file changes with clear requirements
- Adding fields to existing models
- Simple CRUD endpoint additions
- UI component tweaks
- Configuration updates

**Medium tasks (1-3 hours)**:
- New features with 2-5 file changes
- Database migrations with data transformation
- API integration with error handling
- Form implementations with validation
- Service layer additions

**Complex tasks (4-8 hours)**:
- Multi-layer features (DB + API + UI)
- Complex state management
- Authentication/authorization systems
- Payment/billing integrations
- Data migration with edge cases

**Very complex (8+ hours - should split)**:
- Complete feature modules
- Major architectural changes
- Multi-step workflows with many edge cases
- Multiple external integrations
- Large refactoring efforts

**Factors that increase AI implementation time**:
- Unclear requirements or acceptance criteria
- Missing codebase context or documentation
- Complex business logic without examples
- Many edge cases requiring decisions
- Integration with poorly documented external APIs
- Significant debugging/testing requirements

**Factors that decrease AI implementation time**:
- Clear, specific acceptance criteria
- Well-documented codebase
- Existing similar patterns to follow
- Good test coverage to validate against
- Clear error handling requirements

#### Split if:
- **Multiple unrelated changes** - "Add feature X AND refactor Y"
- **Mixed concerns** - Database migration + API changes + UI updates
- **Too large** - >8 hours of AI implementation time
- **Different risk levels** - High-risk authentication mixed with low-risk UI
- **Multiple PR requirement** - Changes that can't be deployed together
- **Requires multiple iteration cycles** - AI would need to pause for feedback

#### Keep together if:
- Changes are tightly coupled
- Cannot be tested independently
- Must be deployed atomically
- Total scope is manageable (<8 hours AI time)
- Single coherent feature/fix

### Step 6: Suggest Issue Ordering

If multiple related issues exist, recommend order based on:

1. **Dependencies** - Prerequisites must come first
2. **Risk** - De-risk early with proof-of-concepts
3. **Value** - High-impact features prioritized
4. **Testing** - Foundation for testing setup early
5. **Feedback loops** - Quick wins for early user feedback

## Output Format

Provide review in this structure:

### ✅ Strengths
- List what the issue does well
- Note clear acceptance criteria
- Highlight good edge case coverage

### 🔍 Codebase Analysis
List what you discovered from examining the code:
```markdown
**[Component]**: What you found
- Existing pattern: [Description]
- Relevant files: [Paths]
- Recommendation: How issue should align
```

### ⚠️ Technical Issues Found

For each issue:
```markdown
**[Category]**: Brief description
- **Current assumption**: What the issue assumes
- **Actual codebase**: What actually exists
- **Recommendation**: How to fix
- **Files to check**: Specific files to review
```

### ❓ Questions Requiring Clarification

**IMPORTANT**: Ask these ONE AT A TIME, waiting for user response between each.

For each question:
```markdown
**Question [N/M]**: [Specific question]

**Context**: [Why this matters]

**Options** (based on codebase):
a) [Option] - [Trade-offs]
b) [Option] - [Trade-offs]

**Recommendation**: [Your suggestion from existing patterns]
```

After user answers a question:
- Thank them for the answer
- Ask the next question (if any remain)
- Once all answered, proceed to update the issue

### 🔍 Missing Edge Cases

List unaddressed scenarios:
```markdown
**[Scenario]**: Description
- **Impact**: What could go wrong
- **Suggested handling**: How to address
```

### 📋 Scope Assessment

**AI Implementation Estimate**: [Time range with breakdown]
- Example: "2-3 hours: 1 hour for API changes, 1 hour for UI, 30-60 min for testing"

**Complexity Factors**:
- [List what makes this complex or simple]
- Example: "Well-defined requirements (+), but poor existing test coverage (-)"

**Recommendation**: 
- [ ] Keep as single issue
- [ ] Split into multiple issues (provide breakdown)

If splitting, suggest:
```markdown
**Issue 1**: [Title] - [Why separate] - [AI time estimate]
- [Scope 1]
- [Scope 2]

**Issue 2**: [Title] - [Why separate] - [AI time estimate]
- [Scope 3]
- [Scope 4]
```

### 🔄 Suggested Issue Order

If multiple issues, recommend sequence:
```markdown
1. **[Issue name]** - [Rationale]
2. **[Issue name]** - [Rationale]
```

### 📝 Updated Issue Text

**After all questions answered**, provide the complete updated issue text with:
- Resolved ambiguities documented
- Answers integrated into appropriate sections
- Decisions documented with rationale
- New acceptance criteria added
- Technical notes enhanced
- Dependencies clarified
- Testing requirements expanded

## Bundled Resources

### References

- `references/review-checklist.md` - Comprehensive checklist for different issue types
- `references/common-issues.md` - Patterns of frequently missed items
- `references/ai-time-estimation.md` - Guide for estimating AI implementation time
- `references/questioning-strategy.md` - When to ask vs when to answer from codebase (load when you have questions)

Load these references when reviewing complex issues or when specific issue types need detailed checking.
