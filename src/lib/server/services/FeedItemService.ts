import type { Database } from 'bun:sqlite'

export interface FeedItem {
	id: string
	content_id: string | null
	item_type: 'cta' | 'ad' | 'featured'
	title: string | null
	description: string | null
	button_text: string | null
	button_href: string | null
	position_type: 'fixed' | 'random'
	position_fixed: number | null
	position_range_min: number | null
	position_range_max: number | null
	start_date: string | null
	end_date: string | null
	is_active: number
	priority: number
	created_at: string
	updated_at: string
	created_by: string | null
}

export interface FeedItemWithContent extends FeedItem {
	content_title: string | null
	content_description: string | null
	content_type: string | null
	content_slug: string | null
}

export class FeedItemService {
	private db: Database

	private createStatement: any
	private updateStatement: any
	private deleteStatement: any
	private getByIdStatement: any
	private getAllStatement: any
	private getActiveStatement: any
	private toggleStatusStatement: any

	constructor(db: Database) {
		this.db = db

		this.createStatement = this.db.prepare(`
			INSERT INTO feed_items (
				content_id, item_type, title, description, button_text, button_href,
				position_type, position_fixed, position_range_min, position_range_max,
				start_date, end_date, is_active, priority, created_by
			)
			VALUES (
				$content_id, $item_type, $title, $description, $button_text, $button_href,
				$position_type, $position_fixed, $position_range_min, $position_range_max,
				$start_date, $end_date, $is_active, $priority, $created_by
			)
			RETURNING *
		`)

		this.updateStatement = this.db.prepare(`
			UPDATE feed_items
			SET content_id = $content_id,
				item_type = $item_type,
				title = $title,
				description = $description,
				button_text = $button_text,
				button_href = $button_href,
				position_type = $position_type,
				position_fixed = $position_fixed,
				position_range_min = $position_range_min,
				position_range_max = $position_range_max,
				start_date = $start_date,
				end_date = $end_date,
				is_active = $is_active,
				priority = $priority
			WHERE id = $id
			RETURNING *
		`)

		this.deleteStatement = this.db.prepare(`
			DELETE FROM feed_items WHERE id = $id
		`)

		this.getByIdStatement = this.db.prepare(`
			SELECT fi.*,
				   c.title as content_title,
				   c.description as content_description,
				   c.type as content_type,
				   c.slug as content_slug
			FROM feed_items fi
			LEFT JOIN content c ON fi.content_id = c.id
			WHERE fi.id = $id
		`)

		this.getAllStatement = this.db.prepare(`
			SELECT fi.*,
				   c.title as content_title,
				   c.description as content_description,
				   c.type as content_type,
				   c.slug as content_slug
			FROM feed_items fi
			LEFT JOIN content c ON fi.content_id = c.id
			ORDER BY fi.priority DESC, fi.created_at DESC
		`)

		this.getActiveStatement = this.db.prepare(`
			SELECT fi.*,
				   c.title as content_title,
				   c.description as content_description,
				   c.type as content_type,
				   c.slug as content_slug
			FROM feed_items fi
			LEFT JOIN content c ON fi.content_id = c.id
			WHERE fi.is_active = 1
				AND (fi.start_date IS NULL OR fi.start_date <= CURRENT_TIMESTAMP)
				AND (fi.end_date IS NULL OR fi.end_date > CURRENT_TIMESTAMP)
				AND (fi.content_id IS NULL OR c.status = 'published')
			ORDER BY fi.priority DESC, fi.created_at DESC
		`)

		this.toggleStatusStatement = this.db.prepare(`
			UPDATE feed_items
			SET is_active = NOT is_active
			WHERE id = $id
			RETURNING *
		`)
	}

	createFeedItem(data: {
		content_id?: string | null
		item_type: 'cta' | 'ad' | 'featured'
		title?: string | null
		description?: string | null
		button_text?: string | null
		button_href?: string | null
		position_type?: 'fixed' | 'random'
		position_fixed?: number | null
		position_range_min?: number | null
		position_range_max?: number | null
		start_date?: string | null
		end_date?: string | null
		is_active?: boolean
		priority?: number
		created_by?: string | null
	}): FeedItem | null {
		try {
			const result = this.createStatement.get({
				content_id: data.content_id || null,
				item_type: data.item_type,
				title: data.title || null,
				description: data.description || null,
				button_text: data.button_text || null,
				button_href: data.button_href || null,
				position_type: data.position_type || 'random',
				position_fixed: data.position_fixed ?? null,
				position_range_min: data.position_range_min ?? 3,
				position_range_max: data.position_range_max ?? 7,
				start_date: data.start_date || null,
				end_date: data.end_date || null,
				is_active: data.is_active !== false ? 1 : 0,
				priority: data.priority || 0,
				created_by: data.created_by || null
			})
			return result as FeedItem
		} catch (error) {
			console.error('Error creating feed item:', error)
			return null
		}
	}

	updateFeedItem(
		id: string,
		data: {
			content_id?: string | null
			item_type?: 'cta' | 'ad' | 'featured'
			title?: string | null
			description?: string | null
			button_text?: string | null
			button_href?: string | null
			position_type?: 'fixed' | 'random'
			position_fixed?: number | null
			position_range_min?: number | null
			position_range_max?: number | null
			start_date?: string | null
			end_date?: string | null
			is_active?: boolean
			priority?: number
		}
	): FeedItem | null {
		try {
			const existing = this.getFeedItemById(id)
			if (!existing) return null

			const result = this.updateStatement.get({
				id,
				content_id: data.content_id !== undefined ? data.content_id : existing.content_id,
				item_type: data.item_type ?? existing.item_type,
				title: data.title !== undefined ? data.title : existing.title,
				description: data.description !== undefined ? data.description : existing.description,
				button_text: data.button_text !== undefined ? data.button_text : existing.button_text,
				button_href: data.button_href !== undefined ? data.button_href : existing.button_href,
				position_type: data.position_type ?? existing.position_type,
				position_fixed: data.position_fixed !== undefined ? data.position_fixed : existing.position_fixed,
				position_range_min: data.position_range_min !== undefined ? data.position_range_min : existing.position_range_min,
				position_range_max: data.position_range_max !== undefined ? data.position_range_max : existing.position_range_max,
				start_date: data.start_date !== undefined ? data.start_date : existing.start_date,
				end_date: data.end_date !== undefined ? data.end_date : existing.end_date,
				is_active: data.is_active !== undefined ? (data.is_active ? 1 : 0) : existing.is_active,
				priority: data.priority ?? existing.priority
			})
			return result as FeedItem
		} catch (error) {
			console.error('Error updating feed item:', error)
			return null
		}
	}

	deleteFeedItem(id: string): boolean {
		try {
			const result = this.deleteStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting feed item:', error)
			return false
		}
	}

	getFeedItemById(id: string): FeedItemWithContent | null {
		try {
			return this.getByIdStatement.get({ id }) as FeedItemWithContent | null
		} catch (error) {
			console.error('Error getting feed item by id:', error)
			return null
		}
	}

	getAllFeedItems(): FeedItemWithContent[] {
		try {
			return this.getAllStatement.all() as FeedItemWithContent[]
		} catch (error) {
			console.error('Error getting all feed items:', error)
			return []
		}
	}

	getActiveFeedItems(): FeedItemWithContent[] {
		try {
			return this.getActiveStatement.all() as FeedItemWithContent[]
		} catch (error) {
			console.error('Error getting active feed items:', error)
			return []
		}
	}

	toggleFeedItemStatus(id: string): FeedItem | null {
		try {
			return this.toggleStatusStatement.get({ id }) as FeedItem | null
		} catch (error) {
			console.error('Error toggling feed item status:', error)
			return null
		}
	}
}
