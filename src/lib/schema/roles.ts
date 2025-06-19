import { z } from 'zod/v4'

export const roleSchema = z.object({
	id: z.number(),
	name: z.string(),
	value: z.string(),
	description: z.string(),
	active: z.boolean(),
	created_at: z.string()
})

export const createRoleSchema = roleSchema.omit({
	id: true,
	created_at: true
})

export const updateRoleSchema = roleSchema.omit({
	created_at: true
})
