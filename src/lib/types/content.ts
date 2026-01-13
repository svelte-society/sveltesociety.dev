import {
	typeSchema,
	contentSchema,
	updateContentSchema,
	createContentSchema,
	jobMetadataSchema,
	storedJobDataSchema
} from '$lib/schema/content'
import { z } from 'zod/v4'

export type Type = z.infer<typeof typeSchema>
export type JobMetadata = z.infer<typeof jobMetadataSchema>
export type StoredJobData = z.infer<typeof storedJobDataSchema>

export type Content = z.infer<typeof contentSchema>
export type UpdateContent = z.infer<typeof updateContentSchema>
export type CreateContent = z.infer<typeof createContentSchema>

// Content with author information
export type ContentWithAuthor = Content & {
	author_id?: string
	author_username?: string
	author_name?: string
}

// Content filtering options
export interface ContentFilters {
	type?: string
	tags?: string | string[]
	search?: string
	status?: string
	limit?: number
	offset?: number
	sort?: 'latest' | 'oldest' | 'popular'
}
