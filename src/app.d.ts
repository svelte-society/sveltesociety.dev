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
import type { CollectionService } from '$lib/server/services/collections'
import type { search } from '$lib/server/services/new_search'

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
			collectionService: CollectionService
			search: typeof search
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
