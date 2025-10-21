#!/usr/bin/env bun
import { Database } from 'bun:sqlite'

const TEST_DB_PATH = 'test.db'

/**
 * Seed the test database with minimal test data
 * This is a minimal version for Phase 1a testing.
 * Will be expanded in Phase 1b with proper test users and content.
 */
async function seedTestDatabase() {
	console.log('🌱 Seeding test database...')

	const db = new Database(TEST_DB_PATH)

	try {
		// For now, just verify the database exists and has tables
		const tables = db.prepare('SELECT COUNT(*) as count FROM sqlite_master WHERE type="table"').get() as { count: number }
		console.log(`  → Found ${tables.count} tables in database`)

		// TODO: Phase 1b will add:
		// - Test users (admin, contributor, viewer)
		// - Test roles
		// - Sample content
		// - Test sessions

		console.log('✅ Test database seeded successfully (minimal seed for Phase 1a)')
	} catch (error) {
		console.error('❌ Failed to seed test database:', error)
		throw error
	} finally {
		db.close()
	}
}

// Run the seeding
seedTestDatabase().catch((error) => {
	console.error('❌ Failed to seed test database:', error)
	process.exit(1)
})
