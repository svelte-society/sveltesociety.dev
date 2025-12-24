/**
 * SEO Module
 * Centralized exports for SEO functionality
 */

export { SEO_CONFIG, OG_TYPE_MAP, SCHEMA_TYPE_MAP } from './config'
export {
	formatMetaDescription,
	sanitizeTitle,
	getAbsoluteUrl,
	getOgImageUrl,
	escapeJsonLd,
	toIso8601,
	getOgType,
	getSchemaType,
	formatContentType,
	pluralizeContentType,
	buildSeoConfig,
	buildHomepageMeta,
	buildContentMeta,
	buildCategoryMeta,
	buildStaticPageMeta
} from './utils'
export type { SeoMetaTagConfig, PageMetaReturn } from './types'

// Export SEO component (enhanced wrapper around svead)
export { default as Seo } from './Seo.svelte'

// Export schema generators
export * from './schema'
