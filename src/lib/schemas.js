import { z } from 'zod';
import { packageNameRegex } from 'package-name-regex';

const PACKAGES_TAGS = /** @type {const} */ ([
	'animations',
	'audio-and-video',
	'auth',
	'bundler-plugins',
	'charts',
	'cli-tools',
	'css-and-layout',
	'data-fetching',
	'data-visualisation',
	'date-and-time',
	'design-pattern',
	'design-system',
	'developer-experience',
	'documentation',
	'forms-and-input',
	'headless',
	'icons-and-fonts',
	'images',
	'in-page-navigation',
	'integrations',
	'internationalization',
	'intersection-observer',
	'layout-and-structure',
	'linting-and-formatting',
	'markdown',
	'modals',
	'multimedia',
	'network-events',
	'notifications',
	'official',
	'preprocessors',
	'routers',
	'seo',
	'ssr',
	'stores-and-state',
	'sveltekit-adapters',
	'testing',
	'typescript',
	'ui-components',
	'user-interaction',
	'validation'
]);

export const packagesSchema = z.array(
	z.object({
		title: z.string().max(50),
		npm: z.string().regex(packageNameRegex),
		url: z.string().url().optional(),
		repository: z.string().url(),
		description: z.string().max(250),
		tags: z.array(z.enum(PACKAGES_TAGS)).min(1).max(6)
	})
);

const TEMPLATES_TAGS = /** @type {const} */ ([
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
		tags: z.array(z.enum(TEMPLATES_TAGS)).min(1).max(6)
	})
);
