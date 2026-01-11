#!/usr/bin/env bun
import { Database } from 'bun:sqlite'
import {
	TEST_USERS,
	TEST_TAGS,
	TEST_CONTENT,
	TEST_JOBS,
	TEST_SAVES,
	TEST_PENDING_CONTENT,
	getSessionExpiry,
	getYesterday
} from '../tests/fixtures/test-data'

const TEST_DB_PATH = 'test.db'

/**
 * Seed the test database with comprehensive test data
 */
async function seedTestDatabase() {
	console.log('🌱 Seeding test database...')

	const db = new Database(TEST_DB_PATH)

	try {
		// Clear existing test data (in reverse order of foreign keys)
		console.log('  → Clearing existing test data...')
		db.run('DELETE FROM saves')
		db.run('DELETE FROM likes')
		db.run('DELETE FROM content_to_tags')
		db.run('DELETE FROM content_to_users')
		db.run('DELETE FROM content')
		db.run('DELETE FROM tags')
		db.run('DELETE FROM sessions')
		db.run('DELETE FROM user_oauth')
		db.run('DELETE FROM users')

		// Get role IDs
		const roles = {
			admin: db.prepare('SELECT id FROM roles WHERE value = ?').get('admin') as { id: number },
			moderator: db.prepare('SELECT id FROM roles WHERE value = ?').get('moderator') as {
				id: number
			},
			member: db.prepare('SELECT id FROM roles WHERE value = ?').get('member') as { id: number }
		}

		// 1. Create test users
		console.log('  → Creating test users...')
		const userInsert = db.prepare(`
			INSERT INTO users (id, email, username, name, avatar_url, bio, role)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`)

		Object.values(TEST_USERS).forEach((user) => {
			const roleId = roles[user.roleValue as keyof typeof roles].id
			userInsert.run(
				user.id,
				user.email,
				user.username,
				user.name,
				user.avatarUrl,
				user.bio,
				roleId
			)
		})

		// 2. Create OAuth provider entries for test users
		console.log('  → Creating OAuth entries...')
		const githubProvider = db
			.prepare('SELECT id FROM oauth_providers WHERE name = ?')
			.get('github') as { id: number }
		const oauthInsert = db.prepare(`
			INSERT INTO user_oauth (user_id, provider_id, provider_user_id, access_token, profile_data)
			VALUES (?, ?, ?, ?, ?)
		`)

		Object.values(TEST_USERS).forEach((user, index) => {
			oauthInsert.run(
				user.id,
				githubProvider.id,
				String(index + 1),
				`test_access_token_${user.username}`,
				JSON.stringify({ login: user.username })
			)
		})

		// 3. Create sessions for test users
		console.log('  → Creating user sessions...')
		const sessionInsert = db.prepare(`
			INSERT INTO sessions (user_id, session_token, expires_at)
			VALUES (?, ?, ?)
		`)

		const expiry = getSessionExpiry()
		Object.values(TEST_USERS).forEach((user) => {
			sessionInsert.run(user.id, user.sessionToken, expiry)
		})

		// 4. Create tags
		console.log('  → Creating tags...')
		const tagInsert = db.prepare(`
			INSERT INTO tags (id, name, slug, color)
			VALUES (?, ?, ?, ?)
		`)

		TEST_TAGS.forEach((tag) => tagInsert.run(tag.id, tag.name, tag.slug, tag.color))

		// 5. Create sample content
		console.log('  → Creating sample content...')
		const contentInsert = db.prepare(`
			INSERT INTO content (id, title, type, status, body, slug, description, metadata, children, published_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`)

		const yesterday = getYesterday()

		TEST_CONTENT.forEach((content) => {
			const children =
				'children' in content && content.children ? JSON.stringify(content.children) : null
			contentInsert.run(
				content.id,
				content.title,
				content.type,
				content.status,
				content.body,
				content.slug,
				content.description,
				content.metadata ? JSON.stringify(content.metadata) : null,
				children,
				content.published ? yesterday : null
			)
		})

		// 6. Link content to users (authors)
		console.log('  → Linking content to authors...')
		const contentUserInsert = db.prepare(`
			INSERT INTO content_to_users (content_id, user_id)
			VALUES (?, ?)
		`)

		TEST_CONTENT.forEach((content) => {
			contentUserInsert.run(content.id, content.authorId)
		})

		// 7. Link content to tags
		console.log('  → Linking content to tags...')
		const contentTagInsert = db.prepare(`
			INSERT INTO content_to_tags (content_id, tag_id)
			VALUES (?, ?)
		`)

		TEST_CONTENT.forEach((content) => {
			content.tags.forEach((tagId) => {
				contentTagInsert.run(content.id, tagId)
			})
		})

		// 8. Add saves/bookmarks
		console.log('  → Creating bookmarks...')
		const saveInsert = db.prepare(`
			INSERT INTO saves (user_id, target_id)
			VALUES (?, ?)
		`)

		TEST_SAVES.forEach((save) => {
			saveInsert.run(save.userId, save.contentId)
		})

		// 9. Add pending content entries (for moderation testing)
		console.log('  → Creating pending content entries...')
		TEST_PENDING_CONTENT.forEach((content) => {
			contentInsert.run(
				content.id,
				content.title,
				content.type,
				content.status,
				content.body,
				content.slug,
				content.description,
				content.metadata ? JSON.stringify(content.metadata) : null,
				null, // children
				null // published_at
			)
			// Link to author
			contentUserInsert.run(content.id, content.authorId)
			// Link to tags
			content.tags.forEach((tagId) => {
				contentTagInsert.run(content.id, tagId)
			})
		})

		// 10. Add job listings
		console.log('  → Creating job listings...')
		TEST_JOBS.forEach((job) => {
			contentInsert.run(
				job.id,
				job.title,
				job.type,
				job.status,
				job.body,
				job.slug,
				job.description,
				job.metadata ? JSON.stringify(job.metadata) : null,
				null, // children
				job.published ? yesterday : null
			)
			// Link to author
			contentUserInsert.run(job.id, job.authorId)
			// Link to tags
			job.tags.forEach((tagId) => {
				contentTagInsert.run(job.id, tagId)
			})
		})

		// Summary
		console.log('\n✅ Test database seeded successfully!')
		console.log('\n📊 Summary:')
		console.log(`   Users: ${Object.keys(TEST_USERS).length} (admin, contributor, viewer)`)
		console.log(`   Tags: ${TEST_TAGS.length}`)
		console.log(
			`   Content: ${TEST_CONTENT.length} published + ${TEST_PENDING_CONTENT.length} pending`
		)
		console.log(`   Jobs: ${TEST_JOBS.length} published`)
		console.log(`   Sessions: ${Object.keys(TEST_USERS).length} (one per user)`)
		console.log('\n🔑 Test User Credentials:')
		Object.entries(TEST_USERS).forEach(([key, user]) => {
			console.log(
				`   ${key.charAt(0).toUpperCase() + key.slice(1).padEnd(12)} ${user.username} / ${user.email}`
			)
		})
		console.log(`\n🎫 Session Tokens (for auth fixtures):`)
		Object.entries(TEST_USERS).forEach(([key, user]) => {
			console.log(
				`   ${key.charAt(0).toUpperCase() + key.slice(1).padEnd(12)} ${user.sessionToken}`
			)
		})
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
