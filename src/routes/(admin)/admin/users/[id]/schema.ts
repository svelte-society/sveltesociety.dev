import { z } from 'zod/v4'

export const schema = z.object({
	id: z.string(),
	username: z.string(),
	email: z.email().or(z.string().default('')),
	bio: z.string().optional().default(''),
	location: z.string().optional().default(''),
	twitter: z.string().optional().default(''),
	avatar_url: z.string(),
	role: z.number()
})
