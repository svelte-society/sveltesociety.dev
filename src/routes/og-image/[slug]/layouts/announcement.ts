/**
 * OG Image Layout for Announcement content
 * Shows: Type badge, title, description
 */

import type { SatoriNode, AnnouncementContentData } from '../types'
import {
	createStandardLayout,
	createTypeBadge,
	createBrandingFooter,
	createTitle,
	createDescription
} from '../utils'

export function createAnnouncementLayout(content: AnnouncementContentData): SatoriNode {
	return createStandardLayout([
		createTypeBadge('Announcement'),
		createTitle(content.title),
		createDescription(content.description),
		createBrandingFooter()
	])
}
