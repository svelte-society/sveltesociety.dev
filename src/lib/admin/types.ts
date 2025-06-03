import type { z } from 'zod'
import type { Type as ContentType } from '$lib/types/content'
import type { Tag } from '$lib/types/tags'
import type { Role } from '$lib/types/roles'

// Content status type
export type ContentStatus = 'draft' | 'pending_review' | 'published' | 'archived'

export interface Link {
	href: string
	label: string
	icon: string
}

// Common form types
export interface FormMessage {
	type: 'success' | 'error'
	text: string
}

// Admin routes
export const ADMIN_ROUTES = {
	content: {
		list: '/admin/content',
		new: '/admin/content/new',
		edit: (id: string) => `/admin/content/${id}`
	},
	collections: {
		list: '/admin/collections',
		new: '/admin/collections/new',
		edit: (id: string) => `/admin/collections/${id}`
	},
	tags: {
		list: '/admin/tags',
		new: '/admin/tags/new',
		edit: (id: string) => `/admin/tags/${id}`
	},
	roles: {
		list: '/admin/roles',
		new: '/admin/roles/new',
		edit: (id: string) => `/admin/roles/${id}`
	},
	users: {
		list: '/admin/users',
		edit: (id: string) => `/admin/users/${id}`
	},
	externalContent: '/admin/external-content',
	moderation: {
		list: '/admin/moderation',
		review: (id: string) => `/admin/moderation/${id}`
	},
	bulkImport: '/admin/bulk-import',
	statistics: '/admin/statistics'
} as const

// Table column definitions
export interface TableColumn<T> {
	key: keyof T
	label: string
	sortable?: boolean
	format?: (value: any, item?: T) => string
}

// Pagination
export interface PaginationData {
	page: number
	limit: number
	total: number
	totalPages: number
}

// Admin list page data
export interface AdminListPageData<T> {
	items: T[]
	pagination: PaginationData
}

// Form field configurations
export interface FormFieldConfig {
	name: string
	label: string
	type: 'text' | 'email' | 'textarea' | 'select' | 'multiselect' | 'markdown' | 'slug'
	placeholder?: string
	required?: boolean
	disabled?: boolean
	helpText?: string
	options?: Array<{ value: string; label: string }>
}

// Status badge variants
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

export const STATUS_BADGE_VARIANTS: Record<ContentStatus, BadgeVariant> = {
	draft: 'default',
	pending_review: 'warning',
	published: 'success',
	archived: 'info'
} as const

// Content type icons
export const CONTENT_TYPE_ICONS: Record<ContentType, string> = {
	recipe: 'book-open',
	video: 'video',
	library: 'package',
	announcement: 'megaphone',
	collection: 'folder',
	event: 'calendar'
} as const

// Common action types
export type AdminAction = 'create' | 'update' | 'delete' | 'approve' | 'reject'

// Form submission result
export interface FormResult<T = any> {
	success: boolean
	data?: T
	error?: string
	validationErrors?: Record<string, string[]>
}

// Breadcrumb item
export interface BreadcrumbItem {
	label: string
	href?: string
}

// Filter options
export interface FilterOption {
	value: string
	label: string
	count?: number
}

export interface AdminFilters {
	status?: ContentStatus
	type?: ContentType
	search?: string
	tags?: string[]
	dateRange?: {
		start: Date
		end: Date
	}
}

// Utility type for form data with schema
export type FormDataWithSchema<T extends z.ZodSchema> = {
	form: z.infer<T>
	[key: string]: any
}
