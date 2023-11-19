import { z } from 'zod';
import packageNameRegex from 'package-name-regex';

export const componentsSchema = z.array(
	z.object({
		title: z.string(),
		npm: z.string().regex(packageNameRegex),
		url: z.string().url().optional(),
		repository: z.string().url(),
		description: z.string(),
		category: z.enum([
			'Display Components',
			'Developer Experience',
			'Internationalization',
			'CSS and Layout',
			'Icons',
			'Multimedia',
			'Testing',
			'Data Visualisation',
			'Integration',
			'Design Pattern',
			'Stores',
			'Routers',
			'SvelteKit Adapters',
			'Design System',
			'User Interaction',
			'Forms & User Input'
		]),
		tags: z.array(z.string()).optional()
	})
);

export const templatesSchema = z.array(
	z.object({
		title: z.string(),
		url: z.string().url().optional(),
		repository: z.string().url(),
		description: z.string(),
		category: z.enum(['Svelte Add', 'SvelteKit', 'Svelte']),
		tags: z.array(z.string()).optional()
	})
);

export const toolsSchema = z.array(
	z.object({
		title: z.string(),
		npm: z.string().regex(packageNameRegex).optional(),
		url: z.string().url().optional(),
		repository: z.string().url(),
		description: z.string(),
		category: z.enum([
			'Debugging',
			'Linting and Formatting',
			'Editor Extensions',
			'Bundler Plugins',
			'Preprocessors'
		]),
		tags: z.array(z.string()).optional()
	})
);
