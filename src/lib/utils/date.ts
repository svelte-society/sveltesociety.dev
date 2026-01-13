/**
 * Format a date string for display (short format: "1/13/2026")
 */
export function formatDate(date: string | null, fallback = '-'): string {
	if (!date) return fallback
	return new Date(date).toLocaleDateString()
}

/**
 * Format a date string with long month name ("January 13, 2026")
 */
export function formatLongDate(date: string | null, fallback = 'Unknown date'): string {
	if (!date) return fallback
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

/**
 * @deprecated Use formatLongDate instead
 */
export function formatRelativeDate(date: string | null): string {
	return formatLongDate(date, 'Unknown date')
}
