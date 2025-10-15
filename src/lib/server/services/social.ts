import { Database } from 'bun:sqlite'
import type {
	SocialAccount,
	SocialPost,
	SocialPostWithContent,
	SocialTemplate,
	CreateSocialPostInput,
	UpdateSocialPostInput,
	CreateSocialAccountInput,
	Platform,
	PostStatus,
	ContentType
} from '$lib/schema/social'

export class SocialService {
	private getPostsStatement
	private getPostByIdStatement
	private getPostsByContentIdStatement
	private getPostsByStatusStatement
	private createPostStatement
	private updatePostStatement
	private deletePostStatement

	private getAccountsStatement
	private getAccountByIdStatement
	private getAccountsByPlatformStatement
	private getDefaultAccountStatement
	private createAccountStatement
	private updateAccountStatement
	private deleteAccountStatement

	private getTemplatesStatement
	private getTemplateByIdStatement
	private getDefaultTemplateStatement
	private createTemplateStatement
	private updateTemplateStatement
	private deleteTemplateStatement

	constructor(private db: Database) {
		// Post queries
		this.getPostsStatement = this.db.prepare(`
			SELECT
				sp.*,
				c.title as content_title,
				c.type as content_type,
				c.slug as content_slug
			FROM social_posts sp
			JOIN content c ON sp.content_id = c.id
			ORDER BY sp.created_at DESC
		`)

		this.getPostByIdStatement = this.db.prepare(`
			SELECT
				sp.*,
				c.title as content_title,
				c.type as content_type,
				c.slug as content_slug
			FROM social_posts sp
			JOIN content c ON sp.content_id = c.id
			WHERE sp.id = $id
		`)

		this.getPostsByContentIdStatement = this.db.prepare(`
			SELECT
				sp.*,
				c.title as content_title,
				c.type as content_type,
				c.slug as content_slug
			FROM social_posts sp
			JOIN content c ON sp.content_id = c.id
			WHERE sp.content_id = $contentId
			ORDER BY sp.created_at DESC
		`)

		this.getPostsByStatusStatement = this.db.prepare(`
			SELECT
				sp.*,
				c.title as content_title,
				c.type as content_type,
				c.slug as content_slug
			FROM social_posts sp
			JOIN content c ON sp.content_id = c.id
			WHERE sp.status = $status
			ORDER BY sp.created_at DESC
		`)

		this.createPostStatement = this.db.prepare(`
			INSERT INTO social_posts (
				content_id,
				account_id,
				platform,
				post_text,
				post_data,
				status,
				scheduled_at,
				created_by
			)
			VALUES (
				$content_id,
				$account_id,
				$platform,
				$post_text,
				$post_data,
				$status,
				$scheduled_at,
				$created_by
			)
			RETURNING *
		`)

		this.updatePostStatement = this.db.prepare(`
			UPDATE social_posts
			SET
				post_text = COALESCE($post_text, post_text),
				post_data = COALESCE($post_data, post_data),
				scheduled_at = COALESCE($scheduled_at, scheduled_at),
				status = COALESCE($status, status),
				external_post_id = COALESCE($external_post_id, external_post_id),
				external_url = COALESCE($external_url, external_url),
				posted_at = COALESCE($posted_at, posted_at),
				error_message = COALESCE($error_message, error_message),
				retry_count = COALESCE($retry_count, retry_count)
			WHERE id = $id
			RETURNING *
		`)

		this.deletePostStatement = this.db.prepare(`
			DELETE FROM social_posts WHERE id = $id
		`)

		// Account queries
		this.getAccountsStatement = this.db.prepare(`
			SELECT * FROM social_accounts
			ORDER BY platform, account_name
		`)

		this.getAccountByIdStatement = this.db.prepare(`
			SELECT * FROM social_accounts WHERE id = $id
		`)

		this.getAccountsByPlatformStatement = this.db.prepare(`
			SELECT * FROM social_accounts
			WHERE platform = $platform AND is_active = 1
			ORDER BY account_name
		`)

		this.getDefaultAccountStatement = this.db.prepare(`
			SELECT * FROM social_accounts
			WHERE platform = $platform AND is_default = 1 AND is_active = 1
			LIMIT 1
		`)

		this.createAccountStatement = this.db.prepare(`
			INSERT INTO social_accounts (
				platform,
				account_name,
				account_handle,
				credentials,
				relay_urls,
				is_active,
				is_default,
				created_by
			)
			VALUES (
				$platform,
				$account_name,
				$account_handle,
				$credentials,
				$relay_urls,
				$is_active,
				$is_default,
				$created_by
			)
			RETURNING *
		`)

		this.updateAccountStatement = this.db.prepare(`
			UPDATE social_accounts
			SET
				account_name = COALESCE($account_name, account_name),
				account_handle = COALESCE($account_handle, account_handle),
				credentials = COALESCE($credentials, credentials),
				relay_urls = COALESCE($relay_urls, relay_urls),
				is_active = COALESCE($is_active, is_active),
				is_default = COALESCE($is_default, is_default)
			WHERE id = $id
			RETURNING *
		`)

		this.deleteAccountStatement = this.db.prepare(`
			DELETE FROM social_accounts WHERE id = $id
		`)

		// Template queries
		this.getTemplatesStatement = this.db.prepare(`
			SELECT * FROM social_templates
			ORDER BY content_type, platform
		`)

		this.getTemplateByIdStatement = this.db.prepare(`
			SELECT * FROM social_templates WHERE id = $id
		`)

		this.getDefaultTemplateStatement = this.db.prepare(`
			SELECT * FROM social_templates
			WHERE content_type = $content_type AND platform = $platform AND is_default = 1
			LIMIT 1
		`)

		this.createTemplateStatement = this.db.prepare(`
			INSERT INTO social_templates (
				content_type,
				platform,
				template,
				is_default,
				created_by
			)
			VALUES (
				$content_type,
				$platform,
				$template,
				$is_default,
				$created_by
			)
			RETURNING *
		`)

		this.updateTemplateStatement = this.db.prepare(`
			UPDATE social_templates
			SET
				template = COALESCE($template, template),
				is_default = COALESCE($is_default, is_default)
			WHERE id = $id
			RETURNING *
		`)

		this.deleteTemplateStatement = this.db.prepare(`
			DELETE FROM social_templates WHERE id = $id
		`)
	}

	// Post methods
	getPosts(filters?: {
		status?: PostStatus
		platform?: Platform
		limit?: number
	}): SocialPostWithContent[] {
		try {
			let query = `
				SELECT
					sp.*,
					c.title as content_title,
					c.type as content_type,
					c.slug as content_slug
				FROM social_posts sp
				JOIN content c ON sp.content_id = c.id
			`
			const conditions: string[] = []
			const params: Record<string, any> = {}

			if (filters?.status) {
				conditions.push('sp.status = $status')
				params.status = filters.status
			}

			if (filters?.platform) {
				conditions.push('sp.platform = $platform')
				params.platform = filters.platform
			}

			if (conditions.length > 0) {
				query += ' WHERE ' + conditions.join(' AND ')
			}

			query += ' ORDER BY sp.created_at DESC'

			if (filters?.limit) {
				query += ' LIMIT $limit'
				params.limit = filters.limit
			}

			const stmt = this.db.prepare(query)
			return stmt.all(params) as SocialPostWithContent[]
		} catch (error) {
			console.error('Error getting posts:', error)
			return []
		}
	}

	getPostById(id: string): SocialPostWithContent | undefined {
		try {
			const result = this.getPostByIdStatement.get({ id })
			return result ? (result as SocialPostWithContent) : undefined
		} catch (error) {
			console.error('Error getting post by id:', error)
			return undefined
		}
	}

	getPostsByContentId(contentId: string): SocialPostWithContent[] {
		try {
			return this.getPostsByContentIdStatement.all({ contentId }) as SocialPostWithContent[]
		} catch (error) {
			console.error('Error getting posts by content id:', error)
			return []
		}
	}

	getScheduledPosts(): SocialPostWithContent[] {
		try {
			const stmt = this.db.prepare(`
				SELECT
					sp.*,
					c.title as content_title,
					c.type as content_type,
					c.slug as content_slug
				FROM social_posts sp
				JOIN content c ON sp.content_id = c.id
				WHERE sp.status = 'scheduled'
				AND sp.scheduled_at IS NOT NULL
				ORDER BY sp.scheduled_at ASC
			`)
			return stmt.all() as SocialPostWithContent[]
		} catch (error) {
			console.error('Error getting scheduled posts:', error)
			return []
		}
	}

	createPost(input: CreateSocialPostInput): SocialPost {
		try {
			const result = this.createPostStatement.get({
				content_id: input.content_id,
				account_id: input.account_id,
				platform: input.platform,
				post_text: input.post_text,
				post_data: input.post_data ? JSON.stringify(input.post_data) : null,
				status: input.scheduled_at ? 'scheduled' : 'draft',
				scheduled_at: input.scheduled_at || null,
				created_by: input.created_by || null
			})
			return result as SocialPost
		} catch (error) {
			console.error('Error creating post:', error)
			throw error
		}
	}

	updatePost(id: string, input: UpdateSocialPostInput): SocialPost | undefined {
		try {
			const result = this.updatePostStatement.get({
				id,
				post_text: input.post_text || null,
				post_data: input.post_data ? JSON.stringify(input.post_data) : null,
				scheduled_at: input.scheduled_at !== undefined ? input.scheduled_at : null,
				status: input.status || null,
				external_post_id: null,
				external_url: null,
				posted_at: null,
				error_message: null,
				retry_count: null
			})
			return result ? (result as SocialPost) : undefined
		} catch (error) {
			console.error('Error updating post:', error)
			return undefined
		}
	}

	deletePost(id: string): boolean {
		try {
			const result = this.deletePostStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting post:', error)
			return false
		}
	}

	// Account methods
	getAccounts(): SocialAccount[] {
		try {
			return this.getAccountsStatement.all() as SocialAccount[]
		} catch (error) {
			console.error('Error getting accounts:', error)
			return []
		}
	}

	getAccountById(id: string): SocialAccount | undefined {
		try {
			const result = this.getAccountByIdStatement.get({ id })
			return result ? (result as SocialAccount) : undefined
		} catch (error) {
			console.error('Error getting account by id:', error)
			return undefined
		}
	}

	getAccountsByPlatform(platform: Platform): SocialAccount[] {
		try {
			return this.getAccountsByPlatformStatement.all({ platform }) as SocialAccount[]
		} catch (error) {
			console.error('Error getting accounts by platform:', error)
			return []
		}
	}

	getDefaultAccount(platform: Platform): SocialAccount | undefined {
		try {
			const result = this.getDefaultAccountStatement.get({ platform })
			return result ? (result as SocialAccount) : undefined
		} catch (error) {
			console.error('Error getting default account:', error)
			return undefined
		}
	}

	createAccount(input: CreateSocialAccountInput): SocialAccount {
		try {
			const result = this.createAccountStatement.get({
				platform: input.platform,
				account_name: input.account_name,
				account_handle: input.account_handle,
				credentials: input.credentials,
				relay_urls: input.relay_urls || null,
				is_active: input.is_active !== undefined ? (input.is_active ? 1 : 0) : 1,
				is_default: input.is_default !== undefined ? (input.is_default ? 1 : 0) : 0,
				created_by: input.created_by || null
			})
			return result as SocialAccount
		} catch (error) {
			console.error('Error creating account:', error)
			throw error
		}
	}

	deleteAccount(id: string): boolean {
		try {
			const result = this.deleteAccountStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting account:', error)
			return false
		}
	}

	// Template methods
	getTemplates(): SocialTemplate[] {
		try {
			return this.getTemplatesStatement.all() as SocialTemplate[]
		} catch (error) {
			console.error('Error getting templates:', error)
			return []
		}
	}

	getTemplateById(id: string): SocialTemplate | undefined {
		try {
			const result = this.getTemplateByIdStatement.get({ id })
			return result ? (result as SocialTemplate) : undefined
		} catch (error) {
			console.error('Error getting template by id:', error)
			return undefined
		}
	}

	getDefaultTemplate(contentType: ContentType, platform: Platform): SocialTemplate | undefined {
		try {
			const result = this.getDefaultTemplateStatement.get({
				content_type: contentType,
				platform: platform
			})
			return result ? (result as SocialTemplate) : undefined
		} catch (error) {
			console.error('Error getting default template:', error)
			return undefined
		}
	}

	createTemplate(
		contentType: ContentType,
		platform: Platform,
		template: string,
		isDefault: boolean,
		createdBy?: string
	): SocialTemplate {
		try {
			const result = this.createTemplateStatement.get({
				content_type: contentType,
				platform: platform,
				template: template,
				is_default: isDefault ? 1 : 0,
				created_by: createdBy || null
			})
			return result as SocialTemplate
		} catch (error) {
			console.error('Error creating template:', error)
			throw error
		}
	}

	updateTemplate(
		id: string,
		update: { template?: string; is_default?: boolean }
	): SocialTemplate | undefined {
		try {
			// The trigger automatically handles unsetting other defaults
			const result = this.updateTemplateStatement.get({
				id,
				template: update.template || null,
				is_default: update.is_default !== undefined ? (update.is_default ? 1 : 0) : null
			})
			return result ? (result as SocialTemplate) : undefined
		} catch (error) {
			console.error('Error updating template:', error)
			return undefined
		}
	}

	deleteTemplate(id: string): boolean {
		try {
			const result = this.deleteTemplateStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting template:', error)
			return false
		}
	}
}
