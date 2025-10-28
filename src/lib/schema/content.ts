import { z } from 'zod/v4'
import { tagSchema } from './tags'

export const typeSchema = z.enum(['video', 'library', 'announcement', 'collection', 'recipe'])
export const statusSchema = z.enum(['draft', 'published', 'archived'])

// For form submissions, we accept either tag IDs (strings) or full tag objects
const tagInputSchema = z.union([
	z.string(), // Tag ID
	tagSchema   // Full tag object
])

const baseContentSchema = z.object({
	id: z.string(),
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().min(1, 'Description is required'),
	status: statusSchema,
	type: typeSchema,
	tags: z.array(tagInputSchema).min(1, 'At least one tag is required'),
	author_id: z.string().optional(),
	created_at: z.string(),
	updated_at: z.string(),
	published_at: z.string().nullable(),
	metadata: z.any().optional(),
	likes: z.number(),
	saves: z.number(),
	liked: z.boolean(),
	saved: z.boolean(),
	views: z.number()
})

const updateKeysToOmit = {
	created_at: true,
	updated_at: true,
	likes: true,
	saves: true,
	liked: true,
	saved: true,
	views: true
} as const

const createKeysToOmit = {
	...updateKeysToOmit,
	id: true
} as const

const videoContentSchema = baseContentSchema.extend({
	type: z.literal('video'),
	metadata: z.object({
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
})

const updateVideoContentSchema = videoContentSchema.omit(updateKeysToOmit)
const createVideoContentSchema = videoContentSchema.omit(createKeysToOmit)

const libraryContentSchema = baseContentSchema.extend({
	type: z.literal('library'),
	metadata: z.object({
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
		thumbnail: z.string().optional(),
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
})

const updateLibraryContentSchema = libraryContentSchema.omit(updateKeysToOmit)
const createLibraryContentSchema = libraryContentSchema.omit(createKeysToOmit)

const recipeContentSchema = baseContentSchema.extend({
	body: z.string().min(1, 'Body is required'),
	rendered_body: z.string(),
	type: z.literal('recipe')
})

const updateRecipeContentSchema = recipeContentSchema.omit(updateKeysToOmit)
const createRecipeContentSchema = recipeContentSchema.omit(createKeysToOmit)

const announcementContentSchema = baseContentSchema.extend({
	body: z.string().min(1, 'Body is required'),
	rendered_body: z.string(),
	type: z.literal('announcement')
})

const updateAnnouncementContentSchema = announcementContentSchema.omit(updateKeysToOmit)
const createAnnouncementContentSchema = announcementContentSchema.omit(createKeysToOmit)

const collectionContentSchema = baseContentSchema.extend({
	body: z.string().min(1, 'Body is required'),
	rendered_body: z.string(),
	type: z.literal('collection'),
	children: z.array(z.string()).min(1, 'At least one child is required')
})

const updateCollectionContentSchema = collectionContentSchema.omit(updateKeysToOmit)
const createCollectionContentSchema = collectionContentSchema.omit(createKeysToOmit)

// Union of all metadata types
export const contentSchema = z.discriminatedUnion('type', [
	videoContentSchema,
	libraryContentSchema,
	recipeContentSchema,
	announcementContentSchema,
	collectionContentSchema
])

export const updateContentSchema = z.discriminatedUnion('type', [
	updateVideoContentSchema,
	updateLibraryContentSchema,
	updateRecipeContentSchema,
	updateAnnouncementContentSchema,
	updateCollectionContentSchema
])

export const createContentSchema = z.discriminatedUnion('type', [
	createVideoContentSchema,
	createLibraryContentSchema,
	createRecipeContentSchema,
	createAnnouncementContentSchema,
	createCollectionContentSchema
])

export const contentFilterSchema = z.object({
	status: statusSchema.optional(),
	type: typeSchema.optional(),
	search: z.string().optional(),
	tags: z.array(z.string()).optional(),
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(20)
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

export const bulkImportSchema = z.object({
	items: z.array(
		z.object({
			type: typeSchema,
			title: z.string().min(1),
			description: z.string().min(1),
			body: z.string().optional(),
			metadata: z.record(z.any(), z.any()).optional(),
			tags: z.array(z.string()).optional(),
			status: statusSchema.default('draft')
		})
	)
})
