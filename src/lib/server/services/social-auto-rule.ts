import type { Database } from 'better-sqlite3'
import type {
	SocialAutoRule,
	SocialAutoRuleRaw,
	SocialPlatform,
	CreateSocialAutoRuleData,
	UpdateSocialAutoRuleData,
	CreateSocialPostData
} from '$lib/types/social'

// Re-export types for consumers
export type { SocialAutoRule, CreateSocialAutoRuleData, UpdateSocialAutoRuleData }

export type TriggerType = 'content_published' | 'sponsor_activated' | 'job_published'

export interface TriggerContext {
	trigger_type: TriggerType
	// For content triggers
	content_id?: string
	content_type?: string
	content_title?: string
	content_description?: string
	content_slug?: string
	content_tags?: string[]
	content_author?: string
	// For sponsor triggers
	sponsor_id?: string
	sponsor_name?: string
	sponsor_tagline?: string
	sponsor_url?: string
	// For job triggers
	job_id?: string
	job_title?: string
	job_company?: string
	job_location?: string
	// Common
	link_url?: string
	triggered_by_user_id: string
}

export interface RuleExecutionResult {
	rule: SocialAutoRule
	post_created: boolean
	post_id?: string
	error?: string
}

export class SocialAutoRuleService {
	private db: Database

	private createStatement: ReturnType<Database['prepare']>
	private getByIdStatement: ReturnType<Database['prepare']>
	private updateStatement: ReturnType<Database['prepare']>
	private deleteStatement: ReturnType<Database['prepare']>
	private listAllStatement: ReturnType<Database['prepare']>
	private listActiveStatement: ReturnType<Database['prepare']>
	private countStatement: ReturnType<Database['prepare']>
	private toggleActiveStatement: ReturnType<Database['prepare']>

	constructor(db: Database) {
		this.db = db

		this.createStatement = this.db.prepare(`
			INSERT INTO social_auto_rules (
				name, description, is_active,
				trigger_type, content_type_filter, tag_filter,
				platforms, template_id, use_ai_generation,
				delay_minutes, add_to_queue, create_as_draft
			)
			VALUES (
				$name, $description, $is_active,
				$trigger_type, $content_type_filter, $tag_filter,
				$platforms, $template_id, $use_ai_generation,
				$delay_minutes, $add_to_queue, $create_as_draft
			)
			RETURNING *
		`)

		this.getByIdStatement = this.db.prepare(`
			SELECT * FROM social_auto_rules WHERE id = $id
		`)

		this.updateStatement = this.db.prepare(`
			UPDATE social_auto_rules
			SET name = $name,
				description = $description,
				is_active = $is_active,
				content_type_filter = $content_type_filter,
				tag_filter = $tag_filter,
				platforms = $platforms,
				template_id = $template_id,
				use_ai_generation = $use_ai_generation,
				delay_minutes = $delay_minutes,
				add_to_queue = $add_to_queue,
				create_as_draft = $create_as_draft
			WHERE id = $id
			RETURNING *
		`)

		this.deleteStatement = this.db.prepare(`
			DELETE FROM social_auto_rules WHERE id = $id
		`)

		this.listAllStatement = this.db.prepare(`
			SELECT * FROM social_auto_rules
			ORDER BY trigger_type, name ASC
			LIMIT $limit OFFSET $offset
		`)

		this.listActiveStatement = this.db.prepare(`
			SELECT * FROM social_auto_rules
			WHERE is_active = 1
			ORDER BY trigger_type, name ASC
		`)

		this.countStatement = this.db.prepare(`
			SELECT COUNT(*) as count FROM social_auto_rules
		`)

		this.toggleActiveStatement = this.db.prepare(`
			UPDATE social_auto_rules
			SET is_active = $is_active
			WHERE id = $id
			RETURNING *
		`)
	}

	// ==========================================
	// Parsing Helpers
	// ==========================================

	private parseRaw(row: SocialAutoRuleRaw | null): SocialAutoRule | null {
		if (!row) return null

		return {
			id: row.id,
			name: row.name,
			description: row.description,
			is_active: row.is_active === 1,
			trigger_type: row.trigger_type as TriggerType,
			content_type_filter: row.content_type_filter,
			tag_filter: row.tag_filter ? JSON.parse(row.tag_filter) : [],
			platforms: JSON.parse(row.platforms) as SocialPlatform[],
			template_id: row.template_id,
			use_ai_generation: row.use_ai_generation === 1,
			delay_minutes: row.delay_minutes,
			add_to_queue: row.add_to_queue === 1,
			create_as_draft: row.create_as_draft === 1,
			created_at: row.created_at,
			updated_at: row.updated_at
		}
	}

	// ==========================================
	// CRUD Methods
	// ==========================================

	/**
	 * Create a new auto-posting rule
	 */
	create(data: CreateSocialAutoRuleData): SocialAutoRule | null {
		try {
			const result = this.createStatement.get({
				name: data.name,
				description: data.description ?? null,
				is_active: data.is_active !== false ? 1 : 0,
				trigger_type: data.trigger_type,
				content_type_filter: data.content_type_filter ?? null,
				tag_filter: data.tag_filter?.length ? JSON.stringify(data.tag_filter) : null,
				platforms: JSON.stringify(data.platforms),
				template_id: data.template_id ?? null,
				use_ai_generation: data.use_ai_generation ? 1 : 0,
				delay_minutes: data.delay_minutes ?? 0,
				add_to_queue: data.add_to_queue !== false ? 1 : 0,
				create_as_draft: data.create_as_draft !== false ? 1 : 0
			}) as SocialAutoRuleRaw | undefined

			return result ? this.parseRaw(result) : null
		} catch (error) {
			console.error('Error creating social auto rule:', error)
			return null
		}
	}

	/**
	 * Get a rule by ID
	 */
	getById(id: string): SocialAutoRule | null {
		try {
			const result = this.getByIdStatement.get({ id }) as SocialAutoRuleRaw | undefined
			return result ? this.parseRaw(result) : null
		} catch (error) {
			console.error('Error getting social auto rule by id:', error)
			return null
		}
	}

	/**
	 * Update a rule
	 */
	update(id: string, data: UpdateSocialAutoRuleData): SocialAutoRule | null {
		try {
			const existing = this.getById(id)
			if (!existing) return null

			const result = this.updateStatement.get({
				id,
				name: data.name ?? existing.name,
				description: data.description !== undefined ? data.description : existing.description,
				is_active:
					data.is_active !== undefined ? (data.is_active ? 1 : 0) : existing.is_active ? 1 : 0,
				content_type_filter:
					data.content_type_filter !== undefined
						? data.content_type_filter
						: existing.content_type_filter,
				tag_filter:
					data.tag_filter !== undefined
						? data.tag_filter.length
							? JSON.stringify(data.tag_filter)
							: null
						: existing.tag_filter.length
							? JSON.stringify(existing.tag_filter)
							: null,
				platforms: data.platforms
					? JSON.stringify(data.platforms)
					: JSON.stringify(existing.platforms),
				template_id: data.template_id !== undefined ? data.template_id : existing.template_id,
				use_ai_generation:
					data.use_ai_generation !== undefined
						? data.use_ai_generation
							? 1
							: 0
						: existing.use_ai_generation
							? 1
							: 0,
				delay_minutes: data.delay_minutes ?? existing.delay_minutes,
				add_to_queue:
					data.add_to_queue !== undefined
						? data.add_to_queue
							? 1
							: 0
						: existing.add_to_queue
							? 1
							: 0,
				create_as_draft:
					data.create_as_draft !== undefined
						? data.create_as_draft
							? 1
							: 0
						: existing.create_as_draft
							? 1
							: 0
			}) as SocialAutoRuleRaw | undefined

			return result ? this.parseRaw(result) : null
		} catch (error) {
			console.error('Error updating social auto rule:', error)
			return null
		}
	}

	/**
	 * Delete a rule
	 */
	delete(id: string): boolean {
		try {
			const result = this.deleteStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting social auto rule:', error)
			return false
		}
	}

	/**
	 * Toggle a rule's active status
	 */
	toggleActive(id: string, isActive: boolean): SocialAutoRule | null {
		try {
			const result = this.toggleActiveStatement.get({
				id,
				is_active: isActive ? 1 : 0
			}) as SocialAutoRuleRaw | undefined

			return result ? this.parseRaw(result) : null
		} catch (error) {
			console.error('Error toggling social auto rule:', error)
			return null
		}
	}

	/**
	 * List all rules
	 */
	list(filters: { limit?: number; offset?: number } = {}): {
		rules: SocialAutoRule[]
		total: number
	} {
		try {
			const limit = filters.limit ?? 50
			const offset = filters.offset ?? 0

			const rows = this.listAllStatement.all({ limit, offset }) as SocialAutoRuleRaw[]
			const countResult = this.countStatement.get() as { count: number }

			const rules = rows
				.map((row) => this.parseRaw(row))
				.filter((r): r is SocialAutoRule => r !== null)

			return { rules, total: countResult.count }
		} catch (error) {
			console.error('Error listing social auto rules:', error)
			return { rules: [], total: 0 }
		}
	}

	/**
	 * Get all active rules
	 */
	getActiveRules(): SocialAutoRule[] {
		try {
			const rows = this.listActiveStatement.all() as SocialAutoRuleRaw[]
			return rows.map((row) => this.parseRaw(row)).filter((r): r is SocialAutoRule => r !== null)
		} catch (error) {
			console.error('Error getting active social auto rules:', error)
			return []
		}
	}

	// ==========================================
	// Rule Matching
	// ==========================================

	/**
	 * Find rules that match a given trigger context
	 */
	findMatchingRules(context: TriggerContext): SocialAutoRule[] {
		const activeRules = this.getActiveRules()

		return activeRules.filter((rule) => {
			// Must match trigger type
			if (rule.trigger_type !== context.trigger_type) {
				return false
			}

			// Check content type filter (for content_published triggers)
			if (rule.content_type_filter && context.content_type) {
				if (rule.content_type_filter !== context.content_type) {
					return false
				}
			}

			// Check tag filter (all specified tags must be present)
			if (rule.tag_filter?.length && context.content_tags) {
				const hasAllTags = rule.tag_filter.every((tag) => context.content_tags?.includes(tag))
				if (!hasAllTags) {
					return false
				}
			}

			return true
		})
	}

	// ==========================================
	// Rule Execution
	// ==========================================

	/**
	 * Build post data from rule and context
	 */
	buildPostData(
		rule: SocialAutoRule,
		context: TriggerContext,
		templateService?: {
			getById: (
				id: string
			) => { twitter_template: string; bluesky_template: string; linkedin_template: string } | null
			getDefault: (
				contentType: string
			) => { twitter_template: string; bluesky_template: string; linkedin_template: string } | null
			processTemplate: (template: string, variables: Record<string, string | undefined>) => string
		}
	): CreateSocialPostData {
		// Determine post type and linked IDs
		let postType: 'content' | 'sponsor' | 'job' | 'custom' = 'custom'
		let contentId: string | null = null
		let sponsorId: string | null = null
		let jobId: string | null = null
		let title = 'Auto-generated post'

		switch (context.trigger_type) {
			case 'content_published':
				postType = 'content'
				contentId = context.content_id ?? null
				title = context.content_title ?? 'New content'
				break
			case 'sponsor_activated':
				postType = 'sponsor'
				sponsorId = context.sponsor_id ?? null
				title = `Sponsor: ${context.sponsor_name ?? 'New sponsor'}`
				break
			case 'job_published':
				postType = 'job'
				jobId = context.job_id ?? null
				title = context.job_title ?? 'New job'
				break
		}

		// Build template variables
		const variables: Record<string, string | undefined> = {
			title: context.content_title ?? context.job_title ?? context.sponsor_name,
			description: context.content_description ?? context.sponsor_tagline,
			url: context.link_url,
			author: context.content_author,
			tags:
				context.content_tags?.length && context.content_tags.length > 0
					? context.content_tags.map((t) => `#${t}`).join(' ')
					: undefined,
			company: context.job_company ?? context.sponsor_name,
			location: context.job_location,
			tagline: context.sponsor_tagline
		}

		// Get template text for each platform
		let twitterText = title
		let blueskyText = title
		let linkedinText = title

		if (templateService) {
			// Try to get specific template or default
			const template = rule.template_id
				? templateService.getById(rule.template_id)
				: templateService.getDefault(context.content_type ?? 'custom')

			if (template) {
				twitterText = templateService.processTemplate(template.twitter_template, variables)
				blueskyText = templateService.processTemplate(template.bluesky_template, variables)
				linkedinText = templateService.processTemplate(template.linkedin_template, variables)
			}
		}

		// Build platform data
		const platforms = rule.platforms.map((platform) => {
			let text = title
			switch (platform) {
				case 'twitter':
					text = twitterText
					break
				case 'bluesky':
					text = blueskyText
					break
				case 'linkedin':
					text = linkedinText
					break
			}
			return { platform, text }
		})

		return {
			title,
			post_type: postType,
			content_id: contentId,
			sponsor_id: sponsorId,
			job_id: jobId,
			link_url: context.link_url ?? null,
			utm_source: 'social',
			utm_medium: 'auto',
			utm_campaign: context.content_type ?? 'promotion',
			created_by: context.triggered_by_user_id,
			platforms
		}
	}
}
