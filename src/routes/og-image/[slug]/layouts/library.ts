/**
 * OG Image Layout for Library content
 * Shows: Type badge, title, owner info with avatar, GitHub stats (stars, forks, issues)
 */

import type { SatoriNode, LibraryContentData } from '../types'
import { OG_IMAGE_COLORS } from '../constants'
import {
	createStandardLayout,
	createTypeBadge,
	createBrandingFooter,
	createTitle,
	formatCompactNumber,
	truncateText,
	imageUrlToBase64
} from '../utils'
import { STAR_ICON, FORK_ICON, BUG_ICON } from '../icons'

export async function createLibraryLayout(content: LibraryContentData): Promise<SatoriNode> {
	const hasStats =
		content.metadata &&
		(content.metadata.stars !== undefined ||
			content.metadata.forks !== undefined ||
			content.metadata.issues !== undefined)

	const hasOwner = content.metadata?.owner

	// Fetch owner avatar if available
	let ownerAvatarBase64: string | null = null
	if (hasOwner && content.metadata?.owner?.avatar) {
		ownerAvatarBase64 = await imageUrlToBase64(content.metadata.owner.avatar)
	}

	// Build stats section
	const statsNodes: SatoriNode[] = []

	if (hasStats && content.metadata) {
		if (content.metadata.stars !== undefined) {
			statsNodes.push({
				type: 'div',
				props: {
					style: {
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						fontSize: '28px',
						fontWeight: '600',
						color: OG_IMAGE_COLORS.text
					},
					children: [
						{
							type: 'img',
							props: {
								src: STAR_ICON,
								style: {
									width: '24px',
									height: '24px'
								}
							}
						},
						{
							type: 'div',
							props: {
								children: formatCompactNumber(content.metadata.stars)
							}
						}
					]
				}
			})
		}

		if (content.metadata.forks !== undefined) {
			statsNodes.push({
				type: 'div',
				props: {
					style: {
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						fontSize: '28px',
						fontWeight: '600',
						color: OG_IMAGE_COLORS.text
					},
					children: [
						{
							type: 'img',
							props: {
								src: FORK_ICON,
								style: {
									width: '24px',
									height: '24px'
								}
							}
						},
						{
							type: 'div',
							props: {
								children: formatCompactNumber(content.metadata.forks)
							}
						}
					]
				}
			})
		}

		if (content.metadata.issues !== undefined) {
			statsNodes.push({
				type: 'div',
				props: {
					style: {
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						fontSize: '28px',
						fontWeight: '600',
						color: OG_IMAGE_COLORS.text
					},
					children: [
						{
							type: 'img',
							props: {
								src: BUG_ICON,
								style: {
									width: '24px',
									height: '24px'
								}
							}
						},
						{
							type: 'div',
							props: {
								children: formatCompactNumber(content.metadata.issues)
							}
						}
					]
				}
			})
		}
	}

	// Build owner section
	const ownerNodes: SatoriNode[] = []

	if (hasOwner && content.metadata?.owner) {
		if (ownerAvatarBase64) {
			ownerNodes.push({
				type: 'img',
				props: {
					src: ownerAvatarBase64,
					style: {
						width: '48px',
						height: '48px',
						borderRadius: '50%',
						border: `3px solid ${OG_IMAGE_COLORS.accent}`
					}
				}
			})
		}

		ownerNodes.push({
			type: 'div',
			props: {
				style: {
					fontSize: '28px',
					fontWeight: '600',
					color: OG_IMAGE_COLORS.text
				},
				children: truncateText(content.metadata.owner.name, 30)
			}
		})
	}

	return createStandardLayout([
		createTypeBadge('Library'),
		createTitle(content.title, 2),
		// Owner and stats section
		{
			type: 'div',
			props: {
				style: {
					display: 'flex',
					flexDirection: 'column',
					gap: '20px',
					marginTop: '32px',
					marginBottom: 'auto'
				},
				children: [
					// Owner info
					...(ownerNodes.length > 0
						? [
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											gap: '16px'
										},
										children: ownerNodes
									}
								}
							]
						: []),
					// Stats
					...(statsNodes.length > 0
						? [
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											gap: '32px',
											flexWrap: 'wrap'
										},
										children: statsNodes
									}
								}
							]
						: [])
				]
			}
		},
		createBrandingFooter()
	])
}
