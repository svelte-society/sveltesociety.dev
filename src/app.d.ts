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
import type { JobTierService, PaymentService, JobApplicationService, StripeService } from '$lib/server/services/jobs'
import type { EmailService } from '$lib/server/services/email'
import type { NewsletterService } from '$lib/server/services/newsletter'

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
			jobTierService: JobTierService
			paymentService: PaymentService
			jobApplicationService: JobApplicationService
			stripeService: StripeService
			emailService: EmailService
			newsletterService: NewsletterService
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
