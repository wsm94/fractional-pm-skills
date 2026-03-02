# UI Mockup Creation Guidelines

Complete guide for creating high-fidelity, interactive UI mockups in Web Chat during PRD discovery.

## When to Create UI Mockups

**Always create mockups in Web Chat when:**
- Feature includes new screens or UI components
- User mentions UI/UX requirements
- Feature involves user-facing interfaces

**Skip mockups when:**
- Running in Claude Code (focus on codebase exploration instead)
- Feature is purely backend/API with no UI
- User explicitly states "no UI needed"

## Discovery Questions

Before creating mockups, ask:

1. **Design System**: "What design system or component library should I use?"
   - Default to shadcn/ui if not specified
   - Other options: Material UI, Ant Design, Chakra UI, custom

2. **Design References**: "Do you have any design specs, wireframes, or example designs?"
   - Figma links
   - Screenshots
   - Style guides
   - Brand guidelines

3. **Existing Patterns**: "Are there existing screens I should match the style of?"
   - Similar features in the product
   - Design consistency requirements

4. **Responsive Requirements**: "Should this work on mobile, tablet, desktop, or all?"
   - Mobile-first vs desktop-first
   - Breakpoint preferences

## Creating Mockups with React Artifacts

### Technology Stack

**Default Stack (unless specified otherwise):**
- React (functional components with hooks)
- Tailwind CSS (core utility classes only)
- shadcn/ui components
- Lucide React icons

**Available Libraries:**
```javascript
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Table } from "@/components/ui/table"
import { Tabs } from "@/components/ui/tabs"
import { Select } from "@/components/ui/select"
import { Camera, Upload, Check, X } from "lucide-react"
```

### Mockup Quality Standards

**High-Fidelity Requirements:**
- ✅ Realistic data (not "Lorem ipsum" or "User 1")
- ✅ Proper spacing and alignment
- ✅ Actual brand colors (if known) or professional defaults
- ✅ Real icons from lucide-react
- ✅ Proper typography hierarchy
- ✅ Interactive elements work (buttons, forms, tabs)
- ✅ Multiple states shown (default, loading, error, empty, success)

**Don't Create:**
- ❌ Static wireframes (make them interactive)
- ❌ Placeholder text like "Content goes here"
- ❌ Broken interactions
- ❌ Single state only (show all states)

### Essential UI States to Include

For every mockup, demonstrate these states where applicable:

1. **Default/Initial State**
   - Empty state (when no data)
   - Default values
   - Placeholder text in inputs

2. **Loading State**
   - Skeleton loaders
   - Spinners
   - Progress indicators
   - Disabled buttons during load

3. **Success State**
   - Data populated
   - Success messages
   - Confirmation states

4. **Error State**
   - Error messages
   - Validation errors
   - Network errors
   - Form field errors

5. **Edge Cases**
   - Long text overflow
   - Large data sets
   - Empty results
   - Maximum character limits reached

### Component Examples

#### Form Screen Example

```jsx
export default function UserProfileForm() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <Input 
            placeholder="John Smith" 
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <Input 
            type="email"
            placeholder="john.smith@company.com"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            disabled={loading}
            onClick={() => setLoading(true)}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>

        {saved && (
          <div className="bg-green-50 text-green-800 p-3 rounded">
            ✓ Profile saved successfully
          </div>
        )}
      </div>
    </Card>
  )
}
```

#### List/Table Screen Example

```jsx
export default function UsersList() {
  const [users, setUsers] = useState([
    { id: 1, name: "Sarah Chen", email: "sarah.chen@acme.com", role: "Admin", status: "active" },
    { id: 2, name: "Marcus Johnson", email: "marcus.j@acme.com", role: "Editor", status: "active" },
    { id: 3, name: "Emma Williams", email: "emma.w@acme.com", role: "Viewer", status: "invited" },
  ])
  const [loading, setLoading] = useState(false)

  if (loading) {
    return <div className="p-8">Loading users...</div>
  }

  if (users.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-500 mb-4">No users found</p>
        <Button>Invite User</Button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <Button>+ Invite User</Button>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span className={`px-2 py-1 rounded text-xs ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
              </td>
              <td>
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
```

#### Modal/Dialog Example

```jsx
export default function DeleteConfirmationModal() {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete Account
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Delete Account?
          </h3>
          <p className="text-gray-600 mb-6">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
          <div className="flex gap-3">
            <Button 
              variant="destructive" 
              disabled={deleting}
              onClick={() => setDeleting(true)}
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
```

#### Dashboard/Stats Screen Example

```jsx
export default function AnalyticsDashboard() {
  const stats = [
    { label: "Total Users", value: "2,543", change: "+12%", trend: "up" },
    { label: "Active Sessions", value: "847", change: "+5%", trend: "up" },
    { label: "Conversion Rate", value: "3.2%", change: "-0.3%", trend: "down" },
    { label: "Revenue", value: "$45,231", change: "+18%", trend: "up" },
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold mb-2">{stat.value}</p>
            <p className={`text-sm ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change} vs last month
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">New user signup</p>
              <p className="text-sm text-gray-500">sarah.chen@example.com</p>
            </div>
            <span className="text-sm text-gray-500">2 min ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">Payment received</p>
              <p className="text-sm text-gray-500">$299.00 from Acme Corp</p>
            </div>
            <span className="text-sm text-gray-500">15 min ago</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
```

## Multi-Screen Mockups

When features have multiple screens, create separate artifacts for each:

### Naming Convention

```
1. [Feature] - Main Screen
2. [Feature] - Settings Modal
3. [Feature] - Empty State
4. [Feature] - Error State
5. [Feature] - Mobile View
```

### Example Multi-Screen Flow

**Feature: User Invitation System**

Create these artifacts:
1. **Users List Screen** - Shows all users with invite button
2. **Invite Modal** - Form to invite new user
3. **Success State** - Confirmation message after invite sent
4. **Pending Invitations List** - Shows users who haven't accepted
5. **Mobile View** - Responsive layout for mobile devices

## Responsive Design

### Breakpoints to Consider

```jsx
// Show different layouts based on screen size
export default function ResponsiveLayout() {
  return (
    <div>
      {/* Mobile: Stack vertically */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          <Card>Mobile Layout</Card>
          <Card>Stacked Content</Card>
        </div>
      </div>

      {/* Desktop: Side by side */}
      <div className="hidden lg:flex lg:gap-6">
        <Card className="flex-1">Desktop Layout</Card>
        <Card className="flex-1">Side by Side</Card>
      </div>
    </div>
  )
}
```

### Mobile-Specific Considerations

- Touch targets: Minimum 44px height
- Simplified navigation (hamburger menu)
- Stacked layouts
- Larger text for readability
- Bottom-aligned CTAs for thumb reach

## Design System Defaults

### shadcn/ui Default Theme

If no brand colors specified, use shadcn defaults:

```jsx
// Colors
- Primary: Blue (slate-900 for text)
- Secondary: Gray (slate-600)
- Success: Green (green-600)
- Error: Red (red-600)
- Warning: Yellow (yellow-600)

// Typography
- Headings: font-bold
- Body: font-normal
- Labels: text-sm font-medium

// Spacing
- Small gap: gap-2 (0.5rem)
- Medium gap: gap-4 (1rem)
- Large gap: gap-6 (1.5rem)
- Section spacing: space-y-6

// Borders
- Default: border (1px)
- Rounded: rounded-md (0.375rem)
- Cards: rounded-lg (0.5rem)
```

### Component Variants

Use appropriate shadcn variants:

```jsx
// Buttons
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Button Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

## Including Mockups in PRD

### PRD Section Format

```markdown
## 3. UI Mockups & Designs

### Overview
High-fidelity interactive mockups created during discovery phase.

### Screens

#### 3.1 Main Dashboard
**Purpose:** Primary user interface showing key metrics and actions
**Mockup:** [View Interactive Mockup](computer://...)
**Key Features:**
- Real-time stats display
- Quick action buttons
- Recent activity feed
- Responsive layout

**States Demonstrated:**
- Default state with data
- Loading state
- Empty state (no data)
- Error state (failed to load)

#### 3.2 Settings Modal
**Purpose:** User configuration interface
**Mockup:** [View Interactive Mockup](computer://...)
**Key Features:**
- Form validation
- Save/cancel actions
- Success feedback

**States Demonstrated:**
- Default form
- Validation errors
- Saving state
- Success confirmation

### Design System
- **Component Library:** shadcn/ui
- **Icons:** Lucide React
- **Responsive:** Mobile-first, tablet, desktop
- **Accessibility:** WCAG 2.1 AA compliant

### Design Decisions
- Used card-based layout for better content organization
- Implemented skeleton loaders for perceived performance
- Added empty states with clear CTAs
- Color-coded status indicators for quick scanning
```

## Checklist for Each Mockup

Before considering a mockup complete, verify:

- [ ] Uses specified design system (or shadcn/ui by default)
- [ ] Contains realistic data (no placeholders)
- [ ] Shows at least 3 states (default, loading, error/empty)
- [ ] Interactive elements work (buttons trigger state changes)
- [ ] Proper spacing and alignment
- [ ] Responsive behavior considered
- [ ] Icons from lucide-react (not emoji or text)
- [ ] Color scheme is professional
- [ ] Typography hierarchy is clear
- [ ] Matches any provided design references
- [ ] Demonstrates key user flows
- [ ] Error states are helpful and actionable

## Common Mistakes to Avoid

### Don't:
1. **Use placeholder text** - "Lorem ipsum", "User 1", "Content here"
2. **Create single-state mockups** - Always show loading, error, empty states
3. **Make static images** - All mockups must be interactive React artifacts
4. **Ignore mobile** - Consider responsive design unless desktop-only specified
5. **Use inline styles** - Only use Tailwind utility classes
6. **Overcomplicate** - Keep to shadcn/ui components, don't create custom complex components
7. **Skip error states** - These are critical for user experience
8. **Forget accessibility** - Use semantic HTML, proper labels, ARIA when needed
9. **Use unavailable libraries** - Stick to the listed available imports
10. **Mix design systems** - If using shadcn, use it consistently throughout

### Do:
1. **Use realistic data** - "Sarah Chen", "sarah.chen@acme.com", "$45,231"
2. **Show workflows** - Multiple screens showing user journey
3. **Make it interactive** - Buttons change state, tabs switch content
4. **Consider edge cases** - What happens with 0 items? 1000 items? Really long text?
5. **Add helpful empty states** - Clear messaging and next actions
6. **Use proper icons** - lucide-react has hundreds of options
7. **Test interactions** - Click through the mockup yourself
8. **Add loading feedback** - Users should know something is happening
9. **Be consistent** - Same spacing, colors, and patterns throughout
10. **Think mobile-first** - Start with mobile layout, enhance for desktop

## After Creating Mockups

Once mockups are complete:

1. **Review with User:**
   - "I've created interactive mockups for [X screens]. Take a look and let me know if anything should change."
   - "Do these mockups match your vision? Any adjustments needed?"

2. **Iterate if Needed:**
   - Adjust based on feedback
   - Create additional states or screens if needed
   - Update design system if different library preferred

3. **Link in PRD:**
   - Include all mockup links in the UI Mockups section
   - Reference specific mockups in functional requirements
   - Note any design decisions made

4. **Proceed to Documentation:**
   - Complete the interview phases
   - Write the full PRD
   - Reference mockups throughout PRD where relevant

## Example Workflow

```
User: "Help me write a PRD for a team dashboard feature"

Claude PM:
1. Asks high-level questions (Phase 1)
2. Detects we're in Web Chat → UI mockup phase
3. Asks: "What screens do we need? Any design specs?"
4. User: "Main dashboard and a settings modal. Use shadcn."
5. Creates interactive mockups:
   - Team Dashboard (default, loading, empty states)
   - Settings Modal (form with validation)
6. User reviews and approves
7. Continues with deep dive questions (Phase 3)
8. Writes comprehensive PRD with mockup links
9. Saves PRD to outputs
```

## Tips for Different Feature Types

### CRUD Features (Create, Read, Update, Delete)
Create mockups for:
- List/table view
- Create/edit form
- Detail view
- Delete confirmation
- Empty state
- Success/error messages

### Dashboard Features
Create mockups for:
- Main dashboard with widgets
- Individual widget drill-downs
- Filters/date range selector
- Export/download options
- Empty state (no data yet)
- Error state (failed to load)

### Workflow Features (Multi-step)
Create mockups for:
- Each step in the workflow
- Progress indicator
- Review/summary step
- Success confirmation
- Abandon/exit flow
- Error recovery

### Settings/Configuration
Create mockups for:
- Settings panel/page
- Tabbed sections (if complex)
- Form with validation
- Save confirmation
- Reset to defaults option
- Dangerous actions (delete, etc.)

The goal is to create mockups so clear and interactive that a designer could use them as a starting point, and a developer could implement them with minimal clarification.
