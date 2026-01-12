import { debounce } from '$lib/utils/debounce'

export type PreviewState<T> = {
	data: T | null
	loading: boolean
	error: string | null
}

/**
 * Creates a debounced preview fetcher that tracks loading/error state
 * @param endpoint - API endpoint path (e.g., '/api/preview/youtube')
 * @param paramName - Query parameter name (e.g., 'url' or 'repo')
 * @param debounceMs - Debounce delay in milliseconds (default: 1000)
 */
export function usePreview<T = unknown>(
	endpoint: string,
	paramName: string,
	debounceMs = 1000
): {
	state: PreviewState<T>
	fetch: (value: string) => void
} {
	let data = $state<T | null>(null)
	let loading = $state(false)
	let error = $state<string | null>(null)
	let previousValue = ''

	const fetchPreview = debounce(async (value: string) => {
		if (!value) {
			data = null
			error = null
			return
		}

		loading = true
		error = null

		try {
			const response = await fetch(`${endpoint}?${paramName}=${encodeURIComponent(value)}`)
			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Failed to fetch preview')
			}

			data = result
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch preview'
			data = null
		} finally {
			loading = false
		}
	}, debounceMs)

	return {
		get state() {
			return { data, loading, error }
		},
		fetch: (value: string) => {
			if (value !== previousValue) {
				previousValue = value
				fetchPreview(value)
			}
		}
	}
}
