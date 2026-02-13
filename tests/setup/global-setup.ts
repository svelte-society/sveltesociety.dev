/**
 * Global setup for Playwright tests.
 * Automatically discovers test files and pre-creates isolated databases for each.
 */

import fs from 'fs'
import path from 'path'
import { getTestFileIdentifier } from '../helpers/database-isolation'

function findSpecFiles(dir: string): string[] {
	if (!fs.existsSync(dir)) return []

	const entries = fs.readdirSync(dir, { withFileTypes: true })
	const files: string[] = []

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			files.push(...findSpecFiles(fullPath))
			continue
		}

		if (entry.isFile() && entry.name.endsWith('.spec.ts')) {
			files.push(fullPath.replace(/\\/g, '/'))
		}
	}

	return files
}

export default async function globalSetup() {
	console.log('🚀 Global test setup starting...\n')

	const BASE_TEST_DB = 'test.db'

	// Verify base test database exists
	if (!fs.existsSync(BASE_TEST_DB)) {
		console.error(`❌ Error: ${BASE_TEST_DB} not found.`)
		console.error('   Run "bun run db:test:init && bun run db:test:seed" first.\n')
		throw new Error('Base test database not found')
	}

	// Discover all test spec files
	const testFiles = findSpecFiles(path.join('tests', 'e2e'))

	if (testFiles.length === 0) {
		console.warn('⚠️  Warning: No test files found in tests/e2e/\n')
		return
	}

	console.log(`�� Found ${testFiles.length} test file(s)`)
	console.log('🗂️  Pre-creating isolated test databases...\n')

	let created = 0
	const seenIdentifiers = new Set<string>()

	for (const testFile of testFiles) {
		// Generate database identifier from file path
		// e.g., 'tests/e2e/admin/moderation.spec.ts' -> 'admin-moderation'
		const identifier = getTestFileIdentifier(testFile)

		// Skip duplicates (shouldn't happen but be safe)
		if (seenIdentifiers.has(identifier)) {
			continue
		}
		seenIdentifiers.add(identifier)

		const isolatedDbPath = `test-${identifier}.db`

		// Remove existing isolated database and its WAL/SHM files if they exist
		// SQLite WAL mode creates .db-wal and .db-shm files that can cause issues
		for (const ext of ['', '-wal', '-shm']) {
			const filePath = `${isolatedDbPath}${ext}`
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath)
			}
		}

		// Copy the base test database
		fs.copyFileSync(BASE_TEST_DB, isolatedDbPath)
		created++
		console.log(`  ✓ Created ${isolatedDbPath}`)
	}

	console.log(`\n✅ Pre-created ${created} isolated test database(s)`)
	console.log('   Each test file will use its own database copy for perfect isolation\n')
}

// Run when executed directly
if (import.meta.main) {
	globalSetup().catch(console.error)
}
