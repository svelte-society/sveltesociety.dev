# vite.config.ts

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});

```

# tsconfig.json

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
	// Path aliases are handled by https://kit.svelte.dev/docs/configuration#alias
	//
	// If you want to overwrite includes/excludes, make sure to copy over the relevant includes/excludes
	// from the referenced tsconfig.json - TypeScript does not merge them in
}

```

# tailwind.config.cjs

```cjs
const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontFamily: {
			'display': ['Inter'],
			'body': ['Inter']
		},
		extend: {
			colors: {
				svelte: {
					900: 'rgb(var(--svelte-orange-900) / <alpha-value>)',
					500: 'rgb(var(--svelte-orange-500) / <alpha-value>)',
					100: 'rgb(var(--svelte-orange-100) / <alpha-value>)'
				}
			}
		}
	},

	plugins: [typography]
};

module.exports = config;

```

# svelte.config.js

```js
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			runtime: 'edge'
		})
	},
};

export default config;

```

# postcss.config.cjs

```cjs
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const config = {
	plugins: [
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		tailwindcss(),
		//But others, like autoprefixer, need to run after,
		autoprefixer
	]
};

module.exports = config;

```

# playwright.config.ts

```ts
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;

```

# package.json

```json
{
	"name": "www",
	"version": "0.0.1",
	"private": true,
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"test": "npm run test:integration && npm run test:unit",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"lint": "prettier --check . && eslint .",
		"format": "prettier --write .",
		"db:migrate": "tsx ./src/lib/server/db/migrations.ts",
		"db:seed": "tsx ./src/lib/server/db/seeds/index.ts",
		"test:integration": "playwright test",
		"test:unit": "vitest"
	},
	"devDependencies": {
		"@libsql/client": "^0.6.2",
		"@milkdown-lab/plugin-menu": "^1.2.3",
		"@milkdown/core": "^7.4.0",
		"@milkdown/ctx": "^7.4.0",
		"@milkdown/plugin-clipboard": "^7.4.0",
		"@milkdown/plugin-emoji": "^7.4.0",
		"@milkdown/plugin-history": "^7.4.0",
		"@milkdown/plugin-listener": "^7.4.0",
		"@milkdown/plugin-upload": "^7.4.0",
		"@milkdown/preset-commonmark": "^7.4.0",
		"@milkdown/prose": "^7.4.0",
		"@milkdown/theme-nord": "^7.4.0",
		"@milkdown/transformer": "^7.4.0",
		"@milkdown/utils": "^7.4.0",
		"@playwright/test": "^1.45.3",
		"@sveltejs/adapter-auto": "^3.2.2",
		"@sveltejs/adapter-vercel": "^5.4.1",
		"@sveltejs/enhanced-img": "^0.1.9",
		"@sveltejs/kit": "^2.5.20",
		"@sveltejs/vite-plugin-svelte": "^3.1.1",
		"@tailwindcss/forms": "^0.5.7",
		"@tailwindcss/typography": "^0.5.13",
		"@types/better-sqlite3": "^7.6.11",
		"@typescript-eslint/eslint-plugin": "^6.21.0",
		"@typescript-eslint/parser": "^6.21.0",
		"autoprefixer": "^10.4.20",
		"better-sqlite3": "^11.1.2",
		"carta-plugin-ins-del": "^1.0.0",
		"carta-plugin-video": "^1.0.0",
		"dotenv": "^16.4.5",
		"eslint": "^8.57.0",
		"eslint-config-prettier": "^9.1.0",
		"eslint-plugin-svelte": "^2.43.0",
		"postcss": "^8.4.40",
		"postcss-load-config": "^5.1.0",
		"prettier": "^3.3.3",
		"prettier-plugin-svelte": "^3.2.6",
		"prettier-plugin-tailwindcss": "^0.5.14",
		"svelte": "5.0.0-next.208",
		"svelte-check": "^3.8.5",
		"svelte-sonner": "^0.3.27",
		"sveltekit-superforms": "^2.16.1",
		"tailwindcss": "^3.4.7",
		"tschema": "^2.0.0",
		"tslib": "^2.6.3",
		"tsx": "^4.16.5",
		"typescript": "^5.5.4",
		"vite": "^5.3.5",
		"vitest": "^1.6.0",
		"zod": "^3.23.8"
	},
	"type": "module"
}

```

# litefs.yml

```yml
# The fuse section describes settings for the FUSE file system. This file system
# is used as a thin layer between the SQLite client in your application and the
# storage on disk. It intercepts disk writes to determine transaction boundaries
# so that those transactions can be saved and shipped to replicas.
fuse:
  dir: "/litefs"

# The data section describes settings for the internal LiteFS storage. We'll 
# mount a volume to the data directory so it can be persisted across restarts.
# However, this data should not be accessed directly by the user application.
data:
  dir: "/var/lib/litefs"

# This flag ensure that LiteFS continues to run if there is an issue on starup.
# It makes it easy to ssh in and debug any issues you might be having rather
# than continually restarting on initialization failure.
exit-on-error: false

# This section defines settings for the option HTTP proxy.
# This proxy can handle primary forwarding & replica consistency
# for applications that use a single SQLite database.
proxy:
  addr: ":8080"
  target: "localhost:4173"
  db: "local"
  passthrough: 
    - "*.ico"
    - "*.png"

# This section defines a list of commands to run after LiteFS has connected
# and sync'd with the cluster. You can run multiple commands but LiteFS expects
# the last command to be long-running (e.g. an application server). When the
# last command exits, LiteFS is shut down.
exec:
  - cmd: "pnpm run preview:www --host"

# The lease section specifies how the cluster will be managed. We're using the
# "consul" lease type so that our application can dynamically change the primary.
#
# These environment variables will be available in your Fly.io application.
lease:
  type: "static"
  advertise-url: "http://${HOSTNAME}.vm.${FLY_APP_NAME}.internal:20202"
  candidate: true
```

# drizzle.config.ts

```ts
import { config } from 'dotenv';

config({
    path: '.env.development'
});

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'sqlite',
    driver: 'turso',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL as string
    },
    verbose: true
})
```

# README.md

```md
# sveltesociety.dev

This branch contains the upcoming Svelte Society website featuring a new design and data that lives in a database.

## Developing

To start off, clone and run `pnpm i`

Add all the relevant .env variables:

\`\`\`
PUBLIC_API_URL=

// For Type gen
PB_TYPEGEN_URL=
PB_TYPEGEN_EMAIL=
PB_TYPEGEN_PASSWORD=
\`\`\`

To pull down new types use `pnpm gen:types`.
```

# .prettierrc

```
{
	"useTabs": true,
	"singleQuote": true,
	"trailingComma": "none",
	"printWidth": 100,
	"plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	"overrides": [
		{
			"files": "*.svelte",
			"options": {
				"parser": "svelte"
			}
		}
	]
}

```

# .prettierignore

```
# Ignore files for PNPM, NPM and YARN
pnpm-lock.yaml
package-lock.json
yarn.lock

```

# .npmrc

```
engine-strict=true

```

# .gitignore

```
.DS_Store
node_modules
/build
/.vercel
/.svelte-kit
/package
.env
.env.*
!.env.example
vite.config.js.timestamp-*
vite.config.ts.timestamp-*
.vscode
local.db
local.db-shm
local.db-wal
```

# .eslintrc.cjs

```cjs
/** @type { import("eslint").Linter.FlatConfig } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};

```

# .eslintignore

```
.DS_Store
node_modules
/build
/.svelte-kit
/package
.env
.env.*
!.env.example

# Ignore files for PNPM, NPM and YARN
pnpm-lock.yaml
package-lock.json
yarn.lock

```

# .aidigestignore

```
test/test-ignore.ts
dist
node_modules
.vercel
.svelte-kit
local.db
local.db-shm
local.db-wal

```

# tests/test.ts

```ts
import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Welcome to SvelteKit' })).toBeVisible();
});

```

# static/favicon.png

This is a binary file of the type: Image

# src/types.d.ts

```ts
export type Content = {
    id: number;
    title: string;
    type: string;
    body: string;
    rendered_body: string;
    slug: string;
    description: string;
    children: string;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    likes: number;
    saves: number;
};

export type Tag = {
    id: number;
    name: string;
    slug: string;
    color: string | null;
};

export type ContentWithTags = Content & { tags: Tag[] };

export type PaginatedContentResult = {
    items: ContentWithTags[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
};
```

# src/index.test.ts

```ts
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

```

# src/hooks.server.ts

```ts
import { sequence } from '@sveltejs/kit/hooks';
import { protect_routes } from './hooks/protect_routes';
import { add_user_data } from './hooks/add_user_data';

export const handle = sequence(add_user_data, protect_routes);
```

# src/app.pcss

```pcss
/* Write your global styles here, in PostCSS syntax */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
	:root {
		--svelte-orange-900: 255 62 0;
		--svelte-orange-500: 255 146 111;
		--svelte-orange-100: 255 223 212;
	}

	html {
		font-family: "Inter", system-ui, sans-serif;
	}
}

@font-face {
	font-family: 'Inter';
	font-style: normal;
	font-weight: 100 900;
	font-display: swap;
	src: local(''), url('/fonts/Inter.woff2') format('woff2');
}
```

# src/app.html

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>

```

# src/app.d.ts

```ts
import type { User } from '$lib/server/db/user';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };


```

# static/fonts/Manrope.woff2

This is a binary file of the type: Binary

# static/fonts/Inter.woff2

This is a binary file of the type: Binary

# src/routes/logo.svg

This is a file of the type: SVG Image

# src/routes/+layout.svelte

```svelte
<script>
	import { Toaster } from 'svelte-sonner';
	import '../app.pcss';

	const { children } = $props();
</script>

{@render children()}

<Toaster />

```

# src/routes/+layout.server.ts

```ts
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
    return { user: locals.user }
}) satisfies LayoutServerLoad;
```

# src/lib/index.ts

```ts
// place files you want to import through the `$lib` alias in this folder.

```

# src/hooks/protect_routes.ts

```ts
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { get_roles } from '$lib/server/db/role';

interface RoutePermission {
    path: string;
    allowedRoles: string[];
}

const routePermissions: RoutePermission[] = [
    { path: '/admin', allowedRoles: ['admin'] },
    { path: '/account', allowedRoles: ['admin', 'user'] },
    // Add more routes and permissions as needed
];

export const protect_routes: Handle = async ({ event, resolve }) => {
    const { user } = event.locals;
    const roles = get_roles();
    const roleMap = new Map(roles.map(role => [role.id, role]));

    const currentPath = event.url.pathname;
    const restrictedRoute = routePermissions.find(route => currentPath.startsWith(route.path));

    if (restrictedRoute) {
        if (!user) {
            // User is not logged in, redirect to login page
            throw redirect(302, '/'); // Adjust the login route as needed
        }

        const userRole = roleMap.get(user.role);

        if (!userRole || !userRole.active) {
            // User's role is not valid or not active
            throw redirect(303, '/');
        }

        if (!restrictedRoute.allowedRoles.includes(userRole.value)) {
            // User doesn't have permission, redirect to homepage
            throw redirect(303, '/');
        }
    }

    // If we've reached this point, either the route is public or the user has permission
    return await resolve(event);
};

```

# src/hooks/add_user_data.ts

```ts
import type { Handle } from '@sveltejs/kit';
import { get_user } from '$lib/server/db/user';
import { validate_session_id } from '$lib/server/db/session';
import { redirect } from '@sveltejs/kit';

export const add_user_data: Handle = async ({ event, resolve }) => {
    const { cookies } = event;

    const session_id = cookies.get('session_id');

    if (!session_id) {
        return await resolve(event);
    }

    const { user_id } = validate_session_id(session_id);

    if (user_id === undefined) {
        redirect(302, '/');
    }

    const user = get_user(user_id)

    if (user) {
        event.locals.user = user;
    }

    const response = await resolve(event);
    return response;
};
```

# src/routes/(app)/society-logo.svg

This is a file of the type: SVG Image

# src/routes/(app)/+layout.svelte

```svelte
<script lang="ts">
	import { page } from '$app/stores';

	let { data, children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<header class="border-svelte-900 border-b-4 p-4">
		<div class="container mx-auto flex items-center justify-between gap-4">
			<a href="/" class="flex items-center gap-2">
				<svg
					width="117"
					height="55"
					viewBox="0 0 117 55"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Svelte Society</title>
					<path
						d="M34.5673 15.8138C30.4471 9.81156 22.3097 8.03263 16.4267 11.8487L6.09451 18.553C4.70013 19.4448 3.50345 20.6227 2.5813 22.0119C1.65916 23.401 1.03141 24.9706 0.738428 26.6205C0.244305 29.4056 0.676586 32.2786 1.96654 34.7851C1.08231 36.1508 0.47991 37.685 0.195642 39.295C-0.0993722 40.9814 -0.0604421 42.711 0.310404 44.3818C0.681047 46.0526 1.37631 47.6313 2.35482 49.0246C6.47488 55.0269 14.6122 56.8059 20.4953 52.99L30.8274 46.3139C32.2204 45.4202 33.4157 44.2415 34.3376 42.8529C35.2597 41.4641 35.8883 39.8953 36.1835 38.2461C36.6758 35.4622 36.2423 32.5905 34.9516 30.0856C35.8352 28.7193 36.4388 27.1855 36.7263 25.5759C37.0205 23.8894 36.9812 22.16 36.6103 20.4894C36.2397 18.8186 35.545 17.2399 34.5673 15.8462"
						fill="#FF3E00"
					/>
					<path
						d="M15.6069 49.3495C13.9724 49.7732 12.2474 49.6858 10.6642 49.0993C9.08107 48.5126 7.7161 47.4551 6.7538 46.0694C6.16276 45.2435 5.74325 44.308 5.51961 43.3179C5.29617 42.3278 5.27305 41.3031 5.45209 40.304C5.51069 39.979 5.59321 39.6587 5.69885 39.3458L5.8939 38.7493L6.42736 39.147C7.65344 40.041 9.02227 40.7213 10.4756 41.1589L10.8739 41.2742L10.838 41.6717C10.7997 42.2168 10.9531 42.7583 11.2719 43.2024C11.5622 43.6194 11.9736 43.9374 12.4505 44.1137C12.9272 44.29 13.4467 44.3162 13.939 44.1887C14.164 44.1282 14.3788 44.0345 14.5758 43.9104L24.9417 37.3021C25.1963 37.1419 25.4145 36.9306 25.5824 36.6814C25.7505 36.4322 25.8644 36.1506 25.917 35.8547C25.9701 35.5533 25.9622 35.2442 25.8938 34.9457C25.8253 34.6473 25.698 34.3655 25.5189 34.1171C25.2284 33.7002 24.8172 33.3824 24.3403 33.2061C23.8634 33.0297 23.3439 33.0035 22.8518 33.1311C22.6264 33.1907 22.4117 33.2847 22.2148 33.4094L18.2342 35.9344C17.5832 36.3466 16.8731 36.6576 16.1284 36.8567C14.4966 37.2777 12.7749 37.1895 11.195 36.6038C9.61493 36.0179 8.2526 34.9629 7.29111 33.5804C6.7019 32.7539 6.28401 31.8183 6.06199 30.8281C5.83977 29.838 5.81787 28.8137 5.99731 27.815C6.1731 26.8349 6.55185 25.9021 7.10904 25.0765C7.66642 24.2508 8.39007 23.5504 9.23375 23.0198L19.6314 16.4118C20.2786 16.0002 20.9846 15.6891 21.7253 15.4892C23.3592 15.0653 25.0838 15.1526 26.6664 15.7393C28.2489 16.3258 29.613 17.3837 30.5743 18.7694C31.166 19.5949 31.5863 20.5303 31.8106 21.5204C32.0348 22.5106 32.0585 23.5355 31.8801 24.5348C31.8181 24.8616 31.7355 25.1844 31.6333 25.501L31.4342 26.0975L30.9048 25.6998C29.6761 24.799 28.3032 24.1132 26.8444 23.6721L26.4464 23.5568L26.4822 23.1591C26.5283 22.6113 26.3786 22.0647 26.0603 21.6163C25.7681 21.2067 25.3579 20.8954 24.8843 20.7243C24.4107 20.5533 23.8961 20.5301 23.409 20.6581C23.1838 20.7179 22.969 20.8117 22.7722 20.9364L12.3864 27.5328C12.1328 27.6929 11.9152 27.9039 11.7473 28.1523C11.5795 28.4007 11.4649 28.6812 11.4112 28.9761C11.3591 29.2784 11.3676 29.5878 11.4359 29.8866C11.5042 30.1855 11.6312 30.4679 11.8092 30.7176C12.0983 31.1308 12.5063 31.4464 12.9791 31.6225C13.4519 31.7986 13.9672 31.8269 14.4564 31.7038C14.6813 31.6423 14.8958 31.5488 15.0933 31.4253L19.074 28.9046C19.7247 28.4877 20.4366 28.175 21.184 27.9782C22.8172 27.5533 24.5418 27.6395 26.1246 28.2256C27.7071 28.8115 29.0715 29.8687 30.033 31.2545C30.6242 32.08 31.0443 33.0154 31.2686 34.0055C31.4928 34.9954 31.5165 36.0204 31.3387 37.0197C31.1629 38 30.7844 38.9328 30.227 39.7584C29.6698 40.5841 28.9462 41.2845 28.1023 41.8148L17.7166 48.4231C17.0643 48.8368 16.353 49.1491 15.6069 49.3495Z"
						fill="#EEEEEE"
					/>
					<path
						d="M10.3059 9.9497C11.0991 9.73929 12.6587 9.96797 13.8436 10.5101L13.4308 12.9168C13.4308 12.9168 11.5259 12.1955 10.8687 11.2992C10.6826 11.0452 11.111 10.5279 11.111 10.5279C11.111 10.5279 10.4622 10.5506 10.3969 11.1154C10.3318 11.6801 10.6806 12.2056 13.477 13.1766C16.2735 14.1479 16.0502 15.3834 18.3566 16.9311C20.8102 18.5781 22.7514 19.4923 25.5892 20.887C28.4268 22.2816 32.3068 22.7506 34.0897 22.6236C35.8194 22.5003 37.2663 22.0778 38.1953 21.7987L39.1242 17.7408L39.551 17.8168L39.7016 16.9544C42.2631 17.4107 44.4482 20.0229 43.9211 23.0409C43.0829 27.8412 37.54 27.9911 33.6978 27.3884C24.3058 25.7154 7.80138 15.6172 8.49948 11.6187C8.76307 10.1096 9.51267 10.1601 10.3059 9.9497Z"
						fill="#1E293B"
					/>
					<path
						d="M13.6855 13.4316L14.4009 9.33545L38.6598 17.8802L39.0868 17.9562C39.3735 20.4326 38.1579 22.0144 38.1579 22.0144C34.3284 23.7773 27.9942 22.2396 25.5516 21.1025C21.3267 19.1358 16.335 15.9041 13.6855 13.4316Z"
						fill="#FF3E00"
					/>
					<path
						d="M15.5804 5.09986C14.3377 8.43513 14.2124 10.4134 14.2124 10.4134C15.6565 12.2266 22.7198 17.2639 29.3179 18.4391C33.8005 19.2375 36.6132 19.5162 39.049 18.1718L39.3123 16.6628L40.216 11.4888C41.1947 5.8836 33.9998 1.71219 31.2249 1.21789C29.7433 0.879881 27.3826 0.533494 25.675 0.229292C19.9118 -0.797316 16.8233 1.7646 15.5804 5.09986Z"
						fill="#1E293B"
					/>
					<path
						d="M40.1681 24.5106C43.6221 23.5945 43.9627 21.1219 43.5566 20.0864C44.398 21.57 43.6849 24.2201 39.8798 25.2294C37.3495 25.9005 31.975 25.6132 21.7217 19.0866C29.0121 23.1873 35.2102 25.8257 40.1681 24.5106Z"
						fill="#EEEEEE"
					/>
					<path
						d="M58.2393 21.674C58.1882 21.1584 57.9688 20.7578 57.581 20.4723C57.1932 20.1868 56.6669 20.044 56.0021 20.044C55.5504 20.044 55.169 20.108 54.858 20.2358C54.5469 20.3594 54.3082 20.532 54.142 20.7536C53.9801 20.9751 53.8991 21.2266 53.8991 21.5078C53.8906 21.7422 53.9396 21.9467 54.0462 22.1214C54.157 22.2962 54.3082 22.4474 54.5 22.5753C54.6918 22.6989 54.9134 22.8075 55.1648 22.9013C55.4162 22.9908 55.6847 23.0675 55.9702 23.1314L57.1463 23.4126C57.7173 23.5405 58.2415 23.7109 58.7188 23.924C59.196 24.1371 59.6094 24.3991 59.9588 24.7102C60.3082 25.0213 60.5788 25.3878 60.7706 25.8097C60.9666 26.2315 61.0668 26.7152 61.071 27.2607C61.0668 28.0618 60.8622 28.7564 60.4574 29.3445C60.0568 29.9283 59.4773 30.3821 58.7188 30.706C57.9645 31.0256 57.0547 31.1854 55.9893 31.1854C54.9325 31.1854 54.0121 31.0234 53.228 30.6996C52.4482 30.3757 51.8388 29.8963 51.3999 29.2614C50.9652 28.6222 50.7372 27.8317 50.7159 26.8899H53.3942C53.424 27.3288 53.5497 27.6953 53.7713 27.9893C53.9972 28.2791 54.2976 28.4986 54.6726 28.6477C55.0518 28.7926 55.4801 28.8651 55.9574 28.8651C56.4261 28.8651 56.8331 28.7969 57.1783 28.6605C57.5277 28.5241 57.7983 28.3345 57.9901 28.0916C58.1818 27.8487 58.2777 27.5696 58.2777 27.2543C58.2777 26.9602 58.1903 26.7131 58.0156 26.5128C57.8452 26.3125 57.5938 26.142 57.2614 26.0014C56.9332 25.8608 56.5305 25.733 56.0533 25.6179L54.6278 25.2599C53.5241 24.9915 52.6527 24.5717 52.0135 24.0007C51.3743 23.4297 51.0568 22.6605 51.0611 21.6932C51.0568 20.9006 51.2678 20.2081 51.6939 19.6158C52.1243 19.0234 52.7145 18.5611 53.4645 18.2287C54.2145 17.8963 55.0668 17.7301 56.0213 17.7301C56.9929 17.7301 57.8409 17.8963 58.5653 18.2287C59.294 18.5611 59.8608 19.0234 60.2656 19.6158C60.6705 20.2081 60.8793 20.8942 60.892 21.674H58.2393ZM72.035 21.1818L68.6025 31H65.5343L62.1017 21.1818H64.9782L67.0172 28.2067H67.1195L69.1522 21.1818H72.035ZM77.5865 31.1918C76.5765 31.1918 75.7072 30.9872 74.9785 30.5781C74.2541 30.1648 73.6958 29.581 73.3038 28.8267C72.9118 28.0682 72.7157 27.1712 72.7157 26.1357C72.7157 25.1257 72.9118 24.2393 73.3038 23.4766C73.6958 22.7138 74.2477 22.1193 74.9593 21.6932C75.6752 21.267 76.5147 21.054 77.4778 21.054C78.1255 21.054 78.7285 21.1584 79.2868 21.3672C79.8493 21.5717 80.3393 21.8807 80.7569 22.294C81.1788 22.7074 81.5069 23.2273 81.7413 23.8537C81.9757 24.4759 82.0929 25.2045 82.0929 26.0398V26.7876H73.8024V25.1001H79.5297C79.5297 24.7081 79.4444 24.3608 79.274 24.0582C79.1035 23.7557 78.867 23.5192 78.5645 23.3487C78.2662 23.174 77.9189 23.0866 77.5226 23.0866C77.1092 23.0866 76.7427 23.1825 76.4231 23.3743C76.1078 23.5618 75.8606 23.8153 75.6816 24.1349C75.5027 24.4503 75.411 24.8018 75.4068 25.1896V26.794C75.4068 27.2798 75.4963 27.6996 75.6752 28.0533C75.8585 28.407 76.1163 28.6797 76.4487 28.8714C76.7811 29.0632 77.1752 29.1591 77.6312 29.1591C77.9338 29.1591 78.2108 29.1165 78.4622 29.0312C78.7136 28.946 78.9288 28.8182 79.1078 28.6477C79.2868 28.4773 79.4231 28.2685 79.5169 28.0213L82.0353 28.1875C81.9075 28.7926 81.6454 29.321 81.2491 29.7727C80.8571 30.2202 80.35 30.5696 79.7278 30.821C79.1099 31.0682 78.3961 31.1918 77.5865 31.1918ZM86.5929 17.9091V31H83.8699V17.9091H86.5929ZM93.9964 21.1818V23.2273H88.0838V21.1818H93.9964ZM89.4261 18.8295H92.1491V27.983C92.1491 28.2344 92.1875 28.4304 92.2642 28.571C92.3409 28.7074 92.4474 28.8033 92.5838 28.8587C92.7244 28.9141 92.8864 28.9418 93.0696 28.9418C93.1974 28.9418 93.3253 28.9311 93.4531 28.9098C93.581 28.8842 93.679 28.8651 93.7472 28.8523L94.1754 30.8786C94.0391 30.9212 93.8473 30.9702 93.6001 31.0256C93.353 31.0852 93.0526 31.1214 92.6989 31.1342C92.0426 31.1598 91.4673 31.0724 90.973 30.8722C90.483 30.6719 90.1016 30.3608 89.8288 29.9389C89.5561 29.517 89.4219 28.9844 89.4261 28.3409V18.8295ZM100.139 31.1918C99.1293 31.1918 98.2599 30.9872 97.5312 30.5781C96.8068 30.1648 96.2486 29.581 95.8565 28.8267C95.4645 28.0682 95.2685 27.1712 95.2685 26.1357C95.2685 25.1257 95.4645 24.2393 95.8565 23.4766C96.2486 22.7138 96.8004 22.1193 97.5121 21.6932C98.228 21.267 99.0675 21.054 100.031 21.054C100.678 21.054 101.281 21.1584 101.839 21.3672C102.402 21.5717 102.892 21.8807 103.31 22.294C103.732 22.7074 104.06 23.2273 104.294 23.8537C104.528 24.4759 104.646 25.2045 104.646 26.0398V26.7876H96.3551V25.1001H102.082C102.082 24.7081 101.997 24.3608 101.827 24.0582C101.656 23.7557 101.42 23.5192 101.117 23.3487C100.819 23.174 100.472 23.0866 100.075 23.0866C99.6619 23.0866 99.2955 23.1825 98.9759 23.3743C98.6605 23.5618 98.4134 23.8153 98.2344 24.1349C98.0554 24.4503 97.9638 24.8018 97.9595 25.1896V26.794C97.9595 27.2798 98.049 27.6996 98.228 28.0533C98.4112 28.407 98.669 28.6797 99.0014 28.8714C99.3338 29.0632 99.728 29.1591 100.184 29.1591C100.487 29.1591 100.763 29.1165 101.015 29.0312C101.266 28.946 101.482 28.8182 101.661 28.6477C101.839 28.4773 101.976 28.2685 102.07 28.0213L104.588 28.1875C104.46 28.7926 104.198 29.321 103.802 29.7727C103.41 30.2202 102.903 30.5696 102.281 30.821C101.663 31.0682 100.949 31.1918 100.139 31.1918Z"
						fill="#1E293B"
					/>
					<path
						d="M58.2393 41.2035C58.1882 40.6879 57.9688 40.2874 57.581 40.0018C57.1932 39.7163 56.6669 39.5736 56.0021 39.5736C55.5504 39.5736 55.169 39.6375 54.858 39.7653C54.5469 39.8889 54.3082 40.0615 54.142 40.2831C53.9801 40.5047 53.8991 40.7561 53.8991 41.0374C53.8906 41.2717 53.9396 41.4763 54.0462 41.651C54.157 41.8257 54.3082 41.977 54.5 42.1048C54.6918 42.2284 54.9134 42.3371 55.1648 42.4308C55.4162 42.5203 55.6847 42.597 55.9702 42.6609L57.1463 42.9422C57.7173 43.07 58.2415 43.2405 58.7188 43.4535C59.196 43.6666 59.6094 43.9287 59.9588 44.2398C60.3082 44.5508 60.5788 44.9173 60.7706 45.3392C60.9666 45.7611 61.0668 46.2447 61.071 46.7902C61.0668 47.5913 60.8622 48.2859 60.4574 48.874C60.0568 49.4578 59.4773 49.9116 58.7188 50.2355C57.9645 50.5551 57.0547 50.7149 55.9893 50.7149C54.9325 50.7149 54.0121 50.553 53.228 50.2291C52.4482 49.9053 51.8388 49.4258 51.3999 48.7909C50.9652 48.1517 50.7372 47.3612 50.7159 46.4195H53.3942C53.424 46.8584 53.5497 47.2249 53.7713 47.5189C53.9972 47.8087 54.2976 48.0281 54.6726 48.1773C55.0518 48.3222 55.4801 48.3946 55.9574 48.3946C56.4261 48.3946 56.8331 48.3264 57.1783 48.1901C57.5277 48.0537 57.7983 47.8641 57.9901 47.6212C58.1818 47.3783 58.2777 47.0991 58.2777 46.7838C58.2777 46.4898 58.1903 46.2426 58.0156 46.0423C57.8452 45.842 57.5938 45.6716 57.2614 45.531C56.9332 45.3903 56.5305 45.2625 56.0533 45.1474L54.6278 44.7895C53.5241 44.521 52.6527 44.1013 52.0135 43.5303C51.3743 42.9592 51.0568 42.1901 51.0611 41.2227C51.0568 40.4301 51.2678 39.7376 51.6939 39.1453C52.1243 38.553 52.7145 38.0906 53.4645 37.7582C54.2145 37.4258 55.0668 37.2597 56.0213 37.2597C56.9929 37.2597 57.8409 37.4258 58.5653 37.7582C59.294 38.0906 59.8608 38.553 60.2656 39.1453C60.6705 39.7376 60.8793 40.4237 60.892 41.2035H58.2393ZM67.3176 50.7213C66.3248 50.7213 65.4661 50.5104 64.7417 50.0885C64.0215 49.6624 63.4654 49.07 63.0733 48.3115C62.6813 47.5487 62.4853 46.6645 62.4853 45.6588C62.4853 44.6446 62.6813 43.7582 63.0733 42.9997C63.4654 42.2369 64.0215 41.6446 64.7417 41.2227C65.4661 40.7966 66.3248 40.5835 67.3176 40.5835C68.3105 40.5835 69.1671 40.7966 69.8873 41.2227C70.6117 41.6446 71.1699 42.2369 71.562 42.9997C71.954 43.7582 72.15 44.6446 72.15 45.6588C72.15 46.6645 71.954 47.5487 71.562 48.3115C71.1699 49.07 70.6117 49.6624 69.8873 50.0885C69.1671 50.5104 68.3105 50.7213 67.3176 50.7213ZM67.3304 48.6119C67.7821 48.6119 68.1593 48.4841 68.4618 48.2284C68.7644 47.9685 68.9924 47.6148 69.1458 47.1673C69.3034 46.7199 69.3823 46.2106 69.3823 45.6396C69.3823 45.0686 69.3034 44.5594 69.1458 44.1119C68.9924 43.6645 68.7644 43.3108 68.4618 43.0508C68.1593 42.7909 67.7821 42.6609 67.3304 42.6609C66.8745 42.6609 66.4909 42.7909 66.1799 43.0508C65.873 43.3108 65.6408 43.6645 65.4831 44.1119C65.3297 44.5594 65.253 45.0686 65.253 45.6396C65.253 46.2106 65.3297 46.7199 65.4831 47.1673C65.6408 47.6148 65.873 47.9685 66.1799 48.2284C66.4909 48.4841 66.8745 48.6119 67.3304 48.6119ZM78.3567 50.7213C77.351 50.7213 76.486 50.5082 75.7615 50.0821C75.0414 49.6517 74.4874 49.0551 74.0996 48.2923C73.7161 47.5295 73.5243 46.6517 73.5243 45.6588C73.5243 44.6531 73.7182 43.771 74.106 43.0125C74.498 42.2497 75.0542 41.6553 75.7743 41.2291C76.4945 40.7987 77.351 40.5835 78.3439 40.5835C79.2005 40.5835 79.9505 40.7391 80.5939 41.0501C81.2374 41.3612 81.7466 41.798 82.1216 42.3605C82.4966 42.923 82.7033 43.5835 82.7417 44.342H80.1721C80.0996 43.852 79.9078 43.4578 79.5968 43.1595C79.29 42.857 78.8873 42.7057 78.3887 42.7057C77.9668 42.7057 77.5982 42.8207 77.2828 43.0508C76.9718 43.2767 76.7289 43.607 76.5542 44.0416C76.3794 44.4763 76.2921 45.0026 76.2921 45.6204C76.2921 46.2469 76.3773 46.7795 76.5478 47.2185C76.7225 47.6574 76.9675 47.9919 77.2828 48.222C77.5982 48.4521 77.9668 48.5672 78.3887 48.5672C78.6998 48.5672 78.9789 48.5033 79.226 48.3754C79.4775 48.2476 79.6841 48.0622 79.8461 47.8193C80.0123 47.5722 80.1209 47.276 80.1721 46.9308H82.7417C82.699 47.6808 82.4945 48.3413 82.128 48.9124C81.7658 49.4791 81.2651 49.9223 80.6259 50.2419C79.9867 50.5615 79.2303 50.7213 78.3567 50.7213ZM84.4851 50.5295V40.7114H87.2081V50.5295H84.4851ZM85.853 39.4457C85.4482 39.4457 85.1009 39.3115 84.8111 39.043C84.5256 38.7703 84.3828 38.4443 84.3828 38.0651C84.3828 37.6901 84.5256 37.3683 84.8111 37.0999C85.1009 36.8271 85.4482 36.6908 85.853 36.6908C86.2578 36.6908 86.603 36.8271 86.8885 37.0999C87.1783 37.3683 87.3232 37.6901 87.3232 38.0651C87.3232 38.4443 87.1783 38.7703 86.8885 39.043C86.603 39.3115 86.2578 39.4457 85.853 39.4457ZM93.8638 50.7213C92.8539 50.7213 91.9846 50.5168 91.2559 50.1077C90.5314 49.6943 89.9732 49.1105 89.5811 48.3562C89.1891 47.5977 88.9931 46.7007 88.9931 45.6652C88.9931 44.6553 89.1891 43.7689 89.5811 43.0061C89.9732 42.2433 90.525 41.6489 91.2367 41.2227C91.9526 40.7966 92.7921 40.5835 93.7551 40.5835C94.4029 40.5835 95.0059 40.6879 95.5641 40.8967C96.1266 41.1013 96.6167 41.4102 97.0343 41.8236C97.4561 42.2369 97.7843 42.7568 98.0186 43.3832C98.253 44.0054 98.3702 44.7341 98.3702 45.5693V46.3172H90.0797V44.6297H95.807C95.807 44.2376 95.7218 43.8903 95.5513 43.5878C95.3809 43.2852 95.1444 43.0487 94.8418 42.8783C94.5435 42.7035 94.1962 42.6162 93.7999 42.6162C93.3865 42.6162 93.0201 42.7121 92.7005 42.9038C92.3851 43.0913 92.138 43.3449 91.959 43.6645C91.78 43.9798 91.6884 44.3314 91.6841 44.7192V46.3236C91.6841 46.8094 91.7736 47.2291 91.9526 47.5828C92.1358 47.9365 92.3936 48.2092 92.726 48.401C93.0584 48.5928 93.4526 48.6886 93.9086 48.6886C94.2111 48.6886 94.4881 48.646 94.7395 48.5608C94.9909 48.4756 95.2061 48.3477 95.3851 48.1773C95.5641 48.0068 95.7005 47.798 95.7942 47.5508L98.3127 47.717C98.1848 48.3222 97.9228 48.8506 97.5265 49.3023C97.1344 49.7497 96.6273 50.0991 96.0051 50.3506C95.3873 50.5977 94.6735 50.7213 93.8638 50.7213ZM105.369 40.7114V42.7568H99.4569V40.7114H105.369ZM100.799 38.3591H103.522V47.5125C103.522 47.7639 103.561 47.9599 103.637 48.1006C103.714 48.2369 103.82 48.3328 103.957 48.3882C104.097 48.4436 104.259 48.4713 104.443 48.4713C104.57 48.4713 104.698 48.4606 104.826 48.4393C104.954 48.4138 105.052 48.3946 105.12 48.3818L105.548 50.4081C105.412 50.4507 105.22 50.4997 104.973 50.5551C104.726 50.6148 104.426 50.651 104.072 50.6638C103.416 50.6893 102.84 50.602 102.346 50.4017C101.856 50.2014 101.475 49.8903 101.202 49.4685C100.929 49.0466 100.795 48.5139 100.799 47.8704V38.3591ZM108.824 54.2114C108.479 54.2114 108.155 54.1837 107.853 54.1283C107.555 54.0771 107.307 54.0111 107.111 53.9301L107.725 51.8974C108.045 51.9955 108.332 52.0487 108.588 52.0572C108.848 52.0658 109.072 52.0061 109.259 51.8783C109.451 51.7504 109.606 51.5331 109.726 51.2263L109.885 50.8108L106.363 40.7114H109.227L111.26 47.9216H111.362L113.414 40.7114H116.297L112.481 51.5906C112.297 52.119 112.048 52.5793 111.733 52.9713C111.422 53.3676 111.028 53.6723 110.55 53.8854C110.073 54.1027 109.498 54.2114 108.824 54.2114Z"
						fill="#1E293B"
					/>
				</svg>
			</a>
			<div class="max-w-2xl flex-1">
				<search>
					<form
						method="GET"
						action="/"
						data-sveltekit-keepfocus
						data-sveltekit-replacestate
						data-sveltekit-noscroll
					>
						<input
							class="h-8 w-full rounded-md border-none bg-slate-100 text-sm"
							type="search"
							name="search"
							placeholder="Search by tags, name or author"
							value={$page.url.searchParams.get('search')}
						/>
						<button type="submit">Search</button>
					</form>
				</search>
			</div>
			<nav>
				<ul class="flex space-x-4 text-slate-800">
					<li>
						<a
							href="/about"
							class="hover:text-slate-600 {$page.url.pathname === '/about' ? 'font-bold' : ''}"
							>About</a
						>
					</li>
					<li>
						<a
							href="/links"
							class="hover:text-slate-600 {$page.url.pathname === '/about' ? 'font-bold' : ''}"
							>Links</a
						>
					</li>
					<li>
						<a
							href="/events"
							class="hover:text-slate-600 {$page.url.pathname === '/about' ? 'font-bold' : ''}"
							>Events</a
						>
					</li>
					{#if data.user}
						<li><a href="/account">Profile</a></li>
						<li><a href="/auth/logout">Logout</a></li>
					{:else}
						<li><a href="/auth/github">Login</a></li>
					{/if}
				</ul>
			</nav>
		</div>
	</header>

	<div class="container mx-auto flex flex-1">
		{@render children()}
	</div>
</div>

```

# src/lib/ui/Tags.svelte

```svelte
<script lang="ts">
	import Tag from './Tag.svelte';

	type Tag = {
		id: string;
		name: string;
		slug: string;
	};
	let { tags }: { tags: Tag[] } = $props();
</script>

<div class="flex flex-wrap gap-2">
	{#each tags as tag}
		<Tag {tag} />
	{/each}
</div>

```

# src/lib/ui/Tag.svelte

```svelte
<script lang="ts">
	import { page } from '$app/stores';

	type Tag = {
		id: string;
		name: string;
		slug: string;
	};
	let { tag, onclick }: { tag: Tag; onclick?: () => void } = $props();

	const handleClick = (e) => {
		if (onclick) {
			e.preventDefault();
			onclick();
		}
	};
</script>

<svelte:element
	this={onclick ? 'button' : 'a'}
	href={$page.url.pathname === `/tags/${tag.slug}` ? '/' : `/tags/${tag.slug}`}
	class="bg-svelte-100 border-svelte-100 text-svelte-900 flex items-center gap-0.5 rounded border-2 px-1 py-0.5 text-xs"
	class:active={$page.url.pathname === `/tags/${tag.slug}`}
	onclick={onclick ? handleClick : undefined}
>
	#{tag.name}
	{#if onclick}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<line x1="18" y1="6" x2="6" y2="18"></line>
			<line x1="6" y1="6" x2="18" y2="18"></line>
		</svg>
	{/if}
</svelte:element>

<style>
	.active {
		@apply border-svelte-900;
	}
</style>

```

# src/lib/ui/Switch.svelte

```svelte
<script lang="ts">
	interface SwitchProps {
		checked: boolean;
		disabled?: boolean;
		name?: string;
		label?: string;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		name = '',
		label = ''
	}: SwitchProps = $props();
</script>

<label
	class="inline-flex cursor-pointer items-center {disabled ? 'cursor-not-allowed opacity-50' : ''}"
>
	<div class="relative">
		<input type="checkbox" class="sr-only" {name} bind:checked {disabled} />
		<div
			class="h-6 w-10 rounded-full bg-gray-200 shadow-inner transition-colors duration-300 ease-in-out
        {checked ? 'bg-blue-500' : 'bg-gray-200'}
        {disabled ? 'opacity-50' : ''}"
		></div>
		<div
			class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ease-in-out
        {checked ? 'translate-x-full transform' : ''}"
		></div>
	</div>
	{#if label}
		<span class="ml-3 text-sm font-medium text-gray-700">{label}</span>
	{/if}
</label>

```

# src/lib/ui/Select.svelte

```svelte
<script lang="ts">
	type SelectOption = {
		value: string;
		label: string;
	};

	interface SelectProps {
		options: SelectOption[];
		value?: string;
		placeholder?: string;
		name?: string;
		disabled?: boolean;
		onchange?: ChangeEventHandler;
	}

	let {
		options = [],
		placeholder = 'Select an option',
		name = '',
		value = $bindable(''),
		disabled = false,
		onchange
	}: SelectProps = $props();
</script>

<div class="relative inline-block w-full">
	<select
		{name}
		bind:value
		{onchange}
		{disabled}
		class="
      focus:shadow-outline block w-full appearance-none rounded border border-gray-300
      bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-400 focus:outline-none
      {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
    "
	>
		{#if placeholder}
			<option value="" disabled selected hidden>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
		<svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
		</svg>
	</div>
</div>

```

# src/lib/ui/Pagination.svelte

```svelte
<script lang="ts">
	import { page } from '$app/stores';

	let { totalPages = 1 } = $props();

	let currentPage = $derived(parseInt($page.url.searchParams.get('page') || '1', 10));
	let visiblePages = $derived(getVisiblePages(currentPage, totalPages));

	function getVisiblePages(current: number, total: number) {
		if (total <= 6) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}

		let pages = [1, total];

		if (current > 2) pages.push(current - 1);
		if (current < total - 1) pages.push(current + 1);

		pages.push(current);

		pages = [...new Set(pages)].sort((a, b) => a - b);

		if (pages[1] - pages[0] > 1) pages.splice(1, 0, '...');
		if (pages[pages.length - 1] - pages[pages.length - 2] > 1)
			pages.splice(pages.length - 1, 0, '...');

		return pages;
	}
</script>

<nav aria-label="Pagination" class="mt-8 flex justify-center">
	<ul class="flex items-center space-x-1">
		<li>
			<a
				href="?page={currentPage - 1}"
				class="rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-500 hover:bg-gray-100 {currentPage ===
				1
					? 'pointer-events-none cursor-not-allowed opacity-50'
					: 'hover:bg-gray-50'}"
				aria-label="Previous page"
				tabindex={currentPage === 1 ? -1 : 0}
			>
				&laquo;
			</a>
		</li>

		{#each visiblePages as page}
			{#if page === '...'}
				<li class="px-2 py-1 text-gray-500">...</li>
			{:else}
				<li>
					<a
						href="?page={page}"
						class="rounded-md border border-gray-300 px-2 py-1 {page === currentPage
							? 'pointer-events-none bg-blue-500 text-white'
							: 'bg-white text-gray-500 hover:bg-gray-50'}"
						aria-current={page === currentPage ? 'page' : undefined}
					>
						{page}
					</a>
				</li>
			{/if}
		{/each}

		<li>
			<a
				href="?page={currentPage + 1}"
				class="rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-500 hover:bg-gray-100 {currentPage ===
				totalPages
					? 'pointer-events-none cursor-not-allowed opacity-50'
					: 'hover:bg-gray-50'}"
				aria-label="Next page"
				tabindex={currentPage === totalPages ? -1 : 0}
			>
				&raquo;
			</a>
		</li>
	</ul>
</nav>

```

# src/lib/ui/MarkdownEditor.svelte

```svelte
<script lang="ts">
	import { insert } from '@milkdown/utils';
	import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
	import { commonmark } from '@milkdown/preset-commonmark';
	import { clipboard } from '@milkdown/plugin-clipboard';
	import { emoji } from '@milkdown/plugin-emoji';
	import { history } from '@milkdown/plugin-history';
	import { listener, listenerCtx } from '@milkdown/plugin-listener';
	import { upload } from '@milkdown/plugin-upload';
	import { nord } from '@milkdown/theme-nord';
	import '@milkdown-lab/plugin-menu/style.css';

	let editor: Editor;
	let editorDiv: HTMLElement;

	let { value = $bindable(), name = '' } = $props();

	$effect(async () => {
		// const { menu, menuDefaultConfig } = await import('@milkdown-lab/plugin-menu');

		editor = await Editor.make()
			// .config(menuDefaultConfig)
			.config((ctx) => {
				ctx.set(rootCtx, editorDiv);
			})
			.config((ctx) => {
				ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
					value = markdown;
				});
			})
			.config(nord)
			.use(commonmark)
			.use(clipboard)
			.use(emoji)
			.use(history)
			.use(upload)
			.use(listener)
			// .use(menu)
			.create();

		editor.action(insert(value));

		return async () => {
			await editor.destroy();
		};
	});
</script>

<div class="markdown-editor">
	<div bind:this={editorDiv}></div>
</div>

<input type="hidden" {value} {name} />

```

# src/lib/ui/Icon.svelte

```svelte
<script context="module">
	let icon_paths_map = new Map([
		[
			'inbox',
			`<path fill-rule="evenodd" clip-rule="evenodd" d="M4.20133 3.09096C4.61499 2.12579 5.56402 1.5 6.6141 1.5H17.3859C18.4361 1.5 19.3849 2.1258 19.7986 3.09096L23.9091 12.6818C23.9691 12.8219 24 12.9726 24 13.125V19.875C24 21.3248 22.8248 22.5 21.375 22.5H2.625C1.17525 22.5 0 21.3248 0 19.875V13.125C0 12.9726 0.0309462 12.8219 0.0909618 12.6818L4.20133 3.09096ZM6.6141 3.75C6.46409 3.75 6.3285 3.8394 6.26941 3.97728L2.8311 12H7.125C7.4791 12 7.81254 12.1667 8.025 12.45L9.9375 15H14.0625L15.975 12.45C16.1874 12.1667 16.5208 12 16.875 12H21.1689L17.7306 3.97728C17.6715 3.8394 17.5359 3.75 17.3859 3.75H6.6141ZM21.75 14.25H17.4375L15.525 16.8C15.3126 17.0833 14.9791 17.25 14.625 17.25H9.375C9.0209 17.25 8.68746 17.0833 8.475 16.8L6.5625 14.25H2.25V19.875C2.25 20.0821 2.4179 20.25 2.625 20.25H21.375C21.5821 20.25 21.75 20.0821 21.75 19.875V14.25Z" fill="#1E293B"/>`
		]
	]);
</script>

<script lang="ts">
	let { large, color, icon } = $props<{ large?: boolean; color?: string; icon: string }>();

	let size = $derived(large ? 24 : 16);
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 {size} {size}"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	{@html icon_paths_map.get(icon)}
</svg>

```

# src/lib/ui/ContentCard.svelte

```svelte
<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Tags from './Tags.svelte';
	interface ContentCardProps {
		id: string | number;
		title: string;
		description?: string;
		rendered_body?: string;
		type: string;
		author: string;
		time: string;
		views: number;
		likes: number;
		liked: boolean;
		saves: number;
		saved: boolean;
		tags: string[];
		slug: string;
	}

	let {
		id,
		title,
		description,
		rendered_body,
		type,
		author,
		time,
		views,
		likes,
		liked,
		saves,
		saved,
		tags,
		slug
	}: ContentCardProps = $props();

	let submitting_like_toggle = $state(false);
	let submitting_save_toggle = $state(false);

	const likeSubmit = ({ cancel }) => {
		if (!$page.data.user) {
			cancel();
			return;
		}
		submitting_like_toggle = true;
		likes = liked ? likes - 1 : likes + 1;
		liked = !liked;
		return async ({ result }) => {
			if (!result?.data?.success) {
				likes = liked ? likes + 1 : likes - 1;
				liked = !liked;
			}
			submitting_like_toggle = false;
		};
	};
	const saveSubmit = () => {
		if (!$page.data.user) {
			cancel();
			return;
		}
		submitting_save_toggle = true;
		saves = saved ? saves - 1 : saves + 1;
		saved = !saved;
		return async ({ result }) => {
			if (!result?.data?.success) {
				saves = saved ? saves + 1 : saves - 1;
				saved = !saved;
			}
			submitting_save_toggle = false;
		};
	};
</script>

<article class="grid gap-2 rounded-lg bg-zinc-50 p-5">
	<div class="mb-2 grid grid-cols-[1fr_auto] items-start justify-between text-xs">
		<div class="flex">
			<span class="font-semibold capitalize">{type}&nbsp;</span>
			<span class="flex text-gray-500"
				><span>by {author} • {time} •&nbsp;</span>
				<span class="flex items-center gap-1">
					{views}
					<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
						<title>views</title>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M1.25937 5.94874C1.56882 5.48321 2.19069 4.63614 3.03377 3.91108C3.882 3.18157 4.89578 2.625 6.00025 2.625C7.10472 2.625 8.11854 3.18157 8.96672 3.91108C9.80979 4.63614 10.4317 5.48321 10.7411 5.94874C10.7627 5.98125 10.7627 6.01875 10.7411 6.05126C10.4317 6.51679 9.80979 7.36386 8.96672 8.0889C8.11854 8.81843 7.10472 9.375 6.00025 9.375C4.89578 9.375 3.882 8.81843 3.03377 8.0889C2.19069 7.36386 1.56882 6.51679 1.25937 6.05126C1.23776 6.01875 1.23776 5.98125 1.25937 5.94874ZM6.00025 1.5C4.51423 1.5 3.24714 2.24375 2.30021 3.05813C1.34813 3.87695 0.660585 4.8173 0.32247 5.32597C0.0500614 5.73578 0.0500625 6.26422 0.32247 6.67403C0.660585 7.1827 1.34813 8.12302 2.30021 8.94187C3.24714 9.75622 4.51423 10.5 6.00025 10.5C7.48627 10.5 8.75334 9.75622 9.70029 8.94187C10.6523 8.12302 11.3399 7.1827 11.678 6.67403C11.9504 6.26422 11.9504 5.73578 11.678 5.32597C11.3399 4.8173 10.6523 3.87695 9.70029 3.05813C8.75334 2.24375 7.48627 1.5 6.00025 1.5ZM6.00024 7.5C6.82867 7.5 7.50024 6.82843 7.50024 6C7.50024 5.17157 6.82867 4.5 6.00024 4.5C5.17182 4.5 4.50024 5.17157 4.50024 6C4.50024 6.82843 5.17182 7.5 6.00024 7.5Z"
							fill="#64748B"
						/>
					</svg>
				</span>
			</span>
		</div>
		<div class="flex items-center space-x-4">
			<form method="POST" action="/?/interact" use:enhance={likeSubmit}>
				<input type="hidden" name="id" value={id} />
				<input type="hidden" name="action" value={liked ? 'remove' : 'add'} />
				<input type="hidden" id="type" name="type" value="like" />

				<button
					disabled={submitting_like_toggle}
					aria-label="Like {type}"
					type="submit"
					class="-mx-2 -my-1 flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						xmlns="http://www.w3.org/2000/svg"
						class="mr-0.5"
					>
						<title>{liked ? 'Remove like' : 'Like'}</title>
						{#if liked}
							<path
								d="M6.62532 0.049567C5.62075 -0.0649162 4.87498 0.78591 4.87498 1.68679V2.06223C4.87498 3.05844 4.38994 3.6545 3.88685 4.02214C3.64068 4.20203 3.39161 4.32474 3.19794 4.40354C2.97064 4.01263 2.54726 3.74982 2.0625 3.74982H1.3125C0.587626 3.74982 0 4.33745 0 5.06232V10.6874C0 11.4122 0.587626 11.9999 1.3125 11.9999H2.0625C2.64352 11.9999 3.13637 11.6223 3.3091 11.0991C3.70246 11.1553 4.10958 11.2706 4.60301 11.4104L4.60316 11.4104C4.71683 11.4426 4.83508 11.4761 4.95881 11.5105C5.82428 11.7509 6.86444 11.9997 8.25 11.9997C9.52927 11.9997 10.4772 11.8855 11.0411 11.1453C11.306 10.7978 11.4439 10.3638 11.5427 9.89123C11.6307 9.47055 11.6986 8.95845 11.7771 8.3661L11.8075 8.1366C11.9944 6.73531 12.0063 5.64813 11.6661 4.89976C11.4831 4.49729 11.1996 4.1928 10.8137 3.99965C10.443 3.81409 10.0148 3.74973 9.5625 3.74973H8.49578L8.50702 3.66548V3.66547C8.5593 3.2768 8.625 2.78842 8.625 2.43723C8.625 1.74608 8.51153 1.14827 8.1333 0.71266C7.74983 0.270907 7.1979 0.114819 6.62532 0.049567Z"
								fill="currentColor"
							/>
						{:else}
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M6.62532 0.049567C5.62075 -0.0649162 4.87498 0.78591 4.87498 1.68679V2.06223C4.87498 3.05844 4.38994 3.6545 3.88685 4.02214C3.64068 4.20203 3.39161 4.32474 3.19794 4.40354C2.97064 4.01263 2.54726 3.74982 2.0625 3.74982H1.3125C0.587626 3.74982 0 4.33745 0 5.06232V10.6874C0 11.4122 0.587626 11.9999 1.3125 11.9999H2.0625C2.64352 11.9999 3.13637 11.6223 3.3091 11.0991C3.70246 11.1553 4.10958 11.2706 4.60301 11.4104L4.60316 11.4104C4.71683 11.4426 4.83508 11.4761 4.95881 11.5105C5.82428 11.7509 6.86444 11.9997 8.25 11.9997C9.52927 11.9997 10.4772 11.8855 11.0411 11.1453C11.306 10.7978 11.4439 10.3638 11.5427 9.89123C11.6307 9.47055 11.6986 8.95845 11.7771 8.3661L11.8075 8.1366C11.9944 6.73531 12.0063 5.64813 11.6661 4.89976C11.4831 4.49729 11.1996 4.1928 10.8137 3.99965C10.443 3.81409 10.0148 3.74973 9.5625 3.74973H8.49578L8.50702 3.66548V3.66547C8.5593 3.2768 8.625 2.78842 8.625 2.43723C8.625 1.74608 8.51153 1.14827 8.1333 0.71266C7.74983 0.270907 7.1979 0.114819 6.62532 0.049567ZM3.375 9.97388C3.90399 10.0403 4.41791 10.187 4.92908 10.3329H4.92908C5.03944 10.3644 5.14968 10.3959 5.25991 10.4265C6.08194 10.6549 7.01051 10.8747 8.25 10.8747C9.59565 10.8747 9.96023 10.7078 10.1463 10.4636C10.2565 10.3189 10.3529 10.0849 10.4416 9.66098C10.5204 9.28418 10.5822 8.8179 10.6625 8.21348L10.6924 7.98788C10.8806 6.57665 10.8345 5.78884 10.642 5.36534C10.5585 5.18186 10.4511 5.0762 10.3102 5.00567C10.1541 4.92756 9.91973 4.87473 9.5625 4.87473H8.2497C7.7358 4.87473 7.27876 4.442 7.34582 3.87279C7.36273 3.72929 7.38262 3.58106 7.40239 3.43371C7.45155 3.06737 7.49998 2.70649 7.49998 2.43723C7.49998 1.83079 7.39171 1.57446 7.28383 1.4502C7.18128 1.33208 6.98276 1.22258 6.49794 1.16733C6.26792 1.14112 5.99998 1.3451 5.99998 1.6868V2.06223C5.99998 3.50352 5.26628 4.40746 4.55062 4.93045C4.19808 5.18808 3.8487 5.35562 3.58861 5.45898C3.50911 5.49058 3.43716 5.5165 3.375 5.53739V9.97388ZM2.0625 4.87482C2.16605 4.87482 2.25 4.95876 2.25 5.06232V10.4997V10.6874C2.25 10.7909 2.16605 10.8749 2.0625 10.8749H1.3125C1.20895 10.8749 1.125 10.7909 1.125 10.6874V5.06232C1.125 4.95876 1.20895 4.87482 1.3125 4.87482H2.0625Z"
								fill="currentColor"
							/>
						{/if}
					</svg>
					{likes}
				</button>
			</form>
			<form use:enhance={saveSubmit} method="POST" action="/?/interact">
				<input type="hidden" name="id" value={id} />
				<input type="hidden" name="action" value={saved ? 'remove' : 'add'} />
				<input type="hidden" id="type" name="type" value="save" />
				<button
					disabled={submitting_save_toggle}
					aria-label="Like {type}"
					type="submit"
					class="-mx-2 -my-1 flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						xmlns="http://www.w3.org/2000/svg"
						class="mr-0.5"
					>
						<title>{saved ? 'Unsave' : 'Save'}</title>
						{#if saved}
							<path
								d="M3.5625 0.75C2.83763 0.75 2.25 1.33763 2.25 2.0625V10.6875C2.25 10.9052 2.37558 11.1033 2.57243 11.1962C2.76928 11.2891 3.00206 11.26 3.17008 11.1217L6 8.7912L8.8299 11.1217C8.99797 11.26 9.2307 11.2891 9.42758 11.1962C9.62445 11.1033 9.75 10.9052 9.75 10.6875V2.0625C9.75 1.33763 9.16237 0.75 8.4375 0.75H3.5625Z"
								fill="currentColor"
							/>
						{:else}
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M3.5625 1.875C3.45895 1.875 3.375 1.95895 3.375 2.0625V9.4956L5.64242 7.62832C5.85012 7.45723 6.14988 7.45723 6.35758 7.62832L8.625 9.4956V2.0625C8.625 1.95895 8.54108 1.875 8.4375 1.875H3.5625ZM2.25 2.0625C2.25 1.33763 2.83763 0.75 3.5625 0.75H8.4375C9.16237 0.75 9.75 1.33763 9.75 2.0625V10.6875C9.75 10.9052 9.62445 11.1033 9.42758 11.1962C9.2307 11.2891 8.99797 11.26 8.8299 11.1217L6 8.7912L3.17008 11.1217C3.00206 11.26 2.76928 11.2891 2.57243 11.1962C2.37558 11.1033 2.25 10.9052 2.25 10.6875V2.0625Z"
								fill="currentColor"
							/>
						{/if}
					</svg>
					{saves}
				</button>
			</form>
		</div>
	</div>

	{#if rendered_body}
		<div class="prose">{@html rendered_body}</div>
	{:else}
		<h2 class="mb-2 text-xl font-bold"><a href="/{type}/{slug}">{title}</a></h2>
		{description}
	{/if}

	<div class="mt-4 grid grid-cols-[1fr_auto] items-start justify-between">
		<div class="flex space-x-2">
			<Tags {tags} />
		</div>

		<div class="text-xs text-gray-500">{time}</div>
	</div>
</article>

```

# src/lib/ui/Button.svelte

```svelte
<script context="module" lang="ts">
	const icon_paths_map = new Map<string, string>([
		[
			'plus',
			`<path fill-rule="evenodd" clip-rule="evenodd" d="M7.75 2C7.94891 2 8.13968 2.07902 8.28033 2.21967C8.42098 2.36032 8.5 2.55109 8.5 2.75V7H12.75C12.9489 7 13.1397 7.07902 13.2803 7.21967C13.421 7.36032 13.5 7.55109 13.5 7.75C13.5 7.94891 13.421 8.13968 13.2803 8.28033C13.1397 8.42098 12.9489 8.5 12.75 8.5H8.5V12.75C8.5 12.9489 8.42098 13.1397 8.28033 13.2803C8.13968 13.421 7.94891 13.5 7.75 13.5C7.55109 13.5 7.36032 13.421 7.21967 13.2803C7.07902 13.1397 7 12.9489 7 12.75V8.5H2.75C2.55109 8.5 2.36032 8.42098 2.21967 8.28033C2.07902 8.13968 2 7.94891 2 7.75C2 7.55109 2.07902 7.36032 2.21967 7.21967C2.36032 7.07902 2.55109 7 2.75 7H7V2.75C7 2.55109 7.07902 2.36032 7.21967 2.21967C7.36032 2.07902 7.55109 2 7.75 2Z" fill="white"/>`
		],
		[
			'minus',
			`<path d="M2.75 8H13.25" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>`
		],
		[
			'close',
			`<path d="M3 3L13 13M3 13L13 3" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>`
		]
	]);
</script>

<script lang="ts">
	type Props = {
		primary?: boolean;
		error?: boolean;
		secondary?: boolean;
		small?: boolean;
		large?: boolean;
		fullWidth?: boolean;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		children: any;
		icon_left?: string;
		icon_right?: string;
		onclick?: () => void;
	};

	let {
		primary,
		secondary,
		error,
		small,
		large,
		fullWidth,
		href,
		type,
		disabled,
		icon_left,
		icon_right,
		children,
		onclick
	}: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	role={href ? '' : 'button'}
	tabindex="0"
	{type}
	{href}
	{onclick}
	class:primary
	class:secondary
	class:error
	class:small
	class:large
	class:fullWidth
	class:disabled
>
	{#if icon_left}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			{@html icon_paths_map.get(icon_left)}
		</svg>
	{/if}
	{@render children()}
	{#if icon_right}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			{@html icon_paths_map.get(icon_right)}
		</svg>
	{/if}
</svelte:element>

<style lang="postcss">
	button,
	a {
		@apply inline-flex items-center justify-center gap-1 rounded-md px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
	}
	.primary {
		@apply bg-svelte-900 focus:ring-svelte-900 text-white hover:brightness-150;
	}
	.secondary {
		@apply bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500;
	}

	.error {
		@apply rounded-md bg-red-600 text-white transition-colors duration-200 hover:bg-red-700;
	}
	.small {
		@apply px-3 py-2 text-sm;
	}
	.large {
		@apply px-6 py-3 text-lg;
	}
	.fullWidth {
		@apply w-full;
	}
	a:disabled,
	button:disabled {
		@apply cursor-not-allowed opacity-50;
	}
</style>

```

# src/lib/ui/Breadcrumb.svelte

```svelte
<script lang="ts">
	import { page } from '$app/stores';

	$: path = $page.url.pathname.split('/').filter(Boolean);
	$: breadcrumbs = path.map((part, index) => ({
		name: part.charAt(0).toUpperCase() + part.slice(1),
		href: '/' + path.slice(0, index + 1).join('/')
	}));

	$: if ($page.data.content?.title && breadcrumbs.length > 0) {
		breadcrumbs[breadcrumbs.length - 1].name = $page.data.content.title;
	}

	$: isHomePage = $page.url.pathname === '/';
</script>

{#if !isHomePage}
	<nav class="py-4 text-sm">
		<ol class="flex list-none p-0">
			<li class="flex items-center">
				<a href="/" class="text-gray-600 hover:text-gray-900 hover:underline">Home</a>
			</li>
			{#each breadcrumbs as crumb, index}
				<li class="flex items-center">
					{#if index > 0 || !isHomePage}
						<svg class="mx-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
					<a href={crumb.href} class="text-gray-600 hover:text-gray-900 hover:underline">
						{crumb.name}
					</a>
				</li>
			{/each}
		</ol>
	</nav>
{/if}

```

# src/lib/ui/Avatar.svelte

```svelte
<script lang="ts">
	export let src: string | null = null;
	export let name: string;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const sizeClasses = {
		sm: 'w-8 h-8 text-xs',
		md: 'w-10 h-10 text-sm',
		lg: 'w-12 h-12 text-base'
	};

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	const initials = getInitials(name);
</script>

<div
	class={`relative ${sizeClasses[size]} flex items-center justify-center overflow-hidden rounded-full border-2 border-indigo-500 bg-gray-200`}
>
	{#if src}
		<img {src} alt={name} class="h-full w-full object-cover" />
	{:else}
		<span class="font-medium text-gray-600">{initials}</span>
	{/if}
</div>

```

# src/lib/ui/AutoComplete.svelte

```svelte
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let items: any[] = [];
	export let searchField: string = 'name';
	export let valueField: string = 'id';
	export let placeholder: string = 'Search...';
	export let createNew: boolean = false;

	let inputValue = '';
	let filteredItems: any[] = [];
	let selectedIndex = -1;
	let showDropdown = false;

	const dispatch = createEventDispatcher();

	$: {
		if (inputValue) {
			filteredItems = items.filter((item) =>
				item[searchField].toLowerCase().includes(inputValue.toLowerCase())
			);
			if (
				createNew &&
				!filteredItems.some((item) => item[searchField].toLowerCase() === inputValue.toLowerCase())
			) {
				filteredItems = [{ [searchField]: inputValue, isNew: true }, ...filteredItems];
			}
		} else {
			filteredItems = [];
		}
		selectedIndex = -1;
	}

	function handleInput() {
		showDropdown = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedIndex = (selectedIndex + 1) % filteredItems.length;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
		} else if (event.key === 'Enter' && selectedIndex !== -1) {
			event.preventDefault();
			selectItem(filteredItems[selectedIndex]);
		}
	}

	function selectItem(item: any) {
		if (item.isNew) {
			dispatch('create', inputValue);
		} else {
			dispatch('select', item[valueField]);
		}
		inputValue = '';
		showDropdown = false;
	}

	function handleBlur() {
		setTimeout(() => {
			showDropdown = false;
		}, 200);
	}
</script>

<div class="relative">
	<input
		type="text"
		bind:value={inputValue}
		oninput={handleInput}
		onkeydown={handleKeydown}
		onblur={handleBlur}
		{placeholder}
		class="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
	/>
	{#if showDropdown && filteredItems.length > 0}
		<ul
			class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg"
		>
			{#each filteredItems as item, index}
				<li>
					<button
						class="flex w-full cursor-pointer px-3 py-2 hover:bg-gray-100"
						class:bg-blue-100={index === selectedIndex}
						onclick={() => selectItem(item)}
					>
						{#if item.isNew}
							<a href=""><span class="font-semibold">Create:</span> {item[searchField]}</a>
						{:else}
							<slot name="item" {item}>
								{item[searchField]}
							</slot>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

```

# src/lib/ui/AutoComplete-Tags.svelte

```svelte
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import AutoComplete from './AutoComplete.svelte';
	import Tag from './Tag.svelte';

	export let tags: Array<{ id: number; name: string }> = [];
	export let selectedTags: number[] = [];
	export let placeholder: string = 'Type to search or create a tag';

	const dispatch = createEventDispatcher();

	function handleCreate(event: CustomEvent<string>) {
		const newTag = { id: Math.max(0, ...tags.map((t) => t.id)) + 1, name: event.detail };
		tags = [...tags, newTag];
		addTag(newTag.id);
		dispatch('create', newTag);
	}

	function handleSelect(event: CustomEvent<number>) {
		event.preventDefault();
		addTag(event.detail);
	}

	function addTag(tagId: number) {
		if (!selectedTags.includes(tagId)) {
			selectedTags = [...selectedTags, tagId];
			dispatch('add', tagId);
		}
	}

	function removeTag(tagId: number) {
		selectedTags = selectedTags.filter((id) => id !== tagId);
		dispatch('remove', tagId);
	}
</script>

<div class="space-y-2">
	<AutoComplete
		items={tags}
		{placeholder}
		searchField="name"
		valueField="id"
		createNew={true}
		on:create={handleCreate}
		on:select={handleSelect}
	/>

	<div class="mt-2 flex flex-wrap gap-2">
		{#each selectedTags as tagId}
			{@const tag = tags.find((t) => t.id === tagId)}
			{#if tag}
				<Tag {tag} onclick={() => removeTag(tag.id)} />
			{/if}
		{/each}
	</div>
	{#each selectedTags as tag}
		<input type="hidden" name="tags" value={tag} />
	{/each}
</div>

```

# src/lib/utils/debounce.ts

```ts
export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<F>): Promise<ReturnType<F>> => {
		return new Promise((resolve) => {
			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				resolve(func(...args));
			}, waitFor);
		});
	};
}

```

# src/lib/utils/date.ts

```ts
export function formatRelativeDate(date: Date | number | string): string {
	const now = new Date();
	const inputDate = new Date(date);
	const diffTime = now.getTime() - inputDate.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		return 'Today';
	} else if (diffDays === 1) {
		return 'Yesterday';
	} else if (diffDays > 1 && diffDays <= 5) {
		return `${diffDays} days ago`;
	} else {
		return inputDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
}

```

# src/routes/(app)/(account)/+layout.svelte

```svelte
<script lang="ts">
    let { children } = $props();
</script>

{@render children()}
```

# src/lib/server/db/user.ts

```ts
import { db } from './index'

interface GitHubUserInfo {
    id: number;
    email?: string;
    name?: string;
    login: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    twitter_username?: string;
}

interface User {
    id: number;
    github_id: number;
    email: string | null;
    username: string;
    name: string | null;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    twitter: string | null;
    role: number;
}

export const get_user = (id: number): User | undefined => {
    const stmt = db.prepare(`
      SELECT * FROM users
      WHERE id = @id
    `);

    try {
        const result = stmt.get({ id }) as User;
        return result;
    } catch (error) {
        console.error('Error getting user:', error);
        return undefined;
    }
}

export const get_users = (): User[] => {
    const stmt = db.prepare(`
      SELECT * FROM users
    `);

    try {
        const result = stmt.all() as User[];
        return result;
    } catch (error) {
        console.error('Error getting users:', error);
        return []
    }
}

export const get_user_count = (): Number => {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM users
    `);

    try {
        const result = stmt.get() as { count: number };
        return result.count;
    } catch (error) {
        console.error('Error getting user:', error);
        return 0;
    }
}

export const create_or_update_user = (githubInfo: GitHubUserInfo): User => {
    const userInfo = extractGithubUserInfo(githubInfo);

    const stmt = db.prepare(`
      INSERT INTO users (github_id, email, username, name, avatar_url, bio, location, twitter)
      VALUES (@github_id, @email, @username, @name, @avatar_url, @bio, @location, @twitter)
      ON CONFLICT (github_id) DO UPDATE SET
        email = @email,
        name = @name,
        username = @username,
        avatar_url = @avatar_url,
        bio = @bio,
        location = @location,
        twitter = @twitter
      RETURNING *
    `);

    try {
        const result = stmt.get(userInfo) as User;
        return result;
    } catch (error) {
        console.error('Error upserting user:', error);
        throw error;
    }
}


function extractGithubUserInfo(info: GitHubUserInfo): Omit<User, 'id' | 'role'> {
    return {
        github_id: info.id,
        email: info.email || null,
        username: info.login,
        name: info.name || null,
        avatar_url: info.avatar_url || null,
        bio: info.bio || null,
        location: info.location || null,
        twitter: info.twitter_username || null,
    };
}
```

# src/lib/server/db/tags.ts

```ts
import { db } from "./index";

export type Tag = {
    id: number;
    name: string;
    slug: string;
    color: string | null;
};

export const get_tags = () => {
    const stmt = db.prepare('SELECT * FROM tags');
    return stmt.all() as Tag[];
}
```

# src/lib/server/db/session.ts

```ts
import { db } from './index'
import { randomUUID } from 'crypto';

const SEVEN_DAYS = 7 * 24 * 60 * 60; // 7 days in seconds

interface Session {
    id: number;
    user_id: number;
    session_token: string;
    expires_at: string;
    created_at: string;
}

interface SessionResult {
    valid: boolean;
    user_id?: number;
}

const deleteSessionStatement = db.prepare(`
    DELETE FROM sessions
    WHERE session_token = @session_token
    RETURNING *
  `);

const createSessionStatement = db.prepare(`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (@user_id, @session_token, @expires_at)
    RETURNING session_token
  `);

const validateSessionStatement = db.prepare(`
    SELECT user_id
    FROM sessions
    WHERE session_token = @session_token
    AND expires_at > datetime('now')
    LIMIT 1
  `);

export function delete_session(sessionToken: string): Session | undefined {
    try {
        return deleteSessionStatement.get({ session_token: sessionToken }) as Session | undefined;
    } catch (error) {
        console.error('Error deleting session:', error);
        return undefined;
    }
}

export function create_session(userId: number): string {
    try {
        const sessionToken = randomUUID();
        const now = new Date();
        const expiration = new Date(now.getTime() + SEVEN_DAYS * 1000);

        const result = createSessionStatement.get({
            user_id: userId,
            session_token: sessionToken,
            expires_at: formatDateForSQLite(expiration)
        }) as { session_token: string };

        return result.session_token;
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;
    }
}

export function validate_session_id(sessionToken: string): SessionResult {
    try {
        const result = validateSessionStatement.get({ session_token: sessionToken }) as { user_id: number } | undefined;

        if (result === undefined) {
            return { valid: false };
        } else {
            return { valid: true, user_id: result.user_id };
        }

    } catch (error) {
        console.error('Error validating session:', error);
        return { valid: false };
    }
}

function formatDateForSQLite(date: Date): string {
    return date.toISOString().replace('T', ' ').replace('Z', '');
}
```

# src/lib/server/db/search.ts

```ts
import { db } from './index';

interface SearchResult {
    content_id: number;
    rank: number;
}

export const search_content = (query: string, limit: number = 20): number[] => {
    // Prepare the SQL statement
    const stmt = db.prepare(`
    SELECT content_id, rank
    FROM content_fts
    WHERE content_fts MATCH ?
    ORDER BY rank
    LIMIT ?
  `);

    try {
        // Execute the query
        const results = stmt.all(query, limit) as SearchResult[];

        // Extract and return only the content_ids
        return results.map(result => result.content_id);
    } catch (error) {
        console.error('Error performing full-text search:', error);
        return [];
    }
};
```

# src/lib/server/db/schema.sql

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    github_id INTEGER UNIQUE,
    email TEXT,
    username TEXT UNIQUE,
    name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    twitter TEXT,
    role INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role) REFERENCES roles(id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS user_id_idx ON sessions(user_id);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    description TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('recipe', 'video', 'library', 'link', 'blog', 'collection')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived', 'pending_review')),
    body TEXT,
    rendered_body TEXT,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    metadata TEXT,
    children TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    likes INTEGER NOT NULL DEFAULT 0,
    saves INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS statusIdx ON content(status);

-- Content to Users junction table
CREATE TABLE IF NOT EXISTS content_to_users (
    content_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (content_id, user_id),
    FOREIGN KEY (content_id) REFERENCES content(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content to Tags junction table
CREATE TABLE IF NOT EXISTS content_to_tags (
    content_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (content_id, tag_id),
    FOREIGN KEY (content_id) REFERENCES content(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
CREATE INDEX IF NOT EXISTS tag_id_idx ON content_to_tags(tag_id);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    target_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (target_id) REFERENCES content(id)
);

-- Saves table
CREATE TABLE IF NOT EXISTS saves (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    target_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (target_id) REFERENCES content(id)
);

-- Full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS content_fts USING fts5(
  content_id UNINDEXED,
  title, 
  body, 
  description
);

-- Moderation queue table
CREATE TABLE IF NOT EXISTS moderation_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    data JSON NOT NULL,
    submitted_by INTEGER,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moderated_by INTEGER,
    moderated_at TIMESTAMP,
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (moderated_by) REFERENCES users(id)
);
```

# src/lib/server/db/role.ts

```ts
import { db } from "./index";

export type Role = {
    id: number;
    name: string;
    value: string;
    description: string;
    active: boolean | number;
};

export const get_roles = () => {
    const stmt = db.prepare('SELECT * FROM roles');
    return stmt.all() as Role[];
}

export const get_active_roles = () => {
    const stmt = db.prepare('SELECT * FROM roles WHERE active = 1');
    return stmt.all() as Role[];
}

export const get_role_by_id = (id: number) => {
    const stmt = db.prepare('SELECT * FROM roles WHERE id = ?');
    let role = stmt.get(id) as Role | undefined;
    return { ...role, active: role?.active === 1 ? true : false } as Role | undefined;
}

export const create_role = (role: Omit<Role, 'id'>) => {
    const stmt = db.prepare('INSERT INTO roles (name, value, description, active) VALUES (?, ?, ?, ?)');
    const info = stmt.run(role.name, role.value, role.description, role.active ? 1 : 0);
    return info.lastInsertRowid as number;
}

export const update_role = (role: Role) => {
    const stmt = db.prepare('UPDATE roles SET name = ?, value = ?, description = ?, active = ? WHERE id = ?');
    const info = stmt.run(role.name, role.value, role.description, role.active ? 1 : 0, role.id);
    return info.changes > 0;
}

export const delete_role = (id: number) => {
    const stmt = db.prepare('DELETE FROM roles WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
}
```

# src/lib/server/db/moderation.ts

```ts
import { db } from "./index";

export type ModerationQueueItem = {
    id: number;
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    data: string; // JSON string
    submitted_by: number;
    submitted_at: string;
    moderated_by: number | null;
    moderated_at: string | null;
};

export type PreviewModerationQueueItem = Omit<ModerationQueueItem, 'data'>;

export const get_moderation_queue = (status: 'pending' | 'approved' | 'rejected' = 'pending'): PreviewModerationQueueItem[] => {
    const stmt = db.prepare(`
        SELECT 
            id, 
            type, 
            status, 
            submitted_by, 
            submitted_at, 
            moderated_by, 
            moderated_at
        FROM moderation_queue
        WHERE status = ?
        ORDER BY submitted_at DESC
    `);
    return stmt.all(status) as PreviewModerationQueueItem[];
}

export const get_moderation_queue_item = (id: number): ModerationQueueItem | undefined => {
    const stmt = db.prepare(`
        SELECT *
        FROM moderation_queue
        WHERE id = ?
    `);
    return stmt.get(id) as ModerationQueueItem | undefined;
}

export const add_to_moderation_queue = (item: Omit<ModerationQueueItem, 'id' | 'status' | 'submitted_at' | 'moderated_by' | 'moderated_at'>): number => {
    const stmt = db.prepare(`
        INSERT INTO moderation_queue (type, status, data, submitted_by, submitted_at)
        VALUES (?, 'pending', ?, ?, CURRENT_TIMESTAMP)
    `);
    const result = stmt.run(item.type, item.data, item.submitted_by);
    return result.lastInsertRowid as number;
}

export const update_moderation_status = (id: number, status: 'approved' | 'rejected', moderated_by: number): boolean => {
    const stmt = db.prepare(`
        UPDATE moderation_queue
        SET status = ?, moderated_by = ?, moderated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `);
    const result = stmt.run(status, moderated_by, id);
    return result.changes > 0;
}

export const get_moderation_queue_count = (status: 'pending' | 'approved' | 'rejected' = 'pending'): number => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM moderation_queue WHERE status = ?');
    return (stmt.get(status) as { count: number }).count;
}

interface GetModerationQueueOptions {
    status?: 'pending' | 'approved' | 'rejected';
    type?: string;
    limit?: number;
    offset?: number;
}

export const get_moderation_queue_paginated = (options: GetModerationQueueOptions): PreviewModerationQueueItem[] => {
    const {
        status = 'pending',
        type,
        limit = 10,
        offset = 0
    } = options;

    let query = `
        SELECT 
            id, 
            type, 
            status, 
            submitted_by, 
            submitted_at, 
            moderated_by, 
            moderated_at
        FROM moderation_queue
        WHERE status = @status
    `;

    const params: any = { status, limit, offset };

    if (type) {
        query += " AND type = @type";
        params.type = type;
    }

    query += `
        ORDER BY submitted_at DESC
        LIMIT @limit OFFSET @offset
    `;

    const stmt = db.prepare(query);
    return stmt.all(params) as PreviewModerationQueueItem[];
}

export const get_moderation_queue_count_filtered = (params: Pick<GetModerationQueueOptions, 'status'>): number => {
    let query = `
        SELECT COUNT(*) as count
        FROM moderation_queue
        WHERE status = @status
    `;

    const stmt = db.prepare(query);
    return (stmt.get(params) as { count: number }).count;
}
```

# src/lib/server/db/migrations.ts

```ts
import { db } from './index'
import fs from 'fs'

export const run_migrations = async () => {
  console.log('Running migrations...')
  const schema = fs.readFileSync('./src/lib/server/db/schema.sql', 'utf8')
  console.log('Schema:', schema)
  db.exec(schema)
}

run_migrations()
```

# src/lib/server/db/interactions.ts

```ts
import { db } from './index';

export function get_user_likes_and_saves(user_id: number | undefined, content_ids: number[]): { user_likes: Set<number>, user_saves: Set<number> } {
    if (!user_id || content_ids.length === 0) {
        return { user_likes: new Set<number>(), user_saves: new Set<number>() };
    }

    const user_likes = new Set<number>();
    const user_saves = new Set<number>();

    const likeStmt = db.prepare('SELECT 1 FROM likes WHERE user_id = ? AND target_id = ?');
    const saveStmt = db.prepare('SELECT 1 FROM saves WHERE user_id = ? AND target_id = ?');

    db.transaction(() => {
        for (const content_id of content_ids) {
            if (likeStmt.get(user_id, content_id)) {
                user_likes.add(content_id);
            }
            if (saveStmt.get(user_id, content_id)) {
                user_saves.add(content_id);
            }
        }
    })();

    return { user_likes, user_saves };
}

type InteractionType = 'like' | 'save';

export function add_interaction(type: InteractionType, userId: number, contentId: number): void {
    const table = `${type}s`;
    const query = `INSERT OR IGNORE INTO ${table} (user_id, target_id, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)`;
    db.prepare(query).run(userId, contentId);
}

export function remove_interaction(type: InteractionType, userId: number, contentId: number): void {
    const table = `${type}s`;
    const query = `DELETE FROM ${table} WHERE user_id = ? AND target_id = ?`;
    db.prepare(query).run(userId, contentId);
}
```

# src/lib/server/db/index.ts

```ts
import Database from 'better-sqlite3';

export const db = new Database('local.db')
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
```

# src/lib/server/db/content.ts

```ts
import { db } from "./index";
import { type Tag } from "./tags";

interface GetContentParams {
    limit?: number;
    offset?: number;
    types?: string[];
}

type ContentInput = {
    title: string;
    type: string;
    status?: 'draft' | 'published' | 'archived';
    body?: string;
    rendered_body?: string;
    slug: string;
    description?: string;
    metadata?: Record<string, any>;
    children?: number[];
};

export type Content = {
    id: number;
    title: string;
    type: 'draft' | 'published' | 'archived';
    body: string;
    rendered_body: string;
    slug: string;
    description: string;
    children: string;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    likes: number;
    saves: number;
};

export type PreviewContent = Omit<Content, 'body' | 'rendered_body'>;

export const get_content = ({ limit = 15, offset = 0, types = [] }: GetContentParams = {}): PreviewContent[] => {
    let query = `
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves 
        FROM published_content
    `;

    const params: Record<string, any> = {
        "limit": limit,
        "offset": offset
    };

    if (types.length > 0) {
        query += " WHERE type IN (" + types.map((_, i) => `@type${i}`).join(", ") + ")";
        types.forEach((type, i) => {
            params[`@type${i}`] = type;
        });
    }

    query += " LIMIT @limit OFFSET @offset";

    const stmt = db.prepare(query);
    return stmt.all(params) as PreviewContent[];
};

export const get_all_content = (): PreviewContent[] => {
    const stmt = db.prepare(`
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves 
        FROM content
    `);
    return stmt.all() as PreviewContent[];
}

export const get_content_by_type = (type: string): PreviewContent[] => {
    const stmt = db.prepare(`
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves
        FROM published_content
        WHERE type = ?
    `);
    return stmt.all(type) as PreviewContent[];
}

export const get_content_by_slug = (slug: string): PreviewContent => {
    const stmt = db.prepare(`
        SELECT *
        FROM published_content
        WHERE slug = ?
    `);
    return stmt.get(slug) as PreviewContent;
}

export const get_content_count = () => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM content');
    return (stmt.get() as { count: number }).count;
}

export const get_tags_for_content = (content_ids: number[]): Tag[][] => {
    const stmt = db.prepare(`
        SELECT t.id, t.name, t.slug, t.color
        FROM content_to_tags ct
        JOIN tags t ON ct.tag_id = t.id
        WHERE ct.content_id = ?
      `);

    const getManyTags = db.transaction((ids: number[]) => {
        const results: Tag[][] = [];
        for (const id of ids) {
            const tags = stmt.all(id) as Tag[];
            results.push(tags);
        }
        return results;
    });

    return getManyTags(content_ids);
}

export const get_content_by_ids = (contentIds: number[]): PreviewContent[] => {
    if (contentIds.length === 0) {
        return [];
    }

    const placeholders = contentIds.map(() => '?').join(',');
    const stmt = db.prepare(`
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves 
        FROM published_content
        WHERE id IN (${placeholders})
    `);

    try {
        return stmt.all(...contentIds) as PreviewContent[];
    } catch (error) {
        console.error('Error fetching content:', error);
        return [];
    }
}

interface GetContentByTagOptions {
    slug: string;
    limit?: number;
    offset?: number;
}

export const get_content_by_tag = (options: GetContentByTagOptions): Content[] => {
    const {
        slug,
        limit = 10,
        offset = 0
    } = options;

    const query = `
        SELECT 
            c.id, 
            c.title, 
            c.type, 
            c.slug, 
            c.description, 
            c.children, 
            c.created_at, 
            c.updated_at, 
            c.published_at, 
            c.likes, 
            c.saves
      FROM published_content c
      JOIN content_to_tags ct ON c.id = ct.content_id
      JOIN tags t ON ct.tag_id = t.id
      WHERE t.slug = @slug
      ORDER BY c.published_at DESC
      LIMIT @limit OFFSET @offset
    `;

    const stmt = db.prepare(query);
    return stmt.all({ slug, limit, offset }) as Content[];
}

export const get_content_by_tag_count = (slug: string): number => {
    const queryCount = `
        SELECT COUNT(*) as count
        FROM published_content c
        JOIN content_to_tags ct ON c.id = ct.content_id
        JOIN tags t ON ct.tag_id = t.id
        WHERE t.slug = ?
    `;

    const stmtCount = db.prepare(queryCount);

    const { count } = stmtCount.get(slug) as { count: number };

    return count
}

interface GetSavedContentOptions {
    user_id: number;
    limit?: number;
    offset?: number;
}

export function get_user_saved_content(options: GetSavedContentOptions): Content[] {
    const {
        user_id,
        limit = 10,
        offset = 0
    } = options;

    const queryContent = `
        SELECT 
            c.id, 
            c.title, 
            c.type, 
            c.slug, 
            c.description, 
            c.children, 
            c.created_at, 
            c.updated_at, 
            c.published_at, 
            c.likes, 
            c.saves
      FROM published_content c
      JOIN saves s ON c.id = s.target_id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const stmtContent = db.prepare(queryContent);

    const content = stmtContent.all(user_id, limit, offset) as Content[];

    return content;
}

export const delete_content = (id: number): boolean => {
    const stmt = db.prepare(`
        DELETE FROM content
        WHERE id = ?
    `);

    try {
        const result = stmt.run(id);
        return result.changes > 0;
    } catch (error) {
        console.error('Error deleting content:', error);
        return false;
    }
}

export const create_content = (input: ContentInput): number | null => {
    const {
        title,
        type,
        status = 'draft',
        body = null,
        rendered_body = null,
        slug,
        description = null,
        metadata = null,
        children = null
    } = input;

    const stmt = db.prepare(`
        INSERT INTO content (
            title,
            type,
            status,
            body,
            rendered_body,
            slug,
            description,
            metadata,
            children,
            created_at,
            updated_at
        ) VALUES (
            @title,
            @type,
            @status,
            @body,
            @rendered_body,
            @slug,
            @description,
            @metadata,
            @children,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
    `);

    try {
        const result = stmt.run({
            title,
            type,
            status,
            body,
            rendered_body,
            slug,
            description,
            metadata: metadata ? JSON.stringify(metadata) : null,
            children: children ? JSON.stringify(children) : null
        });

        // Return the ID of the newly inserted content
        return result.lastInsertRowid as number;
    } catch (error) {
        console.error('Error creating content:', error);
        return null;
    }
}

export const get_content_by_id = (id: number): Content | null => {
    const stmt = db.prepare(`
        SELECT *
        FROM content
        WHERE id = ?
    `);

    try {
        const result = stmt.get(id) as (Omit<Content, 'children'> & { children: string }) | undefined;

        if (!result) {
            return null;
        }

        const children = result.children ? JSON.parse(result.children) : [];

        return {
            ...result,
            children: children.split(',').map((n: string) => parseInt(n))
        };
    } catch (error) {
        console.error('Error fetching content by id:', error);
        return null;
    }
};

export const update_content = (input: ContentInput & { id: number }): boolean => {
    const {
        id,
        title,
        type,
        status,
        body,
        rendered_body,
        slug,
        description,
        metadata,
        children
    } = input;

    const stmt = db.prepare(`
        UPDATE content
        SET
            title = @title,
            type = @type,
            status = @status,
            body = @body,
            rendered_body = @rendered_body,
            slug = @slug,
            description = @description,
            metadata = @metadata,
            children = @children,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
    `);

    try {
        const result = stmt.run({
            id,
            title,
            type,
            status,
            body,
            rendered_body,
            slug,
            description,
            metadata: metadata ? JSON.stringify(metadata) : null,
            children: children ? JSON.stringify(children) : null
        });

        return result.changes > 0;
    } catch (error) {
        console.error('Error updating content:', error);
        return false;
    }
};
```

# src/lib/server/db/collections.ts

```ts
import { db } from "./index";

export type Collection = {
    id: number;
    title: string;
    type: 'collection';
    description: string;
    children: string;
    created_at: string;
    updated_at: string;
    status: 'draft' | 'published';
    published_at: string | null;
    slug: string;
};

export const get_collections = (): Collection[] => {
    const stmt = db.prepare(`
        SELECT * FROM collections_view
    `);
    return stmt.all() as Collection[];
}
```

# src/lib/server/auth/index.ts

```ts
import { redirect } from '@sveltejs/kit'
import { GITHUB_AUTHORIZATION_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private'

const scope = 'user:email'

export const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_AUTHORIZATION_CALLBACK_URL}`

export const exchangeGitHubCodeForToken = async (code: string) => {
    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code
        })
    })

    const data = await response.json()
    return data
}

export const getGitHubUserInfo = async (accessToken: string) => {
    const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    const data = await response.json()
    return data
}
```

# src/routes/(admin)/admin/Table.svelte

```svelte
<script context="module">
	export interface Header {
		key: string;
		label: string;
		sticky?: 'left' | 'right';
	}

	export interface TableProps<T> {
		headers: Header[];
		items: T[];
		itemKey: keyof T;
		renderCell?: Snippet<[item: T, header: Header]>;
		renderActions?: Snippet<[item: T]>;
	}
</script>

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	let { headers, items, itemKey, renderCell, renderActions }: TableProps<any> = $props();
</script>

<div class="overflow-hidden rounded-lg bg-white shadow-sm">
	<div class="w-full overflow-x-auto">
		<table class="w-full text-left text-xs text-gray-500">
			<thead class="bg-gray-50 text-xs uppercase text-gray-700">
				<tr>
					{#each headers as header}
						<th
							scope="col"
							class="min-w-[80px] px-3 py-2 {header.sticky
								? `sticky ${header.sticky}-0 z-20 bg-gray-50`
								: ''}"
						>
							{header.label}
						</th>
					{/each}
					<th scope="col" class="sticky right-0 z-20 min-w-[70px] bg-gray-50 px-3 py-2">
						<span class="sr-only">Actions</span>
						<svg
							class="mx-auto h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							></path>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							></path>
						</svg>
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each items as item}
					<tr class="hover:bg-gray-50">
						{#each headers as header}
							<td
								class="px-3 py-2 {header.sticky ? `sticky ${header.sticky}-0 z-10 bg-white` : ''}"
							>
								{#if renderCell}
									{@render renderCell(item, header)}
								{:else}
									{item[header.key]}
								{/if}
							</td>
						{/each}
						<td class="sticky right-0 z-10 min-w-[70px] bg-white px-3 py-2">
							<div class="flex justify-center space-x-1">
								{#if renderActions}
									{@render renderActions(item)}
								{:else}
									<form action="?/delete" method="POST" use:enhance>
										<input type="hidden" name="id" value={item[itemKey]} />
										<button
											type="submit"
											class="text-red-600 hover:text-red-900"
											aria-label="Delete item"
										>
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												></path>
											</svg>
										</button>
									</form>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

```

# src/routes/(admin)/admin/Header.svelte

```svelte
<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	interface Props {
		title: string;
		buttonText: string;
		buttonHref: string;
	}

	let { title, buttonText, buttonHref }: Props = $props();
</script>

<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
	<h1 class="text-xl font-bold">{title}</h1>
	<Button small primary icon_left="plus" href={buttonHref}>{buttonText}</Button>
</div>

```

# src/routes/(admin)/admin/+page.svelte

```svelte
<script>
	let { data } = $props();
</script>

<h1 class="mb-6 text-3xl font-bold text-gray-800">Dashboard</h1>
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
	<!-- Existing cards -->
	<div class="rounded-lg bg-white p-6 shadow-md">
		<h3 class="mb-4 text-xl font-semibold text-gray-800">User Statistics</h3>
		<div class="text-4xl font-bold text-blue-600">{data.users}</div>
		<p class="text-gray-600">Total Users</p>
	</div>
	<div class="rounded-lg bg-white p-6 shadow-md">
		<h3 class="mb-4 text-xl font-semibold text-gray-800">Content Statistics</h3>
		<div class="text-4xl font-bold text-green-600">{data.content}</div>
		<p class="text-gray-600">Total Content</p>
	</div>

	<!-- Content Metrics Card -->
	<div class="rounded-lg bg-white p-6 shadow-md">
		<h3 class="mb-4 text-xl font-semibold text-gray-800">Content Metrics</h3>
		<ul class="space-y-2">
			<li class="flex justify-between">
				<span class="text-gray-600">Total posts:</span>
				<span class="font-semibold text-gray-800">10,000</span>
			</li>
			<li class="flex justify-between">
				<span class="text-gray-600">Posts per day:</span>
				<span class="font-semibold text-gray-800">250</span>
			</li>
			<li class="flex justify-between">
				<span class="text-gray-600">Comments per day:</span>
				<span class="font-semibold text-gray-800">1,500</span>
			</li>
			<li class="flex justify-between">
				<span class="text-gray-600">Popular posts:</span>
				<a href="/admin" class="font-semibold text-blue-600 hover:underline">View top 10</a>
			</li>
			<li class="flex justify-between">
				<span class="text-gray-600">Categories:</span>
				<a href="/admin" class="font-semibold text-blue-600 hover:underline">View chart</a>
			</li>
		</ul>
	</div>

	<!-- Moderation Queue Card -->
	<div class="rounded-lg bg-white p-6 shadow-md">
		<h3 class="mb-4 text-xl font-semibold text-gray-800">Moderation Queue</h3>
		<ul class="space-y-2">
			<li class="flex justify-between">
				<span class="text-gray-600">Awaiting moderation:</span>
				<span class="font-semibold text-gray-800">{data.moderation_queue}</span>
			</li>
			<li class="flex justify-end">
				<a href="/admin/moderation" class="font-semibold text-blue-600 hover:underline">View list</a
				>
			</li>
		</ul>
	</div>
</div>

```

# src/routes/(admin)/admin/+page.server.ts

```ts
import { get_user_count } from '$lib/server/db/user';
import { get_content_count } from '$lib/server/db/content';
import { get_moderation_queue_count } from '$lib/server/db/moderation';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const users = get_user_count()
	const content = get_content_count();
	const moderation_queue = get_moderation_queue_count();

	return {
		users,
		content,
		moderation_queue
	};
}) satisfies PageServerLoad;

```

# src/routes/(admin)/admin/+layout.svelte

```svelte
<script lang="ts">
	let { data, children } = $props();
</script>

<div class="flex h-screen bg-gray-100">
	<!-- Sidebar -->
	<div class="w-64 bg-white shadow-md">
		<div class="p-4">
			<h2 class="mb-4 text-xl font-bold text-gray-800">Admin Panel</h2>
			<nav>
				<ul class="space-y-2">
					<li>
						<a
							href="/admin"
							class="flex items-center justify-between rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
						>
							<div class="flex items-center">
								<svg
									class="mr-2 h-6 w-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 6h16M4 12h16M4 18h16"
									></path>
								</svg>
								Dashboard
							</div>
						</a>
					</li>
					<li>
						<a
							href="/admin/users"
							class="flex items-center justify-between rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
						>
							<div class="flex items-center">
								<svg
									class="mr-2 h-6 w-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									></path>
								</svg>
								Users
							</div>
						</a>
					</li>
					<li>
						<a
							href="/admin/roles"
							class="flex items-center justify-between rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
						>
							<div class="flex items-center">
								<svg
									class="mr-2 h-6 w-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
									></path>
								</svg>
								Roles
							</div>
						</a>
					</li>
					<li>
						<a
							href="/admin/content"
							class="flex items-center justify-between rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
						>
							<div class="flex items-center">
								<svg
									class="mr-2 h-6 w-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
									></path>
								</svg>
								Content
							</div>
						</a>
					</li>
					<li>
						<a
							href="/admin/collections"
							class="flex items-center justify-between rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
						>
							<div class="flex items-center">
								<svg
									class="mr-2 h-6 w-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									></path>
								</svg>
								Collections
							</div>
						</a>
					</li>
					<li>
						<a
							href="/admin/moderation"
							class="flex items-center justify-between rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
						>
							<div class="flex items-center">
								<svg
									class="mr-2 h-6 w-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
									></path>
								</svg>
								Moderation
							</div>
							{#if data.moderation_count > 0}
								<span
									class="inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-red-100"
								>
									{data.moderation_count}
								</span>
							{/if}
						</a>
					</li>
				</ul>
			</nav>
		</div>
		<div class="absolute bottom-0 w-64 border-t border-gray-200 p-4">
			<a
				href="/"
				class="flex items-center rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
			>
				<svg
					class="mr-2 h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					></path>
				</svg>
				Back to Home
			</a>
		</div>
	</div>
	<!-- Main content -->
	<div class="flex-1 overflow-y-auto">
		<div class="p-8">
			{@render children()}
		</div>
	</div>
</div>

```

# src/routes/(admin)/admin/+layout.server.ts

```ts
import { get_moderation_queue_count_filtered } from '$lib/server/db/moderation';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    const moderation_count = get_moderation_queue_count_filtered({ status: 'pending' });

    return {
        moderation_count
    };
};
```

# src/routes/(app)/(public)/+page.svelte

```svelte
<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';

	let { data } = $props();
</script>

<div class="grid gap-6">
	{#if data.search_results}
		<h1>Searched for: {data.search_results.query}</h1>
		{#if data.search_results.error}
			<p>{data.search_results.error}</p>
		{:else}
			{#each data.search_results.content as item}
				<ContentCard {...item} body={null} author="John Doe" views="11114" />
			{/each}
		{/if}
	{:else}
		{#each data.content as item}
			<ContentCard {...item} body={null} author="John Doe" views="11114" />
		{/each}
	{/if}

	{#if data?.totalPages > 1}
		<Pagination totalPages={data.totalPages} />
	{/if}
</div>

```

# src/routes/(app)/(public)/+page.server.ts

```ts
import type { PageServerLoad } from './$types';
import { get_content, get_content_count, get_tags_for_content } from '$lib/server/db/content';
import { get_user_likes_and_saves, add_interaction, remove_interaction } from '$lib/server/db/interactions';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, fetch, locals }) => {
    const searchQuery = url.searchParams.get('search');
    let page = url.searchParams.get('page')

    if (searchQuery) {
        const resp = await fetch(`/search/${searchQuery}`)
        const content = await resp.json()

        return {
            search_results: {
                content,
                count: content.length,
                query: searchQuery
            }
        }
    } else {
        const content = get_content()
        const tags = get_tags_for_content(content.map(c => c.id))
        let content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }))

        if (locals.user) {
            const { user_likes, user_saves } = get_user_likes_and_saves(locals.user.id, content.map(c => c.id))

            content_with_tags = content_with_tags.map((c, i) => ({
                ...c,
                liked: user_likes.has(c.id),
                saved: user_saves.has(c.id)
            }))
        }

        return {
            content: content_with_tags,
            count: 0
        }
    }
};

export const actions = {
    interact: async ({ request, locals }) => {
        if (!locals.user) return;
        const data = await request.formData();
        const type = data.get('type') as 'like' | 'save';
        const contentId = Number(data.get('id'));
        const action = data.get('action') as 'add' | 'remove';

        if (!['like', 'save'].includes(type) || !['add', 'remove'].includes(action) || isNaN(contentId)) {
            return fail(400, { message: 'Invalid input' });
        }

        try {
            if (action === 'add') {
                add_interaction(type, locals.user.id, contentId);
            } else {
                remove_interaction(type, locals.user.id, contentId);
            }
            return { success: true };
        } catch (error) {
            return fail(500, { message: 'Server error' });
        }
    }
};
```

# src/routes/(app)/(public)/+layout.svelte

```svelte
<script lang="ts">
	let { data, children } = $props();

	import LeftSidebar from './_components/LeftSidebar.svelte';
	import RightSidebar from './_components/RightSidebar.svelte';
	import Breadcrumb from '$lib/ui/Breadcrumb.svelte';
</script>

<LeftSidebar />

<main class="flex-1 px-4 py-8">
	<Breadcrumb />
	{@render children()}
</main>

<RightSidebar tags={data.tags || []} />

```

# src/routes/(app)/(public)/+layout.server.ts

```ts
import { get_tags } from '$lib/server/db/tags';

import { fail } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
    const result = get_tags()

    if (!result) {
        fail(400, { message: 'Error getting roles' });
    }

    return {
        tags: result
    }
})
```

# src/lib/ui/form/Select.svelte

```svelte
<script lang="ts">
	type SelectOption = {
		value: string;
		label: string;
	};
	interface SelectProps {
		label?: string;
		value: string;
		description?: string;
		error?: string;
		initial?: string;
		placeholder?: string;
		options: SelectOption[];
		name: string;
		disabled?: boolean;
	}

	let {
		name,
		value = $bindable(),
		label,
		description,
		placeholder = 'Select an option...',
		error,
		initial = '',
		options = []
	}: SelectProps = $props();
	let selectedValue = $state(initial);
</script>

<div class="flex flex-col gap-1">
	{#if label}
		<label class="text-xs font-medium text-slate-800 outline-none" for={name}>{label}</label>
	{/if}
	<div class="relative">
		<select
			bind:value={selectedValue}
			{name}
			class="w-full appearance-none rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 pr-8 text-sm text-slate-800"
			class:error={false}
		>
			<option value="" disabled selected hidden>{placeholder}</option>
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
		<div
			class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700"
		>
			<svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
				<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
			</svg>
		</div>
	</div>
	{#if error || description}
		<div class="text-xs text-slate-500" class:error={false}>
			{error || description}
		</div>
	{/if}
</div>

<style lang="postcss">
	select.error {
		@apply border-red-300 bg-red-50 text-red-600;
	}
	div .error {
		@apply text-red-600;
	}
	select:disabled {
		@apply cursor-not-allowed text-gray-400;
	}
</style>

```

# src/lib/ui/form/Input.svelte

```svelte
<script lang="ts">
	interface TextInputProps {
		label?: string;
		value?: string;
		description?: string;
		errors?: string[];
		initial?: string;
		placeholder?: string;
		name: string;
		constraints?: any;
		disabled?: boolean;
		type: string;
	}
	let {
		name,
		value = $bindable(''),
		label,
		description,
		placeholder = 'Some text...',
		constraints,
		errors,
		disabled,
		type = 'text'
	}: TextInputProps = $props();
	let inputElement: HTMLInputElement;

	let showClearButton = $derived(value.length > 0);

	function clearText() {
		value = '';
		inputElement.focus();
	}
</script>

<div class="flex flex-col gap-1">
	{#if label}
		<label class="text-xs font-medium text-slate-800 outline-none" for={name}>{label}</label>
	{/if}
	<div class="relative">
		<input
			{type}
			bind:this={inputElement}
			aria-invalid={errors ? 'true' : undefined}
			{disabled}
			bind:value
			{placeholder}
			class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 pr-7 text-sm text-slate-800 placeholder-slate-500"
			{name}
			{...constraints}
			class:error={errors}
		/>
		{#if showClearButton && !disabled}
			<button
				type="button"
				class="absolute right-2.5 top-1/2 -translate-y-1/2"
				onclick={clearText}
				aria-label="Clear input"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Clear text</title>
					<g clip-path="url(#clip0_426_221)">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M1.00538 1.02734C1.16911 0.864159 1.39107 0.772501 1.62248 0.772501C1.85389 0.772501 2.07583 0.864159 2.23957 1.02734L5.98872 4.76845L9.73786 1.02734C9.81785 0.941723 9.91426 0.873058 10.0214 0.825435C10.1285 0.777811 10.2441 0.752204 10.3614 0.750136C10.4786 0.748068 10.595 0.769597 10.7038 0.813421C10.8125 0.857246 10.9113 0.922471 10.9942 1.00522C11.0772 1.08796 11.1425 1.18653 11.1864 1.29503C11.2303 1.40353 11.252 1.51975 11.2499 1.63674C11.2478 1.75375 11.2221 1.86913 11.1744 1.97602C11.1267 2.08291 11.0579 2.17911 10.9721 2.25888L7.22291 5.99999L10.9721 9.7411C11.0579 9.82092 11.1267 9.91712 11.1744 10.024C11.2221 10.1309 11.2478 10.2463 11.2499 10.3633C11.252 10.4803 11.2303 10.5964 11.1864 10.705C11.1425 10.8135 11.0772 10.912 10.9942 10.9947C10.9113 11.0776 10.8125 11.1427 10.7038 11.1865C10.595 11.2303 10.4786 11.252 10.3614 11.2499C10.2441 11.2478 10.1285 11.2222 10.0214 11.1746C9.91426 11.1269 9.81785 11.0583 9.73786 10.9726L5.98872 7.23154L2.23957 10.9726C2.07403 11.1266 1.85508 11.2104 1.62885 11.2064C1.40262 11.2023 1.18678 11.1109 1.02677 10.9513C0.866782 10.7916 0.775138 10.5762 0.771144 10.3505C0.767151 10.1247 0.851134 9.90631 1.00538 9.7411L4.75453 5.99999L1.00538 2.25888C0.841854 2.09551 0.75 1.87403 0.75 1.64311C0.75 1.4122 0.841854 1.19073 1.00538 1.02734Z"
							fill="#94A3B8"
						/>
					</g>
					<defs>
						<clipPath id="clip0_426_221">
							<rect width="12" height="12" fill="white" />
						</clipPath>
					</defs>
				</svg>
			</button>
		{/if}
	</div>
	{#if errors}
		<div class="text-xs text-slate-500" class:error={errors}>
			{errors}
		</div>
	{:else if description}
		<div class="text-xs text-slate-500" class:error={false}>
			{description}
		</div>
	{/if}
</div>

<style lang="postcss">
	input.error {
		@apply border-red-300 bg-red-50 text-red-600;
	}
	div .error {
		@apply text-red-600;
	}
</style>

```

# src/routes/(app)/(account)/account/+page.svelte

```svelte
<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	let { data } = $props();
</script>

<main class="flex-1 px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold">My Account</h1>
	<div class="overflow-hidden rounded-lg bg-white shadow-lg">
		<div class="px-4 py-5 sm:p-6">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-bold text-gray-900">Profile</h2>
				<button
					class="focus-visible:ring-ring ring-offset-background inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				>
					Edit Profile
				</button>
			</div>

			<div class="mb-8 flex flex-col items-center sm:flex-row sm:space-x-6">
				<div class="mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-200 sm:mb-0">
					<img src={data.user.avatar_url} alt="User avatar" class="h-full w-full object-cover" />
				</div>
				<div class="text-center sm:text-left">
					<h3 class="text-xl font-semibold text-gray-900">
						{data.user.name || data.user.username}
					</h3>
					<p class="text-sm text-gray-500">@{data.user.username}</p>
					<p class="mt-2 text-sm text-gray-600">{data.user.bio}</p>
				</div>
			</div>

			<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-sm font-medium text-gray-500">Location</dt>
					<dd class="mt-1 text-lg font-semibold text-gray-900">
						{data.user.location || 'Not specified'}
					</dd>
				</div>
				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-sm font-medium text-gray-500">Twitter</dt>
					<dd class="mt-1 text-lg font-semibold text-gray-900">
						{#if data.user.twitter}
							<a
								href="https://twitter.com/{data.user.twitter}"
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-600 hover:underline"
							>
								@{data.user.twitter}
							</a>
						{:else}
							Not linked
						{/if}
					</dd>
				</div>
				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-sm font-medium text-gray-500">Joined</dt>
					<dd class="mt-1 text-lg font-semibold text-gray-900">
						{new Date(data.user.created_at).toLocaleDateString()}
					</dd>
				</div>
				<div class="rounded-lg bg-gray-50 p-4">
					<dt class="text-sm font-medium text-gray-500">Role</dt>
					<dd class="mt-1 text-lg font-semibold text-gray-900">
						<span
							class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
						>
							Member
						</span>
					</dd>
				</div>
			</div>

			<div>
				<h4 class="mb-4 text-lg font-semibold text-gray-900">Stats</h4>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div class="rounded-lg bg-gray-50 p-4">
						<dt class="text-sm font-medium text-gray-500">Total Posts</dt>
						<dd class="mt-1 text-3xl font-semibold text-gray-900">
							{data.user.authoredContents?.length || 0}
						</dd>
						<div class="mt-2 h-2.5 w-full rounded-full bg-gray-200">
							<div
								class="h-2.5 rounded-full bg-blue-600"
								style="width: {Math.min(
									((data.user.authoredContents?.length || 0) / 100) * 100,
									100
								)}%"
							></div>
						</div>
					</div>
					<div class="rounded-lg bg-gray-50 p-4">
						<dt class="text-sm font-medium text-gray-500">Collections</dt>
						<dd class="mt-1 text-3xl font-semibold text-gray-900">
							{data.user.authoredCollections?.length || 0}
						</dd>
						<div class="mt-2 h-2.5 w-full rounded-full bg-gray-200">
							<div
								class="h-2.5 rounded-full bg-green-600"
								style="width: {Math.min(
									((data.user.authoredCollections?.length || 0) / 20) * 100,
									100
								)}%"
							></div>
						</div>
					</div>
					<div class="rounded-lg bg-gray-50 p-4">
						<dt class="text-sm font-medium text-gray-500">Likes Given</dt>
						<dd class="mt-1 text-3xl font-semibold text-gray-900">
							{data.user.likes?.length || 0}
						</dd>
						<div class="mt-2 h-2.5 w-full rounded-full bg-gray-200">
							<div
								class="h-2.5 rounded-full bg-purple-600"
								style="width: {Math.min(((data.user.likes?.length || 0) / 500) * 100, 100)}%"
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<section class="mt-12">
		<h2 class="mb-4 text-xl font-semibold">My Posts</h2>
		<div class="space-y-6">
			{#each data.user.authoredContents || [] as post}
				<article class="grid gap-2 rounded-lg bg-zinc-50 p-5">
					<div class="mb-2 grid grid-cols-[1fr_auto] items-start justify-between text-xs">
						<div class="flex">
							<span class="font-semibold capitalize">post</span>
							<span class="flex text-gray-500">
								<span
									>by {data.user.name || data.user.username} • {new Date(
										post.created_at
									).toLocaleDateString()} •&nbsp;</span
								>
								<span class="flex items-center gap-1">
									{post.views || 0}
									<svg
										width="12"
										height="12"
										viewBox="0 0 12 12"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>views</title>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M1.25937 5.94874C1.56882 5.48321 2.19069 4.63614 3.03377 3.91108C3.882 3.18157 4.89578 2.625 6.00025 2.625C7.10472 2.625 8.11854 3.18157 8.96672 3.91108C9.80979 4.63614 10.4317 5.48321 10.7411 5.94874C10.7627 5.98125 10.7627 6.01875 10.7411 6.05126C10.4317 6.51679 9.80979 7.36386 8.96672 8.0889C8.11854 8.81843 7.10472 9.375 6.00025 9.375C4.89578 9.375 3.882 8.81843 3.03377 8.0889C2.19069 7.36386 1.56882 6.51679 1.25937 6.05126C1.23776 6.01875 1.23776 5.98125 1.25937 5.94874ZM6.00025 1.5C4.51423 1.5 3.24714 2.24375 2.30021 3.05813C1.34813 3.87695 0.660585 4.8173 0.32247 5.32597C0.0500614 5.73578 0.0500625 6.26422 0.32247 6.67403C0.660585 7.1827 1.34813 8.12302 2.30021 8.94187C3.24714 9.75622 4.51423 10.5 6.00025 10.5C7.48627 10.5 8.75334 9.75622 9.70029 8.94187C10.6523 8.12302 11.3399 7.1827 11.678 6.67403C11.9504 6.26422 11.9504 5.73578 11.678 5.32597C11.3399 4.8173 10.6523 3.87695 9.70029 3.05813C8.75334 2.24375 7.48627 1.5 6.00025 1.5ZM6.00024 7.5C6.82867 7.5 7.50024 6.82843 7.50024 6C7.50024 5.17157 6.82867 4.5 6.00024 4.5C5.17182 4.5 4.50024 5.17157 4.50024 6C4.50024 6.82843 5.17182 7.5 6.00024 7.5Z"
											fill="#64748B"
										></path>
									</svg>
								</span>
							</span>
						</div>
						<div class="flex items-center space-x-4">
							<button
								class="-mx-2 -my-1 flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
								aria-label="Like post"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 12 12"
									xmlns="http://www.w3.org/2000/svg"
									class="mr-0.5"
								>
									<title>Like</title>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M6.62532 0.049567C5.62075 -0.0649162 4.87498 0.78591 4.87498 1.68679V2.06223C4.87498 3.05844 4.38994 3.6545 3.88685 4.02214C3.64068 4.20203 3.39161 4.32474 3.19794 4.40354C2.97064 4.01263 2.54726 3.74982 2.0625 3.74982H1.3125C0.587626 3.74982 0 4.33745 0 5.06232V10.6874C0 11.4122 0.587626 11.9999 1.3125 11.9999H2.0625C2.64352 11.9999 3.13637 11.6223 3.3091 11.0991C3.70246 11.1553 4.10958 11.2706 4.60301 11.4104L4.60316 11.4104C4.71683 11.4426 4.83508 11.4761 4.95881 11.5105C5.82428 11.7509 6.86444 11.9997 8.25 11.9997C9.52927 11.9997 10.4772 11.8855 11.0411 11.1453C11.306 10.7978 11.4439 10.3638 11.5427 9.89123C11.6307 9.47055 11.6986 8.95845 11.7771 8.3661L11.8075 8.1366C11.9944 6.73531 12.0063 5.64813 11.6661 4.89976C11.4831 4.49729 11.1996 4.1928 10.8137 3.99965C10.443 3.81409 10.0148 3.74973 9.5625 3.74973H8.49578L8.50702 3.66548V3.66547C8.5593 3.2768 8.625 2.78842 8.625 2.43723C8.625 1.74608 8.51153 1.14827 8.1333 0.71266C7.74983 0.270907 7.1979 0.114819 6.62532 0.049567Z"
										fill="currentColor"
									></path>
								</svg>
								{post.likes}
							</button>
							<button
								class="-mx-2 -my-1 flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
								aria-label="Save post"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 12 12"
									xmlns="http://www.w3.org/2000/svg"
									class="mr-0.5"
								>
									<title>Save</title>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M3.5625 1.875C3.45895 1.875 3.375 1.95895 3.375 2.0625V9.4956L5.64242 7.62832C5.85012 7.45723 6.14988 7.45723 6.35758 7.62832L8.625 9.4956V2.0625C8.625 1.95895 8.54108 1.875 8.4375 1.875H3.5625ZM2.25 2.0625C2.25 1.33763 2.83763 0.75 3.5625 0.75H8.4375C9.16237 0.75 9.75 1.33763 9.75 2.0625V10.6875C9.75 10.9052 9.62445 11.1033 9.42758 11.1962C9.2307 11.2891 8.99797 11.26 8.8299 11.1217L6 8.7912L3.17008 11.1217C3.00206 11.26 2.76928 11.2891 2.57243 11.1962C2.37558 11.1033 2.25 10.9052 2.25 10.6875V2.0625Z"
										fill="currentColor"
									></path>
								</svg>
								{post.saves}
							</button>
						</div>
					</div>
					<h2 class="mb-2 text-xl font-bold">
						<a href="/post/{post.id}">{post.title}</a>
					</h2>
					<p>{post.description}</p>
					<div class="mt-4 grid grid-cols-[1fr_auto] items-start justify-between">
						<div class="flex space-x-2">
							<div class="flex flex-wrap gap-2">
								{#each post.tags || [] as tag}
									<a
										href="/tags/{tag}"
										class="bg-svelte-100 border-svelte-100 text-svelte-900 flex items-center gap-0.5 rounded border-2 px-1 py-0.5 text-xs"
									>
										#{tag}
									</a>
								{/each}
							</div>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>
</main>

```

# src/lib/server/db/views/content.sql

```sql
-- View for published content
CREATE VIEW published_content AS
SELECT *
FROM content
WHERE status = 'published';

-- View for draft content
CREATE VIEW draft_content AS
SELECT *
FROM content
WHERE status = 'draft';

-- View for archived content
CREATE VIEW archived_content AS
SELECT *
FROM content
WHERE status = 'archived';
```

# src/lib/server/db/views/collections.sql

```sql
CREATE VIEW collections_view AS
SELECT *
FROM content
WHERE type = 'collection';
```

# src/lib/server/db/triggers/search.sql

```sql
CREATE TRIGGER IF NOT EXISTS content_ai AFTER INSERT ON content BEGIN
  INSERT INTO content_fts(content_id, title, body, description)
  VALUES (NEW.id, NEW.title, NEW.body, NEW.description);
END;

CREATE TRIGGER IF NOT EXISTS content_au AFTER UPDATE ON content BEGIN
  UPDATE content_fts
  SET title = NEW.title,
      body = NEW.body,
      description = NEW.description
  WHERE content_id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS content_ad AFTER DELETE ON content BEGIN
  DELETE FROM content_fts WHERE content_id = OLD.id;
END;
```

# src/lib/server/db/triggers/move_from_moderation_queue.sql

```sql
-- Trigger to move moderated_queue item to content when approved
CREATE TRIGGER IF NOT EXISTS approve_content
AFTER UPDATE ON moderation_queue
WHEN NEW.status = 'approved' AND NEW.type = 'content'
BEGIN
  INSERT INTO content (title, type, body, slug, description, status, created_at, updated_at)
  SELECT 
    json_extract(NEW.data, '$.title'),
    json_extract(NEW.data, '$.type'),
    json_extract(NEW.data, '$.body'),
    lower(replace(json_extract(NEW.data, '$.title'), ' ', '-')),
    json_extract(NEW.data, '$.description'),
    'draft',
    NEW.submitted_at,
    NEW.moderated_at;

  -- Handle tags
  INSERT OR IGNORE INTO content_to_tags (content_id, tag_id)
  SELECT last_insert_rowid(), tags.id
  FROM json_each(json_extract(NEW.data, '$.tags')) as t
  JOIN tags ON tags.slug = t.value;
END;
```

# src/lib/server/db/triggers/interactions.sql

```sql
CREATE TRIGGER IF NOT EXISTS increment_likes
AFTER INSERT ON likes
BEGIN
  UPDATE content SET likes = likes + 1 WHERE id = NEW.target_id;
END;

CREATE TRIGGER IF NOT EXISTS decrement_likes
AFTER DELETE ON likes
BEGIN
  UPDATE content SET likes = likes - 1 WHERE id = OLD.target_id;
END;

CREATE TRIGGER IF NOT EXISTS increment_saves
AFTER INSERT ON saves
BEGIN
  UPDATE content SET saves = saves + 1 WHERE id = NEW.target_id;
END;

CREATE TRIGGER IF NOT EXISTS decrement_saves
AFTER DELETE ON saves
BEGIN
  UPDATE content SET saves = saves - 1 WHERE id = OLD.target_id;
END;
```

# src/lib/server/db/triggers/content.sql

```sql
-- Trigger to delete related entries in content_to_tags
CREATE TRIGGER IF NOT EXISTS delete_content_tags
BEFORE DELETE ON content
FOR EACH ROW
BEGIN
    DELETE FROM content_to_tags WHERE content_id = OLD.id;
END;

-- Trigger to delete related entries in content_to_users
CREATE TRIGGER IF NOT EXISTS delete_content_users
BEFORE DELETE ON content
FOR EACH ROW
BEGIN
    DELETE FROM content_to_users WHERE content_id = OLD.id;
END;

-- Trigger to delete related entries in likes
CREATE TRIGGER IF NOT EXISTS delete_content_likes
BEFORE DELETE ON content
FOR EACH ROW
BEGIN
    DELETE FROM likes WHERE target_id = OLD.id;
END;

-- Trigger to delete related entries in saves
CREATE TRIGGER IF NOT EXISTS delete_content_saves
BEFORE DELETE ON content
FOR EACH ROW
BEGIN
    DELETE FROM saves WHERE target_id = OLD.id;
END;
```

# src/lib/server/db/seeds/seed_users.ts

```ts
export function seedUsers(db) {
    const findAdminRoleStmt = db.prepare(`
      SELECT id FROM roles WHERE name = ?
    `);

    const insertUserStmt = db.prepare(`
      INSERT INTO users (id, github_id, email, username, name, avatar_url, bio, location, twitter, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
        const adminRole = findAdminRoleStmt.get('Admin');
        if (!adminRole) {
            throw new Error('Admin role not found. Make sure to run seedRoles first.');
        }

        insertUserStmt.run(
            1,
            534488,
            null,
            'kevmodrome',
            'Kevin Åberg Kultalahti',
            'https://avatars.githubusercontent.com/u/534488?v=4',
            'Technical Community Builder at Svelte Society, Organizer of Svelte Summit.',
            'Sweden',
            'kevmodrome',
            adminRole.id,
            new Date(1721331895712).toISOString()
        );

        console.log('Users seeded successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
}
```

# src/lib/server/db/seeds/seed_tags.ts

```ts
export function seedTags(db) {
    const insertTagStmt = db.prepare(`
    INSERT INTO tags (name, slug, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `);

    const tags = [
        { name: 'Svelte5', slug: 'svelte-5' },
        { name: 'Runes', slug: 'runes' },
        { name: 'Utility', slug: 'utility' },
        { name: 'Snippet', slug: 'snippet' }
    ];

    const insertTagsTransaction = db.transaction((tags) => {
        for (const tag of tags) {
            const now = new Date().toISOString();
            insertTagStmt.run(tag.name, tag.slug, now, now);
        }
    });

    try {
        insertTagsTransaction(tags);
        console.log('Tags inserted successfully');
    } catch (error) {
        console.error('Error inserting tags:', error);
    }
}
```

# src/lib/server/db/seeds/seed_roles.ts

```ts
export function seedRoles(db) {
    const insertRoleStmt = db.prepare(`
      INSERT INTO roles (name, value, description, active, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const roles = [
        {
            name: 'Admin',
            value: 'admin',
            description: 'Administrator role with full access',
            active: true,
        },
        {
            name: 'User',
            value: 'user',
            description: 'Standard user role with limited access',
            active: true,
        },
    ];

    const insertRolesTransaction = db.transaction((roles) => {
        for (const role of roles) {
            const now = new Date().toISOString();
            insertRoleStmt.run(
                role.name,
                role.value,
                role.description,
                role.active ? 1 : 0,
                now
            );
        }
    });

    try {
        insertRolesTransaction(roles);
        console.log('Roles seeded successfully');
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
}
```

# src/lib/server/db/seeds/seed_moderation_queue.ts

```ts
export function seedModerationQueue(db) {
    const insertModerationItemStmt = db.prepare(`
        INSERT INTO moderation_queue (type, status, data, submitted_by, submitted_at)
        VALUES (?, ?, ?, ?, ?)
    `);

    const moderationItems = [
        {
            type: 'content',
            status: 'pending',
            data: JSON.stringify({
                title: 'Svelte 5 Runes Tutorial',
                body: 'This tutorial covers the new runes feature in Svelte 5...',
                type: 'recipe'
            }),
            submitted_by: 1
        },
        {
            type: 'content',
            status: 'pending',
            data: JSON.stringify({
                title: 'Utility Functions for SvelteKit',
                body: 'A collection of useful utility functions for SvelteKit projects...',
                type: 'recipe'
            }),
            submitted_by: 1
        },
        {
            type: 'content',
            status: 'pending',
            data: JSON.stringify({
                title: 'Building a Blog with SvelteKit',
                body: 'Step-by-step guide to creating a blog using SvelteKit...',
                type: 'recipe'
            }),
            submitted_by: 1
        }
    ];

    const insertModerationItemsTransaction = db.transaction((items: typeof moderationItems) => {
        for (const item of items) {
            const now = new Date().toISOString();
            insertModerationItemStmt.run(
                item.type,
                item.status,
                item.data,
                item.submitted_by,
                now
            );
        }
    });

    try {
        insertModerationItemsTransaction(moderationItems);
        console.log('Moderation queue items inserted successfully');
    } catch (error) {
        console.error('Error inserting moderation queue items:', error);
    }
}
```

# src/lib/server/db/seeds/seed_interactions.ts

```ts
export function seedInteractions(db) {
    // Prepare statements
    const insertLikeStmt = db.prepare('INSERT INTO likes (user_id, target_id, created_at) VALUES (?, ?, ?)');
    const insertSaveStmt = db.prepare('INSERT INTO saves (user_id, target_id, created_at) VALUES (?, ?, ?)');

    // Get the first user's ID (assuming we have at least one user)
    const user = db.prepare('SELECT id FROM users LIMIT 1').get() as { id: number } | undefined;

    if (!user) {
        console.error('No users found in the database. Please seed users first.');
        return;
    }

    // Get the first two content pieces (assuming we have at least two)
    const contentItems = db.prepare('SELECT id FROM content LIMIT 2').all() as { id: number }[];

    if (contentItems.length < 2) {
        console.error('Not enough content items found. Please seed content first.');
        return;
    }

    const now = new Date().toISOString();

    // Seed likes and saves
    const seedInteractions = db.transaction(() => {
        // Add a like to the first content piece
        insertLikeStmt.run(user.id, contentItems[0].id, now);

        // Add a like to the second content piece
        insertLikeStmt.run(user.id, contentItems[1].id, now);

        // Save the first content piece
        insertSaveStmt.run(user.id, contentItems[0].id, now);
    });

    // Run the seeding
    try {
        seedInteractions();
        console.log('Likes and saves seeded successfully.');
    } catch (error) {
        console.error('Error seeding likes and saves:', error);
    }
}
```

# src/lib/server/db/seeds/seed_content.ts

```ts


export function seedContent(db) {
  const getAllTagsStmt = db.prepare(`
    SELECT id, slug FROM tags
  `);

  const insertContentStmt = db.prepare(`
    INSERT INTO content (title, type, body, rendered_body, slug, description, children, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertContentTagStmt = db.prepare(`
    INSERT INTO content_to_tags (content_id, tag_id)
    VALUES (?, ?)
  `);
  const tagIds = getAllTagsStmt.all();

  const tagMap = new Map(tagIds.map(tag => [tag.slug, tag.id]));

  const contentItems = [

    {
      title: "Introduction to Svelte 5",
      type: "recipe",
      body: `# Introduction to Svelte 5
      
      Svelte 5 introduces a revolutionary concept called runes, which fundamentally changes how we handle reactivity in Svelte applications. This major update brings significant improvements in performance and developer experience.
      
      ## What are Runes?
      
      Runes are special symbols that allow developers to explicitly declare reactive values and dependencies. They provide a more fine-grained control over reactivity, enabling more efficient updates and easier reasoning about data flow in your application.
      
      ### Key Runes
      
      - \`$state\`: Declares a reactive state variable
      - \`$derived\`: Computes a value based on other reactive values
      - \`$effect\`: Runs side effects when dependencies change
      
      ## Benefits of Svelte 5
      
      1. Improved performance through more efficient updates
      2. Enhanced developer experience with explicit reactivity
      3. Better tooling support for static analysis
      
      In the following sections, we'll dive deeper into these concepts and explore how to leverage them in your Svelte applications.`,
      rendered_body: `<h1>Introduction to Svelte 5</h1>

<p>Svelte 5 introduces a revolutionary concept called runes, which fundamentally changes how we handle reactivity in Svelte applications. This major update brings significant improvements in performance and developer experience.</p>

<h2>What are Runes?</h2>

<p>Runes are special symbols that allow developers to explicitly declare reactive values and dependencies. They provide a more fine-grained control over reactivity, enabling more efficient updates and easier reasoning about data flow in your application.</p>

<h3>Key Runes</h3>

<ul>
<li><code>$state</code>: Declares a reactive state variable</li>
<li><code>$derived</code>: Computes a value based on other reactive values</li>
<li><code>$effect</code>: Runs side effects when dependencies change</li>
</ul>

<h2>Benefits of Svelte 5</h2>

<ol>
<li>Improved performance through more efficient updates</li>
<li>Enhanced developer experience with explicit reactivity</li>
<li>Better tooling support for static analysis</li>
</ol>

<p>In the following sections, we'll dive deeper into these concepts and explore how to leverage them in your Svelte applications.</p>`,
      slug: "introduction-to-svelte-5",
      description: "Learn about the new features in Svelte 5",
      tags: [tagMap.get('svelte-5'), tagMap.get('runes')]
    },
    {
      title: "Understanding Runes in Svelte 5",
      type: "recipe",
      body: `# Understanding Runes in Svelte 5
          
          Runes are a new way to handle reactivity in Svelte 5, offering developers more control and flexibility in managing state and side effects. This article will provide a comprehensive overview of runes and how to use them effectively in your Svelte applications.
          
          ## The Philosophy Behind Runes
          
          Svelte has always been about simplifying the development of reactive user interfaces. With runes, Svelte takes this philosophy a step further by making reactivity more explicit and giving developers fine-grained control over how their application responds to changes.
          
          ## Core Runes
          
          ### $state
          
          The \`$state\` rune is used to declare reactive state variables. Unlike previous versions of Svelte, where reactivity was implicit, \`$state\` makes it clear which values are meant to be reactive.
          
          \`\`\`javascript
          let count = $state(0);
          \`\`\`
          
          ### $derived
          
          \`$derived\` is used to compute values based on other reactive values. It's similar to computed properties in other frameworks.
          
          \`\`\`javascript
          let double = $derived(count * 2);
          \`\`\`
          
          ### $effect
          
          The \`$effect\` rune is used for running side effects when dependencies change. It's similar to the \`useEffect\` hook in React, but with automatic dependency tracking.
          
          \`\`\`javascript
          $effect(() => {
            console.log(\`The count is now \${count}\`);
          });
          \`\`\`
          
          ## Advanced Usage
          
          We'll explore more advanced usage of runes, including:
          
          - Combining multiple runes
          - Using runes with async operations
          - Optimizing performance with fine-grained reactivity
          
          Stay tuned for deep dives into each of these topics!`,
      rendered_body: `<h1>Understanding Runes in Svelte 5</h1>
  
  <p>Runes are a new way to handle reactivity in Svelte 5, offering developers more control and flexibility in managing state and side effects. This article will provide a comprehensive overview of runes and how to use them effectively in your Svelte applications.</p>
  
  <h2>The Philosophy Behind Runes</h2>
  
  <p>Svelte has always been about simplifying the development of reactive user interfaces. With runes, Svelte takes this philosophy a step further by making reactivity more explicit and giving developers fine-grained control over how their application responds to changes.</p>
  
  <h2>Core Runes</h2>
  
  <h3>$state</h3>
  
  <p>The <code>$state</code> rune is used to declare reactive state variables. Unlike previous versions of Svelte, where reactivity was implicit, <code>$state</code> makes it clear which values are meant to be reactive.</p>
  
  <pre><code class="language-javascript">let count = $state(0);
  </code></pre>
  
  <h3>$derived</h3>
  
  <p><code>$derived</code> is used to compute values based on other reactive values. It's similar to computed properties in other frameworks.</p>
  
  <pre><code class="language-javascript">let double = $derived(count * 2);
  </code></pre>
  
  <h3>$effect</h3>
  
  <p>The <code>$effect</code> rune is used for running side effects when dependencies change. It's similar to the <code>useEffect</code> hook in React, but with automatic dependency tracking.</p>
  
  <pre><code class="language-javascript">$effect(() => {
    console.log(\`The count is now \${count}\`);
  });
  </code></pre>
  
  <h2>Advanced Usage</h2>
  
  <p>We'll explore more advanced usage of runes, including:</p>
  
  <ul>
  <li>Combining multiple runes</li>
  <li>Using runes with async operations</li>
  <li>Optimizing performance with fine-grained reactivity</li>
  </ul>
  
  <p>Stay tuned for deep dives into each of these topics!</p>`,
      slug: "understanding-runes-svelte-5",
      description: "Deep dive into Svelte 5's runes",
      tags: [tagMap.get('svelte-5'), tagMap.get('runes')]
    },
    {
      title: "5 Useful Svelte Snippets",
      type: "recipe",
      body: `# 5 Useful Svelte Snippets
          
          Here are 5 Svelte snippets that will boost your productivity and help you write cleaner, more efficient code. These snippets are compatible with Svelte 5 and take advantage of the new runes system where applicable.
          
          ## 1. Reactive Local Storage
          
          This snippet creates a reactive wrapper around localStorage, allowing you to easily sync state with browser storage.
          
          \`\`\`javascript
          function persistentState(key, initialValue) {
            let value = $state(JSON.parse(localStorage.getItem(key)) ?? initialValue);
            
            $effect(() => {
              localStorage.setItem(key, JSON.stringify(value));
            });
          
            return value;
          }
          
          // Usage
          let count = persistentState('count', 0);
          \`\`\`
          
          ## 2. Debounced Input
          
          This snippet creates a debounced input component, useful for search inputs or any scenario where you want to limit the frequency of updates.
          
          \`\`\`svelte
          <script>
            export let value = '';
            export let delay = 300;
          
            let inputValue = $state(value);
            let timeoutId;
          
            $effect(() => {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(() => {
                value = inputValue;
              }, delay);
            });
          </script>
          
          <input bind:value={inputValue} />
          \`\`\`
          
          ## 3. Infinite Scroll
          
          This snippet implements a basic infinite scroll functionality, loading more items as the user scrolls to the bottom of the page.
          
          \`\`\`svelte
          <script>
            let items = $state([]);
            let loading = $state(false);
            let page = $state(1);
          
            async function loadMore() {
              loading = true;
              const newItems = await fetchItems(page);
              items = [...items, ...newItems];
              page++;
              loading = false;
            }
          
            $effect(() => {
              const observer = new IntersectionObserver(
                (entries) => {
                  if (entries[0].isIntersecting && !loading) {
                    loadMore();
                  }
                },
                { threshold: 1 }
              );
          
              observer.observe(document.querySelector('#sentinel'));
          
              return () => observer.disconnect();
            });
          </script>
          
          {#each items as item}
            <div>{item}</div>
          {/each}
          
          <div id="sentinel" />
          {#if loading}
            <div>Loading...</div>
          {/if}
          \`\`\`
          
          ## 4. Dark Mode Toggle
          
          This snippet implements a dark mode toggle that persists the user's preference.
          
          \`\`\`svelte
          <script>
            let darkMode = $state(localStorage.getItem('darkMode') === 'true');
          
            $effect(() => {
              localStorage.setItem('darkMode', darkMode);
              if (darkMode) {
                document.body.classList.add('dark');
              } else {
                document.body.classList.remove('dark');
              }
            });
          </script>
          
          <button on:click={() => darkMode = !darkMode}>
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </button>
          \`\`\`
          
          ## 5. Form Validation
          
          This snippet provides a simple form validation utility using runes.
          
          \`\`\`svelte
          <script>
            let name = $state('');
            let email = $state('');
            let errors = $derived({
              name: name.length < 3 ? 'Name must be at least 3 characters' : null,
              email: !email.includes('@') ? 'Invalid email address' : null
            });
            let isValid = $derived(!Object.values(errors).some(Boolean));
          
            function handleSubmit() {
              if (isValid) {
                // Submit form
              }
            }
          </script>
          
          <form on:submit|preventDefault={handleSubmit}>
            <input bind:value={name} placeholder="Name" />
            {#if errors.name}<span class="error">{errors.name}</span>{/if}
          
            <input bind:value={email} placeholder="Email" />
            {#if errors.email}<span class="error">{errors.email}</span>{/if}
          
            <button disabled={!isValid}>Submit</button>
          </form>
          \`\`\`
          
          These snippets showcase some of the powerful features of Svelte 5 and how runes can be used to create efficient, reactive code. Experiment with them in your projects to see how they can enhance your development workflow!`,
      rendered_body: `<h1>5 Useful Svelte Snippets</h1>
  
  <p>Here are 5 Svelte snippets that will boost your productivity and help you write cleaner, more efficient code. These snippets are compatible with Svelte 5 and take advantage of the new runes system where applicable.</p>
  
  <h2>1. Reactive Local Storage</h2>
  
  <p>This snippet creates a reactive wrapper around localStorage, allowing you to easily sync state with browser storage.</p>
  
  <pre><code class="language-javascript">function persistentState(key, initialValue) {
    let value = $state(JSON.parse(localStorage.getItem(key)) ?? initialValue);
    
    $effect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  
    return value;
  }
  
  // Usage
  let count = persistentState('count', 0);
  </code></pre>
  
  <h2>2. Debounced Input</h2>
  
  <p>This snippet creates a debounced input component, useful for search inputs or any scenario where you want to limit the frequency of updates.</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    export let value = '';
    export let delay = 300;
  
    let inputValue = $state(value);
    let timeoutId;
  
    $effect(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        value = inputValue;
      }, delay);
    });
  &lt;/script&gt;
  
  &lt;input bind:value={inputValue} /&gt;
  </code></pre>
  
  <h2>3. Infinite Scroll</h2>
  
  <p>This snippet implements a basic infinite scroll functionality, loading more items as the user scrolls to the bottom of the page.</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    let items = $state([]);
    let loading = $state(false);
    let page = $state(1);
  
    async function loadMore() {
      loading = true;
      const newItems = await fetchItems(page);
      items = [...items, ...newItems];
      page++;
      loading = false;
    }
  
    $effect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading) {
            loadMore();
          }
        },
        { threshold: 1 }
      );
  
      observer.observe(document.querySelector('#sentinel'));
  
      return () => observer.disconnect();
    });
  &lt;/script&gt;
  
  {#each items as item}
    &lt;div&gt;{item}&lt;/div&gt;
  {/each}
  
  &lt;div id="sentinel" /&gt;
  {#if loading}
    &lt;div&gt;Loading...&lt;/div&gt;
  {/if}
  </code></pre>
  
  <h2>4. Dark Mode Toggle</h2>
  
  <p>This snippet implements a dark mode toggle that persists the user's preference.</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    let darkMode = $state(localStorage.getItem('darkMode') === 'true');
  
    $effect(() => {
      localStorage.setItem('darkMode', darkMode);
      if (darkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    });
  &lt;/script&gt;
  
  &lt;button on:click={() => darkMode = !darkMode}&gt;
    Toggle {darkMode ? 'Light' : 'Dark'} Mode
  &lt;/button&gt;
  </code></pre>
  
  <h2>5. Form Validation</h2>
  
  <p>This snippet provides a simple form validation utility using runes.</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    let name = $state('');
    let email = $state('');
    let errors = $derived({
      name: name.length < 3 ? 'Name must be at least 3 characters' : null,
      email: !email.includes('@') ? 'Invalid email address' : null
    });
    let isValid = $derived(!Object.values(errors).some(Boolean));
  
    function handleSubmit() {
      if (isValid) {
        // Submit form
      }
    }
  &lt;/script&gt;
  
  &lt;form on:submit|preventDefault={handleSubmit}&gt;
    &lt;input bind:value={name} placeholder="Name" /&gt;
    {#if errors.name}&lt;span class="error"&gt;{errors.name}&lt;/span&gt;{/if}
  
    &lt;input bind:value={email} placeholder="Email" /&gt;
    {#if errors.email}&lt;span class="error"&gt;{errors.email}&lt;/span&gt;{/if}
  
    &lt;button disabled={!isValid}&gt;Submit&lt;/button&gt;
  &lt;/form&gt;
  </code></pre>
  
  <p>These snippets showcase some of the powerful features of Svelte 5 and how runes can be used to create efficient, reactive code. Experiment with them in your projects to see how they can enhance your development workflow!</p>`,
      slug: "5-useful-svelte-snippets",
      description: "Boost your Svelte development with these snippets",
      tags: [tagMap.get('svelte-5'), tagMap.get('snippet'), tagMap.get('utility')]
    },
    {
      title: "Building a Todo App with Svelte 5",
      type: "recipe",
      body: `# Building a Todo App with Svelte 5
          
          In this tutorial, we'll build a todo app using Svelte 5 and runes. This project will demonstrate how to use the new reactivity system to create a dynamic and efficient user interface.
          
          ## Setting Up the Project
          
          First, let's set up a new Svelte project using the Svelte CLI:
          
          \`\`\`bash
          npm create svelte@latest my-todo-app
          cd my-todo-app
          npm install
          \`\`\`
          
          ## Creating the Todo Store
          
          We'll start by creating a store to manage our todos. Create a new file \`src/stores/todos.js\`:
          
          \`\`\`javascript
          import { writable } from 'svelte/store';
          
          function createTodos() {
            const { subscribe, update } = writable([]);
          
            return {
              subscribe,
              add: (text) => update(todos => [...todos, { id: Date.now(), text, completed: false }]),
              toggle: (id) => update(todos => todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
              )),
              remove: (id) => update(todos => todos.filter(todo => todo.id !== id)),
            };
          }
          
          export const todos = createTodos();
          \`\`\`
          
          ## Creating the Todo List Component
          
          Now, let's create a TodoList component. Create a new file \`src/components/TodoList.svelte\`:
          
          \`\`\`svelte
          <script>
            import { todos } from '../stores/todos.js';
            
            let newTodo = $state('');
          
            function addTodo() {
              if (newTodo.trim()) {
                todos.add(newTodo);
                newTodo = '';
              }
            }
          </script>
          
          <div>
            <input bind:value={newTodo} placeholder="What needs to be done?" />
            <button on:click={addTodo}>Add Todo</button>
          </div>
          
          <ul>
            {#each $todos as todo (todo.id)}
              <li>
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  on:change={() => todos.toggle(todo.id)} 
                />
                <span class:completed={todo.completed}>{todo.text}</span>
                <button on:click={() => todos.remove(todo.id)}>Delete</button>
              </li>
            {/each}
          </ul>
          
          <style>
            .completed {
              text-decoration: line-through;
              color: #888;
            }
          </style>
          \`\`\`
          
          ## Updating the App Component
          
          Finally, let's update the main App component to use our TodoList. Update \`src/App.svelte\`:
          
          \`\`\`svelte
          <script>
            import TodoList from './components/TodoList.svelte';
          </script>
          
          <main>
            <h1>Svelte 5 Todo App</h1>
            <TodoList />
          </main>
          
          <style>
            main {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
          </style>
          \`\`\`
          
          ## Running the App
          
          Now you can run your Svelte 5 Todo app:
          
          \`\`\`bash
          npm run dev
          \`\`\`
          
          Visit \`http://localhost:5000\` in your browser to see the app in action!
          
          ## Conclusion
          
          This tutorial demonstrated how to build a simple Todo app using Svelte 5 and runes. We've seen how to:
          
          1. Set up a Svelte 5 project
          2. Create a store for managing application state
          3. Use runes for local component state
          4. Create reusable components
          5. Bind events and handle user interactions
          
          Experiment with this app and try adding more features, such as filtering todos or saving them to localStorage. Happy coding!`,
      rendered_body: `<h1>Building a Todo App with Svelte 5</h1>
  
  <p>In this tutorial, we'll build a todo app using Svelte 5 and runes. This project will demonstrate how to use the new reactivity system to create a dynamic and efficient user interface.</p>
  
  <h2>Setting Up the Project</h2>
  
  <p>First, let's set up a new Svelte project using the Svelte CLI:</p>
  
  <pre><code class="language-bash">npm create svelte@latest my-todo-app
  cd my-todo-app
  npm install
  </code></pre>
  
  <h2>Creating the Todo Store</h2>
  
  <p>We'll start by creating a store to manage our todos. Create a new file <code>src/stores/todos.js</code>:</p>
  
  <pre><code class="language-javascript">import { writable } from 'svelte/store';
  
  function createTodos() {
    const { subscribe, update } = writable([]);
  
    return {
      subscribe,
      add: (text) => update(todos => [...todos, { id: Date.now(), text, completed: false }]),
      toggle: (id) => update(todos => todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )),
      remove: (id) => update(todos => todos.filter(todo => todo.id !== id)),
    };
  }
  
  export const todos = createTodos();
  </code></pre>
  
  <h2>Creating the Todo List Component</h2>
  
  <p>Now, let's create a TodoList component. Create a new file <code>src/components/TodoList.svelte</code>:</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    import { todos } from '../stores/todos.js';
    
    let newTodo = $state('');
  
    function addTodo() {
      if (newTodo.trim()) {
        todos.add(newTodo);
        newTodo = '';
      }
    }
  &lt;/script&gt;
  
  &lt;div&gt;
    &lt;input bind:value={newTodo} placeholder="What needs to be done?" /&gt;
    &lt;button on:click={addTodo}&gt;Add Todo&lt;/button&gt;
  &lt;/div&gt;
  
  &lt;ul&gt;
    {#each $todos as todo (todo.id)}
      &lt;li&gt;
        &lt;input 
          type="checkbox" 
          checked={todo.completed} 
          on:change={() => todos.toggle(todo.id)} 
        /&gt;
        &lt;span class:completed={todo.completed}&gt;{todo.text}&lt;/span&gt;
        &lt;button on:click={() => todos.remove(todo.id)}&gt;Delete&lt;/button&gt;
      &lt;/li&gt;
    {/each}
  &lt;/ul&gt;
  
  &lt;style&gt;
    .completed {
      text-decoration: line-through;
      color: #888;
    }
  &lt;/style&gt;
  </code></pre>
  
  <h2>Updating the App Component</h2>
  
  <p>Finally, let's update the main App component to use our TodoList. Update <code>src/App.svelte</code>:</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    import TodoList from './components/TodoList.svelte';
  &lt;/script&gt;
  
  &lt;main&gt;
    &lt;h1&gt;Svelte 5 Todo App&lt;/h1&gt;
    &lt;TodoList /&gt;
  &lt;/main&gt;
  
  &lt;style&gt;
    main {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
  &lt;/style&gt;
  </code></pre>
  
  <h2>Running the App</h2>
  
  <p>Now you can run your Svelte 5 Todo app:</p>
  
  <pre><code class="language-bash">npm run dev
  </code></pre>
  
  <p>Visit <code>http://localhost:5000</code> in your browser to see the app in action!</p>
  
  <h2>Conclusion</h2>
  
  <p>This tutorial demonstrated how to build a simple Todo app using Svelte 5 and runes. We've seen how to:</p>
  
  <ol>
  <li>Set up a Svelte 5 project</li>
  <li>Create a store for managing application state</li>
  <li>Use runes for local component state</li>
  <li>Create reusable components</li>
  <li>Bind events and handle user interactions</li>
  </ol>
  
  <p>Experiment with this app and try adding more features, such as filtering todos or saving them to localStorage. Happy coding!</p>`,
      slug: "todo-app-svelte-5",
      description: "Step-by-step guide to building a todo app with Svelte 5",
      tags: [tagMap.get('svelte-5'), tagMap.get('runes'), tagMap.get('utility')]
    },
    {
      title: "Svelte 5 Tutorial Series",
      type: "collection",
      body: "A comprehensive series of tutorials covering Svelte 5 features and best practices.",
      rendered_body: "<p>A comprehensive series of tutorials covering Svelte 5 features and best practices.</p>",
      slug: "svelte-5-tutorial-series",
      description: "Learn Svelte 5 from the ground up",
      tags: [tagMap.get('svelte-5'), tagMap.get('tutorial')],
      children: []
    }
  ]

  const insertContentAndTags = db.transaction((item) => {
    const children = JSON.stringify(item.children || []);
    const now = new Date().toISOString();

    const info = insertContentStmt.run(
      item.title,
      item.type,
      item.body,
      item.rendered_body,
      item.slug,
      item.description,
      children,
      now,
      now
    );

    const contentId = info.lastInsertRowid;

    for (const tagId of item.tags) {
      insertContentTagStmt.run(contentId, tagId);
    }

    return contentId;
  });

  try {
    for (const item of contentItems) {
      insertContentAndTags(item);
    }
    console.log('Content seeded successfully');
  } catch (error) {
    console.error('Error seeding content:', error);
  }
}
```

# src/lib/server/db/seeds/index.ts

```ts

import { seedTags } from "./seed_tags"
import { seedRoles } from "./seed_roles"
import { seedContent } from "./seed_content"
import { seedUsers } from "./seed_users";
import { seedInteractions } from "./seed_interactions";

import Database from 'better-sqlite3';
import { seedModerationQueue } from "./seed_moderation_queue";

export const db = new Database('local.db')
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

async function runSeeds() {
    try {
        // Run seeds in order
        await seedRoles(db);
        await seedTags(db);
        await seedUsers(db);
        await seedContent(db);
        await seedInteractions(db);
        await seedModerationQueue(db);

        console.log('All seeds completed successfully');
    } catch (error) {
        console.error('Error running seeds:', error);
    } finally {
        // Close the database connection
        db.close();
    }
}

// Run the seeding process
runSeeds();
```

# src/routes/(admin)/admin/roles/+page.svelte

```svelte
<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date';
	import Button from '$lib/ui/Button.svelte';
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Roles Management</h1>
		<Button small primary icon_left="plus" href="/admin/roles/new">New Role</Button>
	</div>
	<div class="overflow-hidden rounded-lg bg-white shadow-sm">
		<div class="w-full overflow-x-auto">
			<table class="w-full text-left text-xs text-gray-500">
				<thead class="bg-gray-50 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="sticky left-0 z-20 min-w-[180px] bg-gray-50 px-3 py-2">Name</th>
						<th scope="col" class="min-w-[180px] px-3 py-2">Description</th>
						<th scope="col" class="min-w-[80px] px-3 py-2">Active</th>
						<th scope="col" class="sticky right-0 z-20 min-w-[70px] bg-gray-50 px-3 py-2">
							<span class="sr-only">Actions</span>
							<svg
								class="mx-auto h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each data.roles as role}
						<tr class="hover:bg-gray-50">
							<td
								class="sticky left-0 z-10 min-w-[180px] whitespace-nowrap bg-white px-3 py-2 font-medium text-gray-900 group-hover:bg-gray-50"
							>
								{role.name}
							</td>
							<td class="min-w-[180px] truncate px-3 py-2">{role.description}</td>
							<td class="min-w-[80px] px-3 py-2">
								<span
									class="inline-flex rounded-full px-2 text-xs font-semibold leading-5 {role.active
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800'}"
								>
									{role.active ? 'Active' : 'Inactive'}
								</span>
							</td>
							<td class="sticky right-0 z-10 min-w-[70px] bg-white px-3 py-2">
								<div class="flex justify-center space-x-1">
									<a
										href="/admin/roles/{role.id}"
										class="text-indigo-600 hover:text-indigo-900"
										aria-label="Edit role"
									>
										<svg
											class="h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											></path>
										</svg>
									</a>
									<form action="?/delete" method="POST" use:enhance>
										<input type="hidden" name="id" value={role.id} />
										<button
											type="submit"
											class="text-red-600 hover:text-red-900"
											aria-label="Delete role"
										>
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												></path>
											</svg>
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

```

# src/routes/(admin)/admin/roles/+page.server.ts

```ts
import { get_roles, delete_role } from '$lib/server/db/role';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
    return {
        roles: get_roles()
    }
})

export const actions = {
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as unknown as number;

        if (!id) {
            return fail(400, { message: 'No role id provided.' });
        }

        const deleted_role = delete_role(id);


        if (!deleted_role) {
            return { message: 'Something went wrong.' };
        }

        return { message: `Role deleted.` };
    }
};
```

# src/routes/(admin)/admin/tags/+page.svelte

```svelte
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { toast } from 'svelte-sonner';

	export let data: PageData;

	const { enhance } = superForm(data.form, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Tag deleted successfully');
				// Optionally, you can reload the page or update the tag list here
			} else {
				toast.error('Failed to delete tag');
			}
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">Tag Management</h1>
	<div class="overflow-hidden rounded-lg bg-white shadow-md">
		<table class="w-full">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Name</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Slug</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Content Count</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Actions</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each data.tags as tag}
					<tr>
						<td class="whitespace-nowrap px-6 py-4">{tag.name}</td>
						<td class="whitespace-nowrap px-6 py-4">{tag.slug}</td>
						<td class="whitespace-nowrap px-6 py-4">{tag.contentCount}</td>
						<td class="whitespace-nowrap px-6 py-4">
							<div class="flex items-center space-x-2">
								<a href="/admin/tags/{tag.id}/edit" class="text-indigo-600 hover:text-indigo-900">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<title>Edit tag</title>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
								</a>
								<form method="POST" action="?/deleteTag" use:enhance class="inline">
									<input type="hidden" name="id" value={tag.id} />
									<button type="submit" class="text-red-600 hover:text-red-900">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<title>Delete tag</title>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="mt-4">
		<a
			href="/admin/tags/new"
			class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
		>
			Create New Tag
		</a>
	</div>
</div>

```

# src/routes/(admin)/admin/tags/+page.server.ts

```ts
import { tagService } from '$lib/server/db/services/tags';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const deleteSchema = z.object({
    id: z.number().int().positive()
});

export const load: PageServerLoad = async () => {
    const result = await tagService.get_tags_ordered_by_content_count();
    const form = await superValidate(zod(deleteSchema));

    if (!result.success) {
        return fail(400, { message: 'Error getting tags' });
    }

    return { tags: result.data, form };
};

export const actions: Actions = {
    deleteTag: async (event) => {
        const form = await superValidate(event, zod(deleteSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await tagService.delete_tag(form.data.id);
            return message(form, 'Tag deleted successfully');
        } catch (error) {
            return message(form, 'Failed to delete tag', { status: 500 });
        }
    }
};
```

# src/routes/(admin)/admin/content/+page.svelte

```svelte
<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date';
	import Button from '$lib/ui/Button.svelte';
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Content Management</h1>
		<Button small primary icon_left="plus" href="/admin/content/new">New Content</Button>
	</div>
	<div class="overflow-hidden rounded-lg bg-white shadow-sm">
		<div class="w-full overflow-x-auto">
			<table class="w-full text-left text-xs text-gray-500">
				<thead class="bg-gray-50 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="sticky left-0 z-20 min-w-[180px] bg-gray-50 px-3 py-2">Title</th>
						<th scope="col" class="min-w-[80px] px-3 py-2">Type</th>
						<th scope="col" class="min-w-[180px] px-3 py-2">Description</th>
						<th scope="col" class="min-w-[120px] px-3 py-2">Created</th>
						<th scope="col" class="sticky right-0 z-20 min-w-[70px] bg-gray-50 px-3 py-2">
							<span class="sr-only">Actions</span>
							<svg
								class="mx-auto h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each data.content as content_item}
						<tr class="hover:bg-gray-50">
							<td
								class="sticky left-0 z-10 min-w-[180px] whitespace-nowrap bg-white px-3 py-2 font-medium text-gray-900 group-hover:bg-gray-50"
							>
								<div>{content_item.title}</div>
								<div class="mt-1 text-xs text-gray-400">{content_item.slug}</div>
							</td>
							<td class="min-w-[80px] px-3 py-2">{content_item.type}</td>
							<td class="min-w-[180px] truncate px-3 py-2">{content_item.description}</td>
							<td class="min-w-[120px] px-3 py-2">
								{formatRelativeDate(content_item.created_at)}
							</td>
							<td class="sticky right-0 z-10 min-w-[70px] bg-white px-3 py-2">
								<div class="flex justify-center space-x-1">
									<a
										href="/admin/content/{content_item.id}"
										class="text-indigo-600 hover:text-indigo-900"
										aria-label="Edit content"
									>
										<svg
											class="h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											></path>
										</svg>
									</a>
									<form action="?/delete" method="POST" use:enhance>
										<input type="hidden" name="id" value={content_item.id} />
										<button
											type="submit"
											class="text-red-600 hover:text-red-900"
											aria-label="Delete content"
										>
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												></path>
											</svg>
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

```

# src/routes/(admin)/admin/content/+page.server.ts

```ts
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { get_all_content, delete_content } from '$lib/server/db/content';

export const load: PageServerLoad = async () => {
	const content = get_all_content()

	if (!content) {
		fail(400, { message: 'Error getting content' });
	}

	return { content };
};

export const actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return
		}

		try {
			delete_content(parseInt(id))
			return { success: true };
		} catch (err) {
			return fail(500, { message: 'Failed to delete content' });
		}
	}
};

```

# src/routes/(admin)/admin/users/+page.svelte

```svelte
<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date';
	import Button from '$lib/ui/Button.svelte';
	import { enhance } from '$app/forms';
	import Avatar from '$lib/ui/Avatar.svelte';
	let { data } = $props();
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Users Management</h1>
		<Button small primary icon_left="plus" href="/admin/users/new">New User</Button>
	</div>
	<div class="overflow-hidden rounded-lg bg-white shadow-sm">
		<div class="w-full overflow-x-auto">
			<table class="w-full text-left text-xs text-gray-500">
				<thead class="bg-gray-50 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="sticky left-0 z-20 min-w-[180px] bg-gray-50 px-3 py-2">User</th>
						<th scope="col" class="min-w-[180px] px-3 py-2">Email</th>
						<th scope="col" class="min-w-[120px] px-3 py-2">Location</th>
						<th scope="col" class="min-w-[120px] px-3 py-2">Twitter</th>
						<th scope="col" class="min-w-[120px] px-3 py-2">Created</th>
						<th scope="col" class="sticky right-0 z-20 min-w-[100px] bg-gray-50 px-3 py-2">
							<span class="sr-only">Actions</span>
							<svg
								class="mx-auto h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each data.users as user}
						<tr class="hover:bg-gray-50">
							<td
								class="sticky left-0 z-10 flex min-w-[180px] items-center whitespace-nowrap bg-white px-3 py-2 font-medium text-gray-900 group-hover:bg-gray-50"
							>
								<Avatar src={user.avatar_url} name={user.username} size="sm" />
								<span class="ml-2">{user.username}</span>
							</td>
							<td class="min-w-[180px] truncate px-3 py-2">{user.email || '-'}</td>
							<td class="min-w-[120px] px-3 py-2">{user.location || '-'}</td>
							<td class="min-w-[120px] px-3 py-2">{user.twitter || '-'}</td>
							<td class="min-w-[120px] px-3 py-2">{formatRelativeDate(user.created_at)}</td>
							<td class="sticky right-0 z-10 min-w-[100px] bg-white px-3 py-2">
								<div class="flex justify-center space-x-1">
									<a
										href="/admin/users/{user.id}"
										class="text-indigo-600 hover:text-indigo-900"
										aria-label="Edit user"
									>
										<svg
											class="h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											></path>
										</svg>
									</a>
									<form action="?/clear_sessions" method="POST" use:enhance>
										<input type="hidden" name="id" value={user.id} />
										<button
											type="submit"
											class="text-yellow-600 hover:text-yellow-900"
											aria-label="Clear user sessions"
										>
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
												></path>
											</svg>
										</button>
									</form>
									<form action="?/delete" method="POST" use:enhance>
										<input type="hidden" name="id" value={user.id} />
										<button
											type="submit"
											class="text-red-600 hover:text-red-900"
											aria-label="Delete user"
										>
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												></path>
											</svg>
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

```

# src/routes/(admin)/admin/users/+page.server.ts

```ts
import type { PageServerLoad } from './$types';
import { get_users } from '$lib/server/db/user';

export const load = (async () => {
    return {
        users: get_users()
    };
}) satisfies PageServerLoad;
```

# src/routes/(admin)/admin/moderation/+page.svelte

```svelte
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ items, page, totalPages, totalItems } = data);

	let selectedIds: number[] = [];

	function toggleSelection(id: number) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((item) => item !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	function getPageUrl(pageNum: number) {
		if (pageNum < 1 || pageNum > totalPages) {
			return null;
		}
		return `?page=${pageNum}`;
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">Moderation Queue</h1>

	<p class="mb-4">Total items: {totalItems}</p>

	<form method="POST" action="?/rejectSelected" use:enhance>
		{#each selectedIds as id}
			<input type="hidden" name="selectedIds" value={id} />
		{/each}
		<button
			class="mb-4 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={selectedIds.length === 0}
		>
			{#if selectedIds.length > 0}
				Reject {selectedIds.length} submission{selectedIds.length !== 1 ? 's' : ''}
			{:else}
				Select items to reject
			{/if}
		</button>
	</form>

	<table class="mb-4 w-full rounded bg-white shadow-md">
		<thead>
			<tr class="bg-gray-200 text-sm uppercase leading-normal text-gray-600">
				<th class="px-6 py-3 text-left">Select</th>
				<th class="px-6 py-3 text-left">Type</th>
				<th class="px-6 py-3 text-left">Submitted At</th>
				<th class="px-6 py-3 text-center">Actions</th>
			</tr>
		</thead>
		<tbody class="text-sm font-light text-gray-600">
			{#each items as item (item.id)}
				<tr class="border-b border-gray-200 hover:bg-gray-100">
					<td class="px-6 py-3 text-left">
						<input
							type="checkbox"
							checked={selectedIds.includes(item.id)}
							on:change={() => toggleSelection(item.id)}
							class="form-checkbox h-5 w-5 text-blue-600"
						/>
					</td>
					<td class="whitespace-nowrap px-6 py-3 text-left">
						<span class="font-medium">{item.type}</span>
					</td>
					<td class="px-6 py-3 text-left">
						{new Date(item.submitted_at).toLocaleString()}
					</td>
					<td class="px-6 py-3 text-center">
						<div class="item-center flex justify-center">
							<a href="/admin/moderation/{item.id}" class="mr-4 text-blue-500 hover:text-blue-600"
								>View</a
							>
							<form method="POST" action="?/approve" use:enhance>
								<input type="hidden" name="id" value={item.id} />
								<button class="mr-4 text-green-500 hover:text-green-600"> Approve </button>
							</form>
							<form method="POST" action="?/reject" use:enhance>
								<input type="hidden" name="id" value={item.id} />
								<button class="text-red-500 hover:text-red-600"> Reject </button>
							</form>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="flex items-center justify-between">
		{#if getPageUrl(page - 1)}
			<a
				href={getPageUrl(page - 1)}
				class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
			>
				Previous
			</a>
		{:else}
			<span class="cursor-not-allowed rounded bg-gray-300 px-4 py-2 font-bold text-gray-500">
				Previous
			</span>
		{/if}

		<span>Page {page} of {totalPages}</span>

		{#if getPageUrl(page + 1)}
			<a
				href={getPageUrl(page + 1)}
				class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
			>
				Next
			</a>
		{:else}
			<span class="cursor-not-allowed rounded bg-gray-300 px-4 py-2 font-bold text-gray-500">
				Next
			</span>
		{/if}
	</div>
</div>

```

# src/routes/(admin)/admin/moderation/+page.server.ts

```ts
import { get_moderation_queue_paginated, update_moderation_status, get_moderation_queue_count_filtered } from '$lib/server/db/moderation';
import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
    const page = Number(url.searchParams.get('page') || '1');
    const itemsPerPage = 10;

    const totalItems = await get_moderation_queue_count_filtered({ status: 'pending' });
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Validate page number
    if (page < 1 || page > totalPages) {
        throw redirect(302, '/admin/');
    }

    const items = await get_moderation_queue_paginated({
        status: 'pending',
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage
    });


    return {
        items,
        page,
        totalPages,
        totalItems
    };
};

export const actions: Actions = {
    approve: async ({ request, locals }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        await update_moderation_status(id, 'approved', locals.user.id);
        return { success: true };
    },
    reject: async ({ request, locals }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        await update_moderation_status(id, 'rejected', locals.user.id);
        return { success: true };
    },
    rejectSelected: async ({ request }) => {
        const data = await request.formData();
        const ids = data.getAll('selectedIds').map(Number);
        for (const id of ids) {
            await update_moderation_status(id, 'rejected', 1); // Replace 1 with actual user ID
        }
        return { success: true };
    }
};
```

# src/routes/(admin)/admin/collections/+page.svelte

```svelte
<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date';
	import Button from '$lib/ui/Button.svelte';
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">Collections Management</h1>
		<Button small primary icon_left="plus" href="/admin/collections/new">New Collection</Button>
	</div>
	<div class="overflow-hidden rounded-lg bg-white shadow-sm">
		<div class="w-full overflow-x-auto">
			<table class="w-full text-left text-xs text-gray-500">
				<thead class="bg-gray-50 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="sticky left-0 z-20 min-w-[180px] bg-gray-50 px-3 py-2">Title</th>
						<th scope="col" class="min-w-[80px] px-3 py-2">Status</th>
						<th scope="col" class="min-w-[120px] px-3 py-2">Created</th>
						<th scope="col" class="sticky right-0 z-20 min-w-[70px] bg-gray-50 px-3 py-2">
							<span class="sr-only">Actions</span>
							<svg
								class="mx-auto h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each data.collections as collection}
						<tr class="hover:bg-gray-50">
							<td
								class="sticky left-0 z-10 min-w-[180px] whitespace-nowrap bg-white px-3 py-2 font-medium text-gray-900 group-hover:bg-gray-50"
							>
								<div>{collection.title}</div>
								<div class="mt-1 text-xs text-gray-500">{collection.slug}</div>
							</td>
							<td class="min-w-[80px] px-3 py-2">
								<span
									class="inline-flex rounded-full px-2 text-xs font-semibold leading-5
									{collection.status === 'published'
										? 'bg-green-100 text-green-800'
										: collection.status === 'draft'
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-red-100 text-red-800'}"
								>
									{collection.status}
								</span>
							</td>
							<td class="min-w-[120px] px-3 py-2">
								{formatRelativeDate(collection.created_at)}
							</td>
							<td class="sticky right-0 z-10 min-w-[70px] bg-white px-3 py-2">
								<div class="flex justify-center space-x-1">
									<a
										href="/admin/collections/{collection.id}"
										class="text-indigo-600 hover:text-indigo-900"
										aria-label="Edit collection"
									>
										<svg
											class="h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											></path>
										</svg>
									</a>
									<form action="?/delete" method="POST" use:enhance>
										<input type="hidden" name="id" value={collection.id} />
										<button
											type="submit"
											class="text-red-600 hover:text-red-900"
											aria-label="Delete collection"
										>
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												></path>
											</svg>
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

```

# src/routes/(admin)/admin/collections/+page.server.ts

```ts
import type { PageServerLoad } from './$types';
import { get_collections } from '$lib/server/db/collections';

export const load: PageServerLoad = async () => {
    return {
        collections: get_collections()
    };
};
```

# src/routes/(app)/(public)/submit/+page.svelte

```svelte
<script lang="ts">
	import Input from '$lib/ui/form/Input.svelte';
	import Select from '$lib/ui/form/Select.svelte';

	let { data } = $props();
</script>

<div class="grid gap-6">
	<Input
		placeholder="Enter a title..."
		name="title"
		label="Title"
		description="Enter the title of your content submission"
		error="This field is required"
	/>
	<Input
		placeholder="Text"
		name="description"
		label="Description"
		description="Enter the description of your recipe"
		error="This field is required"
	/>
	<Select
		name="tags"
		label="Tags"
		description="Select the tags for your content"
		options={[
			{ value: '1', label: 'Tag 1' },
			{ value: '2', label: 'Tag 2' }
		]}
		error="This field is required"
	/>
</div>

```

# src/routes/(app)/(public)/submit/+page.server.ts

```ts
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;
```

# src/routes/(app)/(public)/saved/+page.svelte

```svelte
<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="grid gap-6">
	{#each data.content as item}
		<ContentCard {...item} author="John Doe" views="11114">
			{item.description}</ContentCard
		>
	{/each}
</div>

```

# src/routes/(app)/(public)/saved/+page.server.ts

```ts
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { get_user_saved_content, get_tags_for_content } from '$lib/server/db/content';
import { get_user_likes_and_saves } from '$lib/server/db/interactions';
get_user_likes_and_saves

export const load = (async ({ url, locals }) => {
    if (!locals?.user?.id) redirect(302, '/')

    try {
        const content = get_user_saved_content({ user_id: locals.user.id, limit: 20, offset: 0 });

        const tags = get_tags_for_content(content.map(c => c.id))
        let content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }))

        if (locals.user) {
            const { user_likes, user_saves } = get_user_likes_and_saves(locals.user.id, content.map(c => c.id))

            content_with_tags = content_with_tags.map((c, i) => ({
                ...c,
                liked: user_likes.has(c.id),
                saved: user_saves.has(c.id)
            }))
        }


        return {
            content: content_with_tags,
        };
    } catch (err) {
        console.error('Error fetching saved content:', err);
        throw error(500, 'An error occurred while fetching saved content');
    }
}) satisfies PageServerLoad;

```

# src/routes/(api)/auth/logout/+server.ts

```ts
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { delete_session } from '$lib/server/db/session';

export const GET: RequestHandler = async ({ cookies, request }) => {
    const session_id = cookies.get('session_id')

    if (!session_id) {
        return new Response('No session id provided', { status: 400 });
    }

    delete_session(session_id)
    cookies.delete('session_id', { path: '/' })

    redirect(302, '/')
};
```

# src/routes/(app)/(public)/[type]/+page.svelte

```svelte
<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';

	let { data } = $props();
</script>

<!-- <Tag tag={data.tag.filter} /> -->
<div class="grid gap-6">
	{#each data.content as item}
		<ContentCard {...item} author="John Doe" views={1125}>
			{item.description}</ContentCard
		>
	{/each}
</div>

```

# src/routes/(app)/(public)/[type]/+page.server.ts

```ts
import { get_content_by_type, get_tags_for_content } from '$lib/server/db/content';
import { get_user_likes_and_saves } from '$lib/server/db/interactions';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
    const content = get_content_by_type(params.type);

    const tags = get_tags_for_content(content.map(c => c.id))
    let content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }))

    if (locals.user) {
        const { user_likes, user_saves } = get_user_likes_and_saves(locals.user.id, content.map(c => c.id))

        content_with_tags = content_with_tags.map((c, i) => ({
            ...c,
            liked: user_likes.has(c.id),
            saved: user_saves.has(c.id)
        }))
    }

    if (!content) {
        fail(400, { message: 'Error getting content' });
    }


    return { content: content_with_tags };

};
```

# src/routes/(app)/(public)/_components/RightSidebar.svelte

```svelte
<script lang="ts">
	import Tags from '$lib/ui/Tags.svelte';

	type Tag = {
		id: string;
		name: string;
		slug: string;
		contentCount: number;
	};

	let { tags }: { tags: Tag[] } = $props();
</script>

<main class="mx-auto mt-8 max-w-md space-y-4 p-4">
	<div class="mb-4 grid grid-cols-[auto_1fr] items-start gap-1">
		<div>
			<h3 class="text-lg font-semibold">Got Svelte News?</h3>
			<p class="mb-4 text-sm">Share with the biggest community of Svelte enthusiasts</p>
		</div>
		<button class="bg-svelte-900 w-28 rounded px-2 py-1 text-white hover:brightness-95">
			<span class="line-height-0">+</span> <span class="text-sm">Submit Post</span>
		</button>
	</div>

	<div>
		<h3 class="text-md mb-2 font-semibold">Tags</h3>
		<input
			type="text"
			placeholder="Search Tags"
			class="w-full rounded border-none bg-slate-100 p-2 text-xs"
		/>
	</div>

	<div>
		<h3 class="text-md mb-2 font-semibold">Popular tags</h3>
		<Tags {tags} />
	</div>

	<div class="mb-4 rounded bg-amber-100 p-3 text-sm">
		<p>
			Welcome to Svelte Society, homepage for everything Svelte. Try navigate left menu to filter by
			specific
		</p>
	</div>

	<div class="rounded bg-slate-200 p-4">
		<h3 class="text-md mb-2 font-bold">Our sponsors:</h3>
		<ul class="flex flex-wrap gap-2 text-sm">
			<li>ACME Inc.</li>
			<li>John Doe Inc.</li>
		</ul>
	</div>
</main>

```

# src/routes/(app)/(public)/_components/LeftSidebar.svelte

```svelte
<script>
	import { page } from '$app/stores';

	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'Saved', href: '/saved' },
		{ name: 'CURATED', href: null },
		{ name: 'Announcements', href: '/announcements' },
		{ name: 'Collections', href: '/collections' },
		{ name: 'CODE / RESOURCES', href: null },
		{ name: 'Templates', href: '/templates' },
		{ name: 'Components', href: '/components' },
		{ name: 'Libraries', href: '/libraries' },
		{ name: 'LEARNING', href: null },
		{ name: 'Videos', href: '/videos' },
		{ name: 'Recipes', href: '/recipes' },
		{ name: 'Showcase', href: '/showcase' }
	];
</script>

<aside class="w-56 px-4 py-10">
	<nav>
		<ul class="text-sm font-bold">
			{#each links as link}
				{#if link.href}
					<li class:active={$page.url.pathname === link.href} class="rounded-sm px-2 py-0.5">
						<a href={link.href}>{link.name}</a>
					</li>
				{:else}
					<li class="mt-2 px-2 py-0.5 text-xs font-thin">
						{link.name}
					</li>
				{/if}
			{/each}
		</ul>
	</nav>
</aside>

<style>
	.active {
		@apply bg-svelte-900 text-white;
	}
</style>

```

# src/routes/(api)/auth/callback/+server.ts

```ts
import type { RequestHandler } from './$types';
import { create_or_update_user } from '$lib/server/db/user';
import { delete_session, create_session } from '$lib/server/db/session';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
    const code = url.searchParams.get('code');
    if (!code) {
        return new Response('No code provided', { status: 400 });
    }

    // Get access token
    const token_response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code
        })
    })

    const { error, access_token } = await token_response.json()

    if (error) {
        return new Response('Error getting access token', { status: 500 });
    }

    // Get user info
    const user_info_response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    })

    const user_info = await user_info_response.json()

    if (!user_info) {
        return new Response('Error getting user info', { status: 500 });
    }

    // Create or update user
    let user_result = create_or_update_user(user_info)

    if (!user_result) {
        return new Response('Error creating or updating user', { status: 500 });
    }

    // Delete old user session
    const old_session_token = cookies.get('session_id')

    if (old_session_token) {
        delete_session(old_session_token)
    }

    // Create new user session
    const session_create_result = create_session(user_result.id as number)

    cookies.set('session_id', session_create_result, {
        path: '/',
        httpOnly: true,
        secure: !dev,
    })

    redirect(302, '/')
};
```

# src/routes/(api)/auth/github/+server.ts

```ts
import type { RequestHandler } from './$types';
import { GITHUB_AUTH_URL } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    redirect(302, GITHUB_AUTH_URL);
};
```

# src/routes/(api)/search/[query]/+server.ts

```ts
import { search_content } from '$lib/server/db/search';
import { get_content_by_ids, get_tags_for_content } from '$lib/server/db/content';
import { get_user_likes_and_saves } from '$lib/server/db/interactions';
import { json } from '@sveltejs/kit';

// Rate limit configuration
const RATE_LIMIT = 3; // Number of requests allowed
const TIME_WINDOW = 10 * 1000; // Time window in milliseconds (1 minute)

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export const GET = async ({ params, locals }) => {
    const hits = search_content(params.query)

    const content = get_content_by_ids(hits)

    const tags = get_tags_for_content(content.map(c => c.id))

    let content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }))

    if (locals.user) {
        const { user_likes, user_saves } = get_user_likes_and_saves(locals.user.id, content.map(c => c.id))

        content_with_tags = content_with_tags.map((c, i) => ({
            ...c,
            liked: user_likes.has(c.id),
            saved: user_saves.has(c.id)
        }))
    }

    return json(content_with_tags)
};

function rateLimit(ip: string): boolean {
    const now = Date.now();
    const userRateLimit = rateLimitStore.get(ip);

    if (!userRateLimit) {
        rateLimitStore.set(ip, { count: 1, timestamp: now });
        return true;
    }

    if (now - userRateLimit.timestamp > TIME_WINDOW) {
        rateLimitStore.set(ip, { count: 1, timestamp: now });
        return true;
    }

    if (userRateLimit.count < RATE_LIMIT) {
        rateLimitStore.set(ip, { count: userRateLimit.count + 1, timestamp: userRateLimit.timestamp });
        return true;
    }

    return false;
}
```

# src/routes/(admin)/admin/roles/new/schema.ts

```ts
import { z } from 'zod';

export const schema = z.object({
	name: z.string(),
	value: z.string(),
	description: z.string(),
	active: z.boolean()
});

```

# src/routes/(admin)/admin/roles/new/+page.svelte

```svelte
<script lang="ts">
	import Input from '$lib/ui/form/Input.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { schema } from './schema';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form, zod(schema));
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Role</h1>
	<form method="POST" use:enhance class="space-y-6">
		<Input
			name="name"
			label="Name"
			type="text"
			placeholder="Admin"
			description="Enter the name of the role"
			bind:value={$form.name}
			errors={$errors.name}
		/>
		<Input
			name="value"
			label="Value"
			type="text"
			placeholder="ADMIN"
			description="Enter the value of the role (usually uppercase)"
			bind:value={$form.value}
			errors={$errors.value}
		/>
		<Input
			name="description"
			label="Description"
			type="text"
			placeholder="Administrator role with full access"
			description="Enter a description of the role"
			bind:value={$form.description}
			errors={$errors.description}
		/>
		<div class="pt-4">
			<Button primary type="submit">Create Role</Button>
		</div>
	</form>
</div>

```

# src/routes/(admin)/admin/roles/new/+page.server.ts

```ts
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { create_role } from '$lib/server/db/role';
import { schema } from './schema';

export const load = async () => {
	const form = await superValidate(zod(schema));
	return {
		form
	};
};
export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		console.log(form.data);

		if (!form.valid) {
			return fail(400, { form });
		}

		const created_role_id = create_role(form.data);

		if (!created_role_id) {
			return message(form, 'Something went wrong.');
		}

		// Display a success status message
		redirect(302, '/admin/roles/');
	}
};

```

# src/routes/(app)/(account)/account/edit/+page.svelte

```svelte
<!-- sites/www/src/routes/(app)/(account)/account/edit/+page.svelte -->
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/ui/Button.svelte';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-2xl font-bold">Edit Profile</h1>

	<form use:enhance method="post" class="space-y-6 rounded-lg bg-white p-6 shadow-md">
		<div class="space-y-2">
			<label for="name" class="mb-2 block text-sm font-bold text-gray-700">Name:</label>
			<input
				type="text"
				id="name"
				name="name"
				bind:value={$form.name}
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.name}<p class="text-xs italic text-red-500">{$errors.name}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="username" class="mb-2 block text-sm font-bold text-gray-700">Username:</label>
			<input
				type="text"
				id="username"
				name="username"
				bind:value={$form.username}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.username}<p class="text-xs italic text-red-500">{$errors.username}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="bio" class="mb-2 block text-sm font-bold text-gray-700">Bio:</label>
			<textarea
				id="bio"
				name="bio"
				bind:value={$form.bio}
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			></textarea>
			{#if $errors.bio}<p class="text-xs italic text-red-500">{$errors.bio}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="location" class="mb-2 block text-sm font-bold text-gray-700">Location:</label>
			<input
				type="text"
				id="location"
				name="location"
				bind:value={$form.location}
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.location}<p class="text-xs italic text-red-500">{$errors.location}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="twitter" class="mb-2 block text-sm font-bold text-gray-700">Twitter:</label>
			<input
				type="text"
				id="twitter"
				name="twitter"
				bind:value={$form.twitter}
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.twitter}<p class="text-xs italic text-red-500">{$errors.twitter}</p>{/if}
		</div>

		<div class="flex items-center justify-between">
			<Button primary type="submit">Update Profile</Button>
		</div>
	</form>
</div>

```

# src/routes/(app)/(account)/account/edit/+page.server.ts

```ts
// sites/www/src/routes/(app)/(account)/account/edit/+page.server.ts
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { userService } from '$lib/server/db/services/user';

const schema = z.object({
    name: z.string().optional(),
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    bio: z.string().optional(),
    location: z.string().optional(),
    twitter: z.string().optional()
});

export const load = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }
    if (!locals.user) {
        throw redirect(302, '/account');
    }

    const form = await superValidate(locals.user, zod(schema));
    return { form };
};

export const actions = {
    default: async ({ request, locals }) => {
        const form = await superValidate(request, zod(schema));
        if (!form.valid) {
            return fail(400, { form });
        }
        try {
            await userService.update_user(locals.user.id, form.data);
            return message(form, 'Profile updated successfully.');
        } catch (error) {
            return message(form, 'Failed to update profile.', { status: 500 });
        }
    }
};
```

# src/routes/(admin)/admin/tags/new/+page.svelte

```svelte
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/ui/Button.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, enhance } = superForm(data.form);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">Create New Tag</h1>

	<form use:enhance method="post" class="space-y-6 rounded-lg bg-white p-6 shadow-md">
		<div class="space-y-2">
			<label for="name" class="mb-2 block text-sm font-bold text-gray-700">Name:</label>
			<input
				type="text"
				id="name"
				name="name"
				bind:value={$form.name}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.name}
				<p class="text-xs italic text-red-500">{$errors.name}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<label for="slug" class="mb-2 block text-sm font-bold text-gray-700">Slug:</label>
			<input
				type="text"
				id="slug"
				name="slug"
				bind:value={$form.slug}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.slug}
				<p class="text-xs italic text-red-500">{$errors.slug}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<label for="color" class="mb-2 block text-sm font-bold text-gray-700">Color:</label>
			<input
				type="color"
				id="color"
				name="color"
				bind:value={$form.color}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.color}
				<p class="text-xs italic text-red-500">{$errors.color}</p>
			{/if}
		</div>

		<div class="pt-4">
			<Button primary type="submit">Create Tag</Button>
		</div>
	</form>
</div>

```

# src/routes/(admin)/admin/tags/new/+page.server.ts

```ts
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { tagService } from '$lib/server/db/services/tags';
import type { PageServerLoad, Actions } from './$types';

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
});

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(schema));
    return { form };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema));
        if (!form.valid) {
            return fail(400, { form });
        }
        try {
            await tagService.create_tag(form.data);
            redirect(302, '/admin/tags');
        } catch (error) {
            return message(form, 'Failed to create tag. Please try again.');
        }
    }
};
```

# src/routes/(admin)/admin/roles/[id]/+page.svelte

```svelte
<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import Button from '$lib/ui/Button.svelte';

	const { data } = $props<{ form: any }>();
	const { form, errors, enhance } = superForm(data.form);
</script>

<form use:enhance method="post" class="mb-4 space-y-6 rounded bg-white px-8 pb-8 pt-6 shadow-md">
	<input type="hidden" id="id" name="id" value={$form.id} />

	<div class="mb-4">
		<label for="name" class="mb-2 block text-sm font-bold text-gray-700">Name:</label>
		<input
			type="text"
			id="name"
			name="name"
			bind:value={$form.name}
			required
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
		{#if $errors.name}
			<p class="text-xs italic text-red-500">{$errors.name}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="value" class="mb-2 block text-sm font-bold text-gray-700">Value:</label>
		<input
			type="text"
			id="value"
			name="value"
			bind:value={$form.value}
			required
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
		{#if $errors.value}
			<p class="text-xs italic text-red-500">{$errors.value}</p>
		{/if}
	</div>

	<div class="mb-4">
		<label for="description" class="mb-2 block text-sm font-bold text-gray-700">Description:</label>
		<input
			type="text"
			id="description"
			name="description"
			bind:value={$form.description}
			required
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
		{#if $errors.description}
			<p class="text-xs italic text-red-500">{$errors.description}</p>
		{/if}
	</div>

	<div class="mb-4 flex items-center">
		<label class="inline-flex items-center space-x-2">
			<span class="text-sm font-bold text-gray-700">Active:</span>
			<input
				type="checkbox"
				name="active"
				bind:checked={$form.active}
				class="form-checkbox text-blue-600"
			/>
		</label>
	</div>

	<div class="flex items-center justify-between">
		<Button primary type="submit">Update Role</Button>
	</div>
</form>

<SuperDebug data={$form} />

```

# src/routes/(admin)/admin/roles/[id]/+page.server.ts

```ts
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { update_role, get_role_by_id } from '$lib/server/db/role';

const schema = z.object({
    id: z.number(),
    name: z.string(),
    value: z.string(),
    description: z.string(),
    active: z.boolean()
});

export const load = (async ({ params }) => {
    const role = get_role_by_id(parseInt(params.id));

    if (!role) {
        redirect(302, '/admin/roles');
    }

    const form = await superValidate(role as z.infer<typeof schema>, zod(schema))
    return {
        form
    };
})
export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const updated_role = update_role(form.data);

        if (!updated_role) {
            return message(form, 'Something went wrong.');
        }

        // Display a success status message
        redirect(302, '/admin/roles');
    }
};
```

# src/routes/(admin)/admin/content/new/+page.svelte

```svelte
<!-- src/routes/content/new/+page.svelte -->
<script lang="ts">
	import AutoComplete from '$lib/ui/AutoComplete-Tags.svelte';
	import Button from '$lib/ui/Button.svelte';
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	$inspect(data.form);
	const { form, errors, enhance } = superForm(data.form);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-2xl font-bold">Create New Content</h1>

	<form use:enhance method="post" class="space-y-6 rounded-lg bg-white p-6 shadow-md">
		<div class="space-y-2">
			<label for="title" class="mb-2 block text-sm font-bold text-gray-700">Title:</label>
			<input
				type="text"
				id="title"
				name="title"
				bind:value={$form.title}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.title}<p class="text-xs italic text-red-500">{$errors.title}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="type" class="mb-2 block text-sm font-bold text-gray-700">Type:</label>
			<select
				id="type"
				name="type"
				bind:value={$form.type}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			>
				<option value="recipe">Recipe</option>
				<option value="video">Video</option>
			</select>
			{#if $errors.type}<p class="text-xs italic text-red-500">{$errors.type}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="body" class="mb-2 block text-sm font-bold text-gray-700">Body:</label>
			<div
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			>
				<MarkdownEditor name="body" bind:value={$form.body} />
			</div>
			{#if $errors.body}<p class="text-xs italic text-red-500">{$errors.body}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="slug" class="mb-2 block text-sm font-bold text-gray-700">Slug:</label>
			<input
				type="text"
				id="slug"
				name="slug"
				bind:value={$form.slug}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.slug}<p class="text-xs italic text-red-500">{$errors.slug}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="description" class="mb-2 block text-sm font-bold text-gray-700"
				>Description:</label
			>
			<textarea
				id="description"
				name="description"
				bind:value={$form.description}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			></textarea>
			{#if $errors.description}<p class="text-xs italic text-red-500">{$errors.description}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="description" class="mb-2 block text-sm font-bold text-gray-700">Tags:</label>
			<AutoComplete
				tags={data.tags}
				bind:selectedTags={$form.tags}
				placeholder="Type to search or create a tag"
			/>
			{#if $errors.description}<p class="text-xs italic text-red-500">{$errors.description}</p>{/if}
		</div>

		<div class="pt-4">
			<Button primary type="submit">Create Content</Button>
		</div>
	</form>
</div>

<SuperDebug data={$form} />

```

# src/routes/(admin)/admin/content/new/+page.server.ts

```ts
// src/routes/content/new/+page.server.ts
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { contentService } from '$lib/server/db/services/content';
import { tagService } from '$lib/server/db/services/tags';

const schema = z.object({
	title: z.string().min(1, 'Title is required'),
	type: z.enum(['recipe', 'video']),
	body: z.string().min(1, 'Body is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().min(1, 'Description is required'),
	tags: z.array(z.number()).min(1, 'At least one tag is required')
});

export const load = async () => {
	const result = await tagService.get_tags()

	if (!result.success) {
		fail(400, { message: 'Error getting tags' });
	}

	const form = await superValidate(zod(schema));
	return {
		form,
		tags: result.data
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await contentService.create_content(form.data);
			redirect(302, '/content');
		} catch (error) {
			return message(form, 'Failed to create content.');
		}
	}
};

```

# src/routes/(admin)/admin/content/[id]/+page.svelte

```svelte
<!-- src/routes/content/[id]/edit/+page.svelte -->
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import AutoComplete from '$lib/ui/AutoComplete-Tags.svelte';
	import Button from '$lib/ui/Button.svelte';
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte';

	let { data } = $props();
	let { form, errors, enhance } = superForm(data.form);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-2xl font-bold">Edit Content</h1>

	<form use:enhance method="post" class="space-y-6 rounded-lg bg-white p-6 shadow-md">
		<input type="hidden" id="id" name="id" bind:value={$form.id} />

		<div class="space-y-2">
			<label for="title" class="mb-2 block text-sm font-bold text-gray-700">Title:</label>
			<input
				type="text"
				id="title"
				name="title"
				bind:value={$form.title}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.title}<p class="text-xs italic text-red-500">{$errors.title}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="type" class="mb-2 block text-sm font-bold text-gray-700">Type:</label>
			<select
				id="type"
				name="type"
				bind:value={$form.type}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			>
				<option value="recipe">Recipe</option>
				<option value="video">Video</option>
			</select>
			{#if $errors.type}<p class="text-xs italic text-red-500">{$errors.type}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="body" class="mb-2 block text-sm font-bold text-gray-700">Body:</label>
			<div
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			>
				<MarkdownEditor name="body" bind:value={$form.body} />
			</div>
			{#if $errors.body}<p class="text-xs italic text-red-500">{$errors.body}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="slug" class="mb-2 block text-sm font-bold text-gray-700">Slug:</label>
			<input
				type="text"
				id="slug"
				name="slug"
				bind:value={$form.slug}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.slug}<p class="text-xs italic text-red-500">{$errors.slug}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="description" class="mb-2 block text-sm font-bold text-gray-700"
				>Description:</label
			>
			<textarea
				id="description"
				name="description"
				bind:value={$form.description}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			></textarea>
			{#if $errors.description}<p class="text-xs italic text-red-500">{$errors.description}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="description" class="mb-2 block text-sm font-bold text-gray-700">Tags:</label>
			<AutoComplete
				tags={data.tags}
				bind:selectedTags={$form.tags}
				placeholder="Type to search or create a tag"
			/>
			{#if $errors.description}<p class="text-xs italic text-red-500">{$errors.description}</p>{/if}
		</div>

		<div class="flex items-center justify-between">
			<Button primary type="submit">Update Content</Button>
		</div>
	</form>
</div>

```

# src/routes/(admin)/admin/content/[id]/+page.server.ts

```ts
// src/routes/content/[id]/edit/+page.server.ts
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { contentService } from '$lib/server/db/services/content';
import { tagService } from '$lib/server/db/services/tags';
import { tags } from '$lib/server/db/schema.js';

const schema = z.object({
	id: z.number(),
	title: z.string().min(1, 'Title is required'),
	type: z.enum(['recipe', 'video']),
	body: z.string().min(1, 'Body is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().min(1, 'Description is required'),
	tags: z.array(z.number()).min(1, 'At least one tag is required')
});

export const load = async ({ params }) => {
	// const result = await contentService.get_content(parseInt(params.id));
	const [res_content, res_tags] = await Promise.all([
		contentService.get_content(params.id),
		tagService.get_tags()
	]);
	if (!res_content.data || !res_tags.data) {
		redirect(302, '/content');
	}

	const dto = { ...res_content.data, tags: res_content.data.tags.map(t => t.id) }

	const form = await superValidate(dto, zod(schema));
	return {
		form,
		tags: res_tags.data
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			await contentService.update_content(form.data.id, form.data);
			redirect(304, '/content');
		} catch (error) {
			return message(form, 'Failed to update content.');
		}
	}
};

```

# src/routes/(admin)/admin/collections/new/schema.ts

```ts
import { z } from 'zod';

export const schema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	children: z.array(z.number()).min(1, 'You need to select at least one content item'),
	slug: z.string().min(1, 'Slug is required')
});

```

# src/routes/(admin)/admin/collections/new/ContentSelector.svelte

```svelte
<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Input from '$lib/ui/form/Input.svelte';

	interface ContentItem {
		id: number;
		title: string;
		type: string;
	}

	interface Props {
		selectedIds: number[];
		name: string;
		errors?: any;
		description?: string;
	}

	let { selectedIds = $bindable([]), name, description, errors }: Props = $props();
	let searchQuery = $state('');
	let showModal = $state(false);
	let contentItems: ContentItem[] = $state([]);
	let filteredItems = $derived.by(() => {
		return contentItems.filter((item) =>
			item.title.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	function toggleModal() {
		showModal = !showModal;
		if (showModal) {
			searchContent();
		}
	}

	async function searchContent() {
		// TODO: Implement actual API call to search content
		contentItems = [
			{ id: 1, title: 'Recipe 1', type: 'recipe' },
			{ id: 2, title: 'Video Tutorial', type: 'video' },
			{ id: 3, title: 'Blog Post', type: 'blog' },
			{ id: 4, title: 'Library Book', type: 'library' },
			{ id: 5, title: 'Collection Summer', type: 'collection' }
		];
	}

	function selectItem(item: ContentItem) {
		if (!selectedIds.includes(item.id)) {
			selectedIds = [...selectedIds, item.id];
		} else {
			unselectItem(item.id);
		}
	}

	function unselectItem(id: number) {
		selectedIds = selectedIds.filter((itemId: number) => itemId !== id);
	}

	let selectedItems = $derived.by(() => {
		return selectedIds
			.map((id: number) => contentItems.find((item) => item.id === id))
			.filter(Boolean) as ContentItem[];
	});
</script>

<div class="content-selector">
	<div class="mb-4 grid grid-cols-1 items-start gap-2 sm:grid-cols-[1fr_auto]">
		<Input
			disabled
			placeholder="Learn how to use the best runes in Svelte"
			type="text"
			{description}
			errors={errors?._errors}
			value={selectedIds.join(', ')}
		/>
		<Button type="button" onclick={toggleModal} primary>Select Content</Button>
	</div>
	{#if showModal}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div
				class="w-full max-w-2xl rounded-lg bg-white p-6"
				role="dialog"
				aria-labelledby="modal-title"
			>
				<h2 id="modal-title" class="mb-4 text-2xl font-bold">Select Content</h2>
				<input
					type="text"
					placeholder="Search content..."
					bind:value={searchQuery}
					class="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<div class="mb-4 max-h-96 overflow-y-auto rounded-md border border-gray-200">
					{#each filteredItems as item}
						<div
							class="flex items-center justify-between border-b border-gray-200 p-3 last:border-b-0 hover:bg-gray-50"
						>
							<span>
								{item.title}
								<span class="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs">{item.type}</span>
							</span>
							<Button
								small
								type="button"
								onclick={() => selectItem(item)}
								secondary={selectedIds.includes(item.id)}
								primary={!selectedIds.includes(item.id)}
								>{selectedIds.includes(item.id) ? 'Remove' : 'Select'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="ml-1"
								>
									{#if selectedIds.includes(item.id)}
										<path d="M18 6 6 18"></path>
										<path d="m6 6 12 12"></path>
									{:else}
										<path d="M20 6 9 17l-5-5"></path>
									{/if}
								</svg></Button
							>
						</div>
					{/each}
				</div>
				<div class="flex justify-end">
					<button
						type="button"
						onclick={toggleModal}
						class="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	{/if}
	{#if selectedItems.length > 0}
		<div class="mb-4 overflow-hidden rounded-md border">
			{#each selectedItems as item, index (item.id)}
				<div
					class="flex cursor-move items-center border-b bg-white p-2 last:border-b-0 hover:bg-gray-50"
					data-sveltekit-preload-data="off"
				>
					<span class="mr-3 w-8 text-right text-gray-500">{index + 1}.</span>
					<a href={`/content/${item.id}`} class="mr-2 flex-grow text-blue-600 hover:underline"
						>{item.title}</a
					>
					<span class="mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs">{item.type}</span>
					<button
						type="button"
						onclick={() => unselectItem(item.id)}
						class="text-gray-500 hover:text-gray-700"
						aria-label={`Remove ${item.title}`}
					>
						&times;
					</button>
					<input type="checkbox" hidden checked {name} value={item.id} class="hidden" />
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	input.error {
		@apply border-red-300 bg-red-50 text-red-600;
	}
	div .error {
		@apply text-red-600;
	}
</style>

```

# src/routes/(admin)/admin/collections/new/+page.svelte

```svelte
<script lang="ts">
	import ContentSelector from './ContentSelector.svelte';
	import Input from '$lib/ui/form/Input.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { schema } from './schema';

	import { superForm } from 'sveltekit-superforms';
	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form, zod(schema));
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Collection</h1>
	<form method="POST" use:enhance class="space-y-6">
		<Input
			name="title"
			label="Title"
			type="text"
			placeholder="Best Rune Tutorials"
			description="Enter the title of the collection"
			bind:value={$form.title}
			errors={$errors.title}
		/>
		<Input
			name="slug"
			label="Slug"
			placeholder="best-rune-tutorials"
			description="Enter the slug of the collection"
			type="text"
			bind:value={$form.slug}
			errors={$errors.slug}
		/>
		<Input
			name="description"
			label="Description"
			type="text"
			placeholder="Learn how to use the best runes in Svelte"
			description="Enter the description of the collection"
			bind:value={$form.description}
			errors={$errors.description}
		/>
		<div>
			<ContentSelector
				name="children"
				bind:selectedIds={$form.children}
				errors={$errors.children}
				description="Select content to add to the collection"
			/>
		</div>

		<button
			type="submit"
			class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		>
			Create Collection
		</button>
	</form>
</div>

```

# src/routes/(admin)/admin/collections/new/+page.server.ts

```ts
import { create_content } from '$lib/server/db/content';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { schema } from './schema.ts'

export const load = async () => {
    const form = await superValidate(zod(schema));

    return {
        form
    }
};

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const result = create_content({
            title: form.data.title,
            description: form.data.description,
            children: form.data.children,
            slug: form.data.slug,
            type: 'collection'
        });

        if (result) {
            redirect(303, '/admin/collections');
        } else {
            error(500, 'Failed to create collection');
        }
    }
};
```

# src/routes/(admin)/admin/users/[id]/+page.svelte

```svelte
<script lang="ts">
	import Select from '$lib/ui/Select.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Avatar from '$lib/ui/Avatar.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, enhance } = superForm(data.form);
</script>

<form use:enhance method="post" class="space-y-6 rounded-lg bg-white p-6 shadow-md">
	<input type="hidden" id="id" name="id" bind:value={$form.id} />

	<div class="space-y-2">
		<label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
		<input
			type="text"
			id="username"
			name="username"
			bind:value={$form.username}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.username}
			<p class="text-xs italic text-red-500">{$errors.username}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
		<input
			type="email"
			id="email"
			name="email"
			bind:value={$form.email}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.email}
			<p class="text-xs italic text-red-500">{$errors.email}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="bio" class="block text-sm font-medium text-gray-700">Bio:</label>
		<input
			type="text"
			id="bio"
			name="bio"
			bind:value={$form.bio}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.bio}
			<p class="text-xs italic text-red-500">{$errors.bio}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="location" class="block text-sm font-medium text-gray-700">Location:</label>
		<input
			type="text"
			id="location"
			name="location"
			bind:value={$form.location}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.location}
			<p class="text-xs italic text-red-500">{$errors.location}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="twitter" class="block text-sm font-medium text-gray-700">Twitter:</label>
		<input
			type="text"
			id="twitter"
			name="twitter"
			bind:value={$form.twitter}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.twitter}
			<p class="text-xs italic text-red-500">{$errors.twitter}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="avatar_url" class="block text-sm font-medium text-gray-700">Avatar URL:</label>
		<div class="flex items-center space-x-4">
			<Avatar src={$form.avatar_url} name={$form.username} />
			<input
				type="text"
				id="avatar_url"
				name="avatar_url"
				bind:value={$form.avatar_url}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			/>
		</div>
		{#if $errors.avatar_url}
			<p class="text-xs italic text-red-500">{$errors.avatar_url}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<div class="space-y-2">
			<label for="role" class="block text-sm font-medium text-gray-700">Role:</label>
			<Select
				options={data.roles}
				bind:value={$form.role_id}
				placeholder="Choose a role"
				name="role_id"
			/>
		</div>
	</div>

	<div class="pt-4">
		<Button primary type="submit">Edit User</Button>
	</div>
</form>

<SuperDebug data={$form} />

```

# src/routes/(admin)/admin/users/[id]/+page.server.ts

```ts
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { roleService } from '$lib/server/db/services/roles';
import { userService } from '$lib/server/db/services/user.js';

const schema = z.object({
	id: z.number(),
	username: z.string(),
	email: z.string().email().nullable(),
	bio: z.string().nullable(),
	location: z.string().nullable(),
	twitter: z.string().nullable(),
	avatar_url: z.string().nullable(),
	role_id: z.number().nullable()
});

export const load = async ({ params }) => {
	const [user_result, roles_result] = await Promise.all([
		userService.get_user(parseInt(params.id)),
		roleService.get_active_roles()
	]);

	if (!user_result.data) {
		redirect(302, '/admin/users');
	}

	const form = await superValidate(user_result.data as z.infer<typeof schema>, zod(schema));
	return {
		user: user_result.data,
		roles: roles_result.data.map((r) => ({ ...r, label: r.name, value: r.id })),
		form
	};
};
export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { success } = await userService.update_user(form.data.id as number, form.data);

		if (!success) {
			return message(form, 'Something went wrong.');
		}

		// Display a success status message
		redirect(302, '/admin/users');
	}
};

```

# src/routes/(admin)/admin/moderation/[id]/+page.svelte

```svelte
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ item, submitter } = data);

	function formatJSON(obj: any): string {
		return JSON.stringify(obj, null, 2);
	}

	function getStatusColor(status: string): string {
		switch (status.toLowerCase()) {
			case 'pending':
				return 'bg-yellow-200 text-yellow-800';
			case 'approved':
				return 'bg-green-200 text-green-800';
			case 'rejected':
				return 'bg-red-200 text-red-800';
			default:
				return 'bg-gray-200 text-gray-800';
		}
	}

	function getRoleColor(role: string): string {
		switch (role.toLowerCase()) {
			case 'admin':
				return 'bg-purple-200 text-purple-800';
			case 'moderator':
				return 'bg-blue-200 text-blue-800';
			case 'user':
				return 'bg-gray-200 text-gray-800';
			default:
				return 'bg-gray-200 text-gray-800';
		}
	}
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">Moderation Item: {item.id}</h1>
	<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-xl font-semibold">Item Details</h2>
			<div class="space-y-3">
				<p><strong>Type:</strong> {item.type}</p>
				<p>
					<strong>Status:</strong>
					<span
						class={`ml-2 inline-block rounded-full px-2 py-1 text-sm font-semibold ${getStatusColor(item.status)}`}
					>
						{item.status}
					</span>
				</p>
				<p><strong>Submitted:</strong> {new Date(item.submitted_at).toLocaleString()}</p>
			</div>
		</div>
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-xl font-semibold">Submitter</h2>
			<div class="mb-4 flex items-center">
				{#if submitter.avatar_url}
					<img
						src={submitter.avatar_url}
						alt={submitter.name}
						class="mr-4 h-12 w-12 rounded-full"
					/>
				{:else}
					<div class="mr-4 h-12 w-12 rounded-full bg-gray-200"></div>
				{/if}
				<div>
					<p class="font-medium">{submitter.name}</p>
					<p class="text-sm text-gray-600">@{submitter.username}</p>
				</div>
			</div>
			<div class="space-y-2">
				<p><strong>Email:</strong> {submitter.email}</p>
				<p>
					<strong>Role:</strong>
					<span
						class={`ml-2 inline-block rounded-full px-2 py-1 text-sm font-semibold ${getRoleColor(submitter.role)}`}
					>
						{submitter.role}
					</span>
				</p>
			</div>
		</div>
	</div>
	<div class="mb-6 rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-xl font-semibold">Submission Data</h2>
		<pre class="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
      {formatJSON(JSON.parse(item.data))}
    </pre>
	</div>
	<div class="mb-6 flex items-center justify-between">
		<a href="/admin/moderation" class="text-blue-500 hover:text-blue-600"> &larr; Back to Queue </a>
		<div class="flex space-x-4">
			<form method="POST" action="?/reject" use:enhance>
				<button class="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600">
					Reject
				</button>
			</form>
			<form method="POST" action="?/approve" use:enhance>
				<button class="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600">
					Approve
				</button>
			</form>
		</div>
	</div>
</div>

```

# src/routes/(admin)/admin/moderation/[id]/+page.server.ts

```ts
import { get_moderation_queue_item, update_moderation_status, get_moderation_queue_paginated } from '$lib/server/db/moderation';
import { get_user } from '$lib/server/db/user';
import { get_role_by_id } from '$lib/server/db/role';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const id = parseInt(params.id);
    const item = get_moderation_queue_item(id);

    if (!item) {
        throw error(404, 'Item not found');
    }

    const submitter = get_user(item.submitted_by);

    if (!submitter) {
        throw error(404, 'Submitter not found');
    }

    const role = get_role_by_id(submitter.role);


    return { item, submitter: { ...submitter, role: role?.name } };
};

export const actions: Actions = {
    approve: async ({ params, request }) => {
        const id = parseInt(params.id);
        update_moderation_status(id, 'approved', 1); // Replace 1 with actual user ID
        return await getNextItem(id);
    },
    reject: async ({ params, request }) => {
        const id = parseInt(params.id);
        update_moderation_status(id, 'rejected', 1); // Replace 1 with actual user ID
        return await getNextItem(id);
    }
};

async function getNextItem(currentId: number) {
    const nextItems = await get_moderation_queue_paginated({
        status: 'pending',
        limit: 1,
        offset: 0
    });

    if (nextItems.length > 0 && nextItems[0].id !== currentId) {
        throw redirect(302, `/moderation/${nextItems[0].id}`);
    } else {
        throw redirect(302, '/admin/moderation');
    }
}
```

# src/routes/(app)/(public)/tags/[slug]/+page.svelte

```svelte
<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';

	let { data } = $props();
</script>

<!-- <Tag tag={data.tag.filter} /> -->
<div class="grid gap-6">
	{#each data.content as item}
		<ContentCard {...item} author="John Doe" views="11114">
			{item.description}</ContentCard
		>
	{/each}
</div>

```

# src/routes/(app)/(public)/tags/[slug]/+page.server.ts

```ts
import type { PageServerLoad } from './$types';
import { get_content_by_tag, get_tags_for_content } from '$lib/server/db/content';
import { get_user_likes_and_saves } from '$lib/server/db/interactions';

export const load: PageServerLoad = async ({ params, locals }) => {
    const content = await get_content_by_tag({ slug: params.slug });
    const tags = get_tags_for_content(content.map(c => c.id))
    let content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }))

    if (locals.user) {
        const { user_likes, user_saves } = get_user_likes_and_saves(locals.user.id, content.map(c => c.id))

        content_with_tags = content_with_tags.map((c, i) => ({
            ...c,
            liked: user_likes.has(c.id),
            saved: user_saves.has(c.id)
        }))
    }

    return { content: content_with_tags };
};
```

# src/routes/(app)/(public)/[type]/[slug]/+page.svelte

```svelte
<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';

	let { data } = $props();
</script>

<ContentCard {...data.content} />

AuthorCard goes here

```

# src/routes/(app)/(public)/[type]/[slug]/+page.server.ts

```ts
import { get_content_by_slug, get_tags_for_content } from '$lib/server/db/content';
import { get_user_likes_and_saves } from '$lib/server/db/interactions';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
    const content = get_content_by_slug(params.slug);

    const tags = get_tags_for_content([content.id])
    let content_with_tags = [content].map((c, i) => ({ ...c, tags: tags[i] || [] }))

    if (locals.user) {
        const { user_likes, user_saves } = get_user_likes_and_saves(locals.user.id, [content].map(c => c.id))

        content_with_tags = content_with_tags.map((c, i) => ({
            ...c,
            liked: user_likes.has(c.id),
            saved: user_saves.has(c.id)
        }))
    }

    if (!content) {
        fail(400, { message: 'Error getting content' });
    }


    return { content: content_with_tags[0] };

};
```

# src/routes/(admin)/admin/collections/[id]/+page.svelte

```svelte
<script lang="ts">
	import SuperDebug from 'sveltekit-superforms';
	import ContentSelector from '../new/ContentSelector.svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, enhance, constraints } = superForm(data.form);
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit Collection</h1>
	<form method="POST" use:enhance class="space-y-6">
		<input type="hidden" name="id" bind:value={$form.id} />
		<div>
			<label for="title" class="mb-1 block text-sm font-medium text-gray-700">Title:</label>
			<input
				{...$constraints.title}
				id="title"
				name="title"
				bind:value={$form.title}
				required
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
			/>
		</div>
		<div>
			<label for="slug" class="mb-1 block text-sm font-medium text-gray-700">Slug:</label>
			<input
				{...$constraints.slug}
				id="slug"
				name="slug"
				bind:value={$form.slug}
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
			/>
		</div>
		<div>
			<label for="description" class="mb-1 block text-sm font-medium text-gray-700"
				>Description:</label
			>
			<textarea
				{...$constraints.description}
				id="description"
				name="description"
				bind:value={$form.description}
				class="h-32 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
			></textarea>
		</div>
		<div>
			<ContentSelector name="children" bind:selectedIds={$form.children} />
		</div>
		<button
			type="submit"
			class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		>
			Update Collection
		</button>
	</form>
</div>

```

# src/routes/(admin)/admin/collections/[id]/+page.server.ts

```ts
import { get_content_by_id, update_content } from '$lib/server/db/content';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
    id: z.number(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    children: z.array(z.number()).min(1, 'Children are required'),
    slug: z.string().min(1, 'Slug is required')
});

export const load: PageServerLoad = async ({ params }) => {
    const id = parseInt(params.id);
    const collection = await get_content_by_id(id);

    if (!collection) {
        throw error(404, 'Collection not found');
    }

    const form = await superValidate(collection, zod(schema));
    return {
        form
    };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema));
        if (!form.valid) {
            return fail(400, { form });
        }

        const result = await update_content({
            id: form.data.id,
            title: form.data.title,
            description: form.data.description,
            children: form.data.children,
            slug: form.data.slug,
            type: 'collection'
        });

        if (result) {
            throw redirect(303, '/admin/collections');
        } else {
            throw error(500, 'Failed to update collection');
        }
    }
};
```

