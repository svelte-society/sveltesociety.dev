import { z } from 'zod'
import { tagSchema } from './tags'

export const typeSchema = z.enum([
	'recipe',
	'video',
	'library',
	'announcement',
	'collection',
	'event'
])

// Type-specific metadata schemas
export const videoMetadataSchema = z
	.object({
		channelTitle: z.string().optional(),
		publishedAt: z.string().optional(),
		thumbnail: z.string().optional(),
		thumbnails: z
			.object({
				default: z.object({ url: z.string(), width: z.number(), height: z.number() }).optional(),
				medium: z.object({ url: z.string(), width: z.number(), height: z.number() }).optional(),
				high: z.object({ url: z.string(), width: z.number(), height: z.number() }).optional(),
				standard: z.object({ url: z.string(), width: z.number(), height: z.number() }).optional(),
				maxres: z.object({ url: z.string(), width: z.number(), height: z.number() }).optional()
			})
			.optional(),
		tags: z.array(z.string()).optional(),
		statistics: z
			.object({
				viewCount: z.number().optional(),
				likeCount: z.number().optional(),
				commentCount: z.number().optional()
			})
			.optional(),
		contentDetails: z
			.object({
				duration: z.string().optional(),
				dimension: z.string().optional(),
				definition: z.string().optional()
			})
			.optional(),
		embedUrl: z.string().optional(),
		watchUrl: z.string().optional(),
		externalSource: z
			.object({
				type: z.string(),
				source: z.string(),
				externalId: z.string(),
				url: z.string(),
				lastFetched: z.string(),
				lastModified: z.string().optional()
			})
			.optional()
	})
	.optional()

export const libraryMetadataSchema = z
	.object({
		npm: z.string().optional(),
		github: z.string().optional(),
		homepage: z.string().optional(),
		version: z.string().optional(),
		// GitHub-specific fields
		stars: z.number().optional(),
		forks: z.number().optional(),
		issues: z.number().optional(),
		language: z.string().optional(),
		topics: z.array(z.string()).optional(),
		owner: z
			.object({
				name: z.string(),
				url: z.string(),
				avatar: z.string()
			})
			.optional(),
		defaultBranch: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		pushedAt: z.string().optional(),
		ogImage: z.string().optional(),
		externalSource: z
			.object({
				type: z.string(),
				source: z.string(),
				externalId: z.string(),
				url: z.string(),
				lastFetched: z.string(),
				lastModified: z.string().optional()
			})
			.optional()
	})
	.optional()

export const eventMetadataSchema = z
	.object({
		startTime: z.string(),
		endTime: z.string().optional(),
		location: z.string().optional(),
		guildId: z.string().optional(),
		guildName: z.string().optional(),
		eventUrl: z.string().optional()
	})
	.optional()

export const recipeMetadataSchema = z
	.object({
		difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
		estimatedTime: z.string().optional(),
		prerequisites: z.array(z.string()).optional()
	})
	.optional()

export const announcementMetadataSchema = z
	.object({
		priority: z.enum(['low', 'medium', 'high']).optional(),
		expiresAt: z.string().optional()
	})
	.optional()

export const collectionMetadataSchema = z
	.object({
		itemCount: z.number().optional(),
		isPublic: z.boolean().optional()
	})
	.optional()

// Union of all metadata types
const metadataSchema = z.union([
	videoMetadataSchema,
	libraryMetadataSchema,
	eventMetadataSchema,
	recipeMetadataSchema,
	announcementMetadataSchema,
	collectionMetadataSchema
])

const baseContentSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string(),
	description: z.string().min(10),
	type: typeSchema,
	status: z.string(),
	body: z.string().optional(),
	rendered_body: z.string(),
	author: z.string().optional(),
	tags: z.array(tagSchema),
	created_at: z.string(),
	updated_at: z.string(),
	published_at: z.string().nullable(),
	likes: z.number(),
	saves: z.number(),
	liked: z.boolean(),
	saved: z.boolean(),
	views: z.number(),
	metadata: metadataSchema
})

export const contentSchema = baseContentSchema.extend({
	children: baseContentSchema.array()
})

export const updateContentSchema = contentSchema
	.omit({
		created_at: true,
		updated_at: true,
		published_at: true,
		likes: true,
		saves: true,
		liked: true,
		saved: true,
		views: true,
		children: true
	})
	.extend({
		tags: z.array(z.string())
	})

export const createContentSchema = updateContentSchema.omit({
	id: true
})

export const updateCollectionSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().optional(),
	children: z.array(z.string()),
	tags: z.array(z.string())
})

export const createCollectionSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().optional(),
	children: z.array(z.string()),
	tags: z.array(z.string())
})
