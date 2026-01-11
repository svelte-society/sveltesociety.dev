/**
 * URL helper functions for filter toggle behavior with category page redirect.
 *
 * When on a category page (e.g., /recipe), adding a filter redirects to the homepage
 * with the category preserved as a query param (e.g., /?type=recipe&tags=svelte).
 */

/**
 * Check if a route ID matches a category page pattern.
 * Returns the category type if on a category page, null otherwise.
 */
export function getCategoryFromRoute(
	routeId: string | null,
	params: Record<string, string>
): string | null {
	if (!routeId) return null
	// Match routes like /(app)/(public)/[type]
	if (routeId.includes('[type]') && !routeId.includes('[slug]')) {
		return params.type || null
	}
	return null
}

/**
 * Build a URL with toggled param value.
 * - If on a category page, redirects to homepage with category as query param
 * - Toggle behavior: add if not present, remove if present
 * - Resets page param when filters change
 */
export function buildToggleHref(
	currentUrl: URL,
	routeId: string | null,
	params: Record<string, string>,
	paramName: string,
	value: string
): string {
	const categoryType = getCategoryFromRoute(routeId, params)

	// If on category page, redirect to homepage
	const newUrl = categoryType ? new URL('/', currentUrl.origin) : new URL(currentUrl)

	// If redirecting from category page, copy existing params and add type
	if (categoryType) {
		// First add the category as a type param
		newUrl.searchParams.append('type', categoryType)

		// Copy existing search params (except page)
		currentUrl.searchParams.forEach((v, k) => {
			if (k !== 'page') {
				newUrl.searchParams.append(k, v)
			}
		})
	}

	// Toggle the value using repeated params format
	const values = newUrl.searchParams.getAll(paramName)

	if (values.includes(value)) {
		// Remove the value - delete all, then re-add the rest
		newUrl.searchParams.delete(paramName)
		values.filter((v) => v !== value).forEach((v) => newUrl.searchParams.append(paramName, v))
	} else {
		// Add the value
		newUrl.searchParams.append(paramName, value)
	}

	// Reset pagination when filters change
	newUrl.searchParams.delete('page')

	return newUrl.pathname + newUrl.search
}

/**
 * Check if a value is currently active for a given param.
 * Works with repeated params format (e.g., ?tags=a&tags=b).
 */
export function isValueActive(url: URL, paramName: string, value: string): boolean {
	return url.searchParams.getAll(paramName).includes(value)
}
