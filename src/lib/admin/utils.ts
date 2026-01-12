// Re-export from canonical location
export { generateSlug } from '$lib/utils/slug'

/**
 * Parse pagination parameters from URL
 */
export function getPaginationParams(url: URL): { page: number; limit: number } {
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
	const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))

	return { page, limit }
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination({
	total,
	page,
	limit
}: {
	total: number
	page: number
	limit: number
}) {
	const totalPages = Math.ceil(total / limit)
	const offset = (page - 1) * limit

	return {
		page,
		limit,
		offset,
		total,
		totalPages,
		hasNext: page < totalPages,
		hasPrev: page > 1
	}
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Bytes'

	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
	if (text.length <= length) return text
	return text.substring(0, length - 3) + '...'
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
}

/**
 * Format a date and time for display
 */
export function formatDateTime(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date
	return d.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

/**
 * Build URL with query parameters
 */
export function buildUrl(base: string, params: Record<string, any>): string {
	const url = new URL(base, 'http://dummy.com')

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			if (Array.isArray(value)) {
				value.forEach((v) => url.searchParams.append(key, String(v)))
			} else {
				url.searchParams.set(key, String(value))
			}
		}
	})

	return url.pathname + url.search
}

/**
 * Check if user has permission
 */
export function hasPermission(
	userRole: { permissions: Record<string, boolean> } | null,
	permission: string
): boolean {
	if (!userRole) return false
	return userRole.permissions[permission] === true
}

/**
 * Sort array of objects by key
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
	return [...array].sort((a, b) => {
		const aVal = a[key]
		const bVal = b[key]

		if (aVal < bVal) return order === 'asc' ? -1 : 1
		if (aVal > bVal) return order === 'asc' ? 1 : -1
		return 0
	})
}

/**
 * Group array items by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
	return array.reduce(
		(groups, item) => {
			const groupKey = String(item[key])
			if (!groups[groupKey]) {
				groups[groupKey] = []
			}
			groups[groupKey].push(item)
			return groups
		},
		{} as Record<string, T[]>
	)
}
