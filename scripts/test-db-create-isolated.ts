/**
 * Pre-creates isolated test databases for each test file.
 * This avoids on-demand database copying during test execution,
 * significantly improving test performance.
 */

import fs from 'fs'
import path from 'path'

const BASE_TEST_DB = 'test.db'

// List of all test files that need isolated databases
const TEST_FILES = [
	'admin-moderation',
	'admin-z-content-management',
	'auth-admin-login',
	'auth-login-flow',
	'auth-protected-routes',
	'auth-simple-auth',
	'auth-viewer',
	'browse-content',
	'content-detail',
	'content-submit-library',
	'content-submit-recipe',
	'content-submit-video',
	'search'
]

console.log('🗂️  Pre-creating isolated test databases...')

if (!fs.existsSync(BASE_TEST_DB)) {
	console.error(`❌ Error: ${BASE_TEST_DB} not found. Run 'bun db:test:init && bun db:test:seed' first.`)
	process.exit(1)
}

let created = 0
let skipped = 0

for (const testFile of TEST_FILES) {
	const isolatedDbPath = `test-${testFile}.db`

	// Remove existing isolated database if it exists
	if (fs.existsSync(isolatedDbPath)) {
		fs.unlinkSync(isolatedDbPath)
	}

	// Copy the base test database
	fs.copyFileSync(BASE_TEST_DB, isolatedDbPath)
	created++
	console.log(`  ✓ Created ${isolatedDbPath}`)
}

console.log(`\n✅ Pre-created ${created} isolated test databases`)
console.log(`   Each test file will use its own database copy for perfect isolation\n`)
