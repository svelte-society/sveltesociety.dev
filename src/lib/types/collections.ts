import { z } from 'zod'
import { collectionSchema } from '$lib/schema/collections'

export type Collection = z.infer<typeof collectionSchema>