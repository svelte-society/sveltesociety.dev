import { DB_PATH } from '$env/static/private'
import Database from 'better-sqlite3';


export const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
