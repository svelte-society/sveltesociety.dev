import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { InteractionsService } from './interactions'
import { createTestDatabase } from '../db/test-helpers'

describe('InteractionsService', () => {
	let db: Database
	let interactionsService: InteractionsService

	beforeEach(() => {
		// Create in-memory database with all migrations applied
		db = createTestDatabase()

		// Insert test data
		const testData = {
			users: [
				{ id: 'user1', username: 'testuser1', email: 'user1@test.com' },
				{ id: 'user2', username: 'testuser2', email: 'user2@test.com' }
			],
			content: [
				{
					id: 'content1',
					title: 'Unique Test Content 1',
					type: 'blog',
					status: 'published',
					slug: 'unique-test-1',
					description: 'Test description 1',
					body: 'Test body 1',
					rendered_body: '<p>Test body 1</p>'
				},
				{
					id: 'content2',
					title: 'Unique Test Content 2',
					type: 'blog',
					status: 'published',
					slug: 'unique-test-2',
					description: 'Test description 2',
					body: 'Test body 2',
					rendered_body: '<p>Test body 2</p>'
				},
				{
					id: 'content3',
					title: 'Unique Test Content 3',
					type: 'blog',
					status: 'published',
					slug: 'unique-test-3',
					description: 'Test description 3',
					body: 'Test body 3',
					rendered_body: '<p>Test body 3</p>'
				}
			],
			likes: [
				{ user_id: 'user1', target_id: 'content1' },
				{ user_id: 'user1', target_id: 'content2' },
				{ user_id: 'user2', target_id: 'content1' }
			],
			saves: [
				{ user_id: 'user1', target_id: 'content2' },
				{ user_id: 'user2', target_id: 'content2' },
				{ user_id: 'user2', target_id: 'content3' }
			]
		}

		// Insert users
		const insertUser = db.prepare(`
      INSERT INTO users (id, username, email)
      VALUES ($id, $username, $email)
    `)
		for (const user of testData.users) {
			insertUser.run({
				id: user.id,
				username: user.username,
				email: user.email
			})
		}

		// Insert content
		const insertContent = db.prepare(`
      INSERT INTO content (
        id, title, type, status, slug, description,
        body, rendered_body, created_at, updated_at,
        published_at, likes, saves
      ) VALUES (
        $id, $title, $type, $status, $slug, $description,
        $body, $rendered_body, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP, 0, 0
      )
    `)
		for (const content of testData.content) {
			insertContent.run({
				id: content.id,
				title: content.title,
				type: content.type,
				status: content.status,
				slug: content.slug,
				description: content.description,
				body: content.body,
				rendered_body: content.rendered_body
			})
		}

		// Insert likes
		const insertLike = db.prepare(
			'INSERT INTO likes (user_id, target_id, created_at) VALUES ($user_id, $target_id, CURRENT_TIMESTAMP)'
		)
		for (const like of testData.likes) {
			insertLike.run({
				user_id: like.user_id,
				target_id: like.target_id
			})
		}

		// Insert saves
		const insertSave = db.prepare(
			'INSERT INTO saves (user_id, target_id, created_at) VALUES ($user_id, $target_id, CURRENT_TIMESTAMP)'
		)
		for (const save of testData.saves) {
			insertSave.run({
				user_id: save.user_id,
				target_id: save.target_id
			})
		}

		interactionsService = new InteractionsService(db)
	})

	afterEach(() => {
		db.close()
	})

	describe('getUserLikesAndSaves', () => {
		test('should return empty sets for undefined user', () => {
			const result = interactionsService.getUserLikesAndSaves(undefined, ['content1', 'content2'])
			expect(result.userLikes.size).toBe(0)
			expect(result.userSaves.size).toBe(0)
		})

		test('should return empty sets for empty content ids', () => {
			const result = interactionsService.getUserLikesAndSaves('user1', [])
			expect(result.userLikes.size).toBe(0)
			expect(result.userSaves.size).toBe(0)
		})

		test('should return correct likes and saves for user1', () => {
			const result = interactionsService.getUserLikesAndSaves('user1', [
				'content1',
				'content2',
				'content3'
			])
			expect(result.userLikes.size).toBe(2)
			expect(result.userLikes.has('content1')).toBe(true)
			expect(result.userLikes.has('content2')).toBe(true)
			expect(result.userSaves.size).toBe(1)
			expect(result.userSaves.has('content2')).toBe(true)
		})

		test('should return correct likes and saves for user2', () => {
			const result = interactionsService.getUserLikesAndSaves('user2', [
				'content1',
				'content2',
				'content3'
			])
			expect(result.userLikes.size).toBe(1)
			expect(result.userLikes.has('content1')).toBe(true)
			expect(result.userSaves.size).toBe(2)
			expect(result.userSaves.has('content2')).toBe(true)
			expect(result.userSaves.has('content3')).toBe(true)
		})
	})

	describe('toggleInteraction', () => {
		test('should add a new like', () => {
			const result = interactionsService.toggleInteraction('like', 'user1', 'content3')
			expect(result.action).toBe('add')
			expect(result.type).toBe('like')
			const userResult = interactionsService.getUserLikesAndSaves('user1', ['content3'])
			expect(userResult.userLikes.has('content3')).toBe(true)
		})

		test('should add a new save', () => {
			const result = interactionsService.toggleInteraction('save', 'user1', 'content1')
			expect(result.action).toBe('add')
			expect(result.type).toBe('save')
			const userResult = interactionsService.getUserLikesAndSaves('user1', ['content1'])
			expect(userResult.userSaves.has('content1')).toBe(true)
		})

		test('should remove an existing like when toggled', () => {
			const result = interactionsService.toggleInteraction('like', 'user1', 'content1')
			expect(result.action).toBe('remove')
			expect(result.type).toBe('like')
			const userResult = interactionsService.getUserLikesAndSaves('user1', ['content1'])
			expect(userResult.userLikes.has('content1')).toBe(false)
		})

		test('should remove an existing save when toggled', () => {
			const result = interactionsService.toggleInteraction('save', 'user2', 'content2')
			expect(result.action).toBe('remove')
			expect(result.type).toBe('save')
			const userResult = interactionsService.getUserLikesAndSaves('user2', ['content2'])
			expect(userResult.userSaves.has('content2')).toBe(false)
		})
	})

	describe('getUserContentStats', () => {
		test('should return correct stats for user with content', () => {
			// First need to create an author relationship
			db.prepare(
				'INSERT INTO content_to_users (content_id, user_id) VALUES ($content_id, $user_id)'
			).run({ content_id: 'content1', user_id: 'user1' })

			// Update content stats to match the likes/saves
			db.prepare('UPDATE content SET likes = 2, saves = 0 WHERE id = $id').run({
				id: 'content1'
			})

			const stats = interactionsService.getUserContentStats('user1')
			expect(stats.totalContent).toBe(1)
			expect(stats.totalLikes).toBe(2)
			expect(stats.totalSaves).toBe(0)
		})

		test('should return zero stats for user with no content', () => {
			const stats = interactionsService.getUserContentStats('user_with_no_content')
			expect(stats.totalContent).toBe(0)
			expect(stats.totalLikes).toBe(0)
			expect(stats.totalSaves).toBe(0)
		})
	})
})
