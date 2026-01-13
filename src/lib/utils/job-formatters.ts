/**
 * Format salary range with full currency formatting
 */
export function formatSalary(
	min?: number | null,
	max?: number | null,
	currency = 'USD'
): string | null {
	if (!min && !max) return null
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
 * Format salary range with compact notation (e.g., $80K-$120K)
 */
export function formatSalaryCompact(
	min?: number | null,
	max?: number | null,
	currency?: string | null
): string | null {
	if (!min && !max) return null
	const fmt = new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 0
	})
	const curr = currency || 'USD'
	const symbol = curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : ''
	if (min && max) return `${symbol}${fmt.format(min)}-${fmt.format(max)}`
	if (min) return `${symbol}${fmt.format(min)}+`
	if (max) return `Up to ${symbol}${fmt.format(max)}`
	return null
}

/**
 * Format position type (e.g., "full-time" -> "Full-Time")
 */
export function formatPositionType(type: string): string {
	return type
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('-')
}

/**
 * Format seniority level (e.g., "senior" -> "Senior")
 */
export function formatSeniorityLevel(level: string): string {
	return level.charAt(0).toUpperCase() + level.slice(1)
}

/**
 * Format remote status (e.g., "on-site" -> "On-Site")
 */
export function formatRemoteStatus(status: string): string {
	return status
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('-')
}
