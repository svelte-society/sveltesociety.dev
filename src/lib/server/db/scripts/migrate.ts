#!/usr/bin/env bun

import { Database } from 'bun:sqlite'
import { MigrationRunner } from '../migrations'
import { env } from '$env/dynamic/private'
import path from 'node:path'
import fs from 'node:fs'

async function runMigrations() {
	try {
		// Create database directory if it doesn't exist
		const dbDir = path.dirname(env.DB_PATH ?? 'data.db')
		if (!fs.existsSync(dbDir)) {
			fs.mkdirSync(dbDir, { recursive: true })
		}

		const db = new Database(env.DB_PATH ?? 'data.db')
		db.exec('PRAGMA journal_mode = WAL')
		// IMPORTANT: Disable foreign keys during migrations to prevent
		// ON DELETE CASCADE from wiping junction tables when parent tables
		// are dropped and recreated (e.g., content_to_users was wiped when
		// migration 007 dropped the content table)
		db.exec('PRAGMA foreign_keys = OFF')

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

		// Re-enable foreign keys after migrations complete
		db.exec('PRAGMA foreign_keys = ON')

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
