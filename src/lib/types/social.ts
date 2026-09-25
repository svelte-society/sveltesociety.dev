// ============================================
// Platform Types
// ============================================

export type SocialPlatform = 'twitter' | 'bluesky' | 'linkedin'

export const PLATFORMS: SocialPlatform[] = ['twitter', 'bluesky', 'linkedin']

export const PLATFORM_CONFIG: Record<
	SocialPlatform,
	{
		label: string
		maxChars: number
		color: 'sky' | 'info' | 'primary'
		icon: string
	}
> = {
	twitter: {
		label: 'Twitter/X',
		maxChars: 280,
		color: 'sky',
		icon: 'XLogo'
	},
	bluesky: {
		label: 'Bluesky',
		maxChars: 300,
		color: 'info',
		icon: 'Butterfly'
	},
	linkedin: {
		label: 'LinkedIn',
		maxChars: 3000,
		color: 'primary',
		icon: 'LinkedinLogo'
	}
}

// ============================================
// Post Types
// ============================================

export type SocialPostType = 'content' | 'sponsor' | 'job' | 'custom'

export type SocialPostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

export type SocialPlatformStatus = 'pending' | 'published' | 'failed' | 'skipped'

export const POST_TYPE_CONFIG: Record<
	SocialPostType,
	{
		label: string
		description: string
		color: 'amber' | 'purple' | 'success' | 'default'
	}
> = {
	content: {
		label: 'Content',
		description: 'Share a content item (video, library, recipe, etc.)',
		color: 'amber'
	},
	sponsor: {
		label: 'Sponsor',
		description: 'Promote an active sponsor',
		color: 'purple'
	},
	job: {
		label: 'Job',
		description: 'Share a job listing',
		color: 'success'
	},
	custom: {
		label: 'Custom',
		description: 'Freeform post with custom text',
		color: 'default'
	}
}

export const POST_STATUS_CONFIG: Record<
	SocialPostStatus,
	{
		label: string
		color: 'default' | 'info' | 'success' | 'danger'
	}
> = {
	draft: {
		label: 'Draft',
		color: 'default'
	},
	scheduled: {
		label: 'Scheduled',
		color: 'info'
	},
	published: {
		label: 'Published',
		color: 'success'
	},
	failed: {
		label: 'Failed',
		color: 'danger'
	}
}

// ============================================
// Database Raw Types
// ============================================

export interface SocialPostRaw {
	id: string
	title: string
	post_type: SocialPostType
	content_id: string | null
	sponsor_id: string | null
	job_id: string | null
	status: SocialPostStatus
	scheduled_at: string | null
	published_at: string | null
	link_url: string | null
	utm_source: string | null
	utm_medium: string | null
	utm_campaign: string | null
	media_urls: string | null // JSON array
	tags: string | null // JSON array
	created_by: string
	created_at: string
	updated_at: string
}

export interface SocialPostPlatformRaw {
	id: string
	post_id: string
	platform: SocialPlatform
	text: string
	media_urls: string | null // JSON array
	status: SocialPlatformStatus
	external_post_id: string | null
	error_message: string | null
	published_at: string | null
	retry_count: number
	last_retry_at: string | null
	created_at: string
	updated_at: string
}

export interface SocialTemplateRaw {
	id: string
	name: string
	description: string | null
	content_type: string
	twitter_template: string
	bluesky_template: string
	linkedin_template: string
	is_default: number // SQLite boolean
	created_at: string
	updated_at: string
}

export interface SocialAutoRuleRaw {
	id: string
	name: string
	description: string | null
	is_active: number // SQLite boolean
	trigger_type: string
	content_type_filter: string | null
	tag_filter: string | null // JSON array
	platforms: string // JSON array
	template_id: string | null
	use_ai_generation: number // SQLite boolean
	delay_minutes: number
	add_to_queue: number // SQLite boolean
	create_as_draft: number // SQLite boolean
	created_at: string
	updated_at: string
}

export interface SocialQueueSettingsRaw {
	id: string
	platform: SocialPlatform | 'global'
	posting_times: string // JSON array
	posting_days: string // JSON array
	min_gap_minutes: number
	is_paused: number // SQLite boolean
	timezone: string
	created_at: string
	updated_at: string
}

export interface SocialCredentialsRaw {
	id: string
	platform: SocialPlatform
	account_name: string
	account_id: string | null
	credentials_encrypted: string
	iv: string
	expires_at: string | null
	refresh_token_encrypted: string | null
	refresh_iv: string | null
	is_active: number // SQLite boolean
	last_used_at: string | null
	last_error: string | null
	created_at: string
	updated_at: string
}

// ============================================
// Parsed/Typed Entities
// ============================================

export interface SocialPost {
	id: string
	title: string
	post_type: SocialPostType
	content_id: string | null
	sponsor_id: string | null
	job_id: string | null
	status: SocialPostStatus
	scheduled_at: string | null
	published_at: string | null
	link_url: string | null
	utm_source: string | null
	utm_medium: string | null
	utm_campaign: string | null
	media_urls: string[]
	tags: string[]
	created_by: string
	created_at: string
	updated_at: string
}

export interface SocialPostPlatform {
	id: string
	post_id: string
	platform: SocialPlatform
	text: string
	media_urls: string[]
	status: SocialPlatformStatus
	external_post_id: string | null
	error_message: string | null
	published_at: string | null
	retry_count: number
	last_retry_at: string | null
	created_at: string
	updated_at: string
}

export interface SocialTemplate {
	id: string
	name: string
	description: string | null
	content_type: string
	twitter_template: string
	bluesky_template: string
	linkedin_template: string
	is_default: boolean
	created_at: string
	updated_at: string
}

export interface SocialAutoRule {
	id: string
	name: string
	description: string | null
	is_active: boolean
	trigger_type: 'content_published' | 'sponsor_activated' | 'job_published'
	content_type_filter: string | null
	tag_filter: string[]
	platforms: SocialPlatform[]
	template_id: string | null
	use_ai_generation: boolean
	delay_minutes: number
	add_to_queue: boolean
	create_as_draft: boolean
	created_at: string
	updated_at: string
}

export interface SocialQueueSettings {
	id: string
	platform: SocialPlatform | 'global'
	posting_times: string[]
	posting_days: number[]
	min_gap_minutes: number
	is_paused: boolean
	timezone: string
	created_at: string
	updated_at: string
}

export interface SocialCredentials {
	id: string
	platform: SocialPlatform
	account_name: string
	account_id: string | null
	expires_at: string | null
	is_active: boolean
	last_used_at: string | null
	last_error: string | null
	created_at: string
	updated_at: string
	// Note: credentials_encrypted and iv are NOT included - never expose encrypted data
}

// ============================================
// Extended Types (with relations)
// ============================================

export interface SocialPostWithPlatforms extends SocialPost {
	platforms: SocialPostPlatform[]
}

export interface SocialPostWithContent extends SocialPost {
	platforms: SocialPostPlatform[]
	// Linked content details
	content_title?: string
	content_type?: string
	content_slug?: string
	// Linked sponsor details
	sponsor_name?: string
	sponsor_logo?: string
	// Linked job details
	job_title?: string
	job_company?: string
	// Creator details
	creator_name?: string
}

// ============================================
// Create/Update Input Types
// ============================================

export interface CreateSocialPostData {
	title: string
	post_type: SocialPostType
	content_id?: string | null
	sponsor_id?: string | null
	job_id?: string | null
	link_url?: string | null
	utm_source?: string | null
	utm_medium?: string | null
	utm_campaign?: string | null
	media_urls?: string[]
	tags?: string[]
	created_by: string
	// Platform-specific text
	platforms: {
		platform: SocialPlatform
		text: string
		media_urls?: string[]
	}[]
}

export interface UpdateSocialPostData {
	title?: string
	link_url?: string | null
	utm_source?: string | null
	utm_medium?: string | null
	utm_campaign?: string | null
	media_urls?: string[]
	tags?: string[]
	status?: SocialPostStatus
	scheduled_at?: string | null
}

export interface UpdateSocialPostPlatformData {
	text?: string
	media_urls?: string[]
	status?: SocialPlatformStatus
}

export interface CreateSocialTemplateData {
	name: string
	description?: string | null
	content_type: string
	twitter_template: string
	bluesky_template: string
	linkedin_template: string
	is_default?: boolean
}

export interface UpdateSocialTemplateData {
	name?: string
	description?: string | null
	twitter_template?: string
	bluesky_template?: string
	linkedin_template?: string
	is_default?: boolean
}

export interface CreateSocialAutoRuleData {
	name: string
	description?: string | null
	is_active?: boolean
	trigger_type: 'content_published' | 'sponsor_activated' | 'job_published'
	content_type_filter?: string | null
	tag_filter?: string[]
	platforms: SocialPlatform[]
	template_id?: string | null
	use_ai_generation?: boolean
	delay_minutes?: number
	add_to_queue?: boolean
	create_as_draft?: boolean
}

export interface UpdateSocialAutoRuleData {
	name?: string
	description?: string | null
	is_active?: boolean
	content_type_filter?: string | null
	tag_filter?: string[]
	platforms?: SocialPlatform[]
	template_id?: string | null
	use_ai_generation?: boolean
	delay_minutes?: number
	add_to_queue?: boolean
	create_as_draft?: boolean
}

export interface UpdateSocialQueueSettingsData {
	posting_times?: string[]
	posting_days?: number[]
	min_gap_minutes?: number
	is_paused?: boolean
	timezone?: string
}

// ============================================
// List Filters
// ============================================

export interface ListSocialPostsFilters {
	status?: SocialPostStatus | 'all'
	post_type?: SocialPostType | 'all'
	platform?: SocialPlatform | 'all'
	search?: string
	from_date?: string
	to_date?: string
	limit?: number
	offset?: number
}

export interface ListSocialTemplatesFilters {
	content_type?: string | 'all'
	limit?: number
	offset?: number
}

// ============================================
// Scheduling Types
// ============================================

export interface SchedulePostData {
	post_id: string
	scheduled_at: string
	platforms?: SocialPlatform[] // Which platforms to schedule (defaults to all)
}

export interface QueueSlot {
	datetime: string
	platform: SocialPlatform
	available: boolean
}
