import type { Database } from 'bun:sqlite'
import type { User } from '$lib/server/db/user'
import type { ContentService } from '$lib/server/db/content'
import type { SearchService } from '$lib/server/db/search'
import type { InteractionsService } from '$lib/server/db/interactions'
import type { RoleService } from '$lib/server/db/role'
import type { SessionService } from '$lib/server/db/session'
import type { TagService } from '$lib/server/db/tags'
import type { ModerationService } from '$lib/server/db/moderation'
import type { UserService } from '$lib/server/db/user'
import type { CollectionService } from '$lib/server/db/collections'

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
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
