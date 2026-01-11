# SEO Implementation Quick Start

**For Developers:** Fast reference guide to implement SEO infrastructure.
**See Full PRD:** `docs/PRD_SEO_META_TAGS.md` for complete specifications.

---

## Overview

**Goal:** Add critical SEO infrastructure before launch
**Time:** 5-7 days
**Priority:** P0 (Launch Blocker)

**What We're Adding:**

1. robots.txt + sitemap.xml
2. Open Graph + Twitter Card meta tags
3. OG image generation
4. Schema.org structured data
5. Canonical URLs

---

## Quick Architecture

```
src/
├── lib/
│   └── seo/
│       ├── config.ts                 # SEO constants
│       ├── og-image.ts              # OG image utilities
│       ├── schema/                  # Schema.org generators
│       │   ├── organization.ts
│       │   ├── website.ts
│       │   ├── video.ts
│       │   ├── article.ts
│       │   ├── software.ts
│       │   └── breadcrumb.ts
│       └── utils.ts                 # Helper functions
│
└── routes/
    ├── robots.txt/
    │   └── +server.ts              # Dynamic robots.txt
    ├── sitemap.xml/
    │   └── +server.ts              # Dynamic sitemap
    └── og-image/
        └── [slug]/+server.ts       # OG image generation
```

---

## Step 1: SEO Config (30 min)

Create `/src/lib/seo/config.ts`:

```typescript
export const SEO_CONFIG = {
	siteName: 'Svelte Society',
	siteUrl: 'https://sveltesociety.dev',
	defaultTitle: 'Svelte Society - Community of Svelte Developers',
	defaultDescription:
		'Discover recipes, videos, libraries, and resources from the Svelte community.',
	defaultImage: '/og-default.png',
	twitterHandle: '@sveltesociety',
	locale: 'en_US',

	// OG Image settings
	ogImageWidth: 1200,
	ogImageHeight: 630,

	// Priority settings for sitemap
	priority: {
		homepage: 1.0,
		collection: 0.9,
		announcement: 0.9,
		content: 0.8,
		category: 0.7,
		static: 0.6
	}
}
```

---

## Step 2: robots.txt (1 hour)

Create `/src/routes/robots.txt/+server.ts`:

```typescript
import { SEO_CONFIG } from '$lib/seo/config'

export const GET = () => {
	const robots = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /saved
Disallow: /login

Sitemap: ${SEO_CONFIG.siteUrl}/sitemap.xml
`.trim()

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400' // 24 hours
		}
	})
}
```

**Test:** Visit `/robots.txt` in browser

---

## Step 3: sitemap.xml (3 hours)

Create `/src/routes/sitemap.xml/+server.ts`:

```typescript
import { SEO_CONFIG } from '$lib/seo/config'

export const GET = async ({ locals }) => {
	const { contentService } = locals

	// Get all published content
	const allContent = contentService.getAllPublishedContent()

	// Build URL entries
	const urls: string[] = []

	// Homepage
	urls.push(createUrlEntry('/', new Date(), 1.0, 'daily'))

	// Static pages
	urls.push(createUrlEntry('/about', new Date(), 0.6, 'monthly'))
	urls.push(createUrlEntry('/terms', new Date(), 0.3, 'yearly'))
	urls.push(createUrlEntry('/privacy', new Date(), 0.3, 'yearly'))

	// Category pages
	urls.push(createUrlEntry('/recipe', new Date(), 0.7, 'daily'))
	urls.push(createUrlEntry('/video', new Date(), 0.7, 'daily'))
	urls.push(createUrlEntry('/library', new Date(), 0.7, 'daily'))
	urls.push(createUrlEntry('/collection', new Date(), 0.7, 'daily'))
	urls.push(createUrlEntry('/announcement', new Date(), 0.7, 'daily'))

	// Content pages
	for (const content of allContent) {
		const priority = content.type === 'collection' || content.type === 'announcement' ? 0.9 : 0.8

		urls.push(
			createUrlEntry(
				`/${content.type}/${content.slug}`,
				new Date(content.updated_at || content.created_at),
				priority,
				'weekly'
			)
		)
	}

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600' // 1 hour
		}
	})
}

function createUrlEntry(path: string, lastmod: Date, priority: number, changefreq: string): string {
	return `  <url>
    <loc>${SEO_CONFIG.siteUrl}${path}</loc>
    <lastmod>${lastmod.toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}
```

**Test:** Visit `/sitemap.xml` in browser
**Validate:** https://www.xml-sitemaps.com/validate-xml-sitemap.html

---

## Step 4: Enhanced Meta Tags (4 hours)

Update all `+page.server.ts` files to include full meta config:

```typescript
// Example: /[type]/[slug]/+page.server.ts
export const load = async ({ locals, params, url }) => {
	const content = locals.contentService.getContentBySlug(params.slug)

	if (!content) {
		throw error(404, { message: 'Content not found' })
	}

	// Determine OG type
	const ogType = content.type === 'video' ? 'video.other' : 'article'

	return {
		content,
		meta: {
			// Basic
			title: `${content.title} - Svelte Society`,
			description: content.description || `View ${content.title} on Svelte Society`,
			url: url.toString(),

			// Open Graph
			image: `/og-image/${content.slug}`,
			imageAlt: content.title,
			imageWidth: 1200,
			imageHeight: 630,
			type: ogType,
			siteName: 'Svelte Society',
			locale: 'en_US',

			// Twitter
			twitter: {
				card: 'summary_large_image',
				site: '@sveltesociety',
				title: content.title,
				description: content.description,
				image: `/og-image/${content.slug}`,
				imageAlt: content.title
			},

			// Article specific (for recipes/libraries)
			article:
				content.type !== 'video'
					? {
							publishedTime: content.created_at,
							modifiedTime: content.updated_at,
							author: content.author_name
						}
					: undefined
		}
	}
}
```

**Test:** Check meta tags with:

- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

---

## Step 5: OG Image Generation (6 hours)

Install dependencies:

```bash
bun add @vercel/og
# or
bun add satori sharp
```

Create `/src/routes/og-image/[slug]/+server.ts`:

```typescript
import { ImageResponse } from '@vercel/og'

export const GET = async ({ params, locals }) => {
  const { slug } = params
  const content = locals.contentService.getContentBySlug(slug)

  if (!content) {
    // Return default image
    return new Response(await getDefaultImage(), {
      headers: { 'Content-Type': 'image/png' }
    })
  }

  // Generate image with Satori/Vercel OG
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FF3E00', // Svelte orange
          backgroundImage: 'linear-gradient(135deg, #FF3E00 0%, #F1413D 100%)',
          padding: 60,
          fontFamily: 'Inter'
        }}
      >
        {/* Svelte Society Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 32, color: 'white', fontWeight: 'bold' }}>
            Svelte Society
          </div>
        </div>

        {/* Content Type Badge */}
        <div style={{
          display: 'inline-flex',
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 6,
          color: 'white',
          fontSize: 18,
          marginBottom: 20,
          width: 'fit-content'
        }}>
          {content.type.toUpperCase()}
        </div>

        {/* Title */}
        <div style={{
          fontSize: 64,
          fontWeight: 'bold',
          color: 'white',
          lineHeight: 1.2,
          marginBottom: 20,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {content.title}
        </div>

        {/* Optional: Thumbnail for videos */}
        {content.thumbnail && (
          <img
            src={content.thumbnail}
            style={{
              position: 'absolute',
              bottom: 60,
              right: 60,
              width: 200,
              height: 112,
              objectFit: 'cover',
              borderRadius: 8,
              opacity: 0.3
            }}
          />
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  )
}
```

**Test:** Visit `/og-image/[any-content-slug]` in browser

---

## Step 6: Schema.org (8 hours)

Create schema generators in `/src/lib/seo/schema/`:

### organization.ts

```typescript
import { SEO_CONFIG } from '../config'

export function generateOrganizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SEO_CONFIG.siteName,
		url: SEO_CONFIG.siteUrl,
		logo: `${SEO_CONFIG.siteUrl}/logo.png`,
		description: SEO_CONFIG.defaultDescription,
		sameAs: ['https://twitter.com/sveltesociety', 'https://github.com/svelte-society']
	}
}
```

### website.ts

```typescript
import { SEO_CONFIG } from '../config'

export function generateWebSiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SEO_CONFIG.siteName,
		url: SEO_CONFIG.siteUrl,
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${SEO_CONFIG.siteUrl}/?q={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		}
	}
}
```

### article.ts

```typescript
export function generateArticleSchema(content: any, url: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: content.title,
		description: content.description,
		url: url,
		datePublished: content.created_at,
		dateModified: content.updated_at || content.created_at,
		author: {
			'@type': 'Person',
			name: content.author_name || 'Svelte Society'
		},
		publisher: {
			'@type': 'Organization',
			name: 'Svelte Society',
			logo: {
				'@type': 'ImageObject',
				url: 'https://sveltesociety.dev/logo.png'
			}
		}
	}
}
```

### video.ts

```typescript
export function generateVideoSchema(content: any, url: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'VideoObject',
		name: content.title,
		description: content.description,
		thumbnailUrl: content.thumbnail,
		uploadDate: content.created_at,
		contentUrl: content.metadata?.url,
		embedUrl: content.metadata?.embedUrl,
		author: {
			'@type': 'Person',
			name: content.metadata?.channelName || content.author_name
		}
	}
}
```

### breadcrumb.ts

```typescript
import { SEO_CONFIG } from '../config'

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: `${SEO_CONFIG.siteUrl}${item.url}`
		}))
	}
}
```

### Add to pages:

```svelte
<!-- In content detail page -->
<script lang="ts">
  import { generateArticleSchema, generateBreadcrumbSchema } from '$lib/seo/schema'

  let { data } = $props()

  const articleSchema = generateArticleSchema(data.content, data.meta.url)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Recipes', url: '/recipe' },
    { name: data.content.title, url: `/${data.content.type}/${data.content.slug}` }
  ])

  const schemas = [articleSchema, breadcrumbSchema]
</script>

<svelte:head>
  <script type="application/ld+json">
    {JSON.stringify(schemas)}
  </script>
</svelte:head>
```

**Test:** Google Rich Results Test: https://search.google.com/test/rich-results

---

## Step 7: Resource Hints (15 min)

Update `/src/app.html`:

```html
<head>
	<meta charset="utf-8" />
	<link rel="icon" href="%sveltekit.assets%/favicon.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<!-- Resource hints -->
	<link rel="preconnect" href="https://images.wsrv.nl" crossorigin />
	<link rel="dns-prefetch" href="https://umami.sveltesociety.dev" />

	%sveltekit.head%
</head>
```

---

## Testing Checklist

### Automated Tests

```typescript
// tests/e2e/seo/meta-tags.spec.ts
import { test, expect } from '@playwright/test'

test('homepage has OG tags', async ({ page }) => {
	await page.goto('/')

	await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
	await expect(page.locator('meta[property="og:image"]')).toHaveCount(1)
	await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1)
	await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
})

test('content page has schema', async ({ page }) => {
	await page.goto('/recipe/form-validation')

	const jsonLd = await page.locator('script[type="application/ld+json"]').textContent()
	expect(jsonLd).toBeTruthy()

	const schemas = JSON.parse(jsonLd!)
	expect(Array.isArray(schemas)).toBe(true)
	expect(schemas[0]['@type']).toBe('TechArticle')
})

test('og:image returns 200', async ({ request }) => {
	const response = await request.get('/og-image/test-slug')
	expect(response.status()).toBe(200)
})
```

### Manual Validation

- [ ] robots.txt: http://www.robotstxt.org/validator.html
- [ ] sitemap.xml: https://www.xml-sitemaps.com/validate-xml-sitemap.html
- [ ] OG tags: https://developers.facebook.com/tools/debug/
- [ ] Twitter Cards: https://cards-dev.twitter.com/validator
- [ ] Rich Results: https://search.google.com/test/rich-results
- [ ] Lighthouse SEO: Run in Chrome DevTools (target: 95+)

---

## Common Issues & Fixes

### Issue: OG image not showing on Facebook

**Fix:** Clear Facebook cache in Sharing Debugger

### Issue: Schema validation errors

**Fix:** Ensure all dates are ISO 8601 format, escape user content

### Issue: Sitemap too slow

**Fix:** Add caching, query optimization, consider background job

### Issue: Twitter Card not rendering

**Fix:** Verify card type is `summary_large_image`, image meets size requirements

---

## Performance Tips

1. **Cache everything:**
   - Sitemap: 1 hour
   - OG images: Indefinitely (immutable)
   - robots.txt: 24 hours

2. **Optimize queries:**
   - Use indexes on `status` and `created_at`
   - Cache content list for sitemap

3. **Image generation:**
   - Keep template simple
   - Target <500ms generation time
   - Implement rate limiting

---

## Launch Checklist

Before marking SEO as complete:

- [ ] `/robots.txt` returns 200
- [ ] `/sitemap.xml` returns 200 with all content
- [ ] All pages have OG tags
- [ ] All pages have Twitter Card tags
- [ ] All pages have canonical URLs
- [ ] OG images generate correctly
- [ ] All schemas validate
- [ ] E2E tests pass
- [ ] Lighthouse SEO ≥95
- [ ] Facebook Sharing Debugger passes
- [ ] Twitter Card Validator passes
- [ ] Sitemap submitted to Google Search Console

---

## Resources

- **Full PRD:** `docs/PRD_SEO_META_TAGS.md`
- **Checklist:** `docs/SEO_IMPLEMENTATION_CHECKLIST.md`
- **Svead Docs:** https://github.com/josephspurrier/svead
- **Schema.org:** https://schema.org/
- **Vercel OG:** https://vercel.com/docs/functions/edge-functions/og-image-generation

---

**Questions?** See full PRD or ask in team chat.
