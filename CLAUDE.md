# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
bun dev                  # Start development server
bun build                # Build for production
bun preview              # Preview production build
bun start                # Start production server
```

### Code Quality

```bash
bun lint                 # Format code with Prettier
bun check                # Type-check with svelte-check
```

### Testing

```bash
bun test                 # Run unit tests (Vitest)
bun test:integration     # Run Playwright integration tests
bun test -- path/to/file # Run specific test file
```

### Database

```bash
bun db:migrate           # Run database migrations
```

## Architecture

### Service Layer Pattern

The application uses a service-based architecture where all database operations go through service classes:

- Services are instantiated in `hooks.server.ts` and attached to `locals` via the `attach_services` hook
- Services depend on the database connection and often other services
- Key services: `ContentService`, `SearchService`, `UserService`, `SessionService`, `RoleService`, `TagsService`, `CollectionsService`, `EventsService`, `ExternalContentService`

### Hook System

Three main hooks process requests in order:

1. `add_user_data` - Attaches user session data to locals
2. `attach_services` - Instantiates and attaches all services
3. `protect_routes` - Guards admin routes

### Content Management

- Content types: `recipe`, `video`, `library`, `announcement`, `link`, `blog`, `collection`, `event`
- Status workflow: `draft` → `pending_review` → `published` → `archived`
- Moderation queue for content review
- External content importing from YouTube and GitHub APIs

### Database Schema

- SQLite with WAL mode for concurrency
- Views for aggregated data (collections, content)
- Triggers for automatic updates (interactions, moderation)
- Schema files in `/src/lib/server/db/schema/`, views in `/views/`, triggers in `/triggers/`

### Database Migrations

- Version-based migration system tracks applied migrations in `migrations` table
- Migration files stored in `/src/lib/server/db/migrations/` with format `001_description.sql`
- Migrations run automatically on server start after schema initialization
- Manual migration command: `bun db:migrate` shows status and applies pending migrations
- Create new migrations as numbered SQL files (e.g., `002_add_user_preferences.sql`)

### Search Implementation

- Uses Orama for full-text search indexing
- Search service builds index from content
- API endpoint at `/api/search`

### Authentication

- OAuth-based authentication (GitHub provider)
- Session tokens stored in database
- User roles and permissions system

### External Content Integration

- `ExternalContentService` manages imported content
- Importers for YouTube videos and GitHub repositories
- Caching with stale-while-revalidate using cachified
- GitHub OG images stored in metadata

## Environment Setup

Required environment variables in `.env.development`:

```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_AUTHORIZATION_CALLBACK_URL=http://localhost:5173/auth/callback
DB_PATH=local.db
```

Optional environment variables:

```
ANTHROPIC_API_KEY=         # For AI-powered description generation in admin
YOUTUBE_API_KEY=          # For importing YouTube videos
GITHUB_TOKEN=             # For better rate limits when importing GitHub repos
BULK_IMPORT_API_KEY=      # Secret key for bulk import API endpoint
SEED_DATABASE=            # Controls database seeding: 'full' (all seeds), 'minimal' (roles + kevmodrome), 'none' (no seeding)
                          # Defaults to 'full' in development, 'minimal' in production
```

Docker-specific environment variables:

```
PORT=8083                 # External port for docker-compose (default: 8083)
```

## Key Patterns

### Svelte 5 Reactivity

- Use `$state()` for reactive state
- Use `$derived()` for computed values
- Use `$effect()` sparingly for side effects

### Form Handling

- SuperForms for form validation and handling
- Zod schemas for validation
- Use `dataType: 'json'` for complex nested data
- Specifically follow the pattern in the /submit route.

### Type-Specific Components

- Content display components in `/src/lib/ui/content/`
- Each content type has its own display component (Video.svelte, Library.svelte, etc.)

### Testing Approach

- Unit tests for services with mocked database
- Integration tests for full user flows
- Test database isolation with `NODE_ENV=test`
