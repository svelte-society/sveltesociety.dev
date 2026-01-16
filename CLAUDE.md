# SvelteSociety.dev

A community website for Svelte developers featuring user-curated content (videos, recipes, libraries, announcements, collections, jobs) with content submission, admin moderation, and search.

**Tech stack**: Svelte 5, SvelteKit 2, SQLite, Bun, Tailwind CSS + tailwind-variants

## Key Directories

| Directory                    | Purpose                                              |
| ---------------------------- | ---------------------------------------------------- |
| `src/routes/(app)/(public)/` | Public pages (content listings, details, submission) |
| `src/routes/(admin)/admin/`  | Protected admin routes (moderation, user management) |
| `src/lib/ui/`                | Reusable UI components with tailwind-variants        |
| `src/lib/server/services/`   | Data access layer (33 service classes)               |
| `src/lib/remote/`            | Remote Functions for type-safe client-server RPC     |

## Key Documentation

- **E2E Testing**: See @./docs/E2E_TESTING_MEMORY.md - All new features require Playwright tests
- **Beads Workflow**: See @./docs/BEADS_WORKFLOW.md - Dependency-aware issue tracking (`bd` command)
- **Agent Commands**: See @./docs/AGENT_COMMANDS.md - Context-efficient commands for AI agents

## Svelte MCP Tools

When building Svelte components, use the Svelte MCP server tools:

| Tool                | Purpose                                             | When to Use                                       |
| ------------------- | --------------------------------------------------- | ------------------------------------------------- |
| `list-sections`     | Lists all Svelte 5/SvelteKit documentation sections | First step when looking up docs                   |
| `get-documentation` | Retrieves full documentation for sections           | After list-sections to fetch relevant docs        |
| `svelte-autofixer`  | Analyzes code and suggests fixes                    | **Always** before finalizing any Svelte component |
| `playground-link`   | Generates Svelte playground link                    | When sharing code for testing                     |

## Claude Skills

Skills provide specialized patterns for this codebase. Invoke with `/skill-name`.

| Skill                    | Purpose                                     | When to Use                                      |
| ------------------------ | ------------------------------------------- | ------------------------------------------------ |
| `component-builder`      | Create UI components with tailwind-variants | Creating/editing components in `src/lib/ui/`     |
| `svelte-code-writer`     | Svelte 5 docs lookup and code analysis      | Creating/editing `.svelte` or `.svelte.ts` files |
| `using-remote-functions` | Type-safe client-server communication       | Components that fetch data or submit forms       |
| `admin-crud-page`        | Admin dashboard pages with tables/forms     | Adding admin sections at `/admin/[feature]`      |
| `page-builder`           | List and detail page patterns               | Building pages with forms, filters, pagination   |
| `e2e-test-builder`       | Playwright E2E tests with POM pattern       | Adding tests for new features                    |

## Canonical Examples

Reference these files for patterns:

- **UI Component**: `src/lib/ui/Button.svelte` + `src/lib/ui/button.variants.ts`
- **Service Layer**: `src/lib/server/services/content.ts`
- **Remote Function**: `src/lib/remote/interact.remote.ts`
- **Content Type Page**: `src/lib/ui/content/Video.svelte`

## Code Formatting

Run before committing: `bun run lint`
