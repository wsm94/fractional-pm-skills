# Effort Estimation Guide

## Estimation Principles

1. **Account for the whole task**: Include design, implementation, testing, code review, and deployment
2. **Consider unknowns**: Add buffer for investigation and unexpected issues
3. **Factor in dependencies**: Waiting for other teams or systems adds time
4. **Include non-coding work**: Documentation, meetings, and communication
5. **Learn from history**: Past similar tasks provide good baselines

## T-Shirt Sizing

### XS - Extra Small (2-4 hours)
**Characteristics:**
- Single file change
- No external dependencies
- Clear requirements
- Minimal testing needed
- No design decisions required

**Examples:**
- Fix typo in UI text
- Update configuration value
- Add simple validation rule
- Change color or styling
- Add logging statement

### S - Small (1-2 days)
**Characteristics:**
- Few files changed
- Well-understood domain
- Standard patterns apply
- Basic testing required
- No architectural impact

**Examples:**
- Add new field to existing form
- Create simple CRUD endpoint
- Implement basic validation logic
- Add filter to existing list
- Create simple utility function

### M - Medium (3-5 days)
**Characteristics:**
- Multiple components affected
- Some design decisions needed
- Integration with existing systems
- Comprehensive testing required
- May need documentation updates

**Examples:**
- New feature with UI and backend
- Integration with third-party API
- Complex business logic implementation
- Database migration with data transformation
- Refactor of medium-sized module

### L - Large (1-2 weeks)
**Characteristics:**
- Cross-functional work
- Significant design required
- Multiple integration points
- Extensive testing needed
- Requires documentation
- May need stakeholder review

**Examples:**
- Complete user workflow
- New microservice
- Major refactoring effort
- Complex data migration
- Performance optimization project

### XL - Extra Large (2-4 weeks)
**Characteristics:**
- Architectural changes
- Multiple team coordination
- Significant unknowns
- Comprehensive testing strategy
- Requires design documentation
- Multiple review cycles

**Examples:**
- New product feature end-to-end
- System migration
- Major infrastructure change
- Complete redesign of component
- Implementation of new framework

### XXL - Extra Extra Large (>1 month)
**Should be broken down into smaller issues**

## Complexity Factors

### Technical Complexity Multipliers

**1.0x - Simple**
- Using existing patterns
- Well-documented approach
- Team has done similar before

**1.5x - Moderate**
- Some new patterns needed
- Requires research
- Team has partial experience

**2.0x - Complex**
- Breaking new ground
- Significant unknowns
- Team learning required

### Risk Multipliers

**1.0x - Low Risk**
- Non-critical feature
- Good rollback plan
- Well-tested path

**1.3x - Medium Risk**
- Important feature
- Some rollback complexity
- Moderate testing needed

**1.6x - High Risk**
- Critical system
- Difficult rollback
- Extensive testing required

## Estimation by Component Type

### Frontend Components

| Component Type | Base Estimate | Factors to Consider |
|---------------|---------------|---------------------|
| Static display | 2-4 hours | Design complexity, responsive needs |
| Form | 1-2 days | Validation complexity, field count |
| Data table | 2-3 days | Sorting, filtering, pagination |
| Dashboard | 3-5 days | Number of widgets, data sources |
| Complex interaction | 1 week | Animation, drag-drop, real-time updates |

### Backend Endpoints

| Endpoint Type | Base Estimate | Factors to Consider |
|--------------|---------------|---------------------|
| Simple CRUD | 4-8 hours | Validation complexity |
| Complex query | 1-2 days | Join complexity, performance needs |
| File upload | 1-2 days | Size limits, processing required |
| Integration | 2-3 days | API complexity, error handling |
| Background job | 2-3 days | Retry logic, monitoring needs |

### Database Work

| Task Type | Base Estimate | Factors to Consider |
|-----------|---------------|---------------------|
| Add table | 2-4 hours | Number of fields, constraints |
| Add column | 1-2 hours | Migration complexity, backfill needs |
| Add index | 2-4 hours | Testing impact, size of table |
| Data migration | 1-3 days | Data volume, transformation complexity |
| Schema redesign | 1-2 weeks | Impact on application, migration strategy |

### Integrations

| Integration Type | Base Estimate | Factors to Consider |
|-----------------|---------------|---------------------|
| REST API | 2-3 days | Auth complexity, number of endpoints |
| Webhook | 1-2 days | Retry logic, security needs |
| File import/export | 2-3 days | Format complexity, validation |
| Message queue | 2-3 days | Message format, error handling |
| Third-party SDK | 1-3 days | Documentation quality, complexity |

## Estimation Checklist

Before providing an estimate, consider:

### Requirements
- [ ] Are requirements clear and complete?
- [ ] Are edge cases identified?
- [ ] Are performance requirements specified?
- [ ] Are there ui/ux mockups if needed?

### Technical
- [ ] Is the technical approach clear?
- [ ] Are all dependencies identified?
- [ ] Are there any technical unknowns?
- [ ] Do we need to learn new technologies?

### Testing
- [ ] What types of tests are needed?
- [ ] How complex is test data setup?
- [ ] Are there performance tests required?
- [ ] Is manual testing needed?

### Dependencies
- [ ] Are there blockers from other teams?
- [ ] Do we need infrastructure changes?
- [ ] Are external services required?
- [ ] Any approval processes needed?

### Non-Development Work
- [ ] Documentation requirements?
- [ ] Training needed?
- [ ] Deployment complexity?
- [ ] Monitoring/alerting setup?

## Common Estimation Mistakes

### Under-estimating
- Forgetting about tests
- Ignoring integration complexity  
- Not accounting for code review cycles
- Missing edge cases
- Overlooking deployment and monitoring

### Over-estimating
- Adding too much buffer
- Not reusing existing code
- Over-engineering solutions
- Assuming worst-case for everything
- Not leveraging team experience

## Adjustment Factors

### Team Experience
- **Expert**: 0.7x (30% faster)
- **Experienced**: 1.0x (baseline)
- **Some experience**: 1.3x (30% slower)
- **New to domain**: 2.0x (100% slower)

### Code Quality Requirements
- **Prototype**: 0.7x (quick and dirty)
- **Standard**: 1.0x (normal quality)
- **High**: 1.3x (extensive tests, documentation)
- **Critical**: 2.0x (formal methods, extensive review)

### External Dependencies
- **None**: 1.0x
- **One team**: 1.2x
- **Multiple teams**: 1.5x
- **External vendor**: 2.0x

## Story Points Mapping

If using story points instead of time:

| T-Shirt | Story Points | Rough Time |
|---------|-------------|------------|
| XS | 1 | 2-4 hours |
| S | 2 | 1-2 days |
| M | 3 | 3-5 days |
| L | 5 | 1-2 weeks |
| XL | 8 | 2-4 weeks |
| XXL | 13+ | Break it down |

## Sprint Planning

### Capacity Planning
- Developer day = 6 productive hours
- Account for meetings, reviews, overhead
- Include time for unplanned work (bugs, support)
- Factor in holidays and time off
- Consider onboarding for new team members

### Velocity Tracking
- Track estimated vs actual over time
- Adjust future estimates based on history
- Account for team composition changes
- Consider seasonal variations (holidays, etc.)

## Red Flags in Estimation

Watch out for:
- "Should be simple" without investigation
- Estimates without acceptance criteria
- No time allocated for testing
- Missing deployment and rollback plans
- Assumptions about external dependencies
- No buffer for unknowns
- Extremely precise estimates (false precision)