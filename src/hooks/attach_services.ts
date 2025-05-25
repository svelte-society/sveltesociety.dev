import type { Handle } from '@sveltejs/kit'
import { Database } from 'bun:sqlite'
import { DB_PATH } from '$env/static/private'
import { ContentService } from '$lib/server/services/content'
import { SearchService } from '$lib/server/services/search'
import { InteractionsService } from '$lib/server/services/interactions'
import { RoleService } from '$lib/server/services/role'
import { SessionService } from '$lib/server/services/session'
import { TagService } from '$lib/server/services/tags'
import { ModerationService } from '$lib/server/services/moderation'
import { UserService } from '$lib/server/services/user'
import { CollectionService } from '$lib/server/services/collections'
import { MetadataService } from '$lib/server/services/metadata'
import { EventsService } from '$lib/server/services/events'
import { CacheService } from '$lib/server/services/cache'
import { ExternalContentService } from '$lib/server/services/external-content'

let db: Database
let contentService: ContentService
let searchService: SearchService
let interactionsService: InteractionsService
let roleService: RoleService
let sessionService: SessionService
let tagService: TagService
let moderationService: ModerationService
let userService: UserService
let collectionService: CollectionService
let metadataService: MetadataService
let eventsService: EventsService
let cacheService: CacheService
let externalContentService: ExternalContentService

const initialize_db = () => {
	if (!db) {
		db = new Database(DB_PATH, { strict: true })
		db.exec('PRAGMA journal_mode = WAL')
		db.exec('PRAGMA busy_timeout = 5000')
		db.exec('PRAGMA synchronous = NORMAL')
		db.exec('PRAGMA cache_size = 300000')
		db.exec('PRAGMA temp_store = MEMORY')
		db.exec('PRAGMA mmap_size = 3000000')
		db.exec('PRAGMA foreign_keys = ON')

		cacheService = new CacheService(db)
		searchService = new SearchService(db)
		contentService = new ContentService(db, searchService)
		externalContentService = new ExternalContentService(db, contentService, cacheService)
		interactionsService = new InteractionsService(db)
		roleService = new RoleService(db)
		sessionService = new SessionService(db)
		tagService = new TagService(db)
		moderationService = new ModerationService(db)
		userService = new UserService(db)
		collectionService = new CollectionService(db)
		metadataService = new MetadataService(db)
		eventsService = new EventsService(db, cacheService)
	}

	return db
}

export const attach_services: Handle = async ({ event, resolve }) => {
	const db = initialize_db()
	event.locals.db = db
	event.locals.contentService = contentService
	event.locals.searchService = searchService
	event.locals.interactionsService = interactionsService
	event.locals.roleService = roleService
	event.locals.sessionService = sessionService
	event.locals.tagService = tagService
	event.locals.moderationService = moderationService
	event.locals.userService = userService
	event.locals.collectionService = collectionService
	event.locals.metadataService = metadataService
	event.locals.eventsService = eventsService
	event.locals.cacheService = cacheService
	event.locals.externalContentService = externalContentService
	return resolve(event)
}
