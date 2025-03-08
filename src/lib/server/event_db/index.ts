import { EVENT_DB_PATH } from '$env/static/private'
import { Database } from 'duckdb-async'

export const db = await Database.create(EVENT_DB_PATH)
