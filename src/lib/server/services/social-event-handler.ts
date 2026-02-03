import type { Database } from 'bun:sqlite'
import type { SocialAutoRuleService, TriggerContext, RuleExecutionResult } from './social-auto-rule'
import type { SocialPostService, SocialPostWithPlatforms } from './social-post'
import type { SocialTemplateService } from './social-template'
import type { Content } from '$lib/types/content'
import type { Sponsor } from './sponsors/sponsor'

export interface ContentPublishedContext {
	content_id: string
	content_type: string
	content_title: string
	content_description?: string
	content_slug: string
	content_tags?: string[]
	content_author?: string
	link_url: string
	triggered_by_user_id: string
}

export interface SponsorActivatedContext {
	sponsor_id: string
	sponsor_name: string
	sponsor_tagline?: string
	sponsor_url?: string
	link_url: string
	triggered_by_user_id: string
}

export interface JobPublishedContext {
	job_id: string
	job_title: string
	job_company?: string
	job_location?: string
	link_url: string
	triggered_by_user_id: string
}

export interface EventHandlerResult {
	rules_matched: number
	posts_created: number
	results: RuleExecutionResult[]
}

export class SocialEventHandler {
	private db: Database
	private autoRuleService: SocialAutoRuleService
	private postService: SocialPostService
	private templateService: SocialTemplateService

	private logExecutionStatement: ReturnType<Database['prepare']>

	constructor(
		db: Database,
		autoRuleService: SocialAutoRuleService,
		postService: SocialPostService,
		templateService: SocialTemplateService
	) {
		this.db = db
		this.autoRuleService = autoRuleService
		this.postService = postService
		this.templateService = templateService

		// Prepare log statement for audit trail
		this.logExecutionStatement = this.db.prepare(`
			INSERT INTO social_post_log (post_id, platform, action, success, error_message, response_data)
			VALUES ($post_id, $platform, 'publish', $success, $error_message, $response_data)
		`)
	}

	/**
	 * Handle content published event
	 * Called synchronously when content status changes to 'published'
	 */
	handleContentPublished(context: ContentPublishedContext): EventHandlerResult {
		const triggerContext: TriggerContext = {
			trigger_type: 'content_published',
			content_id: context.content_id,
			content_type: context.content_type,
			content_title: context.content_title,
			content_description: context.content_description,
			content_slug: context.content_slug,
			content_tags: context.content_tags,
			content_author: context.content_author,
			link_url: context.link_url,
			triggered_by_user_id: context.triggered_by_user_id
		}

		return this.executeRules(triggerContext)
	}

	/**
	 * Handle sponsor activated event
	 * Called synchronously when sponsor is activated
	 */
	handleSponsorActivated(context: SponsorActivatedContext): EventHandlerResult {
		const triggerContext: TriggerContext = {
			trigger_type: 'sponsor_activated',
			sponsor_id: context.sponsor_id,
			sponsor_name: context.sponsor_name,
			sponsor_tagline: context.sponsor_tagline,
			sponsor_url: context.sponsor_url,
			link_url: context.link_url,
			triggered_by_user_id: context.triggered_by_user_id
		}

		return this.executeRules(triggerContext)
	}

	/**
	 * Handle job published event
	 * Called synchronously when job content status changes to 'published'
	 */
	handleJobPublished(context: JobPublishedContext): EventHandlerResult {
		const triggerContext: TriggerContext = {
			trigger_type: 'job_published',
			job_id: context.job_id,
			job_title: context.job_title,
			job_company: context.job_company,
			job_location: context.job_location,
			link_url: context.link_url,
			triggered_by_user_id: context.triggered_by_user_id
		}

		return this.executeRules(triggerContext)
	}

	/**
	 * Build context from Content object
	 */
	buildContentContext(content: Content, userId: string, baseUrl: string): ContentPublishedContext {
		// Parse tags from metadata if available
		let tags: string[] = []
		if (content.metadata) {
			try {
				const meta =
					typeof content.metadata === 'string' ? JSON.parse(content.metadata) : content.metadata
				tags = meta.tags || []
			} catch {
				// ignore parse errors
			}
		}

		return {
			content_id: content.id,
			content_type: content.type,
			content_title: content.title,
			content_description: content.description ?? undefined,
			content_slug: content.slug,
			content_tags: tags,
			link_url: `${baseUrl}/${content.type}/${content.slug}`,
			triggered_by_user_id: userId
		}
	}

	/**
	 * Build context from Sponsor object
	 */
	buildSponsorContext(sponsor: Sponsor, userId: string, baseUrl: string): SponsorActivatedContext {
		return {
			sponsor_id: sponsor.id,
			sponsor_name: sponsor.company_name,
			sponsor_tagline: sponsor.tagline ?? undefined,
			sponsor_url: sponsor.website_url ?? undefined,
			link_url: sponsor.website_url || `${baseUrl}/sponsors`,
			triggered_by_user_id: userId
		}
	}

	/**
	 * Execute matching rules for a trigger context
	 */
	private executeRules(context: TriggerContext): EventHandlerResult {
		// Find all active rules that match this trigger
		const matchingRules = this.autoRuleService.findMatchingRules(context)

		if (matchingRules.length === 0) {
			return {
				rules_matched: 0,
				posts_created: 0,
				results: []
			}
		}

		const results: RuleExecutionResult[] = []

		// Execute each matching rule
		for (const rule of matchingRules) {
			const result = this.executeRule(rule, context)
			results.push(result)
		}

		const postsCreated = results.filter((r) => r.post_created).length

		return {
			rules_matched: matchingRules.length,
			posts_created: postsCreated,
			results
		}
	}

	/**
	 * Execute a single rule and create a post
	 */
	private executeRule(
		rule: import('./social-auto-rule').SocialAutoRule,
		context: TriggerContext
	): RuleExecutionResult {
		try {
			// Build post data from rule and context
			const postData = this.autoRuleService.buildPostData(rule, context, {
				getById: (id: string) => this.templateService.getById(id),
				getDefault: (contentType: string) => this.templateService.getDefault(contentType),
				processTemplate: (template: string, variables: Record<string, string | undefined>) =>
					this.templateService.processTemplate(template, variables)
			})

			// Create the post
			const post = this.postService.createPost(postData)

			if (!post) {
				this.logRuleExecution(rule, null, false, 'Failed to create post')
				return {
					rule,
					post_created: false,
					error: 'Failed to create post'
				}
			}

			// Log successful creation
			this.logRuleExecution(rule, post, true, null)

			return {
				rule,
				post_created: true,
				post_id: post.id
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error'
			this.logRuleExecution(rule, null, false, errorMessage)

			return {
				rule,
				post_created: false,
				error: errorMessage
			}
		}
	}

	/**
	 * Log rule execution for audit trail
	 */
	private logRuleExecution(
		rule: import('./social-auto-rule').SocialAutoRule,
		post: SocialPostWithPlatforms | null,
		success: boolean,
		errorMessage: string | null
	): void {
		try {
			// Log for each platform in the rule
			for (const platform of rule.platforms) {
				this.logExecutionStatement.run({
					post_id: post?.id ?? 'auto_rule_failed',
					platform: platform,
					success: success ? 1 : 0,
					error_message: errorMessage,
					response_data: JSON.stringify({
						rule_id: rule.id,
						rule_name: rule.name,
						trigger_type: rule.trigger_type,
						auto_created: true
					})
				})
			}
		} catch (error) {
			// Don't let logging failures break the main flow
			console.error('Failed to log rule execution:', error)
		}
	}
}
