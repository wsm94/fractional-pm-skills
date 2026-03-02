# Issue Review Checklist

This checklist provides detailed checks for different types of development issues.

## General Checks (All Issues)

### Documentation Quality
- [ ] Title is clear and actionable
- [ ] Overview/Objective is present and understandable
- [ ] Success criteria are measurable
- [ ] Estimated effort is reasonable
- [ ] Dependencies are documented

### Technical Clarity
- [ ] All referenced files exist or are marked as "to be created"
- [ ] API contracts are specified (request/response formats)
- [ ] Data models are defined or referenced
- [ ] Error handling approach is mentioned
- [ ] Testing strategy is outlined

### Edge Cases
- [ ] Null/empty value handling addressed
- [ ] Concurrent access scenarios considered
- [ ] Failure recovery documented
- [ ] Validation rules specified
- [ ] Performance implications noted

## Database/Model Changes

### Schema Validation
- [ ] Model/collection names follow project conventions
- [ ] Field names use consistent casing (camelCase vs snake_case)
- [ ] Data types are appropriate for the use case
- [ ] Required vs optional fields are clearly marked
- [ ] Default values are specified where needed

### Relationships
- [ ] Foreign key relationships are defined
- [ ] Cascade delete behavior is specified
- [ ] Many-to-many relationships use junction tables correctly
- [ ] Relationship names are bidirectional where needed

### Migration Safety
- [ ] Migration strategy addresses existing data
- [ ] Backward compatibility is maintained or documented
- [ ] Rollback procedure is defined
- [ ] Data validation before/after migration specified

### Indexes & Performance
- [ ] Frequently queried fields have indexes
- [ ] Compound indexes are defined for multi-field queries
- [ ] Index impact on write performance considered
- [ ] Query patterns documented

## API/Service Changes

### Endpoint Design
- [ ] HTTP methods are semantically correct (GET/POST/PUT/DELETE)
- [ ] URL paths follow REST conventions
- [ ] Versioning strategy considered
- [ ] Rate limiting requirements specified

### Request/Response
- [ ] Request body schema defined
- [ ] Response format specified (success and error)
- [ ] Status codes documented
- [ ] Headers documented (auth, content-type, etc.)

### Authentication & Authorization
- [ ] Auth requirements specified
- [ ] Permission levels defined
- [ ] Token/session handling described
- [ ] Rate limiting per user/role

### Error Handling
- [ ] Validation errors have clear messages
- [ ] Business logic errors are distinguished
- [ ] Server errors are caught and logged
- [ ] Client receives appropriate error details

## Frontend/UI Changes

### Component Structure
- [ ] Component hierarchy is logical
- [ ] Props are typed/documented
- [ ] State management approach specified
- [ ] Event handlers are defined

### User Experience
- [ ] Loading states are shown
- [ ] Error states are displayed to users
- [ ] Empty states are designed
- [ ] Success feedback is provided

### Responsive Design
- [ ] Mobile breakpoints specified
- [ ] Touch interactions considered
- [ ] Keyboard navigation addressed
- [ ] Accessibility requirements met

### Performance
- [ ] Large lists use virtualization/pagination
- [ ] Images are optimized/lazy-loaded
- [ ] API calls are debounced/throttled
- [ ] Component re-renders are optimized

## Integration Issues

### External Services
- [ ] API credentials/keys management specified
- [ ] Timeout values defined
- [ ] Retry logic implemented
- [ ] Circuit breaker pattern considered
- [ ] Fallback behavior defined

### Third-Party Dependencies
- [ ] Library versions specified
- [ ] License compatibility checked
- [ ] Security vulnerabilities assessed
- [ ] Bundle size impact considered
- [ ] Alternatives evaluated

### Webhooks/Events
- [ ] Event payload format defined
- [ ] Idempotency handling specified
- [ ] Event ordering considered
- [ ] Failure recovery defined

## Testing Issues

### Test Coverage
- [ ] Unit test scenarios listed
- [ ] Integration test scenarios listed
- [ ] E2E test scenarios listed (if applicable)
- [ ] Performance test requirements specified

### Test Data
- [ ] Test fixtures defined
- [ ] Seed data requirements specified
- [ ] Mock/stub strategy outlined
- [ ] Cleanup procedures defined

### CI/CD
- [ ] Test automation requirements specified
- [ ] Deployment steps outlined
- [ ] Environment-specific configs addressed
- [ ] Rollback procedures defined

## Security Issues

### Input Validation
- [ ] All inputs are validated
- [ ] SQL injection prevention addressed
- [ ] XSS prevention addressed
- [ ] CSRF protection specified

### Data Protection
- [ ] Sensitive data is encrypted
- [ ] PII handling complies with regulations
- [ ] Logging doesn't expose sensitive data
- [ ] Data retention policies followed

### Access Control
- [ ] Authentication mechanism specified
- [ ] Authorization levels defined
- [ ] Session management described
- [ ] Token expiration handled

## Performance Issues

### Optimization Strategy
- [ ] Bottlenecks identified
- [ ] Caching strategy defined
- [ ] Database query optimization considered
- [ ] CDN usage specified (if applicable)

### Scalability
- [ ] Load handling capacity estimated
- [ ] Horizontal scaling considered
- [ ] Resource limits defined
- [ ] Monitoring/alerting specified

## DevOps/Infrastructure Issues

### Deployment
- [ ] Deployment steps are clear
- [ ] Environment variables documented
- [ ] Configuration management specified
- [ ] Zero-downtime deployment considered

### Monitoring
- [ ] Logging strategy defined
- [ ] Metrics to track specified
- [ ] Alert thresholds defined
- [ ] Dashboard requirements outlined

### Disaster Recovery
- [ ] Backup strategy defined
- [ ] Recovery procedures documented
- [ ] RTO/RPO requirements specified
- [ ] Failover process outlined
