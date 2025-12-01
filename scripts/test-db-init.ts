#!/usr/bin/env bun
import { Database } from 'bun:sqlite'
import fs from 'fs'
import path from 'path'
import { MigrationRunner } from '../src/lib/server/db/migrations'

const TEST_DB_PATH = 'test.db'

/**
 * Expected schema objects that must exist after migrations.
 * These are verified to catch migration bugs early (like missing triggers).
 *
 * Update this list when adding new migrations that create triggers, views, or indexes.
 */
const EXPECTED_SCHEMA = {
	triggers: [
		'increment_likes',
		'decrement_likes',
		'increment_saves',
		'decrement_saves',
		'delete_content_tags',
		'delete_content_users',
		'delete_content_likes',
		'delete_content_saves',
		'update_published_at',
		'approve_content',
		'content___set_slug'
	],
	views: [
		'collections_view',
		'published_content',
		'draft_content',
		'archived_content',
		'content_without_collections',
		'content_with_authors'
	],
	indexes: [
		'idx_user_oauth_user_id',
		'idx_user_oauth_provider',
		'user_id_idx',
		'statusIdx',
		'tag_id_idx',
		'idx_cache_created_at',
		'idx_content_status_published_at',
		'idx_content_to_users_content_id',
		'idx_content_to_users_user_id'
	]
}

/**
 * Verify that all expected schema objects exist in the database.
 * This catches migration bugs like missing triggers or indexes.
 */
function verifySchemaIntegrity(db: Database): void {
	console.log('  → Verifying schema integrity...')

	const errors: string[] = []

	// Query all schema objects from sqlite_master
	const schemaObjects = db
		.query<{ name: string; type: string }, []>(
			`SELECT name, type FROM sqlite_master WHERE type IN ('trigger', 'view', 'index')`
		)
		.all()

	const existingTriggers = new Set(schemaObjects.filter((o) => o.type === 'trigger').map((o) => o.name))
	const existingViews = new Set(schemaObjects.filter((o) => o.type === 'view').map((o) => o.name))
	const existingIndexes = new Set(schemaObjects.filter((o) => o.type === 'index').map((o) => o.name))

	// Check triggers
	for (const trigger of EXPECTED_SCHEMA.triggers) {
		if (!existingTriggers.has(trigger)) {
			errors.push(`Missing trigger: ${trigger}`)
		}
	}

	// Check views
	for (const view of EXPECTED_SCHEMA.views) {
		if (!existingViews.has(view)) {
			errors.push(`Missing view: ${view}`)
		}
	}

	// Check indexes
	for (const index of EXPECTED_SCHEMA.indexes) {
		if (!existingIndexes.has(index)) {
			errors.push(`Missing index: ${index}`)
		}
	}

	if (errors.length > 0) {
		console.error('❌ Schema integrity check failed:')
		for (const error of errors) {
			console.error(`   - ${error}`)
		}
		throw new Error(`Schema integrity check failed with ${errors.length} error(s)`)
	}

	console.log(
		`    ✓ ${EXPECTED_SCHEMA.triggers.length} triggers, ${EXPECTED_SCHEMA.views.length} views, ${EXPECTED_SCHEMA.indexes.length} indexes verified`
	)
}

/**
 * Initialize the test database with schema and migrations
 * This script:
 * 1. Removes existing test.db if present
 * 2. Creates a new test.db
 * 3. Runs all migrations to set up schema, views, and triggers
 * 4. Verifies schema integrity to catch migration bugs
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

	// Verify schema integrity after migrations
	verifySchemaIntegrity(db)

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
