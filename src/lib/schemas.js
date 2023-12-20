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
			'Bundler Plugins',
			'CSS and Layout',
			'Data Visualisation',
			'Debugging',
			'Design Pattern',
			'Design System',
			'Developer Experience',
			'Display Components',
			'Forms & User Input',
			'Icons',
			'Integration',
			'Internationalization',
			'Linting and Formatting',
			'Multimedia',
			'Preprocessors',
			'Routers',
			'Stores',
			'SvelteKit Adapters',
			'Testing',
			'User Interaction'
		]),
		tags: z.array(z.string()).max(5).optional()
	})
);

export const templatesSchema = z.array(
	z.object({
		title: z.string().max(50),
		url: z.string().url().optional(),
		repository: z.string().url(),
		description: z.string().max(250),
		category: z.enum(['Svelte Add', 'SvelteKit', 'Svelte']),
		tags: z.array(z.string()).max(5).optional()
	})
);
