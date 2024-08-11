import { z } from 'zod';

export const schema = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().email().optional().default(''),
    bio: z.string().optional().default(''),
    location: z.string().optional().default(''),
    twitter: z.string().optional().default(''),
    avatar_url: z.string(),
    role_id: z.number()
});