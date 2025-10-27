import type { Database } from 'bun:sqlite'
import type { User } from '$lib/server/services/user'
import type { ContentService } from '$lib/server/services/content'
import type { SearchService } from '$lib/server/services/search'
import type { InteractionsService } from '$lib/server/services/interactions'
import type { RoleService } from '$lib/server/services/role'
import type { SessionService } from '$lib/server/services/session'
import type { TagService } from '$lib/server/services/tags'
import type { ModerationService } from '$lib/server/services/moderation'
import type { UserService } from '$lib/server/services/user'
import type { MetadataService } from '$lib/server/services/metadata'
import type { EventsService } from '$lib/server/services/events'
import type { CacheService } from '$lib/server/services/cache'
import type { ExternalContentService } from '$lib/server/services/external-content'
import type { LLMService } from '$lib/server/services/llm'
import type { AnnouncementService } from '$lib/server/services/AnnouncementService'

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
			moderationService: ModerationService
			userService: UserService
			metadataService: MetadataService
			eventsService: EventsService
			cacheService: CacheService
			externalContentService: ExternalContentService
			llmService: LLMService
			announcementService: AnnouncementService
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
