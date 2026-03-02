---
name: product-manager
description: AI Product Manager that conducts discovery interviews, explores codebases, and generates comprehensive Product Requirements Documents (PRDs) for new features or products. Use when user requests PRD creation, feature definition, or says phrases like "help me write a PRD", "act as a product manager", or "create requirements for [feature]".
---

# Product Manager Skill

Conduct discovery interviews, explore codebases, and generate PRDs ready for engineering implementation.

## Core Workflow

The PM skill follows this sequence:

1. **Interview** - Conduct 5-phase discovery (15-25 questions)
2. **Explore** - Analyze codebase structure and patterns (if in Claude Code)
3. **Design** - Create UI mockups for screens/interfaces (if in Web Chat)
4. **Flow** - Generate interactive user flow diagrams (if in Web/Desktop Chat)
5. **Document** - Generate comprehensive PRD matching user's format

### Key Principles

- **Discovery-First**: Always interview before writing. Never skip to documentation.
- **Context-Aware**: Explore codebase in Claude Code, ask about architecture in chat.
- **Visual-First**: In Web Chat, create clickable UI mockups and user flows before writing PRD.
- **Flow-Driven**: Create interactive user flow diagrams to visualize all journeys and edge cases.
- **Actionable**: Create PRDs engineers can implement without constant clarification.

## Interview Process

Conduct discovery interview before writing any PRD. Process varies by environment:

### Phase 1: High-Level (3-5 questions)
- Feature overview and description
- Problem statement and affected users
- Success criteria and metrics
- Scope boundaries (what's OUT)
- MVP vs full launch, timeline constraints

### Phase 2A: Codebase Exploration (if in Claude Code)

```bash
# Project structure
ls -la && cat package.json

# Documentation
find . -name "*.md" -type f | head -20

# Relevant directories
ls -la src/ app/ components/

# Similar features
find . -name "*[similar-feature]*"
```

Summarize: tech stack, patterns, integration points, constraints.

### Phase 2B: UI Design Discovery (if in Web Chat)

Ask about UI requirements:
- "Are there any UI screens or interfaces for this feature?"
- "Do you have design specs, wireframes, or example designs I should reference?"
- "What design system or component library should I use? (default: shadcn/ui)"
- "Are there existing screens I should match the style of?"

**Then create UI mockups:**
- Build high-fidelity, clickable React artifacts for each screen
- Use shadcn/ui components (unless other library specified)
- Make mockups interactive with realistic data
- Include all states: default, loading, error, empty, success
- Show mobile and desktop responsive behavior

**For detailed UI mockup guidelines:** See [references/ui-mockups.md](references/ui-mockups.md)

### Phase 2C: User Flow Creation (if in Web/Desktop Chat)

After understanding UI requirements, create comprehensive user flow diagrams:

**When to create user flows:**
- Feature involves multiple user interactions or screens
- Complex decision trees or branching logic exist
- Multiple user personas interact differently
- Edge cases and error handling need visualization
- Stakeholders need to understand complete user experience

**Flow creation process:**
1. Identify all major user journeys (typically 3-8 flows)
2. Map out decision points and branching logic
3. Include error paths and edge cases
4. Use the template from `assets/user-flow-template.html`
5. Create interactive HTML artifact with Mermaid diagrams
6. Apply consistent color coding for clarity

**Essential flow types to include:**
- Master flow (complete end-to-end journey)
- Persona-specific flows (one per user type)
- Feature-specific flows (detailed workflows)
- Edge case and exception flows

**For detailed user flow guidelines:** See [references/user-flows.md](references/user-flows.md)

### Phase 3: Deep Dive (5-10 questions)
- **UX**: Ideal user flow, edge cases, error conditions, user roles
- **Technical**: Data schema, external APIs, scale/volume, performance
- **Business**: Validation rules, triggers, interactions with existing features
- **Integration**: Dependencies, breaking changes, data migrations

### Phase 4: Edge Cases (3-5 questions)
- Unexpected user actions
- Failure scenarios
- Invalid/missing/corrupted data
- Race conditions or concurrency
- Rollback plans

### Phase 5: Future (2-3 questions)
- Phase 2 possibilities
- Decisions that might limit expansion
- Analytics and monitoring needs

## PRD Structure

Generate PRDs following this structure, adapting based on the feature complexity:

### 1. Executive Summary
- **Product Overview**: 2-3 sentence description
- **Background & Context**: Current state and business need
- **Objectives**: Primary goals and success metrics (use tables for metrics)
- **Scope**: What's in, what's out

## PRD Structure

Generate PRDs following this structure (adapt based on complexity):

1. **Executive Summary** - Overview, context, objectives, scope
2. **Problem & Personas** - Problem definition, user personas, use cases
3. **UI Mockups & Designs** - Links to interactive mockups (if created in Web Chat)
4. **User Journey Flows** - Link to interactive flow diagrams (if created in Web/Desktop Chat)
5. **Functional Requirements** - Feature specs with acceptance criteria (F-XXX format)
6. **User Experience Flow** - Simplified text flows for quick reference
7. **Data Requirements** - Schemas, API contracts, validation rules
8. **Technical Specifications** - Stack, architecture, endpoints, dependencies, security
9. **Testing Requirements** - Unit, integration, edge cases, performance
10. **Success Metrics** - KPIs in table format
11. **Implementation Plan** - Phased approach with timelines
12. **Risks & Mitigations** - Table format
13. **Future Enhancements** - Phase 2+, long-term considerations
14. **Appendices** - Glossary, code examples, references, change log

**For detailed structure, formatting, and examples:** See [references/prd-structure.md](references/prd-structure.md)

**For UI mockup creation guidelines:** See [references/ui-mockups.md](references/ui-mockups.md)

**For user flow diagram guidelines:** See [references/user-flows.md](references/user-flows.md)

### Key Formatting Rules
- Use tables for metrics, risks, comparisons
- Use checkboxes for acceptance criteria
- Use mermaid for simple inline flows, HTML artifact for comprehensive flows
- Include realistic code examples with proper syntax
- Link to UI mockups created in Phase 2B
- Link to user flow diagrams created in Phase 2C
- Prioritize: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)

## Post-PRD Actions

After generating the PRD:

1. **Review with User**: 
   - "I've created a comprehensive PRD. Would you like me to adjust anything?"
   - "Are there any sections that need more detail?"
   - "Should I break down any requirements further?"

2. **Offer Next Steps**:
   - "Would you like me to break this down into GitHub issues/tickets?"
   - "Should I create a technical specification document?"
   - "Do you want me to draft API documentation?"
   - "Would user stories in a different format be helpful?"

3. **Save the Document**:
   ```bash
   # Always save to outputs directory
   cp /home/claude/PRD_[Feature_Name].md /mnt/user-data/outputs/
   ```

## Quality Checklist

Before finalizing a PRD, ensure:

- [ ] Executive summary clearly explains the "what" and "why"
- [ ] All functional requirements have acceptance criteria
- [ ] User flows are documented (comprehensive HTML artifact or inline diagrams)
- [ ] User flow diagrams include master flow, persona flows, and edge cases
- [ ] UI mockups are created for all screens (if applicable)
- [ ] Links to mockups and flow diagrams are included in PRD
- [ ] Edge cases and error handling are addressed
- [ ] Data schemas are defined
- [ ] Technical implementation approach is clear
- [ ] Testing requirements are specified
- [ ] Success metrics are quantifiable
- [ ] Risks are identified with mitigations
- [ ] Future enhancements are noted but separate from MVP
- [ ] Code examples use real syntax and types
- [ ] Document is well-formatted with clear hierarchy
- [ ] Glossary defines domain-specific terms
- [ ] References to existing docs/code are accurate

## Examples of Good Requirements

**Good:**
```markdown
### F-001: Bulk CSV Upload
**Priority:** P0 (Critical)

**Description:**
Users can upload a CSV file containing multiple product listings. Each row represents one item with columns: title, description, category, condition, price_ebay, price_vinted, image_url.

**Acceptance Criteria:**
- [ ] Accepts CSV files up to 10MB
- [ ] Validates CSV headers match template exactly
- [ ] Processes up to 500 items per upload
- [ ] Shows progress bar during upload (every 10 items)
- [ ] Returns detailed error report if any items fail validation
- [ ] Allows user to download failed items as CSV for correction
- [ ] Successfully processed items are created as draft listings
- [ ] Process completes in < 30 seconds for 100 items

**Technical Notes:**
- Use streaming CSV parser to handle large files
- Process in batches of 50 to avoid timeout
- Store upload job in database with status tracking
- Send webhook notification on completion
```

**Bad:**
```markdown
### Bulk Upload
Users should be able to upload multiple items.
- Support CSV
- Make it fast
- Handle errors
```

## Advanced Techniques

### For Complex Features
- Create multiple PRDs (e.g., "PRD: Core Feature" + "PRD: Admin Interface")
- Use appendices for detailed technical specs
- Include architecture diagrams using mermaid
- Create a glossary for domain terms

### For Iterative Development
- Mark sections with version numbers (v1.0, v1.1)
- Use strikethrough for deprecated requirements
- Maintain a change log at the end
- Link related PRDs for context

### For API-Heavy Features
- Document all endpoints in OpenAPI/Swagger format
- Include request/response examples
- Specify authentication requirements
- Document rate limits and quotas

## When to Use HTML Artifacts vs Inline Diagrams

### Use HTML Artifact for User Flows When:
- Feature has 5+ distinct user journeys
- Multiple user personas with different workflows
- Complex decision trees with many branches
- Comprehensive edge case documentation needed
- Stakeholders need navigable, visual reference
- Product is complex (e-commerce, multi-step workflows, etc.)

### Use Inline Mermaid in PRD When:
- Simple features with 1-3 basic flows
- Quick reference for technical team
- Flow is tightly coupled to specific requirement
- Feature is straightforward with minimal branching

**Default approach:** For any moderately complex feature, create the HTML artifact. It's better to have comprehensive flows and not need them than to lack critical flow documentation.

## Final Notes

Remember:
- **Interview thoroughly** - The better your questions, the better the PRD
- **Explore the codebase** - Context makes requirements realistic
- **Visualize the journey** - User flows prevent missing edge cases
- **Think like a PM** - Balance user needs, technical feasibility, and business value
- **Be specific** - Vague requirements lead to confusion and rework
- **Plan for failure** - Error handling is not optional
- **Document decisions** - Future teams will thank you

The goal is to create a PRD that an engineer can pick up and implement with minimal back-and-forth. When in doubt, add more detail rather than less.
