# sveltesociety.dev

This branch contains the upcoming Svelte Society website featuring a new design and data that lives in a database.

## Developing

To start off, clone and run `pnpm i`.

Add all the relevant .env.development variables:

```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_AUTHORIZATION_CALLBACK_URL=http://localhost:5173/auth/callback

DB_PATH=local.db
EVENT_DB_PATH=local_event.db
```

Run `pnpm run db:init` and then `pnpm run db:seed` to seed the database.

To run the application, run `pnpm run dev`.

After this you can login with GitHub. To access the admin dashboard, you'll need to open the `local.db` file and change your role to 1 (Admin).
