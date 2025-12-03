import { z } from 'zod/v4'

export const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  created_at: z.string(),
  updated_at: z.string()
})

export type Tag = z.infer<typeof tagSchema>

export const createTagSchema = tagSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
})

export const updateTagSchema = tagSchema.omit({
  created_at: true,
  updated_at: true
})

export const deleteTagSchema = tagSchema.pick({
  id: true
})
