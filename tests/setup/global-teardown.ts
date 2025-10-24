/**
 * Global teardown for Playwright tests.
 * Cleans up isolated test databases after all tests complete.
 */

import fs from 'fs'
import { globSync } from 'glob'

export default async function globalTeardown() {
	console.log('\n🧹 Cleaning up isolated test databases...')

	try {
		// Find all isolated test database files (including WAL and SHM files)
		const testDbFiles = globSync('test-*.db*', { cwd: process.cwd() })

		if (testDbFiles.length === 0) {
			console.log('  No isolated test databases found to clean up.')
			return
		}

		let removed = 0
		for (const file of testDbFiles) {
			try {
				fs.unlinkSync(file)
				removed++
			} catch (error) {
				console.warn(`  Warning: Could not remove ${file}:`, error)
			}
		}

		console.log(`  ✓ Removed ${removed} isolated test database file(s)`)
		console.log('✅ Teardown complete\n')
	} catch (error) {
		console.error('❌ Error during teardown:', error)
	}
}
