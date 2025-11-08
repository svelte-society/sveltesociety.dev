/**
 * OG Image Layout for Recipe content
 * Shows: Type badge, title, description
 */

import type { SatoriNode, RecipeContentData } from '../types'
import {
	createStandardLayout,
	createTypeBadge,
	createBrandingFooter,
	createTitle,
	createDescription
} from '../utils'

export function createRecipeLayout(content: RecipeContentData): SatoriNode {
	return createStandardLayout([
		createTypeBadge('Recipe'),
		createTitle(content.title),
		createDescription(content.description),
		createBrandingFooter()
	])
}
