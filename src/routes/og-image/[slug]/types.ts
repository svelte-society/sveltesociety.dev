/**
 * Type definitions for OG image generation
 */

export interface OgImageDimensions {
	width: number
	height: number
}

export interface SatoriNode {
	type: string
	props: {
		style?: Record<string, string | number>
		children?: string | SatoriNode | SatoriNode[]
		src?: string
		[key: string]: unknown
	}
}

interface BaseContentData {
	title: string
	type: string
	description?: string
}

export interface RecipeContentData extends BaseContentData {
	type: 'recipe'
	description: string
}

export interface LibraryContentData extends BaseContentData {
	type: 'library'
	description: string
	metadata?: {
		stars?: number
		forks?: number
		issues?: number
		owner?: {
			name: string
			url: string
			avatar: string
		}
		npm?: string
		github?: string
	}
}

export interface CollectionContentData extends BaseContentData {
	type: 'collection'
	description: string
	children?: Array<{
		title: string
		type: string
	}>
}

export interface AnnouncementContentData extends BaseContentData {
	type: 'announcement'
	description: string
}

export interface VideoContentData extends BaseContentData {
	type: 'video'
	description: string
	metadata?: {
		thumbnail?: string
		thumbnails?: {
			maxres?: { url: string; width: number; height: number }
			standard?: { url: string; width: number; height: number }
			high?: { url: string; width: number; height: number }
		}
		channelTitle?: string
	}
}

export type ContentData =
	| RecipeContentData
	| LibraryContentData
	| CollectionContentData
	| AnnouncementContentData
	| VideoContentData

export interface OgImageColors {
	background: string
	text: string
	accent: string
	accentGradient: string
	secondary: string
	badge: string
}
