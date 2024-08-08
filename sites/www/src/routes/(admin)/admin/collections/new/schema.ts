import { z } from 'zod';

export const schema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	children: z.array(z.number()).min(1, 'You need to select at least one content item'),
	slug: z.string().min(1, 'Slug is required')
});
