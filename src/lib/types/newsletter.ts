// Campaign types
export type CampaignType = 'content_highlights' | 'announcement' | 'jobs_roundup'

export type CampaignStatus = 'draft' | 'scheduled' | 'sent'

// Base campaign data shared across all types
export interface BaseCampaign {
	id: string
	title: string
	subject: string
	campaign_type: CampaignType
	status: CampaignStatus
	plunk_campaign_id: string | null
	scheduled_at: string | null
	sent_at: string | null
	created_by: string
	created_at: string
	updated_at: string
}

// Item stored in type_data (minimal data)
export interface CampaignItemData {
	id: string
	custom_description?: string | null
}

// Item with full content details (for display)
export interface CampaignItemWithContent {
	id: string
	custom_description: string | null
	title: string
	type: string
	slug: string
	description: string | null
	image: string | null
}

// Job item with metadata (for jobs roundup)
export interface JobItemWithContent extends CampaignItemWithContent {
	metadata?: {
		company_name?: string
		company_logo?: string
		location?: string
		remote_status?: string
		position_type?: string
		salary_min?: number
		salary_max?: number
		salary_currency?: string
	}
}

// Type-specific data structures stored in type_data JSON
export interface ContentHighlightsTypeData {
	items: CampaignItemData[]
	intro_text?: string | null
}

export interface AnnouncementTypeData {
	body_html: string
	cta_text?: string | null
	cta_url?: string | null
}

export interface JobsRoundupTypeData {
	job_ids: string[]
	intro_text?: string | null
}

// Type data union
export type TypeData = ContentHighlightsTypeData | AnnouncementTypeData | JobsRoundupTypeData

// Raw campaign from database (type_data is JSON string)
export interface NewsletterCampaignRaw extends BaseCampaign {
	type_data: string // JSON string in DB
}

// Typed campaigns with parsed type_data
export interface ContentHighlightsCampaign extends BaseCampaign {
	campaign_type: 'content_highlights'
	type_data: ContentHighlightsTypeData
}

export interface AnnouncementCampaign extends BaseCampaign {
	campaign_type: 'announcement'
	type_data: AnnouncementTypeData
}

export interface JobsRoundupCampaign extends BaseCampaign {
	campaign_type: 'jobs_roundup'
	type_data: JobsRoundupTypeData
}

// Union of all typed campaigns
export type NewsletterCampaign =
	| ContentHighlightsCampaign
	| AnnouncementCampaign
	| JobsRoundupCampaign

// Campaigns with enriched items (for display/sending)
export interface ContentHighlightsCampaignWithItems extends Omit<
	ContentHighlightsCampaign,
	'type_data'
> {
	type_data: Omit<ContentHighlightsTypeData, 'items'> & { items: CampaignItemWithContent[] }
}

export interface JobsRoundupCampaignWithItems extends Omit<JobsRoundupCampaign, 'type_data'> {
	type_data: Omit<JobsRoundupTypeData, 'job_ids'> & { jobs: JobItemWithContent[] }
}

export type CampaignWithItems =
	| ContentHighlightsCampaignWithItems
	| AnnouncementCampaign
	| JobsRoundupCampaignWithItems

// Create campaign data by type
export interface CreateContentHighlightsCampaign {
	campaign_type: 'content_highlights'
	title: string
	subject: string
	created_by: string
	type_data?: Partial<ContentHighlightsTypeData>
}

export interface CreateAnnouncementCampaign {
	campaign_type: 'announcement'
	title: string
	subject: string
	created_by: string
	type_data: AnnouncementTypeData
}

export interface CreateJobsRoundupCampaign {
	campaign_type: 'jobs_roundup'
	title: string
	subject: string
	created_by: string
	type_data?: Partial<JobsRoundupTypeData>
}

export type CreateCampaignData =
	| CreateContentHighlightsCampaign
	| CreateAnnouncementCampaign
	| CreateJobsRoundupCampaign

// Update campaign data
export interface UpdateCampaignData {
	title?: string
	subject?: string
	status?: CampaignStatus
	plunk_campaign_id?: string | null
	scheduled_at?: string | null
	sent_at?: string | null
	type_data?: Partial<TypeData>
}

// List filters
export interface ListCampaignsFilters {
	status?: CampaignStatus | 'all'
	campaign_type?: CampaignType | 'all'
	limit?: number
	offset?: number
}

// Campaign type configuration for UI
export const CAMPAIGN_TYPE_CONFIG: Record<
	CampaignType,
	{
		label: string
		description: string
		icon: string
		color: 'amber' | 'purple' | 'success'
	}
> = {
	content_highlights: {
		label: 'Content',
		description: 'Curated selection of content items',
		icon: 'Sparkle',
		color: 'amber'
	},
	announcement: {
		label: 'Announcement',
		description: 'Freeform rich text for community news',
		icon: 'Megaphone',
		color: 'purple'
	},
	jobs_roundup: {
		label: 'Jobs',
		description: 'Collection of job listings',
		icon: 'Briefcase',
		color: 'success'
	}
}

// Pending subscription for double opt-in
export interface PendingSubscription {
	id: string
	email: string
	token: string
	user_id: string | null
	expires_at: string
	created_at: string
}
