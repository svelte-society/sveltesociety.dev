import type { Database } from 'better-sqlite3'

export interface SidebarShortcut {
	id: string
	content_id: string
	label: string | null
	priority: number
	is_active: number
	created_at: string
	updated_at: string
	created_by: string | null
}

export interface SidebarShortcutWithContent extends SidebarShortcut {
	title: string
	type: string
	slug: string
	status: string
}

export class ShortcutService {
	private db: Database

	// Prepared statements
	private createShortcutStatement: any
	private updateShortcutStatement: any
	private deleteShortcutStatement: any
	private getShortcutByIdStatement: any
	private getShortcutByContentIdStatement: any
	private getAllShortcutsStatement: any
	private getActiveShortcutsStatement: any

	constructor(db: Database) {
		this.db = db

		this.createShortcutStatement = this.db.prepare(`
			INSERT INTO sidebar_shortcuts (content_id, label, priority, is_active, created_by)
			VALUES ($content_id, $label, $priority, $is_active, $created_by)
			RETURNING *
		`)

		this.updateShortcutStatement = this.db.prepare(`
			UPDATE sidebar_shortcuts
			SET content_id = $content_id,
				label = $label,
				priority = $priority,
				is_active = $is_active
			WHERE id = $id
			RETURNING *
		`)

		this.deleteShortcutStatement = this.db.prepare(`
			DELETE FROM sidebar_shortcuts WHERE id = $id
		`)

		this.getShortcutByIdStatement = this.db.prepare(`
			SELECT s.*, c.title, c.type, c.slug, c.status
			FROM sidebar_shortcuts s
			JOIN content c ON s.content_id = c.id
			WHERE s.id = $id
		`)

		this.getShortcutByContentIdStatement = this.db.prepare(`
			SELECT s.*, c.title, c.type, c.slug, c.status
			FROM sidebar_shortcuts s
			JOIN content c ON s.content_id = c.id
			WHERE s.content_id = $content_id
		`)

		this.getAllShortcutsStatement = this.db.prepare(`
			SELECT s.*, c.title, c.type, c.slug, c.status
			FROM sidebar_shortcuts s
			JOIN content c ON s.content_id = c.id
			ORDER BY s.priority DESC, s.created_at DESC
		`)

		this.getActiveShortcutsStatement = this.db.prepare(`
			SELECT s.*, c.title, c.type, c.slug, c.status
			FROM sidebar_shortcuts s
			JOIN content c ON s.content_id = c.id
			WHERE s.is_active = 1
				AND c.status = 'published'
			ORDER BY s.priority DESC, s.created_at DESC
		`)
	}

	createShortcut(data: {
		content_id: string
		label?: string | null
		priority?: number
		is_active?: boolean
		created_by?: string | null
	}): SidebarShortcut | null {
		try {
			const result = this.createShortcutStatement.get({
				content_id: data.content_id,
				label: data.label || null,
				priority: data.priority ?? 0,
				is_active: data.is_active !== false ? 1 : 0,
				created_by: data.created_by || null
			})
			return result as SidebarShortcut
		} catch (error) {
			console.error('Error creating sidebar shortcut:', error)
			return null
		}
	}

	updateShortcut(
		id: string,
		data: {
			content_id?: string
			label?: string | null
			priority?: number
			is_active?: boolean
		}
	): SidebarShortcut | null {
		try {
			const existing = this.getShortcutById(id)
			if (!existing) return null

			const result = this.updateShortcutStatement.get({
				id,
				content_id: data.content_id ?? existing.content_id,
				label: data.label !== undefined ? data.label : existing.label,
				priority: data.priority ?? existing.priority,
				is_active: data.is_active !== undefined ? (data.is_active ? 1 : 0) : existing.is_active
			})
			return result as SidebarShortcut
		} catch (error) {
			console.error('Error updating sidebar shortcut:', error)
			return null
		}
	}

	deleteShortcut(id: string): boolean {
		try {
			const result = this.deleteShortcutStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting sidebar shortcut:', error)
			return false
		}
	}

	getShortcutById(id: string): SidebarShortcutWithContent | null {
		try {
			return this.getShortcutByIdStatement.get({ id }) as SidebarShortcutWithContent | null
		} catch (error) {
			console.error('Error getting sidebar shortcut by id:', error)
			return null
		}
	}

	getShortcutByContentId(content_id: string): SidebarShortcutWithContent | null {
		try {
			return this.getShortcutByContentIdStatement.get({
				content_id
			}) as SidebarShortcutWithContent | null
		} catch (error) {
			console.error('Error getting sidebar shortcut by content id:', error)
			return null
		}
	}

	getAllShortcuts(): SidebarShortcutWithContent[] {
		try {
			return this.getAllShortcutsStatement.all() as SidebarShortcutWithContent[]
		} catch (error) {
			console.error('Error getting all sidebar shortcuts:', error)
			return []
		}
	}

	getActiveShortcuts(): SidebarShortcutWithContent[] {
		try {
			return this.getActiveShortcutsStatement.all() as SidebarShortcutWithContent[]
		} catch (error) {
			console.error('Error getting active sidebar shortcuts:', error)
			return []
		}
	}

	toggleShortcutStatus(id: string): SidebarShortcut | null {
		const shortcut = this.getShortcutById(id)
		if (!shortcut) return null

		return this.updateShortcut(id, { is_active: !shortcut.is_active })
	}
}
