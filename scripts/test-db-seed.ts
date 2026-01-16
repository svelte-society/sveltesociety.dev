#!/usr/bin/env bun
import { Database } from 'bun:sqlite'
import {
	TEST_USERS,
	TEST_TAGS,
	TEST_CONTENT,
	TEST_JOBS,
	TEST_SAVES,
	TEST_PENDING_CONTENT,
	TEST_SPONSORS,
	TEST_SPONSOR_TIERS,
	TEST_SPONSOR_SUBSCRIPTIONS,
	TEST_FEED_ITEMS,
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
			INSERT INTO users (id, email, username, name, avatar_url, bio, role, newsletter_preference)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`)

		Object.values(TEST_USERS).forEach((user) => {
			const roleId = roles[user.roleValue as keyof typeof roles].id
			// Set newsletter_preference to 'declined' for most users to prevent modal from
			// interfering with tests. The newsletter_new user keeps null for modal testing.
			const newsletterPreference = user.username === 'test_newsletter' ? null : 'declined'
			userInsert.run(
				user.id,
				user.email,
				user.username,
				user.name,
				user.avatarUrl,
				user.bio,
				roleId,
				newsletterPreference
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

		// 11. Add sponsor tiers (clear subscriptions/sponsors first due to FK constraints)
		console.log('  → Creating sponsor tiers...')
		db.run('DELETE FROM sponsor_subscriptions')
		db.run('DELETE FROM sponsors')
		db.run('DELETE FROM sponsor_tiers')
		const tierInsert = db.prepare(`
			INSERT INTO sponsor_tiers (id, name, display_name, price_cents, yearly_price_cents, one_time_price_cents, features, max_tagline_length, logo_size, sort_order)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`)

		TEST_SPONSOR_TIERS.forEach((tier) => {
			tierInsert.run(
				tier.id,
				tier.name,
				tier.display_name,
				tier.price_cents,
				tier.yearly_price_cents,
				tier.one_time_price_cents,
				JSON.stringify(tier.features),
				tier.max_tagline_length,
				tier.logo_size,
				tier.display_order
			)
		})

		// 12. Add sponsors (matches sponsors table schema)
		console.log('  → Creating sponsors...')
		const sponsorInsert = db.prepare(`
			INSERT INTO sponsors (id, company_name, logo_url, tagline, website_url, discount_code, discount_description, contact_email, status, activated_at, expires_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`)

		TEST_SPONSORS.forEach((sponsor) => {
			sponsorInsert.run(
				sponsor.id,
				sponsor.company_name,
				sponsor.logo_url,
				sponsor.tagline,
				sponsor.website_url,
				sponsor.discount_code,
				sponsor.discount_description,
				sponsor.contact_email,
				sponsor.status,
				sponsor.activated_at,
				sponsor.expires_at
			)
		})

		// 13. Add sponsor subscriptions (links sponsors to tiers)
		console.log('  → Creating sponsor subscriptions...')
		const subscriptionInsert = db.prepare(`
			INSERT INTO sponsor_subscriptions (id, sponsor_id, tier_id, billing_type, stripe_subscription_id, stripe_customer_id, stripe_checkout_session_id, amount_cents, currency, status, current_period_start, current_period_end)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`)

		TEST_SPONSOR_SUBSCRIPTIONS.forEach((sub) => {
			subscriptionInsert.run(
				sub.id,
				sub.sponsor_id,
				sub.tier_id,
				sub.billing_type,
				sub.stripe_subscription_id,
				sub.stripe_customer_id,
				sub.stripe_checkout_session_id,
				sub.amount_cents,
				sub.currency,
				sub.status,
				sub.current_period_start,
				sub.current_period_end
			)
		})

		// 14. Add feed items (for feed builder testing)
		console.log('  → Creating feed items...')
		db.run('DELETE FROM feed_items')
		const feedItemInsert = db.prepare(`
			INSERT INTO feed_items (id, content_id, sponsor_id, item_type, title, description, button_text, button_href, position_type, position_fixed, position_range_min, position_range_max, start_date, end_date, is_active, priority, created_by)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`)

		TEST_FEED_ITEMS.forEach((item) => {
			feedItemInsert.run(
				item.id,
				item.content_id,
				item.sponsor_id,
				item.item_type,
				item.title,
				item.description,
				item.button_text,
				item.button_href,
				item.position_type,
				item.position_fixed,
				item.position_range_min,
				item.position_range_max,
				item.start_date,
				item.end_date,
				item.is_active ? 1 : 0,
				item.priority,
				item.created_by
			)
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
		console.log(`   Sponsors: ${TEST_SPONSORS.length} (${TEST_SPONSOR_TIERS.length} tiers)`)
		console.log(`   Feed Items: ${TEST_FEED_ITEMS.length} (CTA + sponsor items)`)
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
