import { TagSchema } from '$lib/schema/tags'
import { z } from 'zod'

export type Tag = z.infer<typeof TagSchema>