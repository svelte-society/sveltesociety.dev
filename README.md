# sveltesociety.dev

This branch contains the upcoming Svelte Society website featuring a new design and data that lives in a database.

## Developing

Steps to get running:
- Run `bun i`
- Run `bun run --bun db:init`
- Run `bun run --bun db:seed`
- Run `bun run --bun dev`

### Environment Variables

Add all the relevant .env.development variables:

```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_AUTHORIZATION_CALLBACK_URL=http://localhost:5173/auth/callback

DB_PATH=local.db
EVENT_DB_PATH=local_event.db
```
