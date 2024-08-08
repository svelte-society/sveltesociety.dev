import { z } from 'zod';

export const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['recipe', 'video']),
    body: z.string().min(1, 'Body is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    tags: z.array(z.number()).min(1, 'At least one tag is required')
});