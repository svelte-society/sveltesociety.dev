#!/usr/bin/env bun
import { Database } from 'bun:sqlite'
import fs from 'fs'
import path from 'path'
import { MigrationRunner } from '../src/lib/server/db/migrations'

const TEST_DB_PATH = 'test.db'

/**
 * Initialize the test database with schema and migrations
 * This script:
 * 1. Removes existing test.db if present
 * 2. Creates a new test.db
 * 3. Runs all migrations to set up schema, views, and triggers
 */
async function initTestDatabase() {
	console.log('🧪 Initializing test database...')

	// Remove existing test database if it exists
	if (fs.existsSync(TEST_DB_PATH)) {
		console.log('  → Removing existing test.db')
		fs.unlinkSync(TEST_DB_PATH)
	}

	// Create new database
	console.log('  → Creating new test.db')
	const db = new Database(TEST_DB_PATH)

	// Set pragmas for better performance and consistency
	db.exec('PRAGMA journal_mode = WAL')
	db.exec('PRAGMA foreign_keys = ON')

	// Run migrations
	console.log('  → Running migrations...')
	const migrationRunner = new MigrationRunner(db)
	await migrationRunner.runMigrations()

	// Close database connection
	db.close()

	console.log('✅ Test database initialized successfully')
	console.log(`   Database: ${path.resolve(TEST_DB_PATH)}`)
}

// Run the initialization
initTestDatabase().catch((error) => {
	console.error('❌ Failed to initialize test database:', error)
	process.exit(1)
})
