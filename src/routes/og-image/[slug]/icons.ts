/**
 * SVG icons as base64 data URIs for use in Satori
 * Emoji don't render reliably in Satori, so we use SVG icons instead
 */

/**
 * Star icon (for GitHub stars)
 */
export const STAR_ICON = `data:image/svg+xml;base64,${Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFB800">
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
	</svg>`
).toString('base64')}`

/**
 * Fork icon (for GitHub forks)
 */
export const FORK_ICON = `data:image/svg+xml;base64,${Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<circle cx="12" cy="18" r="3"></circle>
		<circle cx="6" cy="6" r="3"></circle>
		<circle cx="18" cy="6" r="3"></circle>
		<path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path>
		<path d="M12 12v3"></path>
	</svg>`
).toString('base64')}`

/**
 * Bug/Issue icon (for GitHub issues)
 */
export const BUG_ICON = `data:image/svg+xml;base64,${Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<path d="m8 2 1.88 1.88"></path>
		<path d="M14.12 3.88 16 2"></path>
		<path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path>
		<path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path>
		<path d="M12 20v-9"></path>
		<path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path>
		<path d="M6 13H2"></path>
		<path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path>
		<path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path>
		<path d="M22 13h-4"></path>
		<path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path>
	</svg>`
).toString('base64')}`

/**
 * Content type icons for collection cards
 */

// Video icon
const VIDEO_ICON = `data:image/svg+xml;base64,${Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<path d="m22 8-6 4 6 4V8Z"></path>
		<rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
	</svg>`
).toString('base64')}`

// Library/Package icon
const LIBRARY_ICON = `data:image/svg+xml;base64,${Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<path d="M16.5 9.4 7.55 4.24"></path>
		<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
		<polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
		<line x1="12" y1="22.08" x2="12" y2="12"></line>
	</svg>`
).toString('base64')}`

// Recipe/Document icon
const RECIPE_ICON = `data:image/svg+xml;base64,${Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
		<polyline points="14 2 14 8 20 8"></polyline>
		<line x1="16" y1="13" x2="8" y2="13"></line>
		<line x1="16" y1="17" x2="8" y2="17"></line>
		<line x1="10" y1="9" x2="8" y2="9"></line>
	</svg>`
).toString('base64')}`

// Announcement/Megaphone icon
const ANNOUNCEMENT_ICON = `data:image/svg+xml;base64,${Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<path d="m3 11 18-5v12L3 14v-3z"></path>
		<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
	</svg>`
).toString('base64')}`

// Collection/Book icon
const COLLECTION_ICON = `data:image/svg+xml;base64,${Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
		<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
	</svg>`
).toString('base64')}`

/**
 * Get the appropriate icon for a content type
 */
export function getTypeIcon(type: string): string {
	const iconMap: Record<string, string> = {
		video: VIDEO_ICON,
		library: LIBRARY_ICON,
		recipe: RECIPE_ICON,
		announcement: ANNOUNCEMENT_ICON,
		collection: COLLECTION_ICON
	}
	return iconMap[type] || RECIPE_ICON
}
