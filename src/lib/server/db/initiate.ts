import { Database } from 'bun:sqlite'
import fs from 'node:fs'
import path from 'node:path'

import { DB_PATH } from '$env/static/private'
import { MigrationRunner } from './migrations'

// Create database directory if it doesn't exist
const dbDir = path.dirname(DB_PATH)
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true })
}

export const initiate_db = async () => {
	console.log('Initiating database...')
	const db = new Database(DB_PATH)
	db.exec('PRAGMA journal_mode = WAL')
	db.exec('PRAGMA foreign_keys = ON')

	const migrationRunner = new MigrationRunner(db)
	await migrationRunner.runMigrations()

	db.close()
	console.log('Database initialization completed.')
}
