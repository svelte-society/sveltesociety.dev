// Social Media Scheduler Services
// Re-export all social-related services and types from a single entry point

export { SocialPostService } from './social-post'
export type {
	SocialPost,
	SocialPostPlatform,
	SocialPostWithPlatforms,
	SocialPostWithContent,
	CreateSocialPostData,
	UpdateSocialPostData,
	ListSocialPostsFilters
} from './social-post'
export { POST_TYPE_CONFIG, POST_STATUS_CONFIG, PLATFORM_CONFIG } from './social-post'

export { SocialTemplateService } from './social-template'
export type {
	SocialTemplate,
	CreateSocialTemplateData,
	UpdateSocialTemplateData
} from './social-template'

export { SocialCredentialService } from './social-credential'
export type { SocialCredentials } from './social-credential'
export type {
	TwitterCredentials,
	BlueskyCredentials,
	LinkedInCredentials,
	PlatformCredentials
} from './social-credential'

export { SocialQueueService } from './social-queue'

// Re-export common types from the types file
export type {
	SocialPlatform,
	SocialPostType,
	SocialPostStatus,
	SocialPlatformStatus,
	SocialAutoRule,
	SocialQueueSettings
} from '$lib/types/social'

export { PLATFORMS } from '$lib/types/social'
