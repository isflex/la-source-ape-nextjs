# Server Async Styled Default Module Components

## ⚠️ Important Notice

This directory is scheduled for a **major refactoring** to implement a **Composition Pattern** architecture. This refactoring will resolve the current architectural inconsistency where server components (`'use server'`) contain client-side hooks (`useState`, `useEffect`), which is invalid in React Server Components.

## Current State

**Total Components**: 134 components across 53 component families

**Architectural Issue**:
- All components have `'use server'` directive
- 19 components use React hooks (useState, useEffect) - **invalid with 'use server'**
- 115 components are pure server components - valid
- Only 6 components are actively used server-side: Box, Hero, Section, Text, Title, View

**Components with Hooks (Invalid)**:
1. Accordion/Item
2. Button
3. Checkbox
4. Dropdown (+ Item, Trigger)
5. ImageList
6. Input
7. Modal
8. Options/Item
9. Pagination
10. ProductTour
11. Radio
12. Slider
13. Switch
14. Tabs (+ Item)
15. Tag
16. Textarea

## Planned Refactoring

### Architecture Overview

The refactoring will implement a **three-layer composition pattern**:

```
Component Layer (server-async & client)
           ↓
Component Logic Layer (NEW - shared logic modules)
           ↓
Shared Utilities Layer (NEW - common operations)
```

### Key Changes

1. **Extract Shared Logic**: Create reusable logic modules for all components
2. **Remove Hooks from Server Components**: Fix the 'use server' + hooks conflict
3. **State Variation Pattern**: Server components will render all possible state variations, client-side JavaScript selects which to display
4. **Type-Safe Builders**: Create prop builders for consistent logic across server and client components

### New Directory Structure

```
packages/flex/design-system-react-ts/src/
├── component-logic/                    # NEW
│   ├── shared-utils/                   # ID generation, class building, etc.
│   └── component-modules/              # Per-component logic modules
│       ├── checkbox/
│       │   ├── checkbox-logic.ts
│       │   ├── checkbox-builders.ts
│       │   └── checkbox-types.ts
│       └── [one folder per component]
│
└── server-async-styled-default-module-components/  # REFACTORED
    ├── checkbox/CheckboxDefault.tsx    # Hooks removed, uses logic modules
    └── [all components refactored]
```

### Benefits

- ✅ **Valid Server Components**: No more 'use server' + hooks conflict
- ✅ **Shared Logic**: Reusable across server-async and client components
- ✅ **Type Safety**: Type-safe prop builders throughout
- ✅ **Progressive Enhancement**: State variations enable server-rendered interactivity
- ✅ **Maintainability**: Single source of truth for component logic

## Implementation Plan

📋 **Detailed Plan**: [`/home/ischerer/.claude/plans/misty-waddling-pnueli.md`](/home/ischerer/.claude/plans/misty-waddling-pnueli.md)

### Phased Approach (7 Weeks)

1. **Week 1**: Foundation - Create shared utilities
2. **Week 2**: Pilot - Validate with 3 components (Container, Checkbox, Input)
3. **Weeks 3-4**: Transform 115 stateless components
4. **Weeks 5-6**: Transform 19 stateful components with state variations
5. **Week 7**: Optimization, documentation, testing

### Example Transformation

**Before** (Invalid):
```tsx
'use server'
const Checkbox = async ({ checked, onChange }) => {
  const [_checked, setChecked] = React.useState(checked)  // ❌ Invalid
  React.useEffect(() => { ... })                          // ❌ Invalid
  return <input checked={_checked} onChange={onChange} />
}
```

**After** (Valid):
```tsx
'use server'
import { buildCheckboxData } from '../../component-logic/component-modules/checkbox'

const Checkbox = async (props) => {
  const { variations } = buildCheckboxData(props)  // ✅ Pure logic

  return variations.map(variation => (
    <input
      data-state={variation.key}
      className={variation.classes}
      style={{ display: variation.isDefault ? 'block' : 'none' }}
      {...variation.attributes}
    />
  ))
}
```

## Implementation Guidelines

### ⚠️ Development Branch Setup

**IMPORTANT**: This refactoring MUST be implemented on a feature branch in its own worktree:

```bash
# From the flexi worktree
cd /home/ischerer/workspaces/flex/la-source-ape/gateway/flexi

# Create feature branch
git checkout -b feature/composition-pattern-refactor

# Create new worktree for this work
git worktree add ../flexi-composition-refactor feature/composition-pattern-refactor

# Work in the new worktree
cd ../flexi-composition-refactor
```

### Why a Separate Worktree?

1. **Isolation**: Keep refactoring separate from ongoing flexi work
2. **Parallel Development**: Continue work in flexi while refactoring
3. **Safe Testing**: Test extensively without affecting main worktree
4. **Clean Merges**: Easier to review and merge when complete

### Implementation Order

**Start with**:
1. Shared utilities (foundation)
2. Container component (simplest, validates pattern)
3. Checkbox component (validates state variation pattern)
4. Input component (validates complex component pattern)

**Then proceed to**:
1. The 6 core server components (Box, Hero, Section, Text, Title, View)
2. Remaining stateless components
3. Stateful components with hooks

### Testing Requirements

Before considering implementation complete:

- [ ] All utilities have unit tests
- [ ] All logic modules have unit tests
- [ ] Components render correctly (visual regression tests)
- [ ] TypeScript compilation passes with no errors
- [ ] No breaking changes to component APIs
- [ ] Bundle size is unchanged or reduced
- [ ] Performance benchmarks show no degradation

## Current Usage

While this refactoring is planned, these components remain in use:

**Active Server Components** (6):
- Box
- Hero
- Section
- Text
- Title
- View

These are imported via `/apps/gateway/src/components/flex-server-components.ts`

**Client Components**: All components are available in their client form via `styled-default-module-components/` which will NOT be modified by this refactoring.

## Questions or Issues?

For detailed technical specifications, architecture decisions, and implementation details, see the full plan:

📋 [`/home/ischerer/.claude/plans/misty-waddling-pnueli.md`](/home/ischerer/.claude/plans/misty-waddling-pnueli.md)

---

**Last Updated**: December 2024
**Status**: Planning Complete - Ready for Implementation
**Assigned**: TBD
**Estimated Duration**: 7 weeks
