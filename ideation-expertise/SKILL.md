---
name: ideation-expertise
description: Facilitates structured ideation and early-stage brainstorming for new projects or products. Guides users through problem space exploration, opportunity mapping, user research, business context, and feature prioritisation to produce a comprehensive Ideation Document ready for product discovery. Use when user wants to brainstorm a new product idea, explore a problem space, create an ideation document, or says phrases like "help me ideate", "brainstorm this idea", "create an ideation doc", "explore this problem space", or "I have a product idea".
---

# Ideation Expertise

Facilitate structured ideation sessions that capture early-stage thinking about projects and products. Produce Ideation Documents designed to feed into product discovery.

## Core Workflow

1. **Understand** - Identify what the user wants to ideate on and gather initial context
2. **Explore Problem Space** - Guide the user through problem definition, current state, pain points, and urgency
3. **Map Opportunities** - Explore vision, beneficiaries, adjacent opportunities, and success horizons
4. **Define Users** - Identify user types, workflows, and screen/interaction concepts
5. **Capture Business Context** - Strategic alignment, drivers, constraints, and metrics
6. **Prioritise Ideas** - Sort features into must-have, should-have, and nice-to-have
7. **Identify Risks** - Surface known risks, open questions, and assumptions
8. **Document** - Generate the Ideation Document using the template

## Key Principles

- **Conversational Discovery**: Guide through structured questions rather than asking users to fill in a blank template. Ask 3-5 questions at a time, grouped by section.
- **Progressive Depth**: Start broad (problem/opportunity) and narrow down (features/constraints). Never jump to solutions before understanding the problem.
- **Capture Everything**: Early-stage ideas are fragile. Record all thinking, even rough ideas, with the understanding that refinement happens later.
- **Stay Pre-Technical**: Ideation Documents capture *what* and *why*, not *how*. Technical decisions belong in Discovery. Redirect technical solutioning back to problem/opportunity framing.
- **Version Thinking**: Encourage iterative refinement. Mark the document version and track how thinking evolves.

## Interview Process

### Phase 1: Problem & Opportunity (5-8 questions)

Open with broad, exploratory questions:

- "What problem are you trying to solve? Who has this problem?"
- "How is this problem being solved today? What's broken about that?"
- "Why solve this now? Is there a trigger event or cost of inaction?"
- "If this is solved well, what does the world look like?"
- "Who benefits most, and how?"

### Phase 2: Users & Workflows (5-8 questions)

Dig into the people and their journeys:

- "Who are the different types of users? What are their roles and skill levels?"
- "Walk me through a typical workflow — what do they do step by step today?"
- "What's the most frustrating part of that workflow?"
- "What screens or interactions do you envision? What would users see and do?"
- "Are there different user journeys for different user types?"

### Phase 3: Business Context (3-5 questions)

Understand the business drivers:

- "How does this align with your company's strategy or goals?"
- "What's driving the investment — revenue, cost reduction, compliance, competition?"
- "What constraints exist — budget, timeline, team, regulatory?"
- "What business metrics should this move? By how much?"

### Phase 4: Features & Prioritisation (3-5 questions)

Shape the solution space:

- "What capabilities are absolutely essential for this to be useful?"
- "What's important but could wait for a second release?"
- "Are there existing products or competitors to learn from? What do they do well or poorly?"
- "What business rules or validation constraints must the system respect?"

### Phase 5: Risks & Unknowns (3-5 questions)

Surface uncertainty:

- "What could go wrong? What's the impact and likelihood?"
- "What don't you know yet that you need to find out?"
- "What are you assuming to be true that should be validated?"
- "How will you measure whether this is successful?"

## Generating the Ideation Document

After completing the interview, generate the Ideation Document using the template at `assets/ideation-template.md`.

### Document Generation Steps

1. Read the template from `assets/ideation-template.md`
2. Fill in all sections with information gathered during the interview
3. Replace all placeholder text (`[Project Name]`, `YYYY-MM-DD`, etc.) with actual values
4. Remove HTML comment prompts from completed sections
5. Set the frontmatter fields: title, version, created date, participants, tools_used, status
6. Save the completed document to the project directory (ask user for preferred location)

### Quality Checklist

Before presenting the document, verify:

- [ ] All sections have substantive content (no empty placeholders remain)
- [ ] Problem statement is specific about who has the problem and what it costs
- [ ] At least one user type is fully described
- [ ] At least one workflow is documented step by step
- [ ] Features are categorised into must/should/nice-to-have
- [ ] Success metrics are specific and measurable
- [ ] Open questions and assumptions are captured
- [ ] No technical implementation decisions are included (architecture, stack, data models)
- [ ] Changelog reflects the session

## Post-Document Actions

After generating the document:

1. **Review**: Present the document and ask for feedback — "Would you like to adjust any sections?"
2. **Refine**: Offer to drill deeper into any section — "Should we explore the user workflows in more detail?"
3. **Version**: If doing a second round, increment the version and update the changelog
4. **Next Steps**: Suggest natural follow-ons:
   - "Ready to move this into discovery? This document is designed to feed directly into product discovery."
   - "Would you like to create a PRD from this ideation document?"
   - "Should we break down the must-haves into development issues?"

## Handling Partial Sessions

If the user wants to ideate on only part of the document (e.g., just the problem space):

- Fill in the sections covered
- Mark uncovered sections with `<!-- Not yet explored -->`
- Set status to `draft` in frontmatter
- Note in the changelog what was covered and what remains

## Handling Multiple Rounds

Ideation often happens iteratively. When revisiting an existing document:

1. Read the existing document to understand current state
2. Identify which sections need refinement or expansion
3. Ask targeted questions for those sections
4. Increment the version number
5. Update the changelog with what changed, what was added, and what was dropped
