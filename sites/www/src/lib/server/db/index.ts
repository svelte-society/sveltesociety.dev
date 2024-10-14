import { DB_PATH } from '$env/static/private'
import Database from 'better-sqlite3'

export const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('busy_timeout = 5000')
db.pragma('synchronous = NORMAL')
db.pragma('cache_size = 300000')
db.pragma('temp_store = MEMORY')
db.pragma('mmap_size = 3000000')
db.pragma('foreign_keys = ON')
