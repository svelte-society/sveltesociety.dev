# sveltesociety.dev

This branch contains the upcoming Svelte Society website featuring a new design and data that lives in a database. Currently being deployed to https://beta.sveltesociety.dev

## Developing

Steps to get running:

- Run `bun i`
- Run `bun run --bun dev`

### Environment Variables

Add all the relevant .env variables:

```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_AUTHORIZATION_CALLBACK_URL=http://localhost:5173/auth/callback
DB_PATH=local.db
EVENT_DB_PATH=local_event.db
NIXPACKS_NODE_VERSION=20

DB_PATH=local.db
```
