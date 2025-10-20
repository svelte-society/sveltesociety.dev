# Product Requirements Document: Content Dashboard Filtering & Search

## Overview

Enhance the admin Content Dashboard (`/admin/content`) with interactive filtering and search capabilities using SvelteKit's new remote functions feature. This will allow administrators to filter content by type and status, and search using simple text queries, all without full page reloads.

## Current State

### Existing Implementation
- **Location**: `/src/routes/(admin)/admin/content/+page.svelte` and `+page.server.ts`
- **Data Loading**: Server-side via `load` function
- **Pagination**: URL-based with `?page=` query parameter (50 items per page)
- **Current Filters**: Loads all content with `status: 'all'`
- **No UI Filters**: Users cannot filter or search from the UI

### Backend Capabilities (Already Implemented)
The `ContentService.getFilteredContent()` method already supports:
- **Type filtering**: `type?: string` - Supports: `video`, `library`, `announcement`, `collection`, `recipe`
- **Status filtering**: `status?: string` - Supports: `draft`, `published`, `archived`, `all`
- **Tag filtering**: `tags?: string | string[]`
- **Search**: `search?: string` - Full-text search via Orama
- **Sorting**: `sort?: 'latest' | 'oldest' | 'popular'`
- **Pagination**: `limit` and `offset`

## Goals

1. **Improve Admin UX**: Allow admins to quickly filter and find content without page reloads
2. **Leverage Remote Functions**: Use SvelteKit 2.27+ remote functions for type-safe client-server communication
3. **Maintain Performance**: Keep the current pagination and only fetch what's needed
4. **Progressive Enhancement**: Ensure basic functionality works without JavaScript

## Non-Goals

- Tag filtering (future enhancement)
- Advanced search with operators
- Bulk operations on filtered results
- Saved filter presets
- Export functionality

## Technical Architecture

### Remote Functions Implementation

Create a new remote functions file to handle filtering operations:

**File**: `/src/routes/(admin)/admin/content/data.remote.ts`

```typescript
import { query } from '$app/server'
import { getRequestEvent } from '$app/server'
import { z } from 'zod/v4'

// Schema for filter parameters
const contentFiltersSchema = z.object({
  type: z.enum(['video', 'library', 'announcement', 'collection', 'recipe']).optional(),
  status: z.enum(['draft', 'published', 'archived', 'all']).default('all'),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().default(50)
})

export const getFilteredContent = query(contentFiltersSchema, async (filters) => {
  const { locals } = getRequestEvent()
  const { page, perPage, ...serviceFilters } = filters

  const offset = (page - 1) * perPage

  const content = locals.contentService.getFilteredContent({
    ...serviceFilters,
    limit: perPage,
    offset
  })

  const count = locals.contentService.getFilteredContentCount(serviceFilters)

  return {
    content,
    pagination: {
      count,
      perPage,
      currentPage: page
    }
  }
})
```

### UI Components

#### Filter Bar Component
**File**: `/src/lib/ui/admin/ContentFilters.svelte`

A filter bar component that will contain:
- **Type Filter**: Multi-select dropdown/checkboxes for content types
- **Status Filter**: Single-select dropdown for status
- **Search Input**: Text input with debounce
- **Clear Filters**: Button to reset all filters

#### Updated Page Component
**File**: `/src/routes/(admin)/admin/content/+page.svelte`

- Import and call the remote function
- Use `$derived` for reactive filter state
- Maintain URL sync with filters for bookmarking/sharing
- Use `await` syntax with `<svelte:boundary>` for loading/error states

### URL Structure

Filters should be reflected in the URL for bookmarking and sharing:

```
/admin/content?type=video&status=published&search=svelte&page=2
```

Parameters:
- `type`: Content type (optional, multi-value supported via comma: `type=video,recipe`)
- `status`: Status filter (optional, defaults to `all`)
- `search`: Search query (optional)
- `page`: Current page number (optional, defaults to 1)

## User Interface Design

### Filter Bar Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Content Management                            [+ New Content]   │
├─────────────────────────────────────────────────────────────────┤
│  [🔍 Search...              ]  [Type: All ▼]  [Status: All ▼]  │
│                                                   [Clear Filters] │
└─────────────────────────────────────────────────────────────────┘
```

### Filter Controls

1. **Search Input**
   - Placeholder: "Search content..."
   - 300ms debounce
   - Show loading indicator when searching
   - Clear button (X) when text is present

2. **Type Filter**
   - Multi-select dropdown
   - Options: All, Video, Library, Announcement, Collection, Recipe
   - Show count badges for active selections
   - Icons for each type (using existing TypeIcon component)

3. **Status Filter**
   - Single-select dropdown
   - Options: All, Draft, Published, Archived
   - Color-coded badges (using existing Badge component)

4. **Clear Filters Button**
   - Only visible when filters are active
   - Resets all filters to defaults

### Loading & Empty States

1. **Loading State**: Use existing table structure with skeleton rows
2. **Empty State**: "No content found matching your filters"
3. **Error State**: Generic error message with retry option

## Functionality Requirements

### Filter Behavior

1. **Real-time Updates**:
   - Filters apply immediately on change
   - Search applies after 300ms debounce
   - Page resets to 1 when filters change

2. **URL Synchronization**:
   - Filters update URL query parameters
   - Browser back/forward works correctly
   - URL can be shared/bookmarked

3. **Filter Persistence**:
   - Filters persist across navigation (via URL)
   - Filters clear on navigation away from page

4. **Combination Logic**:
   - Multiple filters use AND logic
   - Multiple types use OR logic within type filter
   - Search combines with other filters

### Performance Considerations

1. **Debouncing**: Search input debounced to 300ms
2. **Query Caching**: Leverage remote function caching
3. **Pagination**: Maintain 50 items per page
4. **Progressive Enhancement**: Basic filtering via forms works without JS

## Implementation Details

### Remote Functions Configuration

Enable remote functions in `svelte.config.js`:

```javascript
export default {
  kit: {
    experimental: {
      remoteFunctions: true
    }
  },
  compilerOptions: {
    experimental: {
      async: true
    }
  }
}
```

### Component Structure

```
src/routes/(admin)/admin/content/
├── +page.svelte                    # Main page with filters and table
├── +page.server.ts                 # Fallback load function (progressive enhancement)
├── data.remote.ts                  # Remote functions for filtering
└── ContentForm.svelte              # Existing form component

src/lib/ui/admin/
├── ContentFilters.svelte           # New: Filter bar component
├── TypeSelect.svelte               # New: Multi-select for types
├── StatusSelect.svelte             # New: Single-select for status
└── Table.svelte                    # Existing table component
```

### State Management

```typescript
// Filter state
let filters = $state({
  type: [] as string[],
  status: 'all' as string,
  search: '',
  page: 1
})

// Derived query
const query = $derived(getFilteredContent(filters))

// Watch for URL changes
$effect(() => {
  const params = new URLSearchParams(window.location.search)
  filters.type = params.get('type')?.split(',') ?? []
  filters.status = params.get('status') ?? 'all'
  filters.search = params.get('search') ?? ''
  filters.page = parseInt(params.get('page') ?? '1')
})

// Update URL when filters change
$effect(() => {
  const params = new URLSearchParams()
  if (filters.type.length) params.set('type', filters.type.join(','))
  if (filters.status !== 'all') params.set('status', filters.status)
  if (filters.search) params.set('search', filters.search)
  if (filters.page > 1) params.set('page', filters.page.toString())

  goto(`?${params.toString()}`, { replaceState: true, noScroll: true })
})
```

## Success Metrics

1. **Functionality**: All filters work correctly in combination
2. **Performance**: Filter changes feel instant (<100ms perceived)
3. **UX**: Admins can find content faster than current implementation
4. **Compatibility**: Works with and without JavaScript

## Progressive Enhancement Strategy

### Without JavaScript
- Use traditional form submission with `method="GET"`
- Server-side load function handles filtering
- Full page reload on filter change

### With JavaScript
- Remote functions provide instant updates
- No page reloads
- Loading states and optimistic updates

## Testing Requirements

1. **Unit Tests**:
   - Remote function validation
   - Filter combination logic
   - URL parameter parsing

2. **Integration Tests**:
   - Filter application
   - Pagination with filters
   - Search functionality
   - URL synchronization

3. **E2E Tests** (Playwright):
   - Complete user workflows
   - Filter combinations
   - Progressive enhancement fallback
   - Performance under load

## Future Enhancements

1. **Tag Filtering**: Add tag multi-select filter
2. **Sort Options**: Add sorting controls to UI
3. **Saved Filters**: Save commonly used filter combinations
4. **Bulk Operations**: Select and perform actions on filtered results
5. **Export**: Export filtered content to CSV/JSON
6. **Advanced Search**: Support operators like `tag:svelte`, `status:draft`, etc.
7. **Filter Presets**: Quick filters like "My Drafts", "Pending Review", etc.

## Dependencies

- SvelteKit 2.27+ (for remote functions)
- Zod v4 (for schema validation - already in project)
- Existing ContentService methods (already implemented)

## Implementation Phases

### Phase 1: Remote Functions Foundation (2-3 hours)
**Goal**: Set up remote functions infrastructure and basic query

**Tasks**:
1. Enable remote functions in `svelte.config.js`
2. Create `data.remote.ts` with basic `getFilteredContent` query
3. Add Zod schema for filter validation
4. Test remote function manually in browser console
5. Ensure progressive enhancement fallback still works

**Success Criteria**:
- Remote function can be called from client
- Returns content and pagination data
- Type-safe with Zod validation
- Server-side load function remains as fallback

**Files Changed**:
- `svelte.config.js`
- `src/routes/(admin)/admin/content/data.remote.ts` (new)

**Deliverable**: Working remote function that mirrors existing load behavior

---

### Phase 2: Search Filter Implementation (2-3 hours)
**Goal**: Add search input with debouncing using remote function

**Tasks**:
1. Add search input to page
2. Implement debounce logic (300ms)
3. Wire up search to remote function
4. Add loading indicator during search
5. Update URL with search parameter
6. Handle empty search results

**Success Criteria**:
- Search input debounces properly
- Results update without page reload
- URL reflects search query
- Loading state is visible
- Empty state shows appropriate message

**Files Changed**:
- `src/routes/(admin)/admin/content/+page.svelte`

**UI Mock**:
```
┌─────────────────────────────────────────────┐
│  Content Management          [+ New Content] │
├─────────────────────────────────────────────┤
│  [🔍 Search content...                    ] │
└─────────────────────────────────────────────┘
```

**Deliverable**: Functional search that works independently

---

### Phase 3: Status Filter (2 hours)
**Goal**: Add status dropdown filter

**Tasks**:
1. Create `StatusSelect.svelte` component
2. Add status filter to page layout
3. Wire up to remote function
4. Sync status with URL parameter
5. Style with existing Badge component colors

**Success Criteria**:
- Dropdown shows all status options (All, Draft, Published, Archived)
- Selecting status updates results instantly
- URL parameter reflects selection
- Works in combination with search

**Files Changed**:
- `src/lib/ui/admin/StatusSelect.svelte` (new)
- `src/routes/(admin)/admin/content/+page.svelte`

**UI Mock**:
```
┌─────────────────────────────────────────────┐
│  Content Management          [+ New Content] │
├─────────────────────────────────────────────┤
│  [🔍 Search...      ]  [Status: All ▼    ] │
└─────────────────────────────────────────────┘
```

**Deliverable**: Status filtering working with search

---

### Phase 4: Type Filter (3 hours)
**Goal**: Add content type multi-select filter

**Tasks**:
1. Create `TypeSelect.svelte` component with multi-select
2. Add type icons using existing `TypeIcon` component
3. Wire up to remote function (array of types)
4. Sync with URL parameter (comma-separated)
5. Show active filter count badge

**Success Criteria**:
- Multi-select dropdown works smoothly
- Shows icons for each type
- Multiple types combine with OR logic
- URL shows comma-separated types
- Badge shows count of selected types
- Works with search and status filters

**Files Changed**:
- `src/lib/ui/admin/TypeSelect.svelte` (new)
- `src/routes/(admin)/admin/content/+page.svelte`
- `src/routes/(admin)/admin/content/data.remote.ts` (update schema)

**UI Mock**:
```
┌─────────────────────────────────────────────────────┐
│  Content Management                [+ New Content]   │
├─────────────────────────────────────────────────────┤
│  [🔍 Search... ]  [Type: All ▼]  [Status: All ▼]  │
└─────────────────────────────────────────────────────┘
```

**Deliverable**: Full filtering capability (search + status + type)

---

### Phase 5: Clear Filters & Polish (1-2 hours)
**Goal**: Add clear filters button and polish UX

**Tasks**:
1. Add "Clear Filters" button
2. Show button only when filters are active
3. Reset all filters to defaults on click
4. Add smooth transitions for filter changes
5. Ensure pagination resets on filter change
6. Test all filter combinations

**Success Criteria**:
- Clear button visible only when needed
- Clicking clears all filters and resets to page 1
- Smooth user experience
- All combinations work correctly

**Files Changed**:
- `src/routes/(admin)/admin/content/+page.svelte`

**Final UI Mock**:
```
┌───────────────────────────────────────────────────────────┐
│  Content Management                      [+ New Content]   │
├───────────────────────────────────────────────────────────┤
│  [🔍 Search... ]  [Type: All ▼]  [Status: All ▼] [Clear] │
└───────────────────────────────────────────────────────────┘
```

**Deliverable**: Polished, production-ready filtering UI

---

### Phase 6: Testing & Documentation (2 hours)
**Goal**: Comprehensive testing and documentation

**Tasks**:
1. Write unit tests for remote function
2. Write integration tests for filter logic
3. Add Playwright E2E test for complete flow
4. Test progressive enhancement (without JS)
5. Update relevant documentation
6. Performance testing with large datasets

**Success Criteria**:
- All tests pass
- Progressive enhancement verified
- Performance is acceptable (<100ms perceived)
- Documentation is complete

**Files Changed**:
- `src/routes/(admin)/admin/content/data.remote.test.ts` (new)
- `tests/admin-content-filters.spec.ts` (new)
- `docs/` (update as needed)

**Deliverable**: Tested, documented feature ready for production

---

## Phase Summary

| Phase | Duration | Complexity | Dependencies | Can Ship? |
|-------|----------|------------|--------------|-----------|
| 1. Remote Functions Foundation | 2-3h | Medium | None | No (infra only) |
| 2. Search Filter | 2-3h | Low | Phase 1 | ✅ Yes |
| 3. Status Filter | 2h | Low | Phase 1, 2 | ✅ Yes |
| 4. Type Filter | 3h | Medium | Phase 1-3 | ✅ Yes |
| 5. Clear Filters & Polish | 1-2h | Low | Phase 1-4 | ✅ Yes |
| 6. Testing & Documentation | 2h | Low | Phase 1-5 | ✅ Yes |
| **Total** | **12-15h** | | | |

## Phase Decision Points

After each phase, evaluate:
1. **Ship it?** - Can we deploy this phase standalone?
2. **Iterate?** - Does this phase need refinement before continuing?
3. **Continue?** - Ready to move to next phase?

### Incremental Value by Phase
- **After Phase 2**: Admins can search content - immediate value 🎯
- **After Phase 3**: Admins can filter by status - useful for finding drafts
- **After Phase 4**: Full filtering capability - complete feature
- **After Phase 5**: Polished UX - production quality
- **After Phase 6**: Quality assurance - confidence in stability

### Recommended Deployment Strategy
- Deploy Phase 1+2 together (minimal viable feature)
- Deploy Phase 3 independently (incremental improvement)
- Deploy Phase 4 independently (major enhancement)
- Deploy Phase 5 independently (UX polish)
- Phase 6 should be completed before any deployment

## Open Questions

1. Should type filter support multiple types or single selection? (Recommendation: Multiple for flexibility)
2. Should we add a "favorites/bookmarks" feature for filter combinations? (Future enhancement)
3. Should search highlight matching text in results? (Nice to have, but not critical)
4. Should we add keyboard shortcuts for common filters? (Future enhancement)

## Appendix

### Content Types
- `video` - Video content
- `library` - Library entries
- `announcement` - Announcements
- `collection` - Collections
- `recipe` - Recipes

### Content Statuses
- `draft` - Not published, work in progress
- `published` - Live and visible to users
- `archived` - Hidden but not deleted
- `all` - Special value to show all statuses (admin only)

### Existing Backend Interface
```typescript
interface ContentFilters {
  type?: string
  tags?: string | string[]
  search?: string
  status?: string
  limit?: number
  offset?: number
  sort?: 'latest' | 'oldest' | 'popular'
}
```
