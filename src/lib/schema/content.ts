import { z } from 'zod'

export const typeSchema = z.enum(['video', 'library', 'announcement', 'collection', 'recipe'])
export const statusSchema = z.enum(['draft', 'published', 'archived'])

const baseContentSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string(),
	description: z.string().min(10),
	status: statusSchema,
	type: typeSchema,
	author: z.string().optional(),
	tags: z.array(z.string()).min(1, 'At least one tag is required'),
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
	published_at: true,
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

const videoContentSchema = z.object({
	...baseContentSchema.shape,
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

const libraryContentSchema = z.object({
	...baseContentSchema.shape,
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

const recipeContentSchema = z.object({
	...baseContentSchema.shape,
	body: z.string(),
	rendered_body: z.string(),
	type: z.literal('recipe')
})

const updateRecipeContentSchema = recipeContentSchema.omit(updateKeysToOmit)
const createRecipeContentSchema = recipeContentSchema.omit(createKeysToOmit)

const announcementContentSchema = z.object({
	...baseContentSchema.shape,
	body: z.string(),
	rendered_body: z.string(),
	type: z.literal('announcement')
})

const updateAnnouncementContentSchema = announcementContentSchema.omit(updateKeysToOmit)
const createAnnouncementContentSchema = announcementContentSchema.omit(createKeysToOmit)

const collectionContentSchema = z.object({
	...baseContentSchema.shape,
	body: z.string(),
	rendered_body: z.string(),
	type: z.literal('collection'),
	children: z.array(z.string())
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
