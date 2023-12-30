import { z } from 'zod';
import { packageNameRegex } from 'package-name-regex';

export const PACKAGES_TAGS = /** @type {const} */ ([
	'animations',
	'async-data',
	'async-loading',
	'audio',
	'auth',
	'bundler-plugins',
	'charts',
	'cli-tools',
	'components-and-libraries',
	'css-and-layout',
	'data-visualisation',
	'debugging',
	'design-pattern',
	'design-system',
	'developer-experience',
	'development-and-documentation',
	'display-components',
	'fonts-and-icons',
	'forms-and-user-input',
	'forms-and-validation',
	'graphql',
	'icons',
	'images',
	'in-page-navigation',
	'inputs-and-widgets',
	'integration',
	'integrations',
	'interactions',
	'internationalization',
	'internationalization',
	'intersection-observer',
	'jsx',
	'layout-and-structure',
	'linting-and-formatting',
	'maps',
	'markdown',
	'modals',
	'multimedia',
	'native',
	'network-events',
	'notifications',
	'offline-and-online-detection',
	'preprocessors',
	'routers',
	'routers',
	'ssr',
	'stores',
	'stores-and-state',
	'sveltekit-adapters',
	'testing',
	'testing',
	'third-party-services',
	'time-and-date',
	'typescript',
	'user-interaction',
	'video',
	'viewport'
]);

export const packagesSchema = z.array(
	z.object({
		title: z.string().max(50),
		npm: z.string().regex(packageNameRegex),
		url: z.string().url().optional(),
		repository: z.string().url(),
		description: z.string().max(250),
		tags: z.array(z.enum(PACKAGES_TAGS)).max(6)
	})
);

export const TEMPLATES_TAGS = /** @type {const} */ ([
	'blog',
	'code-splitting',
	'component-sets',
	'components-and-libraries',
	'database',
	'electron',
	'integrations',
	'lazy-loading',
	'markdown',
	'mdsvex',
	'mobile',
	'preprocessors',
	'seo',
	'ssr',
	'stores-and-state',
	'storybook',
	'svelte',
	'svelte-add',
	'sveltekit',
	'testing',
	'typescript',
	'webpack'
]);

export const templatesSchema = z.array(
	z.object({
		title: z.string().max(50),
		url: z.string().url().optional(),
		repository: z.string().url(),
		description: z.string().max(250),
		tags: z.array(z.enum(TEMPLATES_TAGS)).max(6)
	})
);
