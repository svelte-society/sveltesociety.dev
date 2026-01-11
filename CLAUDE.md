# Claude Memory - Additional Context

This file provides additional context for Claude Code beyond the main CLAUDE.md.

## Testing Documentation

See @./docs/E2E_TESTING_MEMORY.md for E2E testing requirements and patterns.

## Svelte MCP Tools

When building Svelte components, use the Svelte MCP server tools:

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `list-sections` | Lists all Svelte 5/SvelteKit documentation sections | First step when looking up docs |
| `get-documentation` | Retrieves full documentation for sections | After list-sections to fetch relevant docs |
| `svelte-autofixer` | Analyzes code and suggests fixes | **Always** before finalizing any Svelte component |
| `playground-link` | Generates Svelte playground link | When sharing code for testing |

**Important**: Always run `svelte-autofixer` on Svelte components before completing work.

## Claude Skills

Skills are invoked with `/skill-name` (e.g., `/e2e-test-builder`). They provide specialized patterns for this codebase.

**ALWAYS invoke any skill that is deemed important for what you are doing.**

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `svelte-code-writer` | Svelte 5 docs lookup and code analysis | Creating/editing `.svelte` or `.svelte.ts/.svelte.js` files |
| `using-remote-functions` | Type-safe client-server communication | Components that fetch data, submit forms, or run server commands |
| `admin-crud-page` | Admin dashboard pages with tables/forms | Adding admin sections at `/admin/[feature]` |
| `page-builder` | List and detail page patterns | Building pages with forms, filters, pagination |
| `e2e-test-builder` | Playwright E2E tests with POM pattern | Adding tests for new features |

**Template skills** (for creating new skills):
- `sample-basic` - Minimal skill structure template
- `sample-with-references` - Progressive disclosure pattern with reference files

## Beads Workflow (bd)

This project uses **bd** (beads) for dependency-aware issue tracking. Issues are chained together like beads on a string.

### Key Commands

- `bd create "Task name"` - Create new issue
- `bd list` - List all issues
- `bd list --status open` - Filter by status
- `bd ready` - Show issues ready to work (no blockers)
- `bd show bd-1` - View issue details
- `bd update bd-1 --status in_progress` - Update issue status
- `bd close bd-1` - Mark issue complete
- `bd dep add bd-1 bd-2` - Add dependency (bd-2 blocks bd-1)

### Workflow Pattern

1. Use `bd ready` to find available work
2. Use `bd update <id> --status in_progress` to claim work
3. Use `bd create` when discovering new tasks during work
4. Use `bd dep add` to link related tasks
5. Use `bd close <id>` when work is complete

### Auto-Sync

bd automatically syncs with git (5s debounce):
- Exports to JSONL after changes
- Imports from JSONL after git pull
- No manual sync needed

## Important Reminders

- All new features MUST include Playwright E2E tests
- Update `tests/README.md` after adding new test coverage
