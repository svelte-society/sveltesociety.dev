import { Database } from 'bun:sqlite';

export class InteractionsService {
	constructor(private db: Database) {}

	getUserLikesAndSaves(userId: string | undefined, contentIds: string[]): { userLikes: Set<string>; userSaves: Set<string> } {
		if (!userId || contentIds.length === 0) {
			return { userLikes: new Set<string>(), userSaves: new Set<string>() };
		}

		const userLikes = new Set<string>();
		const userSaves = new Set<string>();

		const likeStmt = this.db.prepare(
			'SELECT 1 FROM likes WHERE user_id = $user_id AND target_id = $target_id'
		);
		const saveStmt = this.db.prepare(
			'SELECT 1 FROM saves WHERE user_id = $user_id AND target_id = $target_id'
		);

		this.db.transaction(() => {
			for (const contentId of contentIds) {
				if (likeStmt.get({ $user_id: userId, $target_id: contentId })) {
					userLikes.add(contentId);
				}
				if (saveStmt.get({ $user_id: userId, $target_id: contentId })) {
					userSaves.add(contentId);
				}
			}
		})();

		return { userLikes, userSaves };
	}

	getUserLikesAndSavesCount(userId: string | undefined): {
		userLikes: number;
		userSaves: number;
	} {
		if (!userId) {
			return { userLikes: 0, userSaves: 0 };
		}

		let userLikes = 0;
		let userSaves = 0;

		const likeStmt = this.db.prepare('SELECT COUNT(1) AS count FROM likes WHERE user_id = $id');
		const saveStmt = this.db.prepare('SELECT COUNT(1) AS count FROM saves WHERE user_id = $id');

		this.db.transaction(() => {
			userLikes = (likeStmt.get({ $id: userId }) as { count: number }).count;
			userSaves = (saveStmt.get({ $id: userId }) as { count: number }).count;
		})();

		return { userLikes, userSaves };
	}

	addInteraction(type: 'like' | 'save', userId: string, contentId: string): void {
		const query = this.db.prepare(
			`INSERT OR IGNORE INTO ${type}s (user_id, target_id, created_at) VALUES ($user_id, $target_id, CURRENT_TIMESTAMP)`
		);
		query.run({ $user_id: userId, $target_id: contentId });
	}

	removeInteraction(type: 'like' | 'save', userId: string, contentId: string): void {
		const table = `${type}s`;
		const query = `DELETE FROM ${table} WHERE user_id = $user_id AND target_id = $target_id`;
		this.db.prepare(query).run({ $user_id: userId, $target_id: contentId });
	}
}
