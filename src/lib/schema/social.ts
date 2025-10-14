import { z } from 'zod/v4'
import { typeSchema as contentTypeSchema } from './content'

// Enums
export const platformSchema = z.enum(['bluesky', 'nostr', 'linkedin'])
export const postStatusSchema = z.enum(['draft', 'scheduled', 'posted', 'failed', 'skipped'])

// Social Account Schema
export const socialAccountSchema = z.object({
	id: z.string(),
	platform: platformSchema,
	account_name: z.string(),
	account_handle: z.string(),
	credentials: z.string(), // Encrypted JSON
	relay_urls: z.string().nullable(),
	is_active: z.boolean(),
	is_default: z.boolean(),
	created_at: z.string(),
	updated_at: z.string(),
	created_by: z.string().nullable()
})

export const createSocialAccountSchema = z.object({
	platform: platformSchema,
	account_name: z.string().min(1, 'Account name is required'),
	account_handle: z.string().min(1, 'Account handle is required'),
	credentials: z.string().min(1, 'Credentials are required'),
	relay_urls: z.string().optional(),
	is_active: z.boolean().default(true),
	is_default: z.boolean().default(false),
	created_by: z.string().optional()
})

export const updateSocialAccountSchema = z.object({
	account_name: z.string().min(1).optional(),
	account_handle: z.string().min(1).optional(),
	credentials: z.string().min(1).optional(),
	relay_urls: z.string().optional(),
	is_active: z.boolean().optional(),
	is_default: z.boolean().optional()
})

// Social Post Schema
export const socialPostSchema = z.object({
	id: z.string(),
	content_id: z.string(),
	account_id: z.string(),
	platform: platformSchema,
	post_text: z.string(),
	post_data: z.string().nullable(), // JSON
	external_post_id: z.string().nullable(),
	external_url: z.string().nullable(),
	status: postStatusSchema,
	scheduled_at: z.string().nullable(),
	posted_at: z.string().nullable(),
	error_message: z.string().nullable(),
	retry_count: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
	created_by: z.string().nullable()
})

export const socialPostWithContentSchema = socialPostSchema.extend({
	content_title: z.string(),
	content_type: contentTypeSchema,
	content_slug: z.string()
})

export const createSocialPostSchema = z.object({
	content_id: z.string().min(1, 'Content is required'),
	account_id: z.string().min(1, 'Account is required'),
	platform: platformSchema,
	post_text: z.string().min(1, 'Post text is required').max(5000, 'Post text is too long'),
	post_data: z.record(z.any(), z.any()).optional(),
	scheduled_at: z.iso.datetime().nullable().optional(),
	created_by: z.string().optional()
})

export const updateSocialPostSchema = z.object({
	post_text: z.string().min(1).max(5000).optional(),
	post_data: z.record(z.any(), z.any()).optional(),
	scheduled_at: z.iso.datetime().nullable().optional(),
	status: postStatusSchema.optional()
})

// Social Template Schema
export const socialTemplateSchema = z.object({
	id: z.string(),
	content_type: contentTypeSchema,
	platform: platformSchema,
	template: z.string(),
	is_default: z.boolean(),
	created_at: z.string(),
	updated_at: z.string(),
	created_by: z.string().nullable()
})

export const createSocialTemplateSchema = z.object({
	content_type: contentTypeSchema,
	platform: platformSchema,
	template: z.string().min(1, 'Template is required'),
	is_default: z.boolean().default(false),
	created_by: z.string().optional()
})

export const updateSocialTemplateSchema = z.object({
	template: z.string().min(1).optional(),
	is_default: z.boolean().optional()
})

// Type exports
export type Platform = z.infer<typeof platformSchema>
export type PostStatus = z.infer<typeof postStatusSchema>
export type ContentType = z.infer<typeof contentTypeSchema>

export type SocialAccount = z.infer<typeof socialAccountSchema>
export type CreateSocialAccountInput = z.infer<typeof createSocialAccountSchema>
export type UpdateSocialAccountInput = z.infer<typeof updateSocialAccountSchema>

export type SocialPost = z.infer<typeof socialPostSchema>
export type SocialPostWithContent = z.infer<typeof socialPostWithContentSchema>
export type CreateSocialPostInput = z.infer<typeof createSocialPostSchema>
export type UpdateSocialPostInput = z.infer<typeof updateSocialPostSchema>

export type SocialTemplate = z.infer<typeof socialTemplateSchema>
export type CreateSocialTemplateInput = z.infer<typeof createSocialTemplateSchema>
export type UpdateSocialTemplateInput = z.infer<typeof updateSocialTemplateSchema>
