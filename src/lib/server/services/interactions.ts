import { Database } from 'bun:sqlite'

export class InteractionsService {
	constructor(private db: Database) {}

	getUserLikesAndSaves(
		userId: string | undefined,
		contentIds: string[]
	): { userLikes: Set<string>; userSaves: Set<string> } {
		if (!userId || contentIds.length === 0) {
			return { userLikes: new Set<string>(), userSaves: new Set<string>() }
		}

		const userLikes = new Set<string>()
		const userSaves = new Set<string>()

		const likeStmt = this.db.prepare(
			'SELECT 1 FROM likes WHERE user_id = $user_id AND target_id = $target_id'
		)
		const saveStmt = this.db.prepare(
			'SELECT 1 FROM saves WHERE user_id = $user_id AND target_id = $target_id'
		)

		this.db.transaction(() => {
			for (const contentId of contentIds) {
				if (likeStmt.get({ user_id: userId, target_id: contentId })) {
					userLikes.add(contentId)
				}
				if (saveStmt.get({ user_id: userId, target_id: contentId })) {
					userSaves.add(contentId)
				}
			}
		})()

		return { userLikes, userSaves }
	}

	getUserContentStats(authorId: string): {
		totalLikes: number
		totalSaves: number
		totalContent: number
	} {
		// Get total likes and saves received on content authored by the user
		const statsQuery = this.db.prepare(`
			SELECT 
				SUM(c.likes) as totalLikes,
				SUM(c.saves) as totalSaves,
				COUNT(c.id) as totalContent
			FROM content c
			JOIN content_to_users cu ON c.id = cu.content_id
			WHERE cu.user_id = $authorId AND c.status = 'published'
		`)

		const stats = statsQuery.get({ authorId }) as {
			totalLikes: number | null
			totalSaves: number | null
			totalContent: number
		}

		return {
			totalLikes: stats.totalLikes || 0,
			totalSaves: stats.totalSaves || 0,
			totalContent: stats.totalContent || 0
		}
	}

	toggleInteraction(type: 'like' | 'save', userId: string, contentId: string) {
		const interactionQuery = this.db.prepare(
			`SELECT * FROM ${type}s WHERE user_id = $user_id AND target_id = $target_id`
		)

		const interaction = interactionQuery.get({ user_id: userId, target_id: contentId })

		if (interaction) {
			const query = `DELETE FROM ${type}s WHERE user_id = $user_id AND target_id = $target_id`
			this.db.prepare(query).run({ user_id: userId, target_id: contentId })
			return { success: true, type, action: 'remove' }
		} else {
			const query = this.db.prepare(
				`INSERT OR IGNORE INTO ${type}s (user_id, target_id, created_at) VALUES ($user_id, $target_id, CURRENT_TIMESTAMP)`
			)
			query.run({ user_id: userId, target_id: contentId })
			return { success: true, type, action: 'add' }
		}
	}
}
