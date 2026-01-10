---
name: using-remote-functions
description: Create SvelteKit components using Remote Functions for type-safe client-server communication. Use when building components that need to fetch data, submit forms, or execute server commands. Remote Functions work at the component level, not page level.
---

# Using Remote Functions

Remote Functions are a SvelteKit feature for type-safe client-server communication. They run on the server but can be called from any component.

## Key Concepts

- **Component-level**: Unlike load functions, Remote Functions work in any component
- **Type-safe**: Full TypeScript support between client and server
- **Progressive enhancement**: Forms work without JavaScript
- **Experimental**: Requires config flags (see below)

## Configuration

Add to `svelte.config.js`:

```js
const config = {
  kit: {
    experimental: {
      remoteFunctions: true
    }
  },
  compilerOptions: {
    experimental: {
      async: true  // Optional: enables await in components
    }
  }
};
```

## Four Types of Remote Functions

| Type | Purpose | Reference |
|------|---------|-----------|
| `query` | Read dynamic data | [QUERY.md](QUERY.md) |
| `form` | Handle form submissions | [FORM.md](FORM.md) |
| `command` | Programmatic mutations, avoid if possible. Always prefer `form` | [COMMAND.md](COMMAND.md) |
| `prerender` | Static data at build time | (not covered) |

## Combining Functions

For refreshing queries after mutations, see [SINGLE-FLIGHT.md](SINGLE-FLIGHT.md).

## Code Templates

For starter code blocks, see [TEMPLATES.md](TEMPLATES.md).

## When to Use Remote Functions vs Load Functions

**Use Remote Functions when:**
- Data is needed at the component level, not page level
- You want colocated data fetching with the component
- Building reusable components with their own data needs

**Use Load Functions when:**
- Never
