import { z } from 'zod'
import { typeSchema } from '$lib/schema/content'

// Content status enum
export const contentStatusEnum = z.enum(['draft', 'pending_review', 'published', 'archived'])

// Common schema patterns
const slugSchema = z
	.string()
	.min(1, 'Slug is required')
	.max(255)
	.regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')

const nameSchema = z.string().min(1, 'Name is required').max(100)

const descriptionSchema = z.string().max(500).optional()

// Tag schemas
export const createTagSchema = z.object({
	name: nameSchema,
	slug: slugSchema
})

export const updateTagSchema = createTagSchema

// Role schemas
export const createRoleSchema = z.object({
	name: nameSchema,
	description: descriptionSchema,
	permissions: z.record(z.boolean()).default({})
})

export const updateRoleSchema = createRoleSchema

// Collection schemas
export const createCollectionSchema = z.object({
	title: z.string().min(1, 'Title is required').max(255),
	slug: slugSchema,
	description: z.string().min(1, 'Description is required'),
	body: z.string().optional(),
	status: contentStatusEnum.default('draft'),
	tags: z.array(z.string()).default([]),
	content_ids: z.array(z.string()).default([])
})

export const updateCollectionSchema = createCollectionSchema

// User update schema
export const updateUserSchema = z.object({
	username: z.string().min(3).max(50),
	name: z.string().max(100).nullable(),
	email: z.string().email(),
	role: z.string().uuid('Invalid role ID'),
	bio: z.string().max(500).nullable(),
	location: z.string().max(100).nullable(),
	website: z.string().url().nullable().or(z.literal('')),
	twitter: z.string().max(50).nullable()
})

// Moderation schemas
export const moderationActionSchema = z.object({
	action: z.enum(['approve', 'reject']),
	reason: z.string().optional()
})

// External content import schemas
export const importYouTubeSchema = z.object({
	channelId: z.string().min(1, 'Channel ID is required'),
	maxResults: z.number().min(1).max(50).default(10)
})

export const importGitHubSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	includeForked: z.boolean().default(false),
	maxResults: z.number().min(1).max(100).default(20)
})

// Bulk import schema
export const bulkImportSchema = z.object({
	items: z.array(
		z.object({
			type: typeSchema,
			title: z.string().min(1),
			description: z.string().min(1),
			body: z.string().optional(),
			metadata: z.record(z.any()).optional(),
			tags: z.array(z.string()).optional(),
			status: contentStatusEnum.default('draft')
		})
	)
})

// Filter schemas
export const contentFilterSchema = z.object({
	status: contentStatusEnum.optional(),
	type: typeSchema.optional(),
	search: z.string().optional(),
	tags: z.array(z.string()).optional(),
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(20)
})

export const paginationSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(20)
})
