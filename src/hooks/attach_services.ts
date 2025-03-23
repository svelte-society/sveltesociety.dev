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

// Initialize database with optimal settings
const db = new Database(DB_PATH, { strict: true })
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA busy_timeout = 5000')
db.exec('PRAGMA synchronous = NORMAL')
db.exec('PRAGMA cache_size = 300000')
db.exec('PRAGMA temp_store = MEMORY')
db.exec('PRAGMA mmap_size = 3000000')
db.exec('PRAGMA foreign_keys = ON')

// Initialize services
const contentService = new ContentService(db)
const searchService = new SearchService(db)
const interactionsService = new InteractionsService(db)
const roleService = new RoleService(db)
const sessionService = new SessionService(db)
const tagService = new TagService(db)
const moderationService = new ModerationService(db)
const userService = new UserService(db)
const collectionService = new CollectionService(db)

export const attach_services: Handle = async ({ event, resolve }) => {
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
    return resolve(event)
} 