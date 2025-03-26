import { describe, test, expect, beforeAll, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { InteractionsService } from './interactions'
import fs from 'node:fs'

describe('InteractionsService', () => {
	let db: Database
	let interactionsService: InteractionsService

	beforeAll(() => {
		// Read and execute schema
		const schema = fs.readFileSync('src/lib/server/db/schema/schema.sql', 'utf-8')
		db = new Database(':memory:', { strict: true })
		db.exec(schema)
	})

	beforeEach(() => {
		// Clear all tables
		db.prepare('DELETE FROM likes').run()
		db.prepare('DELETE FROM saves').run()
		db.prepare('DELETE FROM content').run()
		db.prepare('DELETE FROM users').run()

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

	describe('getUserLikesAndSavesCount', () => {
		test('should return zero counts for undefined user', () => {
			const result = interactionsService.getUserLikesAndSavesCount(undefined)
			expect(result.userLikes).toBe(0)
			expect(result.userSaves).toBe(0)
		})

		test('should return correct counts for user1', () => {
			const result = interactionsService.getUserLikesAndSavesCount('user1')
			expect(result.userLikes).toBe(2)
			expect(result.userSaves).toBe(1)
		})

		test('should return correct counts for user2', () => {
			const result = interactionsService.getUserLikesAndSavesCount('user2')
			expect(result.userLikes).toBe(1)
			expect(result.userSaves).toBe(2)
		})
	})

	describe('addInteraction', () => {
		test('should add a new like', () => {
			interactionsService.addInteraction('like', 'user1', 'content3')
			const result = interactionsService.getUserLikesAndSaves('user1', ['content3'])
			expect(result.userLikes.has('content3')).toBe(true)
		})

		test('should add a new save', () => {
			interactionsService.addInteraction('save', 'user1', 'content1')
			const result = interactionsService.getUserLikesAndSaves('user1', ['content1'])
			expect(result.userSaves.has('content1')).toBe(true)
		})

		test('should not duplicate existing like', () => {
			interactionsService.addInteraction('like', 'user1', 'content1')
			const result = interactionsService.getUserLikesAndSavesCount('user1')
			expect(result.userLikes).toBe(2) // Should remain the same
		})

		test('should not duplicate existing save', () => {
			interactionsService.addInteraction('save', 'user1', 'content2')
			const result = interactionsService.getUserLikesAndSavesCount('user1')
			expect(result.userSaves).toBe(1) // Should remain the same
		})
	})

	describe('removeInteraction', () => {
		test('should remove an existing like', () => {
			interactionsService.removeInteraction('like', 'user1', 'content1')
			const result = interactionsService.getUserLikesAndSaves('user1', ['content1'])
			expect(result.userLikes.has('content1')).toBe(false)
		})

		test('should remove an existing save', () => {
			interactionsService.removeInteraction('save', 'user2', 'content2')
			const result = interactionsService.getUserLikesAndSaves('user2', ['content2'])
			expect(result.userSaves.has('content2')).toBe(false)
		})

		test('should not error when removing non-existent like', () => {
			expect(() => {
				interactionsService.removeInteraction('like', 'user1', 'content3')
			}).not.toThrow()
		})

		test('should not error when removing non-existent save', () => {
			expect(() => {
				interactionsService.removeInteraction('save', 'user1', 'content3')
			}).not.toThrow()
		})
	})
})
