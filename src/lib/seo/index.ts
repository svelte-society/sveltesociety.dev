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
	buildSeoConfig,
	buildHomepageMeta,
	buildContentMeta,
	buildCategoryMeta,
	buildStaticPageMeta
} from './utils'
export type { SeoMetaTagConfig, PageMetaReturn } from './types'
