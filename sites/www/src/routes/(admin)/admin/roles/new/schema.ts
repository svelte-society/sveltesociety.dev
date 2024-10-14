import { z } from 'zod'

export const schema = z.object({
	name: z.string(),
	value: z.string(),
	description: z.string(),
	active: z.boolean()
})
