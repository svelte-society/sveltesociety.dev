import { z } from 'zod';

export const componentsSchema = z.array(
	z.object({
		title: z.string(),
		url: z.string().optional(),
		repository: z.string(),
		description: z.string(),
		npm: z.string(),
		category: z.string(),
		tags: z.array(z.string()).optional()
	})
);

export const templatesSchema = z.array(
	z.object({
		title: z.string(),
		repository: z.string(),
		description: z.string(),
		category: z.string(),
		tags: z.array(z.string()).optional()
	})
);

export const toolsSchema = z.array(
	z.object({
		title: z.string(),
		repository: z.string(),
		description: z.string(),
		category: z.string(),
		tags: z.array(z.string()).optional()
	})
);
