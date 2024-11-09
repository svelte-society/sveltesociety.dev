import { Database } from 'bun:sqlite'
import { DB_PATH } from '$env/static/private'

export const db = new Database(DB_PATH, { strict: true })
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA busy_timeout = 5000')
db.exec('PRAGMA synchronous = NORMAL')
db.exec('PRAGMA cache_size = 300000')
db.exec('PRAGMA temp_store = MEMORY')
db.exec('PRAGMA mmap_size = 3000000')
db.exec('PRAGMA foreign_keys = ON')
