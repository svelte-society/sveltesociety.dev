/**
 * Image caching utility using wsrv.nl
 * Documentation: https://images.weserv.nl/docs/
 */

import { dev } from '$app/environment'
import { page } from '$app/state'

export interface ImageCacheOptions {
	/** Width in pixels */
	w?: number
	/** Height in pixels */
	h?: number
	/** Device pixel ratio (1-5) */
	dpr?: number
	/** How the image is fitted to target dimensions */
	fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
	/** Background color when using fit=contain (hex without #) */
	cbg?: string
	/** Do not enlarge the image */
	we?: boolean
	/** Alignment position */
	a?:
		| 'top'
		| 'bottom'
		| 'left'
		| 'right'
		| 'center'
		| 'top-left'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-right'
	/** Quality (0-100) */
	q?: number
	/** Output format */
	output?: 'webp' | 'jpg' | 'png' | 'gif' | 'tiff' | 'bmp' | 'ico'
	/** Blur effect (0.3-1000) */
	blur?: number
	/** Sharpen */
	sharp?: boolean
	/** Cache-Control max-age in seconds */
	maxage?: string
}

/**
 * Generate a cached image URL using wsrv.nl
 * @param originalUrl The original image URL
 * @param options Image transformation options
 * @returns The wsrv.nl cached image URL
 */
export function getCachedImageUrl(
	originalUrl: string | null | undefined,
	options: ImageCacheOptions = {}
): string {
	// Return empty string for invalid URLs
	if (!originalUrl || originalUrl === '') {
		return ''
	}

	if (dev) {
		return originalUrl
	}

	// Skip if already a weserv URL
	if (originalUrl.includes('wsrv.nl') || originalUrl.includes('weserv.nl')) {
		return originalUrl
	}

	// Skip data URLs
	if (originalUrl.startsWith('data:')) {
		return originalUrl
	}

	// Build query parameters
	const params = new URLSearchParams()

	// Add the original URL
	params.append('url', originalUrl.startsWith('/') ? page.url.origin + originalUrl : originalUrl)

	// Add options
	if (options.w) params.append('w', options.w.toString())
	if (options.h) params.append('h', options.h.toString())
	if (options.dpr) params.append('dpr', Math.min(5, Math.max(1, options.dpr)).toString())
	if (options.fit) params.append('fit', options.fit)
	if (options.cbg) params.append('cbg', options.cbg)
	if (options.we) params.append('we', '1')
	if (options.a) params.append('a', options.a)
	if (options.q) params.append('q', Math.min(100, Math.max(0, options.q)).toString())
	if (options.output) params.append('output', options.output)
	if (options.blur && options.blur >= 0.3 && options.blur <= 1000) {
		params.append('blur', options.blur.toString())
	}
	if (options.sharp) params.append('sharp', '1')
	if (options.maxage) params.append('maxage', options.maxage)

	// Use protocol-relative URL
	return `//wsrv.nl/?${params.toString()}`
}

/**
 * Preset configurations for common use cases
 */
export const imageCachePresets = {
	/** Thumbnail for cards and lists (16:9 aspect ratio) */
	thumbnail: {
		w: 320,
		h: 180,
		fit: 'cover' as const,
		q: 85,
		output: 'webp' as const
	},
	/** Avatar images */
	avatar: {
		w: 64,
		h: 64,
		fit: 'cover' as const,
		q: 90,
		output: 'webp' as const
	},
	/** Hero/banner images */
	hero: {
		w: 1200,
		h: 600,
		fit: 'cover' as const,
		q: 85,
		output: 'webp' as const
	},
	/** Content body images */
	content: {
		w: 800,
		fit: 'inside' as const,
		we: true,
		q: 85,
		output: 'webp' as const
	},
	/** Social media preview */
	social: {
		w: 1200,
		h: 630,
		fit: 'cover' as const,
		q: 90,
		output: 'jpg' as const
	},
	/** Square thumbnail for horizontal card layout */
	cardThumbnail: {
		w: 120,
		h: 120,
		fit: 'cover' as const,
		q: 85,
		output: 'webp' as const
	}
} as const

/**
 * Get a cached image URL with a preset configuration
 */
export function getCachedImageWithPreset(
	originalUrl: string | null | undefined,
	preset: keyof typeof imageCachePresets,
	additionalOptions?: ImageCacheOptions
): string {
	return getCachedImageUrl(originalUrl, {
		...imageCachePresets[preset],
		...additionalOptions
	})
}
