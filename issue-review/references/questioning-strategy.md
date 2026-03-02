# Intelligent Questioning Strategy

This guide helps determine when to ask questions vs when to infer answers from the codebase.

## Core Principle

**Always prefer answering from codebase over asking questions.**

Questions slow down the review process. Only ask when:
1. Multiple valid approaches exist with trade-offs
2. Business logic decision required
3. User preference needed
4. Cannot infer from existing code

## Decision Tree

```
Found ambiguity/missing info
    ↓
Can I find the answer in the codebase?
    ↓
YES → Search for existing patterns
    ↓
    Found clear pattern?
        ↓
        YES → Use pattern, note in review with confidence
        NO → Multiple patterns exist
            ↓
            Are patterns contradictory?
                ↓
                YES → Ask which pattern to follow
                NO → Pick most recent/common pattern, note assumption
    ↓
NO → Is this technical or business decision?
    ↓
    Technical → Can I make reasonable architectural choice?
        ↓
        YES → Make choice, document reasoning
        NO → Ask user
    ↓
    Business → Always ask user
```

## Examples: When to Answer vs Ask

### Scenario 1: Error Response Format

**Ambiguity**: Issue doesn't specify error response format.

**Codebase Check**:
```bash
grep -r "error response" --include="*.ts" src/controllers/
grep -r "statusCode.*400" --include="*.ts"
```

**If found consistent pattern**:
```typescript
// Multiple controllers return:
{ success: false, error: "message", code: "ERROR_CODE" }
```

**Action**: ✅ **Answer from codebase**
```markdown
**Error Format**: Based on existing controllers (UserController, ProductController), 
errors should follow the pattern:
{ success: false, error: "User-friendly message", code: "ERROR_CODE" }
```

**Don't ask**: "How should errors be formatted?"

---

### Scenario 2: Authentication Method

**Ambiguity**: Issue says "add authentication" but doesn't specify method.

**Codebase Check**:
```bash
grep -r "passport" --include="*.ts"
grep -r "jwt" --include="*.ts"
grep -r "authenticate" --include="*.ts"
```

**If found**: Application uses JWT with Passport.js

**Action**: ✅ **Answer from codebase**
```markdown
**Authentication**: Based on existing auth middleware (`src/middleware/auth.ts`), 
use Passport.js JWT strategy consistent with other protected routes.
```

**Don't ask**: "What authentication method should we use?"

---

### Scenario 3: Database Transaction Strategy

**Ambiguity**: Multi-step database operation, unclear if should use transaction.

**Codebase Check**:
```bash
grep -r "transaction" --include="*.ts" src/services/
grep -r "startSession" --include="*.ts"
```

**If found**: Some services use transactions, others don't, no clear pattern.

**Action**: ❓ **Ask user**
```markdown
**Question 1/3**: Should this multi-step operation use database transactions?

**Context**: This operation creates a User, UserProfile, and UserSettings. 
Partial failures could leave inconsistent data.

**Options**:
a) Use transaction - Ensures atomicity, but adds complexity and locks
b) No transaction - Simpler, but risk of partial data on failure
c) Idempotent design - Make operation safely retryable

**Codebase Analysis**: Found mixed approaches:
- OrderService uses transactions for payment operations
- ProfileService doesn't use transactions for profile updates

**Recommendation**: Use transaction (option a) since this involves related records 
that should succeed/fail together, similar to OrderService pattern.
```

---

### Scenario 4: Pagination Defaults

**Ambiguity**: List endpoint doesn't specify page size.

**Codebase Check**:
```bash
grep -r "limit.*=" --include="*.ts" src/controllers/
grep -r "pageSize" --include="*.ts"
```

**If found**: Multiple endpoints use limit=20

**Action**: ✅ **Answer from codebase**
```markdown
**Pagination**: Based on existing list endpoints (getUsers, getProducts, getOrders),
use default limit of 20 items per page with max of 100.
```

**Don't ask**: "What should the page size be?"

---

### Scenario 5: Caching Strategy

**Ambiguity**: High-traffic endpoint, unclear if needs caching.

**Codebase Check**:
```bash
grep -r "cache" --include="*.ts" src/
grep -r "redis" --include="*.ts"
```

**If found**: Redis available but inconsistently used

**Action**: ❓ **Ask user**
```markdown
**Question 1/2**: Should this endpoint implement caching?

**Context**: Expected 1000+ requests/sec for product search. Currently no caching.

**Options**:
a) Add Redis caching now - Better performance, more complexity
b) Add later if needed - Simpler implementation, may need optimization soon
c) Add CDN caching only - Simpler, works for public data

**Codebase Analysis**: Redis is available (used by SessionService) but most 
endpoints don't use caching yet.

**Recommendation**: Option b (add later) for MVP, since we can measure actual 
load first. Add TODO comment about caching.
```

---

### Scenario 6: Validation Rules

**Ambiguity**: Field mentioned but no validation specified (e.g., "add email field").

**Codebase Check**:
```bash
grep -r "email.*validation" --include="*.ts"
grep -r "validator" --include="*.ts"
grep -r "@IsEmail" --include="*.ts"
```

**If found**: Class-validator used with @IsEmail decorator

**Action**: ✅ **Answer from codebase**
```markdown
**Validation**: Based on User model validation, use class-validator:
- @IsEmail() for format validation
- @IsNotEmpty() for required fields
- Match existing pattern in UserDTO
```

**Don't ask**: "How should we validate email?"

---

### Scenario 7: Business Logic - Discount Calculation

**Ambiguity**: "Apply discount" but no rules specified.

**Codebase Check**: Found some discount logic but rules unclear

**Action**: ❓ **Ask user** (Business Logic)
```markdown
**Question 2/3**: What are the discount calculation rules?

**Context**: Need to apply user discount to order total.

**Codebase Analysis**: Found DiscountService but it has multiple discount types:
- Percentage discounts (used for promotions)
- Fixed amount discounts (used for credits)
- Tiered discounts (used for bulk orders)

Which discount type applies here, or should it support multiple?
```

**Always ask for business logic** - Cannot infer from code alone.

---

## Question Quality Checklist

Before asking a question, ensure:

- [ ] Cannot be answered by examining existing code
- [ ] Cannot be reasonably inferred from similar features
- [ ] Question is specific and actionable
- [ ] Context explains why it matters
- [ ] Options are provided (when applicable)
- [ ] Recommendation based on codebase analysis included
- [ ] Only ONE question asked at a time

## Codebase Search Commands

### Finding Patterns

```bash
# Find similar features
find . -name "*user*" -type f
find . -name "*auth*" -type f

# Find implementation patterns
grep -r "class.*Controller" --include="*.ts"
grep -r "export.*Service" --include="*.ts"

# Find validation patterns
grep -r "validator" --include="*.ts"
grep -r "@Is" --include="*.ts"

# Find error handling
grep -r "try.*catch" --include="*.ts"
grep -r "throw new" --include="*.ts"

# Find database patterns
grep -r "findOne" --include="*.ts"
grep -r "transaction" --include="*.ts"

# Find auth patterns
grep -r "authenticate" --include="*.ts"
grep -r "authorize" --include="*.ts"

# Find existing tests
find . -name "*.test.ts" -o -name "*.spec.ts"
```

### Understanding Architecture

```bash
# Find service layer
find src/services -name "*.ts"

# Find controllers
find src/controllers -name "*.ts"

# Find models
find src/models -name "*.ts"

# Find middleware
find src/middleware -name "*.ts"

# Check dependencies
cat package.json | grep -A 50 "dependencies"
```

## Common Answerable Questions

These can almost always be answered from codebase:

✅ **Error response format** - Check existing controllers
✅ **Authentication method** - Check auth middleware
✅ **Validation approach** - Check existing models/DTOs
✅ **Pagination defaults** - Check existing list endpoints
✅ **File structure** - Check existing similar features
✅ **Naming conventions** - Check existing files
✅ **Import patterns** - Check existing modules
✅ **Test structure** - Check existing test files
✅ **Logging format** - Check existing log calls
✅ **Database query patterns** - Check existing services

## Common Questions to Ask

These usually require user input:

❓ **Business logic rules** - Cannot infer from code
❓ **Performance requirements** - Need user's expectations
❓ **Security policies** - Need organizational rules
❓ **Feature priorities** - Need product decisions
❓ **User experience flows** - Need design decisions
❓ **External integrations** - Need API credentials/details
❓ **Data retention policies** - Need compliance rules
❓ **Rollout strategy** - Need deployment decisions

## Questioning Flow

### Phase 1: Analyze (Do First)
1. Read issue completely
2. Search codebase for patterns
3. Identify what can be answered vs what needs asking
4. Prepare questions with context and options

### Phase 2: Present Findings
1. Show what you found in codebase
2. List answers inferred from patterns
3. Note assumptions made

### Phase 3: Ask Questions (One at a Time)
```markdown
I need to clarify [N] points that I couldn't determine from the codebase.

**Question 1/N**: [Question]
...
```

Wait for answer.

```markdown
Thanks! That helps. 

**Question 2/N**: [Next question]
...
```

Repeat until all answered.

### Phase 4: Update Issue
```markdown
Based on your answers and codebase analysis, here's the updated issue:
[Complete updated issue text]
```

## Anti-Patterns

❌ **Don't ask obvious questions**
```
Bad: "Should we validate user input?"
Good: "Based on class-validator usage across the codebase, I'll add validation using @IsEmail(), @IsNotEmpty() decorators."
```

❌ **Don't ask multiple questions at once**
```
Bad: "1. What's the auth method? 2. What's the error format? 3. Should we cache?"
Good: Ask ONE, wait for answer, then ask next.
```

❌ **Don't ask without showing you searched**
```
Bad: "How should we handle errors?"
Good: "I checked existing controllers and see they use {success, error, code} format. Should this endpoint follow the same pattern?"
```

❌ **Don't ask when you can infer**
```
Bad: "Should we use TypeScript interfaces?"
Good: "Following the existing pattern in UserService.ts, I'll use TypeScript interfaces for type safety."
```

## Confidence Levels

When answering from codebase, indicate confidence:

**High Confidence (90%+)**
- Pattern used in 5+ similar places
- Recent implementation
- Well-documented

Format: "Based on [Component], this should..."

**Medium Confidence (70-90%)**
- Pattern used in 2-4 places
- Somewhat inconsistent
- Older code

Format: "The common pattern in [Components] is..., though [caveat]"

**Low Confidence (<70%)**
- Pattern found in 1 place
- Inconsistent implementations
- Unclear from code

Format: "I found this pattern in [Component], but given [concern], you might want to confirm..."

## Summary

**Golden Rule**: Search first, ask only when necessary, ask one at a time.

**Goal**: Maximize codebase-driven answers, minimize user interruption, but never guess on business logic or critical architectural decisions.
