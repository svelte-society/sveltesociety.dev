import { roleSchema, createRoleSchema, updateRoleSchema } from '$lib/schema/roles'
import type { z } from 'zod'

export type Role = z.infer<typeof roleSchema>
export type CreateRole = z.infer<typeof createRoleSchema>
export type UpdateRole = z.infer<typeof updateRoleSchema>
