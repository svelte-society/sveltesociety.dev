/**
 * OG Image Layout for Recipe content
 * Shows: Type badge, title, description
 */

import type { SatoriNode, RecipeContentData } from '../types'
import { OG_IMAGE_COLORS } from '../constants'
import {
	createAccentBar,
	createTypeBadge,
	createBrandingFooter,
	createTitle,
	createDescription
} from '../utils'

export function createRecipeLayout(content: RecipeContentData): SatoriNode {
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
							createTypeBadge('Recipe'),
							createTitle(content.title),
							createDescription(content.description),
							createBrandingFooter()
						]
					}
				}
			]
		}
	}
}
