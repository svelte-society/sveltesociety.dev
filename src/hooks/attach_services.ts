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
import { LLMService } from '$lib/server/services/llm'
import { AnnouncementService } from '$lib/server/services/AnnouncementService'
import fs from 'fs'
import path from 'path'
import { dev } from '$app/environment'

// Cache for database connections and services per database path
const dbCache = new Map<string, {
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
	metadataService: MetadataService
	eventsService: EventsService
	cacheService: CacheService
	externalContentService: ExternalContentService
	llmService: LLMService
	announcementService: AnnouncementService
}>()

const initialize_db = (dbPath: string) => {
	// Return cached instance if exists
	if (dbCache.has(dbPath)) {
		return dbCache.get(dbPath)!
	}

	// Create new database connection and services
	const db = new Database(dbPath, { strict: true })
	db.run('PRAGMA journal_mode = WAL')
	db.run('PRAGMA busy_timeout = 5000')
	db.run('PRAGMA synchronous = NORMAL')
	db.run('PRAGMA cache_size = 300000')
	db.run('PRAGMA temp_store = MEMORY')
	db.run('PRAGMA mmap_size = 3000000')
	db.run('PRAGMA foreign_keys = ON')

	const cacheService = new CacheService(db)
	const searchService = new SearchService(db)
	const contentService = new ContentService(db, searchService)
	const externalContentService = new ExternalContentService(db, contentService, cacheService)
	const interactionsService = new InteractionsService(db)
	const roleService = new RoleService(db)
	const sessionService = new SessionService(db)
	const tagService = new TagService(db)
	const moderationService = new ModerationService(db)
	const userService = new UserService(db)
	const collectionService = new CollectionService(db, searchService)
	const metadataService = new MetadataService(db)
	const eventsService = new EventsService(db, cacheService)
	const llmService = new LLMService(tagService)
	const announcementService = new AnnouncementService(db)

	const services = {
		db,
		contentService,
		searchService,
		interactionsService,
		roleService,
		sessionService,
		tagService,
		moderationService,
		userService,
		collectionService,
		metadataService,
		eventsService,
		cacheService,
		externalContentService,
		llmService,
		announcementService,
	}

	dbCache.set(dbPath, services)
	return services
}

export const attach_services: Handle = async ({ event, resolve }) => {
	// Determine which database to use based on test cookie
	let dbPath = DB_PATH

	// In test environment, check for test_db cookie to enable per-test isolation
	if (process.env.NODE_ENV === 'test') {
		const testDbName = event.cookies.get('test_db')

		if (testDbName) {
			// Use test-specific database (e.g., test-content-detail.db)
			// These databases are pre-created by globalSetup
			dbPath = `test-${testDbName}.db`

			// Fallback: Create isolated database copy if it doesn't exist
			// This should rarely happen as databases are pre-created in globalSetup
			if (!fs.existsSync(dbPath)) {
				const baseTestDb = 'test.db'
				if (fs.existsSync(baseTestDb)) {
					fs.copyFileSync(baseTestDb, dbPath)
					console.log(`[Test Isolation] Created on-demand: ${dbPath}`)
				}
			}
		}
	}

	// Initialize database and services for this path
	const services = initialize_db(dbPath)

	// Attach all services to event.locals
	event.locals.db = services.db
	event.locals.contentService = services.contentService
	event.locals.searchService = services.searchService
	event.locals.interactionsService = services.interactionsService
	event.locals.roleService = services.roleService
	event.locals.sessionService = services.sessionService
	event.locals.tagService = services.tagService
	event.locals.moderationService = services.moderationService
	event.locals.userService = services.userService
	event.locals.collectionService = services.collectionService
	event.locals.metadataService = services.metadataService
	event.locals.eventsService = services.eventsService
	event.locals.cacheService = services.cacheService
	event.locals.externalContentService = services.externalContentService
	event.locals.llmService = services.llmService
	event.locals.announcementService = services.announcementService

	return resolve(event)
}
