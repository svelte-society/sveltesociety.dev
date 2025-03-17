import { Database } from 'bun:sqlite';

export type Tag = {
	id: string
	name: string
	slug: string
	color?: string | null
	created_at: string
	updated_at: string
}

export class TagService {
	private getTagsStatement;
	private getTagsCountStatement;
	private getTagStatement;
	private deleteTagStatement;
	private createTagStatement;
	private updateTagStatement;

	constructor(private db: Database) {
		this.getTagsStatement = this.db.prepare(
			'SELECT * FROM tags ORDER BY created_at DESC LIMIT $limit OFFSET $offset'
		);

		this.getTagsCountStatement = this.db.prepare(
			'SELECT COUNT(*) as count FROM tags'
		);

		this.getTagStatement = this.db.prepare(
			'SELECT * FROM tags WHERE id = $id'
		);

		this.deleteTagStatement = this.db.prepare(
			'DELETE FROM tags WHERE id = $id RETURNING *'
		);

		this.createTagStatement = this.db.prepare(
			'INSERT INTO tags (name, slug) VALUES ($name, $slug) RETURNING *'
		);

		this.updateTagStatement = this.db.prepare(
			'UPDATE tags SET name = $name, slug = $slug WHERE id = $id RETURNING *'
		);
	}

	getTags(options?: { limit?: number; offset?: number }): Tag[] {
		try {
			const limit = options?.limit ?? 10;
			const offset = options?.offset ?? 0;
			return this.getTagsStatement.all({
				$limit: limit,
				$offset: offset
			}) as Tag[];
		} catch (error) {
			console.error('Error getting tags:', error);
			return [];
		}
	}

	getTagsCount(): number {
		const result = this.getTagsCountStatement.get() as { count: number };
		return result.count;
	}

	getTag(id: string): Tag | undefined {
		const result = this.getTagStatement.get({ $id: id });
		return result ? result as Tag : undefined;
	}

	deleteTag(id: string): boolean {
		const result = this.deleteTagStatement.run({ $id: id });
		return result.changes > 0;
	}

	createTag(tag: Omit<Tag, 'id' | 'created_at' | 'updated_at' | 'color'>): Tag {
		const result = this.createTagStatement.get({
			$name: tag.name,
			$slug: tag.slug
		});
		return result as Tag;
	}

	updateTag(tag: Omit<Tag, 'created_at' | 'updated_at'>): Tag | undefined {
		const result = this.updateTagStatement.get({
			$name: tag.name,
			$slug: tag.slug,
			$id: tag.id
		});
		return result ? result as Tag : undefined;
	}
}