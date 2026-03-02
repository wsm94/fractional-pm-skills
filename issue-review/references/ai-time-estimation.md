# AI-Driven Implementation Time Estimation

This guide helps estimate how long tasks take for AI agents (like Claude Code) to implement, not human developers.

## Key Differences: AI vs Human Development

### AI is Faster At:
- Writing boilerplate code
- Following established patterns
- Implementing well-defined specs
- Creating similar variations
- Converting formats
- Basic CRUD operations
- Test writing from specs

### AI is Slower At:
- Unclear requirements (needs clarification)
- Novel architectural decisions
- Complex business logic without examples
- Debugging poorly documented code
- Integration with undocumented APIs
- Understanding implicit requirements
- Iterative refinement from vague feedback

## Time Estimation Framework

### 15-30 Minutes: Trivial Tasks

**Characteristics**:
- Single file change
- No new dependencies
- Clear pattern to follow
- No complex logic
- Minimal testing needed

**Examples**:
- Add a field to existing model
- Update validation rule
- Change text/copy
- Add environment variable
- Simple configuration update
- CSS/styling tweaks
- Add logging statement

**Code Volume**: <50 lines changed

### 30-60 Minutes: Simple Tasks

**Characteristics**:
- 2-3 file changes
- Follows existing patterns
- Basic error handling
- Simple tests needed
- No external integration

**Examples**:
- Add endpoint to existing controller
- Create simple UI component
- Add new database query
- Implement basic validation
- Add unit tests for function
- Simple data transformation
- Create utility function

**Code Volume**: 50-150 lines changed

### 1-2 Hours: Moderate Tasks

**Characteristics**:
- 3-5 file changes
- Some new patterns needed
- Moderate error handling
- Integration tests needed
- Single-layer complexity

**Examples**:
- New REST endpoint with validation
- Form with multiple fields
- Database migration with transform
- Service method with business logic
- Component with state management
- Simple third-party API call
- Authentication middleware

**Code Volume**: 150-300 lines changed

### 2-4 Hours: Standard Features

**Characteristics**:
- 5-10 file changes
- Multi-file coordination
- Comprehensive error handling
- Multiple test scenarios
- Cross-layer changes

**Examples**:
- Complete CRUD for resource
- Multi-step form workflow
- API integration with retry/timeout
- Dashboard component with charts
- Search functionality with filters
- Email notification system
- File upload with validation

**Code Volume**: 300-600 lines changed

### 4-8 Hours: Complex Features

**Characteristics**:
- 10-20 file changes
- New architectural patterns
- Extensive error handling
- Complex test scenarios
- Multiple integrations

**Examples**:
- Authentication system
- Payment integration
- Real-time updates (WebSocket)
- Complex workflow engine
- Multi-table reporting
- Data import/export pipeline
- Role-based permissions

**Code Volume**: 600-1200 lines changed

### 8+ Hours: Should Split

**These should be broken into smaller issues**:
- Complete feature modules
- Major refactoring
- Complex state machines
- Multiple external integrations
- Significant architecture changes

## Estimation Multipliers

### Requirements Clarity Multiplier

**Clear requirements (1.0x)**:
- Specific acceptance criteria
- Examples provided
- Edge cases documented
- Error handling specified

**Vague requirements (1.5-2.0x)**:
- "Make it work"
- "Similar to X"
- Missing edge cases
- Unclear success criteria

**No requirements (3.0x+)**:
- "Figure out what's needed"
- Requires discovery
- Business logic not documented

### Codebase Familiarity Multiplier

**Well-documented (1.0x)**:
- Clear patterns
- Good examples
- Type definitions
- Comments on complex logic

**Moderately documented (1.3x)**:
- Some patterns clear
- Type definitions present
- Minimal comments

**Poorly documented (2.0x+)**:
- No clear patterns
- Limited types
- No comments
- Must reverse-engineer intent

### Testing Requirements Multiplier

**No tests needed (0.8x)**:
- Prototype/POC
- Internal tool
- One-time script

**Basic tests (1.0x)**:
- Happy path tests
- Basic edge cases

**Comprehensive tests (1.5x)**:
- Full edge case coverage
- Integration tests
- E2E tests
- Performance tests

### Integration Complexity Multiplier

**No external integration (1.0x)**:
- Self-contained
- Internal APIs only

**Well-documented API (1.2x)**:
- Good docs
- Clear error messages
- SDK available

**Poorly documented API (2.0x)**:
- Sparse docs
- Undocumented errors
- Must experiment

**Legacy system (2.5x+)**:
- No docs
- Unreliable
- Complex auth
- Inconsistent responses

## Real-World Examples with Estimates

### Example 1: Add User Profile Field

**Task**: Add "phone number" field to user profile

**Breakdown**:
- Update User model: 5 min
- Update API validation: 5 min
- Update form UI: 10 min
- Update tests: 10 min

**Total**: 30 minutes

**Multipliers**: None (1.0x)

**Final estimate**: **30 minutes**

### Example 2: Implement Search

**Task**: Add search functionality to product listing

**Breakdown**:
- Create search API endpoint: 30 min
- Add search UI component: 30 min
- Implement filters: 45 min
- Add pagination: 20 min
- Write tests: 30 min

**Subtotal**: 2.5 hours

**Multipliers**:
- Moderate docs (1.3x)
- Basic tests (1.0x)

**Final estimate**: **3-4 hours**

### Example 3: Payment Integration

**Task**: Integrate Stripe for one-time payments

**Breakdown**:
- Setup Stripe SDK: 20 min
- Create payment endpoint: 45 min
- Implement webhook handler: 45 min
- Add payment UI: 60 min
- Error handling: 45 min
- Testing: 60 min

**Subtotal**: 4.25 hours

**Multipliers**:
- Clear requirements (1.0x)
- Well-documented API (1.2x)
- Comprehensive tests (1.5x)

**Final estimate**: **7-8 hours**

**Recommendation**: Consider splitting into:
1. Backend integration (3-4 hours)
2. Frontend implementation (3-4 hours)

### Example 4: Data Migration

**Task**: Migrate user preferences from JSON to separate table

**Breakdown**:
- Create new model/schema: 30 min
- Write migration script: 60 min
- Handle edge cases: 45 min
- Rollback procedure: 30 min
- Update application code: 45 min
- Testing on staging: 60 min

**Subtotal**: 4.5 hours

**Multipliers**:
- Edge cases complex (1.4x)
- Production data (1.3x)

**Final estimate**: **6-8 hours**

## Estimation Process

1. **Break down into concrete steps**
   - List each file/component to change
   - Estimate each step individually

2. **Sum baseline estimates**
   - Add up all steps
   - Round to reasonable ranges

3. **Apply multipliers**
   - Assess requirements clarity
   - Consider codebase familiarity
   - Factor in testing needs
   - Account for integration complexity

4. **Add buffer**
   - Simple tasks: 20% buffer
   - Medium tasks: 30% buffer
   - Complex tasks: 50% buffer

5. **Sanity check**
   - >8 hours? Should split
   - <15 min? Too trivial to track
   - Compare to similar past tasks

## Red Flags for Time Blowout

⚠️ **Warning signs that estimates will be wrong**:

- "Should be quick" in issue title
- Multiple "and also" requirements
- "Similar to X but different"
- External API with no docs
- "Fix bug" with no repro steps
- "Improve performance" without metrics
- "Refactor while adding feature"
- Multiple stakeholders with different views
- Production data migration
- "Just" or "simply" in description

## Communication Tips

When providing estimates to users:

✅ **Do**:
- Give a range (2-3 hours, not 2.5 hours)
- Explain main time sinks
- Note assumptions ("assuming API docs are good")
- Suggest splits for >8 hour tasks
- Highlight risks/unknowns

❌ **Don't**:
- Give false precision ("2.73 hours")
- Promise speed without caveats
- Ignore requirement clarity issues
- Estimate without reading the code
- Forget to mention testing time

## Tracking Accuracy

After completing issues, note:
- Estimated time
- Actual time
- What took longer than expected
- What was faster than expected

Use this to calibrate future estimates.

## Quick Reference Card

| Complexity | Time Range | Files Changed | Code Lines |
|------------|------------|---------------|------------|
| Trivial | 15-30 min | 1 | <50 |
| Simple | 30-60 min | 2-3 | 50-150 |
| Moderate | 1-2 hours | 3-5 | 150-300 |
| Standard | 2-4 hours | 5-10 | 300-600 |
| Complex | 4-8 hours | 10-20 | 600-1200 |
| Very Complex | 8+ hours | 20+ | 1200+ |

**Split anything >8 hours into smaller issues.**
