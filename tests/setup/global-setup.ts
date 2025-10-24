/**
 * Global setup for Playwright tests.
 * Automatically discovers test files and pre-creates isolated databases for each.
 */

import fs from 'fs'
import path from 'path'
import { globSync } from 'glob'

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
	const testFiles = globSync('tests/e2e/**/*.spec.ts', { cwd: process.cwd() })

	if (testFiles.length === 0) {
		console.warn('⚠️  Warning: No test files found in tests/e2e/\n')
		return
	}

	console.log(`📋 Found ${testFiles.length} test file(s)`)
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

		// Remove existing isolated database if it exists
		if (fs.existsSync(isolatedDbPath)) {
			fs.unlinkSync(isolatedDbPath)
		}

		// Copy the base test database
		fs.copyFileSync(BASE_TEST_DB, isolatedDbPath)
		created++
		console.log(`  ✓ Created ${isolatedDbPath}`)
	}

	console.log(`\n✅ Pre-created ${created} isolated test database(s)`)
	console.log('   Each test file will use its own database copy for perfect isolation\n')
}

/**
 * Extracts a test file identifier from the file path.
 * This must match the identifier used in setupDatabaseIsolation() calls.
 *
 * @param filePath - Full path to the test file
 * @returns A sanitized identifier (e.g., 'admin-moderation', 'content-detail')
 */
function getTestFileIdentifier(filePath: string): string {
	// Remove .spec.ts extension and get just the filename
	const basename = path.basename(filePath, '.spec.ts')

	// Determine the subdirectory (admin, auth, content, public, etc.)
	const parts = filePath.split('/')
	const e2eIndex = parts.indexOf('e2e')
	const subdir = e2eIndex >= 0 && parts[e2eIndex + 1] ? parts[e2eIndex + 1] : ''

	// Generate identifier based on subdirectory
	if (subdir === 'admin') {
		return `admin-${basename}`
	} else if (subdir === 'content') {
		return `content-${basename}`
	} else if (subdir === 'auth') {
		return `auth-${basename}`
	} else if (subdir === 'public') {
		return basename
	}

	// Default: use directory-basename
	return subdir ? `${subdir}-${basename}` : basename
}
