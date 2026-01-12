/**
 * Format salary range for display
 * @param min - Minimum salary
 * @param max - Maximum salary
 * @param currency - Currency code (default: USD)
 * @param compact - Use compact notation for smaller displays
 */
export function formatSalary(
	min?: number | null,
	max?: number | null,
	currency = 'USD',
	compact = false
): string | null {
	if (!min && !max) return null

	if (compact) {
		const fmt = new Intl.NumberFormat('en-US', {
			notation: 'compact',
			maximumFractionDigits: 0
		})
		const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''
		if (min && max) return `${symbol}${fmt.format(min)}-${fmt.format(max)}`
		if (min) return `${symbol}${fmt.format(min)}+`
		if (max) return `Up to ${symbol}${fmt.format(max)}`
		return null
	}

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	})
	if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`
	if (min) return `From ${formatter.format(min)}`
	if (max) return `Up to ${formatter.format(max)}`
	return null
}

/**
 * Capitalize a kebab-case or single-word enum value
 * "full-time" -> "Full-Time", "senior" -> "Senior"
 */
export function formatEnumLabel(value: string): string {
	return value
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('-')
}

/** Remote status display labels */
export const REMOTE_LABELS: Record<string, string> = {
	remote: 'Remote',
	hybrid: 'Hybrid',
	'on-site': 'On-Site'
}
