/**
 * Utility functions for OG image generation
 */

import type { SatoriNode } from './types'
import { OG_IMAGE_COLORS, SVELTE_SOCIETY_LOGO_BASE64 } from './constants'

/**
 * Creates the orange accent bar at the top of the image
 */
function createAccentBar(): SatoriNode {
	return {
		type: 'div',
		props: {
			style: {
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: '8px',
				background: OG_IMAGE_COLORS.accentGradient
			}
		}
	}
}

/**
 * Creates a content type badge
 */
export function createTypeBadge(typeLabel: string): SatoriNode {
	return {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				alignItems: 'center',
				marginBottom: '40px'
			},
			children: {
				type: 'div',
				props: {
					style: {
						background: OG_IMAGE_COLORS.badge,
						padding: '10px 20px',
						borderRadius: '6px',
						fontSize: '20px',
						fontWeight: '700',
						letterSpacing: '0.5px',
						textTransform: 'uppercase',
						color: 'white'
					},
					children: typeLabel
				}
			}
		}
	}
}

/**
 * Creates the footer branding section
 */
export function createBrandingFooter(): SatoriNode {
	return {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				marginTop: '40px'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							fontSize: '32px',
							fontWeight: '700',
							display: 'flex',
							alignItems: 'center',
							gap: '16px',
							color: OG_IMAGE_COLORS.text
						},
						children: [
							{
								type: 'img',
								props: {
									src: SVELTE_SOCIETY_LOGO_BASE64,
									style: {
										width: '56px',
										height: '56px'
									}
								}
							},
							{
								type: 'div',
								props: {
									children: 'Svelte Society'
								}
							}
						]
					}
				},
				{
					type: 'div',
					props: {
						style: {
							fontSize: '24px',
							color: OG_IMAGE_COLORS.secondary,
							fontWeight: '500'
						},
						children: 'sveltesociety.dev'
					}
				}
			]
		}
	}
}

/**
 * Creates a title element with proper truncation
 */
export function createTitle(title: string, maxLines = 3): SatoriNode {
	return {
		type: 'div',
		props: {
			style: {
				fontSize: '72px',
				fontWeight: '800',
				lineHeight: '1.1',
				marginBottom: 'auto',
				maxWidth: '100%',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				display: '-webkit-box',
				WebkitLineClamp: String(maxLines),
				WebkitBoxOrient: 'vertical',
				color: OG_IMAGE_COLORS.text
			},
			children: title
		}
	}
}

/**
 * Creates a description element
 */
export function createDescription(description: string, fontSize = 32): SatoriNode {
	return {
		type: 'div',
		props: {
			style: {
				fontSize: `${fontSize}px`,
				fontWeight: '400',
				lineHeight: '1.4',
				color: OG_IMAGE_COLORS.secondary,
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				display: '-webkit-box',
				WebkitLineClamp: '3',
				WebkitBoxOrient: 'vertical',
				marginTop: '24px'
			},
			children: description
		}
	}
}

/**
 * Formats a number with K/M suffix for compact display
 */
export function formatCompactNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M'
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'K'
	}
	return String(num)
}

/**
 * Truncates text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text
	return text.slice(0, maxLength - 3) + '...'
}

/**
 * Fetches an image URL and converts it to a base64 data URI for Satori
 */
export async function imageUrlToBase64(url: string): Promise<string | null> {
	try {
		const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
		if (!response.ok) return null

		const arrayBuffer = await response.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		const contentType = response.headers.get('content-type') || 'image/jpeg'
		const base64 = buffer.toString('base64')

		return `data:${contentType};base64,${base64}`
	} catch (error) {
		console.error(`Failed to fetch image ${url}:`, error)
		return null
	}
}

/**
 * Creates a standard OG image layout with accent bar and content container
 * This centralizes the common structure shared across all content types
 */
export function createStandardLayout(children: SatoriNode[]): SatoriNode {
	return {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				background: OG_IMAGE_COLORS.background,
				color: OG_IMAGE_COLORS.text,
				position: 'relative',
				fontFamily: 'Inter'
			},
			children: [
				createAccentBar(),
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							height: '100%',
							padding: '40px'
						},
						children
					}
				}
			]
		}
	}
}
