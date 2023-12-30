import { z } from 'zod';
import { packageNameRegex } from 'package-name-regex';

export const packagesSchema = z.array(
	z.object({
		title: z.string().max(50),
		npm: z.string().regex(packageNameRegex),
		url: z.string().url().optional(),
		repository: z.string().url(),
		description: z.string().max(250),
		category: z.enum([
			'bundler-plugins',
			'css-and-layout',
			'data-visualisation',
			'debugging',
			'design-pattern',
			'design-system',
			'developer-experience',
			'display-components',
			'forms-and-user-input',
			'icons',
			'integration',
			'internationalization',
			'linting-and-formatting',
			'multimedia',
			'preprocessors',
			'routers',
			'stores',
			'sveltekit-adapters',
			'testing',
			'user-interaction'
		]),
		tags: z
			.array(
				z.enum([
					'animations',
					'async-data',
					'async-loading',
					'audio',
					'auth',
					'charts',
					'cli-tools',
					'components-and-libraries',
					'development-and-documentation',
					'fonts-and-icons',
					'forms-and-validation',
					'graphql',
					'images',
					'in-page-navigation',
					'inputs-and-widgets',
					'integrations',
					'interactions',
					'internationalization',
					'intersection-observer',
					'jsx',
					'layout-and-structure',
					'maps',
					'markdown',
					'modals',
					'native',
					'network-events',
					'notifications',
					'offline-and-online-detection',
					'routers',
					'ssr',
					'stores-and-state',
					'testing',
					'third-party-services',
					'time-and-date',
					'typescript',
					'video',
					'viewport'
				])
			)
			.max(5)
	})
);

export const templatesSchema = z.array(
	z.object({
		title: z.string().max(50),
		url: z.string().url().optional(),
		repository: z.string().url(),
		description: z.string().max(250),
		category: z.enum(['svelte-add', 'sveltekit', 'svelte']),
		tags: z
			.array(
				z.enum([
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
					'testing',
					'typescript',
					'webpack'
				])
			)
			.max(5)
	})
);
