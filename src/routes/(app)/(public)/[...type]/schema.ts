import { z } from 'zod'

export const schema = z.object({
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    search: z.string().optional(),
})
