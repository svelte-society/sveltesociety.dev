import type { Database } from 'bun:sqlite'
import type { User } from '$lib/server/services/user'
import type { ContentService } from '$lib/server/services/content'
import type { SearchService } from '$lib/server/services/search'
import type { InteractionsService } from '$lib/server/services/interactions'
import type { RoleService } from '$lib/server/services/role'
import type { SessionService } from '$lib/server/services/session'
import type { TagService } from '$lib/server/services/tags'
import type { UserService } from '$lib/server/services/user'
import type { MetadataService } from '$lib/server/services/metadata'
import type { EventsService } from '$lib/server/services/events'
import type { CacheService } from '$lib/server/services/cache'
import type { ExternalContentService } from '$lib/server/services/external-content'
import type { LLMService } from '$lib/server/services/llm'
import type { AnnouncementService } from '$lib/server/services/AnnouncementService'
import type { ShortcutService } from '$lib/server/services/ShortcutService'
import type { FeedItemService } from '$lib/server/services/FeedItemService'
import type {
	JobTierService,
	PaymentService,
	JobApplicationService
} from '$lib/server/services/jobs'
import type { StripeService } from '$lib/server/services/payments'
import type {
	SponsorTierService,
	SponsorService,
	SponsorSubscriptionService
} from '$lib/server/services/sponsors'
import type { EmailService } from '$lib/server/services/email'
import type { NewsletterService } from '$lib/server/services/newsletter'
import type {
	SocialPostService,
	SocialTemplateService,
	SocialCredentialService,
	SocialQueueService,
	SocialAutoRuleService,
	SocialEventHandler
} from '$lib/server/services/social'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null
			db: Database
			contentService: ContentService
			searchService: SearchService
			interactionsService: InteractionsService
			roleService: RoleService
			sessionService: SessionService
			tagService: TagService
			userService: UserService
			metadataService: MetadataService
			eventsService: EventsService
			cacheService: CacheService
			externalContentService: ExternalContentService
			llmService: LLMService
			announcementService: AnnouncementService
			shortcutService: ShortcutService
			feedItemService: FeedItemService
			jobTierService: JobTierService
			paymentService: PaymentService
			jobApplicationService: JobApplicationService
			stripeService: StripeService
			sponsorTierService: SponsorTierService
			sponsorService: SponsorService
			sponsorSubscriptionService: SponsorSubscriptionService
			emailService: EmailService
			newsletterService: NewsletterService
			socialPostService: SocialPostService
			socialTemplateService: SocialTemplateService
			socialCredentialService: SocialCredentialService
			socialQueueService: SocialQueueService
			socialAutoRuleService: SocialAutoRuleService
			socialEventHandler: SocialEventHandler
		}
		// interface PageData {}
		interface PageState {
			showNewsletterModal?: boolean
		}
		// interface Platform {}
	}
}

export {}
