import { z } from 'zod'

export const roleSchema = z.object({
	id: z.string(),
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
	id: true,
	created_at: true
})
