import type { Handle } from '@sveltejs/kit'
import { Database } from 'bun:sqlite'
import { DB_PATH } from '$env/static/private'
import { ContentService } from '$lib/server/db/content'
import { SearchService } from '$lib/server/db/search'
import { InteractionsService } from '$lib/server/db/interactions'
import { RoleService } from '$lib/server/db/role'
import { SessionService } from '$lib/server/db/session'
import { TagService } from '$lib/server/db/tags'
import { ModerationService } from '$lib/server/db/moderation'
import { UserService } from '$lib/server/db/user'
import { CollectionService } from '$lib/server/db/collections'

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