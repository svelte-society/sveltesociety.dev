import type { Component } from 'svelte'
import type { ContentWithAuthor } from '$lib/types/content'

/**
 * Feed item types for the unified content feed
 */
export type FeedItem =
	| { type: 'content'; data: ContentWithAuthor }
	| { type: 'cta'; id: string; component: Component; props: Record<string, unknown> }
	| { type: 'ad'; id: string; component: Component; props: Record<string, unknown> }
	| { type: 'featured'; id: string; data: ContentWithAuthor }

/**
 * Configuration for interstitial items (CTAs, ads, etc.)
 */
export type InterstitialConfig = {
	id: string
	type: 'cta' | 'ad'
	position: number | 'random'
	positionRange?: [number, number] // For random positioning, e.g., [3, 8]
	component: Component
	props?: Record<string, unknown>
	show?: boolean // Whether to display this interstitial
}

/**
 * Get a key for a feed item (for Svelte's each block keying)
 */
export function getFeedItemKey(item: FeedItem): string {
	if (item.type === 'content' || item.type === 'featured') {
		return item.data.id
	}
	return `${item.type}-${item.id}`
}

/**
 * Simple seeded random number generator for SSR consistency
 * Uses a basic linear congruential generator
 */
function seededRandom(seed: number): () => number {
	let state = seed
	return () => {
		state = (state * 1103515245 + 12345) & 0x7fffffff
		return state / 0x7fffffff
	}
}

/**
 * Build a unified feed array from content and interstitials
 *
 * @param content - Array of content items
 * @param interstitials - Configuration for CTAs, ads, etc.
 * @param seed - Seed for random positioning (use page number for SSR consistency)
 * @returns Unified feed array with content and interstitials
 */
export function buildFeed(
	content: ContentWithAuthor[],
	interstitials: InterstitialConfig[],
	seed: number = 1
): FeedItem[] {
	// Start with content items
	const feed: FeedItem[] = content.map((data) => ({ type: 'content' as const, data }))

	// Filter to only visible interstitials
	const visibleInterstitials = interstitials.filter((i) => i.show !== false)

	if (visibleInterstitials.length === 0) {
		return feed
	}

	// Create seeded random for consistent SSR/hydration
	const random = seededRandom(seed)

	// Calculate positions for each interstitial
	const insertions: { position: number; item: FeedItem }[] = []

	for (const config of visibleInterstitials) {
		let position: number

		if (config.position === 'random' && config.positionRange) {
			const [min, max] = config.positionRange
			position = min + Math.floor(random() * (max - min + 1))
		} else if (typeof config.position === 'number') {
			position = config.position
		} else {
			// Default to position 5 if no valid position specified
			position = 5
		}

		// Only insert if we have enough content
		if (position <= feed.length) {
			insertions.push({
				position,
				item: {
					type: config.type,
					id: config.id,
					component: config.component,
					props: config.props || {}
				}
			})
		}
	}

	// Sort insertions by position (descending) so we can insert from end to start
	// This prevents position shifts from affecting earlier insertions
	insertions.sort((a, b) => b.position - a.position)

	// Insert interstitials into the feed
	for (const { position, item } of insertions) {
		feed.splice(position, 0, item)
	}

	return feed
}
