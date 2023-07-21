import { z } from 'zod';

export const entrySchema = z.array(
	z.object({
		title: z.string(),
		url: z.string(),
		description: z.string(),
		npm: z.string().optional(),
		addedOn: z.string(),
		category: z.string().optional(),
		tags: z.array(z.string()).optional(),
		stars: z.number().optional()
	})
);
