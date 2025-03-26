# IMPORTANT! Instrcutions

When reasoning about a problem - always think about the root cause of an issue. Always prefer simple, clear solutions to advanced.
When reasoning about implementing new features, always look at previously implemented features and see if you can take inspiration from those features - OR, if possible, consolidate and re-use logic by extracting it to services or repositories.

When implementing things that are not Svelte components always write tests.

When finishing a feature, run all tests using `bun test` to make sure they all pass.

The technologies used in this codebase are the following:

- Bun
- Svelte 5
- SvelteKit
- Zod
- SQLite
