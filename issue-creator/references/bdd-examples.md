# BDD Criteria Examples

## Given-When-Then Format

The Given-When-Then format helps create testable acceptance criteria that can be directly converted to BDD tests.

### Structure
- **Given**: The initial context or preconditions
- **When**: The action or event that occurs
- **Then**: The expected outcome or result

## Examples by Feature Type

### Authentication & Authorization

```markdown
✅ Good:
- [ ] Given a user with valid credentials, when they submit login form, then they receive a JWT token and are redirected to dashboard
- [ ] Given a user with invalid password, when they attempt login, then they see "Invalid credentials" error and remain on login page
- [ ] Given a logged-in user with expired token, when they make an API request, then they receive 401 and are redirected to login
- [ ] Given a user with role "admin", when they access /admin, then they can view admin dashboard
- [ ] Given a user with role "viewer", when they attempt to delete a record, then they receive 403 Forbidden

❌ Bad:
- [ ] Users can log in
- [ ] Authentication works properly
- [ ] Admin users have correct permissions
```

### Form Validation

```markdown
✅ Good:
- [ ] Given an email field, when user enters "notanemail", then validation shows "Please enter a valid email address"
- [ ] Given a required field, when user submits form with field empty, then submission is blocked and field is highlighted with error
- [ ] Given a password field requiring 8+ characters, when user enters "pass", then real-time validation shows "Password must be at least 8 characters"
- [ ] Given a price field, when user enters negative number, then validation prevents submission and shows "Price must be positive"

❌ Bad:
- [ ] Form validation works
- [ ] Invalid inputs are rejected
```

### API Endpoints

```markdown
✅ Good:
- [ ] Given valid product data, when POST to /api/products, then return 201 with created product including generated ID
- [ ] Given missing required field "name", when POST to /api/products, then return 400 with error details specifying missing field
- [ ] Given non-existent ID, when GET /api/products/999999, then return 404 with appropriate error message
- [ ] Given 100 products in database, when GET /api/products?page=1&limit=10, then return exactly 10 products with pagination metadata

❌ Bad:
- [ ] API creates products
- [ ] Error handling works
```

### Data Processing

```markdown
✅ Good:
- [ ] Given a CSV with 1000 rows, when import is triggered, then all valid rows are imported within 30 seconds
- [ ] Given a CSV with invalid data on row 50, when import runs, then rows 1-49 are imported and error report shows issue at row 50
- [ ] Given duplicate detection enabled, when importing record with existing ID, then existing record is updated rather than creating duplicate
- [ ] Given a file >10MB, when upload attempted, then rejection with "File size exceeds maximum of 10MB"

❌ Bad:
- [ ] Import feature works
- [ ] Handle large files appropriately
```

### Shopping Cart

```markdown
✅ Good:
- [ ] Given an item with stock quantity 5, when user adds 6 to cart, then show "Only 5 available" and limit quantity to 5
- [ ] Given items in cart totaling £99, when user applies "FREE100" code (free shipping over £100), then shipping remains at £5.99
- [ ] Given empty cart, when user clicks checkout, then show "Your cart is empty" message and disable checkout button
- [ ] Given item added to cart, when 10 minutes pass with no activity, then preserve cart contents for returning user

❌ Bad:
- [ ] Shopping cart functionality
- [ ] Stock limits work correctly
```

### Search Functionality

```markdown
✅ Good:
- [ ] Given search term "laptop", when user searches, then return products with "laptop" in title, description, or category within 200ms
- [ ] Given search with no results, when displayed, then show "No results found for '[term]'" with suggested alternatives
- [ ] Given special characters in search "laptop's", when processed, then properly escape and search for "laptops" or "laptop's"
- [ ] Given 500 matching results, when displayed, then show first 20 with pagination controls

❌ Bad:
- [ ] Search returns relevant results
- [ ] Search is fast
```

### Payment Processing

```markdown
✅ Good:
- [ ] Given valid card details, when payment submitted, then charge card and return transaction ID within 5 seconds
- [ ] Given card with insufficient funds, when payment attempted, then return clear error and do not create order
- [ ] Given network timeout during payment, when 30 seconds elapse, then reverse transaction and show "Payment failed, please try again"
- [ ] Given successful payment, when order created, then send confirmation email within 2 minutes

❌ Bad:
- [ ] Payment processing works
- [ ] Handle payment failures
```

### Notification System

```markdown
✅ Good:
- [ ] Given user with email notifications enabled, when order ships, then send email within 5 minutes with tracking number
- [ ] Given user opted out of marketing, when promotional campaign runs, then exclude user from email list
- [ ] Given 1000 notifications queued, when processed, then deliver 95% within 1 minute
- [ ] Given email bounce, when detected, then mark email as invalid and stop future attempts

❌ Bad:
- [ ] Send notifications
- [ ] Respect user preferences
```

### File Upload

```markdown
✅ Good:
- [ ] Given image file >5MB, when uploaded, then compress to <2MB while maintaining minimum 1080p resolution
- [ ] Given PDF file, when uploaded, then extract text for searchability and store both original and text
- [ ] Given unsupported file type (.exe), when upload attempted, then reject with "File type not supported" message
- [ ] Given network interruption at 50% upload, when connection restored, then resume from 50% rather than restart

❌ Bad:
- [ ] File upload works
- [ ] Support multiple file types
```

### Reporting & Analytics

```markdown
✅ Good:
- [ ] Given date range Jan 1-31, when revenue report generated, then include all transactions with timestamps in UTC between those dates
- [ ] Given user without "reports" permission, when accessing /reports, then return 403 Forbidden
- [ ] Given 1M+ records, when report requested, then generate asynchronously and email link when complete
- [ ] Given report export to CSV, when generated, then include headers and escape special characters properly

❌ Bad:
- [ ] Reports show correct data
- [ ] Export functionality works
```

## Testing Requirements Examples

### Unit Test Examples

```markdown
✅ Good Unit Tests:
- Test: calculateDiscount() returns 10% off for orders >$100
- Test: validateEmail() rejects addresses without @ symbol
- Test: formatCurrency() handles negative numbers correctly
- Test: parseDate() throws error for invalid date strings
- Test: hashPassword() produces different hash for same input with different salt

❌ Bad Unit Tests:
- Test: Function works correctly
- Test: Validation is proper
```

### Integration Test Examples

```markdown
✅ Good Integration Tests:
- Test: Creating order triggers inventory reduction in database
- Test: API call to payment gateway completes round trip in <3s
- Test: Message published to queue is received by consumer
- Test: Database transaction rolls back on error
- Test: Cache invalidates when underlying data changes

❌ Bad Integration Tests:
- Test: Systems work together
- Test: Integration is successful
```

### E2E Test Examples

```markdown
✅ Good E2E Tests:
- Test: User can complete purchase from product search to order confirmation
- Test: Admin can create product, publish it, and it appears in customer search
- Test: Password reset flow works from email request to successful login
- Test: User can upload image, crop it, apply filter, and download result
- Test: Multi-step form preserves data when navigating back and forth

❌ Bad E2E Tests:
- Test: User flow works
- Test: Application functions properly
```

## Checklist Format Criteria

Sometimes checklist format is clearer than Given-When-Then:

```markdown
### Good Checklist Criteria:
- [ ] Email validation rejects invalid formats
- [ ] Email validation accepts valid formats with + and . characters  
- [ ] Password requires minimum 8 characters
- [ ] Password requires at least one uppercase letter
- [ ] Password requires at least one number
- [ ] Form cannot be submitted with validation errors
- [ ] Validation messages clear and actionable
- [ ] Validation runs on blur and on submit

### Bad Checklist Criteria:
- [ ] Validation works
- [ ] Form is user-friendly
- [ ] Security is good
```

## Performance Criteria

```markdown
✅ Good Performance Criteria:
- [ ] Page loads in <2 seconds on 3G connection
- [ ] API responds in <200ms for 95th percentile
- [ ] Database queries complete in <100ms
- [ ] JavaScript bundle size <500KB gzipped
- [ ] Time to First Byte (TTFB) <600ms
- [ ] Lighthouse performance score >90

❌ Bad Performance Criteria:
- [ ] Application is fast
- [ ] Good performance
- [ ] Optimized code
```

## Security Criteria

```markdown
✅ Good Security Criteria:
- [ ] All API endpoints require authentication except public routes
- [ ] Passwords hashed with bcrypt (minimum cost factor 10)
- [ ] SQL queries use parameterized statements
- [ ] File uploads restricted to allowed MIME types
- [ ] Rate limiting: max 100 requests per minute per IP
- [ ] CORS configured for specific allowed origins only
- [ ] XSS protection headers present on all responses

❌ Bad Security Criteria:
- [ ] Application is secure
- [ ] Follow security best practices
- [ ] No vulnerabilities
```