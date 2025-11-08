/**
 * OG Image Layout for Collection content
 * Shows: Type badge, title, description, preview cards of collection items (2-3 items)
 */

import type { SatoriNode, CollectionContentData } from '../types'
import { OG_IMAGE_COLORS } from '../constants'
import {
	createAccentBar,
	createTypeBadge,
	createBrandingFooter,
	createTitle
} from '../utils'
import { getTypeIcon } from '../icons'

export function createCollectionLayout(content: CollectionContentData): SatoriNode {
	const childItems = content.children || []
	const displayItems = childItems.slice(0, 2)
	const remainingCount = Math.max(0, childItems.length - 2)

	// Create item preview cards
	const itemCards: SatoriNode[] = displayItems.map((item) => {
		const typeIcon = getTypeIcon(item.type)

		return {
			type: 'div',
			props: {
				style: {
					display: 'flex',
					flexDirection: 'column',
					background: '#f8fafc',
					border: '2px solid #cbd5e1',
					borderRadius: '12px',
					padding: '16px',
					width: '280px',
					minHeight: '120px',
					justifyContent: 'space-between'
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								fontSize: '22px',
								fontWeight: '700',
								color: OG_IMAGE_COLORS.text,
								lineHeight: '1.3',
								wordBreak: 'break-word',
								flex: '1'
							},
							children: item.title
						}
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								marginTop: '8px'
							},
							children: [
								{
									type: 'img',
									props: {
										src: typeIcon,
										style: {
											width: '20px',
											height: '20px'
										}
									}
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: '16px',
											fontWeight: '600',
											color: OG_IMAGE_COLORS.secondary,
											textTransform: 'uppercase',
											letterSpacing: '0.5px'
										},
										children: item.type
									}
								}
							]
						}
					}
				]
			}
		}
	})

	// Add "more items" indicator if needed
	if (remainingCount > 0) {
		itemCards.push({
			type: 'div',
			props: {
				style: {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'rgba(248, 250, 252, 0.5)',
					border: '2px dashed #cbd5e1',
					borderRadius: '12px',
					width: '140px',
					height: '120px'
				},
				children: {
					type: 'div',
					props: {
						style: {
							fontSize: '48px',
							fontWeight: '700',
							color: OG_IMAGE_COLORS.secondary
						},
						children: `+${remainingCount}`
					}
				}
			}
		})
	}

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
						children: [
							createTypeBadge('Collection'),
							createTitle(content.title, 2),
							// Item preview section
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										gap: '20px',
										marginTop: '32px',
										marginBottom: 'auto',
										flexWrap: 'wrap'
									},
									children: itemCards
								}
							},
							createBrandingFooter()
						]
					}
				}
			]
		}
	}
}
