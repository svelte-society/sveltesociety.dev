import { Database } from 'bun:sqlite'
import fs from 'fs'
import path from 'path'

import { DB_PATH } from '$env/static/private'
import { MigrationRunner } from './migrations'

// Create database directory if it doesn't exist
const dbDir = path.dirname(DB_PATH)
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true })
}

export const db = new Database(DB_PATH)

export const initiate_db = async () => {
	console.log('Initiating database...')
	const migrationRunner = new MigrationRunner(db)
	await migrationRunner.runMigrations()

	db.run('PRAGMA journal_mode = WAL')
	db.run('PRAGMA foreign_keys = ON')

	console.log('Database initialization completed.')
}
