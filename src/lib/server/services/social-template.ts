import type { Database } from 'better-sqlite3'
import type {
	SocialTemplate,
	SocialTemplateRaw,
	SocialPlatform,
	CreateSocialTemplateData,
	UpdateSocialTemplateData,
	ListSocialTemplatesFilters
} from '$lib/types/social'

// Re-export types for consumers
export type { SocialTemplate, CreateSocialTemplateData, UpdateSocialTemplateData }

export class SocialTemplateService {
	private db: Database

	private createStatement: ReturnType<Database['prepare']>
	private getByIdStatement: ReturnType<Database['prepare']>
	private getByNameStatement: ReturnType<Database['prepare']>
	private getDefaultStatement: ReturnType<Database['prepare']>
	private updateStatement: ReturnType<Database['prepare']>
	private deleteStatement: ReturnType<Database['prepare']>
	private listStatement: ReturnType<Database['prepare']>
	private countStatement: ReturnType<Database['prepare']>
	private clearDefaultStatement: ReturnType<Database['prepare']>

	constructor(db: Database) {
		this.db = db

		this.createStatement = this.db.prepare(`
			INSERT INTO social_templates (
				name, description, content_type,
				twitter_template, bluesky_template, linkedin_template,
				is_default
			)
			VALUES (
				$name, $description, $content_type,
				$twitter_template, $bluesky_template, $linkedin_template,
				$is_default
			)
			RETURNING *
		`)

		this.getByIdStatement = this.db.prepare(`
			SELECT * FROM social_templates WHERE id = $id
		`)

		this.getByNameStatement = this.db.prepare(`
			SELECT * FROM social_templates WHERE name = $name
		`)

		this.getDefaultStatement = this.db.prepare(`
			SELECT * FROM social_templates
			WHERE content_type = $content_type AND is_default = 1
			LIMIT 1
		`)

		this.updateStatement = this.db.prepare(`
			UPDATE social_templates
			SET name = $name,
				description = $description,
				twitter_template = $twitter_template,
				bluesky_template = $bluesky_template,
				linkedin_template = $linkedin_template,
				is_default = $is_default
			WHERE id = $id
			RETURNING *
		`)

		this.deleteStatement = this.db.prepare(`
			DELETE FROM social_templates WHERE id = $id
		`)

		this.listStatement = this.db.prepare(`
			SELECT * FROM social_templates
			ORDER BY content_type, is_default DESC, name ASC
			LIMIT $limit OFFSET $offset
		`)

		this.countStatement = this.db.prepare(`
			SELECT COUNT(*) as count FROM social_templates
		`)

		this.clearDefaultStatement = this.db.prepare(`
			UPDATE social_templates
			SET is_default = 0
			WHERE content_type = $content_type AND id != $id
		`)
	}

	// ==========================================
	// Parsing Helpers
	// ==========================================

	private parseRaw(row: SocialTemplateRaw | null): SocialTemplate | null {
		if (!row) return null

		return {
			id: row.id,
			name: row.name,
			description: row.description,
			content_type: row.content_type,
			twitter_template: row.twitter_template,
			bluesky_template: row.bluesky_template,
			linkedin_template: row.linkedin_template,
			is_default: row.is_default === 1,
			created_at: row.created_at,
			updated_at: row.updated_at
		}
	}

	// ==========================================
	// CRUD Methods
	// ==========================================

	/**
	 * Create a new template
	 */
	create(data: CreateSocialTemplateData): SocialTemplate | null {
		try {
			const result = this.createStatement.get({
				name: data.name,
				description: data.description ?? null,
				content_type: data.content_type,
				twitter_template: data.twitter_template,
				bluesky_template: data.bluesky_template,
				linkedin_template: data.linkedin_template,
				is_default: data.is_default ? 1 : 0
			}) as SocialTemplateRaw | undefined

			const template = result ? this.parseRaw(result) : null

			// If this is marked as default, clear other defaults for this content type
			if (template && template.is_default) {
				this.clearDefaultStatement.run({
					content_type: template.content_type,
					id: template.id
				})
			}

			return template
		} catch (error) {
			console.error('Error creating social template:', error)
			return null
		}
	}

	/**
	 * Get a template by ID
	 */
	getById(id: string): SocialTemplate | null {
		try {
			const result = this.getByIdStatement.get({ id }) as SocialTemplateRaw | undefined
			return result ? this.parseRaw(result) : null
		} catch (error) {
			console.error('Error getting social template by id:', error)
			return null
		}
	}

	/**
	 * Get a template by name
	 */
	getByName(name: string): SocialTemplate | null {
		try {
			const result = this.getByNameStatement.get({ name }) as SocialTemplateRaw | undefined
			return result ? this.parseRaw(result) : null
		} catch (error) {
			console.error('Error getting social template by name:', error)
			return null
		}
	}

	/**
	 * Get the default template for a content type
	 */
	getDefault(contentType: string): SocialTemplate | null {
		try {
			const result = this.getDefaultStatement.get({
				content_type: contentType
			}) as SocialTemplateRaw | undefined
			return result ? this.parseRaw(result) : null
		} catch (error) {
			console.error('Error getting default social template:', error)
			return null
		}
	}

	/**
	 * Update a template
	 */
	update(id: string, data: UpdateSocialTemplateData): SocialTemplate | null {
		try {
			const existing = this.getById(id)
			if (!existing) return null

			const result = this.updateStatement.get({
				id,
				name: data.name ?? existing.name,
				description: data.description !== undefined ? data.description : existing.description,
				twitter_template: data.twitter_template ?? existing.twitter_template,
				bluesky_template: data.bluesky_template ?? existing.bluesky_template,
				linkedin_template: data.linkedin_template ?? existing.linkedin_template,
				is_default:
					data.is_default !== undefined ? (data.is_default ? 1 : 0) : existing.is_default ? 1 : 0
			}) as SocialTemplateRaw | undefined

			const template = result ? this.parseRaw(result) : null

			// If this is marked as default, clear other defaults for this content type
			if (template && template.is_default) {
				this.clearDefaultStatement.run({
					content_type: template.content_type,
					id: template.id
				})
			}

			return template
		} catch (error) {
			console.error('Error updating social template:', error)
			return null
		}
	}

	/**
	 * Delete a template
	 */
	delete(id: string): boolean {
		try {
			const result = this.deleteStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting social template:', error)
			return false
		}
	}

	/**
	 * List templates with filters
	 */
	list(filters: ListSocialTemplatesFilters = {}): {
		templates: SocialTemplate[]
		total: number
	} {
		try {
			const limit = filters.limit ?? 50
			const offset = filters.offset ?? 0

			// Build dynamic query if content_type filter is provided
			if (filters.content_type && filters.content_type !== 'all') {
				const listStatement = this.db.prepare(`
					SELECT * FROM social_templates
					WHERE content_type = $content_type
					ORDER BY is_default DESC, name ASC
					LIMIT $limit OFFSET $offset
				`)

				const countStatement = this.db.prepare(`
					SELECT COUNT(*) as count FROM social_templates
					WHERE content_type = $content_type
				`)

				const rows = listStatement.all({
					content_type: filters.content_type,
					limit,
					offset
				}) as SocialTemplateRaw[]
				const countResult = countStatement.get({
					content_type: filters.content_type
				}) as { count: number }

				const templates = rows
					.map((row) => this.parseRaw(row))
					.filter((t): t is SocialTemplate => t !== null)

				return { templates, total: countResult.count }
			}

			// Default list (no content_type filter)
			const rows = this.listStatement.all({ limit, offset }) as SocialTemplateRaw[]
			const countResult = this.countStatement.get() as { count: number }

			const templates = rows
				.map((row) => this.parseRaw(row))
				.filter((t): t is SocialTemplate => t !== null)

			return { templates, total: countResult.count }
		} catch (error) {
			console.error('Error listing social templates:', error)
			return { templates: [], total: 0 }
		}
	}

	/**
	 * Get all templates grouped by content type
	 */
	getGroupedByContentType(): Map<string, SocialTemplate[]> {
		try {
			const statement = this.db.prepare(`
				SELECT * FROM social_templates
				ORDER BY content_type, is_default DESC, name ASC
			`)

			const rows = statement.all() as SocialTemplateRaw[]
			const grouped = new Map<string, SocialTemplate[]>()

			for (const row of rows) {
				const template = this.parseRaw(row)
				if (template) {
					const existing = grouped.get(template.content_type) ?? []
					existing.push(template)
					grouped.set(template.content_type, existing)
				}
			}

			return grouped
		} catch (error) {
			console.error('Error getting templates grouped by content type:', error)
			return new Map()
		}
	}

	// ==========================================
	// Template Variable Processing
	// ==========================================

	/**
	 * Process template variables and return final text
	 */
	processTemplate(template: string, variables: Record<string, string | undefined>): string {
		let result = template

		for (const [key, value] of Object.entries(variables)) {
			const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
			result = result.replace(regex, value ?? '')
		}

		// Clean up any remaining unmatched variables
		result = result.replace(/\{\{[^}]+\}\}/g, '')

		// Clean up multiple consecutive newlines
		result = result.replace(/\n{3,}/g, '\n\n')

		return result.trim()
	}

	/**
	 * Get the template text for a specific platform
	 */
	getTemplateForPlatform(template: SocialTemplate, platform: SocialPlatform): string {
		switch (platform) {
			case 'twitter':
				return template.twitter_template
			case 'bluesky':
				return template.bluesky_template
			case 'linkedin':
				return template.linkedin_template
		}
	}

	/**
	 * Process a template for all platforms
	 */
	processTemplateForAllPlatforms(
		template: SocialTemplate,
		variables: Record<string, string | undefined>
	): Record<SocialPlatform, string> {
		return {
			twitter: this.processTemplate(template.twitter_template, variables),
			bluesky: this.processTemplate(template.bluesky_template, variables),
			linkedin: this.processTemplate(template.linkedin_template, variables)
		}
	}
}
