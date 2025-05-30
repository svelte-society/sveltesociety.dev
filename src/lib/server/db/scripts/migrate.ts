#!/usr/bin/env bun

import { Database } from 'bun:sqlite'
import { MigrationRunner } from '../migrations'
import { DB_PATH } from '$env/static/private'
import path from 'path'
import fs from 'fs'

async function runMigrations() {
	try {
		// Create database directory if it doesn't exist
		const dbDir = path.dirname(DB_PATH)
		if (!fs.existsSync(dbDir)) {
			fs.mkdirSync(dbDir, { recursive: true })
		}

		const db = new Database(DB_PATH)
		db.exec('PRAGMA journal_mode = WAL')
		db.exec('PRAGMA foreign_keys = ON')

		const migrationRunner = new MigrationRunner(db)

		// Show current status
		console.log('\n=== Migration Status ===')
		const status = migrationRunner.getMigrationStatus()
		status.forEach((migration) => {
			const statusIcon = migration.applied ? '✓' : '○'
			console.log(
				`${statusIcon} ${migration.version.toString().padStart(3, '0')}: ${migration.name}`
			)
		})

		// Run migrations
		await migrationRunner.runMigrations()

		db.close()
		console.log('\nMigration script completed successfully')
	} catch (error) {
		console.error('Migration script failed:', error)
		process.exit(1)
	}
}

if (import.meta.main) {
	runMigrations()
}
