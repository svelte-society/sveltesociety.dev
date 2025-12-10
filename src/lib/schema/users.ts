import { z } from 'zod/v4'

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(1, 'Username is required'),
  email: z.email().or(z.string().default('')),
  bio: z.string().optional().default(''),
  location: z.string().optional().default(''),
  twitter: z.string().optional().default(''),
  avatar_url: z.string().default(''),
  role: z.number()
})

export type UserUpdate = z.infer<typeof userSchema>

export const updateUserSchema = userSchema

export const updateUserRoleSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  role: z.number()
})

export const deleteUserSchema = z.object({
  id: z.string().min(1, 'User ID is required')
})

export const clearSessionsSchema = z.object({
  id: z.string().min(1, 'User ID is required')
})

export const getUsersSchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(25)
})
