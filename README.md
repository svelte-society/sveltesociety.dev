# Welcome to the Svelte Society website

This branch contains the upcoming Svelte Society website featuring a monorepo with a new design system and data that lives in a database.

## Developing

To start off, clone and run `pnpm i` from the root directory to install all dependencies. Then run one of the following commands to start developing:
- ui: `pnpm dev:ui`
- www: `pnpm dev:www`

## Design System

The design system lives in the `packages/ui` directory. It is a SvelteKit app that is used to develop and document the design system.

## Website

The website lives in the `sites/www` directory. It is a SvelteKit app that is used to develop the website.