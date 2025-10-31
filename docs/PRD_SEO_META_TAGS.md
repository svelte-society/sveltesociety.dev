# PRD: SEO and Meta Tag Implementation for Launch

**Status:** Ready for Implementation
**Priority:** P0 - Launch Blocker
**Target:** Pre-Launch (Complete before production deployment)
**Estimated Effort:** 3-5 days

## Executive Summary

Before launching Svelte Society to production, critical SEO infrastructure must be implemented to ensure proper search engine indexing, social media sharing, and discoverability. While the project has solid foundations (clean URLs, SSR-ready architecture, Svead library), essential SEO elements are missing that will significantly impact visibility and user acquisition.

**Key Gaps Identified:**
- No robots.txt or sitemap.xml (search engines cannot discover content)
- No Open Graph or Twitter Card tags (poor social sharing experience)
- No structured data/Schema.org (missing rich search results)
- Incomplete Svead integration (library installed but underutilized)
- No canonical URLs (potential duplicate content issues)
- Missing social preview images (og:image not configured)

## Current State Assessment

### Strengths ✅
1. **Clean URL Structure** - Semantic slugs (`/recipe/form-validation`, `/video/rich-harris-keynote`)
2. **SSR-Ready** - SvelteKit with server-side rendering enabled
3. **Content Types** - Well-structured content (recipes, videos, libraries, collections, announcements)
4. **Image Infrastructure** - wsrv.nl CDN with optimization presets already configured
5. **Svead Library** - Installed (v0.0.15) with comprehensive SEO support
6. **Analytics** - Umami analytics integrated

### Critical Gaps 🚨
1. **No `robots.txt`** - Search engines have no crawling guidance
2. **No `sitemap.xml`** - No URL discovery mechanism for search engines
3. **No Open Graph tags** - Facebook/LinkedIn sharing shows generic previews
4. **No Twitter Cards** - Twitter sharing lacks rich preview cards
5. **No Schema.org JSON-LD** - Missing opportunity for rich snippets in search results
6. **No canonical URLs** - Risk of duplicate content penalties
7. **No og:image generation** - Social shares lack visual appeal
8. **Inconsistent meta implementation** - Some pages use Svead, others use basic `<svelte:head>`

### Moderate Gaps ⚠️
1. Image lazy loading not implemented
2. No resource hints for external resources (preconnect, dns-prefetch)
3. About page has no meta configuration
4. User profile pages use basic `<svelte:head>` instead of Svead
5. No prerendering configured for static pages

## Goals and Success Metrics

### Primary Goals
1. **Search Engine Indexability** - Enable proper crawling and indexing of all public content
2. **Social Media Sharing** - Rich, appealing previews on Facebook, Twitter, LinkedIn, Discord, Slack
3. **Rich Search Results** - Implement structured data for enhanced SERP appearance
4. **Prevent Duplicate Content** - Canonical URLs and proper robots directives
5. **Page Load Performance** - Optimize for Core Web Vitals

### Success Metrics
- **Technical SEO Score** - Lighthouse SEO score ≥95
- **Social Sharing** - All content pages have valid OG images and Twitter Cards
- **Indexing** - Sitemap submitted and verified in Google Search Console
- **Schema Validation** - All structured data passes Google Rich Results Test
- **Core Web Vitals** - LCP <2.5s, FID <100ms, CLS <0.1

## Technical Architecture

### Technology Stack
- **Svead** (v0.0.15) - Meta tag management
- **SvelteKit** - SSR and routing
- **wsrv.nl CDN** - Image optimization (already configured)
- **SQLite** - Content database

### SEO Components Architecture

```
src/lib/seo/
├── config.ts              # SEO constants and defaults
├── og-image.ts            # OG image generation utilities
├── schema/                # Schema.org JSON-LD generators
│   ├── organization.ts
│   ├── website.ts
│   ├── video.ts
│   ├── article.ts
│   ├── software.ts
│   └── breadcrumb.ts
└── utils.ts               # SEO helper functions

src/routes/
├── robots.txt/+server.ts  # Dynamic robots.txt
├── sitemap.xml/+server.ts # Dynamic sitemap.xml
└── og-image/              # OG image generation endpoint
    └── [slug]/+server.ts
```

## Feature Requirements

### P0 - Launch Blockers (Must Have)

#### 1. robots.txt Implementation
**File:** `/src/routes/robots.txt/+server.ts`

**Requirements:**
- Dynamic robots.txt generation
- Allow all crawlers on public content
- Disallow admin routes (`/admin/*`)
- Disallow API routes (`/api/*`)
- Include sitemap URL
- User-agent specific rules

**Example Output:**
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /saved
Disallow: /login

Sitemap: https://sveltesociety.dev/sitemap.xml
```

**Acceptance Criteria:**
- [ ] Accessible at `/robots.txt`
- [ ] Returns `text/plain` content type
- [ ] Includes sitemap reference
- [ ] Blocks sensitive routes
- [ ] Passes robots.txt validator

---

#### 2. Sitemap.xml Generation
**File:** `/src/routes/sitemap.xml/+server.ts`

**Requirements:**
- Dynamic sitemap generation from database
- Include all published content (recipes, videos, libraries, collections, announcements)
- Include static pages (home, about, terms, privacy)
- Exclude admin, API, and user-specific pages
- Include `lastmod` dates from content `updated_at`
- Set priority based on content type
- Cache sitemap for 1 hour

**Priority Scheme:**
- Homepage: 1.0
- Collections/Announcements: 0.9
- Recipes/Videos/Libraries: 0.8
- Static pages: 0.6
- Category pages: 0.7

**Acceptance Criteria:**
- [ ] Accessible at `/sitemap.xml`
- [ ] Valid XML format (passes validator)
- [ ] Includes all published content
- [ ] Uses ISO 8601 dates
- [ ] Implements caching
- [ ] Max 50,000 URLs (current content ~hundreds)
- [ ] Returns `application/xml` content type

---

#### 3. Open Graph Tags Implementation
**Files:** All `+page.server.ts` files, layout component

**Requirements:**
- Configure Svead with full OG support
- Generate OG image URLs for all content
- Content-type specific OG tags

**Required OG Tags:**
```typescript
{
  'og:title': string
  'og:description': string
  'og:url': string
  'og:type': 'website' | 'article' | 'video.other'
  'og:image': string
  'og:image:width': '1200'
  'og:image:height': '630'
  'og:image:alt': string
  'og:site_name': 'Svelte Society'
  'og:locale': 'en_US'
}
```

**Content Type Mappings:**
- **Video content** → `og:type: 'video.other'`
- **Recipe/Library content** → `og:type: 'article'`
- **Homepage/Categories** → `og:type: 'website'`

**Acceptance Criteria:**
- [ ] All pages have OG tags
- [ ] Images are 1200x630px
- [ ] Passes Facebook Sharing Debugger
- [ ] Dynamic content includes content-specific images
- [ ] Fallback OG image for pages without images

---

#### 4. Twitter Card Tags
**Files:** All `+page.server.ts` files

**Requirements:**
- Implement Twitter Card meta tags via Svead
- Use `summary_large_image` card type
- Include Twitter-specific metadata

**Required Twitter Tags:**
```typescript
{
  'twitter:card': 'summary_large_image'
  'twitter:site': '@sveltesociety'
  'twitter:title': string
  'twitter:description': string
  'twitter:image': string
  'twitter:image:alt': string
}
```

**Acceptance Criteria:**
- [ ] All pages have Twitter Card tags
- [ ] Passes Twitter Card Validator
- [ ] Images optimized for Twitter (2:1 ratio)
- [ ] @sveltesociety handle included

---

#### 5. OG Image Generation
**File:** `/src/routes/og-image/[slug]/+server.ts`

**Requirements:**
- Dynamic OG image generation for content
- Use Satori (HTML/CSS to PNG)
- Branded template with Svelte Society styling
- Include content title, type, and optional thumbnail

**Technical Approach:**
Option A: Use `@vercel/og` or `satori` for server-side generation
Option B: Use wsrv.nl with overlay parameters for simple cases
Option C: Pre-generate on content publish (store in database)

**Recommended:** Option A (most flexible)

**Template Design:**
- Size: 1200x630px
- Background: Svelte Society brand gradient
- Content title (max 60 chars)
- Content type badge (Recipe, Video, Library)
- Svelte Society logo
- Optional: Content thumbnail (for videos)

**Acceptance Criteria:**
- [ ] Generates valid PNG images
- [ ] Returns proper content-type header
- [ ] Caches generated images
- [ ] Handles long titles gracefully
- [ ] Fallback for generation failures
- [ ] Performance: <500ms generation time

---

#### 6. Canonical URLs
**Files:** All `+page.server.ts` files, Svead config

**Requirements:**
- Add canonical URL to every page
- Use absolute URLs (https://sveltesociety.dev/...)
- Handle trailing slashes consistently
- Prevent duplicate content issues

**Implementation:**
- Svead supports canonical via `url` field
- Ensure URL is always absolute
- Remove query parameters for content pages

**Acceptance Criteria:**
- [ ] All pages have canonical URL
- [ ] Uses HTTPS protocol
- [ ] No trailing slashes (SvelteKit default)
- [ ] Query params excluded from canonical

---

#### 7. Schema.org Structured Data
**Files:** `/src/lib/seo/schema/`, individual page components

**Requirements:**
Implement JSON-LD structured data for:

**Organization Schema (Homepage):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Svelte Society",
  "url": "https://sveltesociety.dev",
  "logo": "https://sveltesociety.dev/logo.png",
  "description": "A community of Svelte developers...",
  "sameAs": [
    "https://twitter.com/sveltesociety",
    "https://github.com/svelte-society"
  ]
}
```

**WebSite Schema (Homepage):**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Svelte Society",
  "url": "https://sveltesociety.dev",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://sveltesociety.dev/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

**VideoObject Schema (Video Content):**
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Title",
  "description": "Description",
  "thumbnailUrl": "...",
  "uploadDate": "ISO8601",
  "contentUrl": "YouTube URL",
  "embedUrl": "YouTube embed URL",
  "author": {
    "@type": "Person",
    "name": "Author name"
  }
}
```

**TechArticle Schema (Recipe Content):**
```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Title",
  "description": "Description",
  "author": {
    "@type": "Person",
    "name": "Author name"
  },
  "datePublished": "ISO8601",
  "dateModified": "ISO8601"
}
```

**SoftwareSourceCode Schema (Library Content):**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "Library name",
  "description": "Description",
  "codeRepository": "GitHub URL",
  "programmingLanguage": "JavaScript"
}
```

**BreadcrumbList Schema (All Content Pages):**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://sveltesociety.dev"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Recipes",
      "item": "https://sveltesociety.dev/recipe"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Form Validation",
      "item": "https://sveltesociety.dev/recipe/form-validation"
    }
  ]
}
```

**Acceptance Criteria:**
- [ ] All schemas validate in Google Rich Results Test
- [ ] Schema rendered in `<script type="application/ld+json">`
- [ ] Multiple schemas combined in array when needed
- [ ] All dates in ISO 8601 format
- [ ] No schema errors in Search Console

---

#### 8. Standardize Meta Tag Approach
**Files:** `/src/routes/(app)/(public)/user/[username]/+page.svelte`, `/src/routes/(app)/(public)/about/+page.svelte`

**Requirements:**
- Convert all pages to use Svead (currently user profile uses `<svelte:head>`)
- Add meta config to About page (currently missing)
- Ensure consistent meta structure across all pages

**Acceptance Criteria:**
- [ ] All pages use Svead for meta tags
- [ ] No pages using raw `<svelte:head>` for SEO
- [ ] About page has proper meta configuration
- [ ] User profile pages have complete OG tags

---

### P1 - High Priority (Launch Week)

#### 9. Enhanced Image Optimization
**Files:** Content components, image utility

**Requirements:**
- Add `loading="lazy"` to all non-critical images
- Add `decoding="async"` to all images
- Add `fetchpriority="high"` to hero images
- Implement responsive images with srcset where appropriate

**Acceptance Criteria:**
- [ ] All images below fold have lazy loading
- [ ] Hero images have high fetch priority
- [ ] Images have explicit width/height attributes
- [ ] No layout shift from images (CLS improvement)

---

#### 10. Resource Hints
**File:** `/src/app.html`

**Requirements:**
Add resource hints for external services:

```html
<link rel="preconnect" href="https://images.wsrv.nl" crossorigin>
<link rel="dns-prefetch" href="https://umami.sveltesociety.dev">
<link rel="dns-prefetch" href="https://www.youtube.com">
```

**Acceptance Criteria:**
- [ ] Preconnect to image CDN
- [ ] DNS prefetch for analytics
- [ ] DNS prefetch for YouTube embeds (if used)
- [ ] No unnecessary preconnects

---

#### 11. SEO Configuration File
**File:** `/src/lib/seo/config.ts`

**Requirements:**
- Centralized SEO constants
- Default meta values
- Social media handles
- Image dimensions
- Schema.org defaults

```typescript
export const SEO_CONFIG = {
  siteName: 'Svelte Society',
  siteUrl: 'https://sveltesociety.dev',
  defaultTitle: 'Svelte Society - Community of Svelte Developers',
  defaultDescription: 'Discover recipes, videos, libraries, and resources from the Svelte community.',
  defaultImage: '/og-default.png',
  twitterHandle: '@sveltesociety',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCardType: 'summary_large_image',
  locale: 'en_US'
}
```

**Acceptance Criteria:**
- [ ] All SEO constants centralized
- [ ] Used across all page configurations
- [ ] Easy to update for environment changes

---

#### 12. Meta Tag Testing
**Files:** New E2E test file

**Requirements:**
- Playwright tests for meta tag presence
- Validate OG tags on sample pages
- Validate Twitter Cards on sample pages
- Test og:image URLs resolve

**Test Coverage:**
- Homepage has all required meta tags
- Content detail pages have content-specific tags
- OG images return 200 status
- Twitter Card validator passes
- No duplicate meta tags

**Acceptance Criteria:**
- [ ] E2E tests for meta tags pass
- [ ] Test added to CI pipeline
- [ ] Documentation updated in `tests/README.md`

---

### P2 - Medium Priority (Post-Launch)

#### 13. Static Page Prerendering
**File:** `/svelte.config.js`, individual page files

**Requirements:**
- Configure prerendering for static pages
- Prerender: about, terms, privacy, 404
- Keep dynamic content as SSR

**Acceptance Criteria:**
- [ ] Static pages are prerendered
- [ ] Build time includes prerendering
- [ ] No SSR calls for static content

---

#### 14. RSS Feed Generation
**File:** `/src/routes/rss.xml/+server.ts`

**Requirements:**
- RSS 2.0 feed for latest content
- Include all content types
- Limit to 50 most recent items
- Cache for 1 hour

**Acceptance Criteria:**
- [ ] Valid RSS 2.0 format
- [ ] Includes content from all types
- [ ] Passes RSS validator

---

#### 15. Advanced Schema.org
**Files:** Additional schema generators

**Requirements:**
- Event schema for upcoming events
- Person schema for user profiles (if public)
- ItemList schema for category pages
- FAQPage schema if FAQ added

---

## Implementation Plan

### Phase 1: Foundation (Day 1)
**Estimated Time:** 6-8 hours

1. Create SEO configuration file and utilities
2. Implement robots.txt endpoint
3. Implement sitemap.xml endpoint
4. Add resource hints to app.html

**Deliverables:**
- [ ] `/robots.txt` accessible and valid
- [ ] `/sitemap.xml` accessible and valid
- [ ] Sitemap submitted to Google Search Console

---

### Phase 2: Meta Tags (Day 2)
**Estimated Time:** 8-10 hours

1. Extend Svead configuration with OG and Twitter tags
2. Update all `+page.server.ts` files with complete meta objects
3. Standardize user profile and about page meta tags
4. Add canonical URLs to all pages

**Deliverables:**
- [ ] All pages have OG tags
- [ ] All pages have Twitter Card tags
- [ ] All pages have canonical URLs
- [ ] Passes Facebook Sharing Debugger
- [ ] Passes Twitter Card Validator

---

### Phase 3: OG Images (Day 3)
**Estimated Time:** 6-8 hours

1. Choose and implement OG image generation solution
2. Create branded OG image template
3. Implement dynamic OG image endpoint
4. Add fallback OG image for pages without content
5. Update meta configs to use og:image URLs

**Deliverables:**
- [ ] OG images generate successfully
- [ ] All content pages have unique OG images
- [ ] Fallback image in place
- [ ] Images cached properly

---

### Phase 4: Structured Data (Day 4)
**Estimated Time:** 8-10 hours

1. Create schema generators for each content type
2. Implement Organization and WebSite schema on homepage
3. Add content-type specific schemas to detail pages
4. Add BreadcrumbList to all content pages
5. Validate all schemas

**Deliverables:**
- [ ] All schemas validate in Google Rich Results Test
- [ ] No schema errors in Search Console (after indexing)
- [ ] Breadcrumbs display in search results preview

---

### Phase 5: Testing & Polish (Day 5)
**Estimated Time:** 4-6 hours

1. Write Playwright tests for meta tags
2. Implement image lazy loading
3. Add fetch priority to critical images
4. Manual testing across different content types
5. Documentation updates

**Deliverables:**
- [ ] E2E tests pass
- [ ] Lighthouse SEO score ≥95
- [ ] All acceptance criteria met
- [ ] Documentation complete

---

## Testing Strategy

### Automated Testing
**Playwright E2E Tests** (`tests/e2e/seo/meta-tags.spec.ts`):
```typescript
test.describe('SEO Meta Tags', () => {
  test('homepage has all required meta tags', async ({ page }) => {
    await page.goto('/')

    // Check Open Graph
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Svelte Society/)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image/)

    // Check Twitter Card
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')

    // Check canonical
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sveltesociety.dev/')
  })

  test('content pages have structured data', async ({ page }) => {
    await page.goto('/recipe/form-validation')

    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent()
    const schema = JSON.parse(jsonLd)

    expect(schema['@type']).toBe('TechArticle')
    expect(schema.headline).toBeTruthy()
  })

  test('og:image URLs return 200', async ({ request }) => {
    const response = await request.get('/og-image/test-content')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('image/png')
  })
})
```

### Manual Testing Checklist
- [ ] **robots.txt validator** - http://www.robotstxt.org/validator.html
- [ ] **Sitemap validator** - https://www.xml-sitemaps.com/validate-xml-sitemap.html
- [ ] **Google Rich Results Test** - https://search.google.com/test/rich-results
- [ ] **Facebook Sharing Debugger** - https://developers.facebook.com/tools/debug/
- [ ] **Twitter Card Validator** - https://cards-dev.twitter.com/validator
- [ ] **LinkedIn Post Inspector** - https://www.linkedin.com/post-inspector/
- [ ] **Google Search Console** - Verify sitemap submitted
- [ ] **Lighthouse SEO Audit** - Score ≥95
- [ ] **Schema.org Validator** - https://validator.schema.org/

### Sample URLs to Test
- Homepage: `https://sveltesociety.dev/`
- Video: `https://sveltesociety.dev/video/[any-slug]`
- Recipe: `https://sveltesociety.dev/recipe/[any-slug]`
- Library: `https://sveltesociety.dev/library/[any-slug]`
- Collection: `https://sveltesociety.dev/collection/[any-slug]`
- Category: `https://sveltesociety.dev/recipe`
- Static: `https://sveltesociety.dev/about`

---

## Performance Considerations

### Caching Strategy
1. **Sitemap** - Cache for 1 hour (CDN + in-memory)
2. **OG Images** - Cache indefinitely (immutable once generated)
3. **Structured Data** - No caching needed (server-rendered)
4. **robots.txt** - Cache for 24 hours

### Image Optimization
- Use existing wsrv.nl infrastructure
- OG images: 1200x630px, JPEG, 90% quality
- Serve WebP for browsers that support it
- Implement lazy loading for below-fold images

### Database Queries
- Sitemap generation should use indexed queries
- Cache content list for sitemap generation
- Consider background job for large sitemaps (>10k URLs)

---

## Security Considerations

### robots.txt
- Do not expose sensitive routes
- Block `/admin/*`, `/api/*`, `/saved`, `/login`
- Allow search engines on public content only

### OG Image Generation
- Sanitize slug input to prevent injection
- Rate limit image generation endpoint (10 req/min per IP)
- Validate content exists before generating image
- Limit image generation to published content only

### Structured Data
- Escape user-generated content in JSON-LD
- Validate schema data types
- Do not include sensitive user information

---

## Monitoring and Maintenance

### Search Console Monitoring
- Weekly review of crawl errors
- Monitor sitemap indexing status
- Track search appearance (clicks, impressions)
- Monitor Core Web Vitals

### Ongoing Tasks
- Update sitemap when content published
- Regenerate OG images if template changes
- Monitor structured data errors
- Keep Svead library updated

### Alerts
- Drop in Lighthouse SEO score below 90
- Sitemap returns 404 or errors
- OG image generation failures >5% rate
- Schema validation errors in Search Console

---

## Documentation Requirements

### Developer Documentation
1. **SEO Implementation Guide** (`docs/SEO.md`)
   - How to add meta tags to new pages
   - How schema generators work
   - OG image generation process
   - Testing checklist

2. **Update `tests/README.md`**
   - Document new SEO tests
   - Add to coverage matrix

### User-Facing Documentation
None required (technical implementation)

---

## Success Criteria (Definition of Done)

### Technical Checklist
- [ ] robots.txt accessible and valid
- [ ] sitemap.xml accessible and valid
- [ ] Sitemap submitted to Google Search Console
- [ ] All pages have complete Open Graph tags
- [ ] All pages have Twitter Card tags
- [ ] All pages have canonical URLs
- [ ] OG images generate for all content types
- [ ] Fallback OG image exists
- [ ] Organization schema on homepage
- [ ] WebSite schema with SearchAction
- [ ] Content-type specific schemas on detail pages
- [ ] BreadcrumbList on all content pages
- [ ] All schemas pass Google Rich Results Test
- [ ] All pages use Svead (no raw `<svelte:head>`)
- [ ] Resource hints added to app.html
- [ ] Image lazy loading implemented
- [ ] Playwright tests for SEO pass
- [ ] Lighthouse SEO score ≥95

### Validation Checklist
- [ ] Facebook Sharing Debugger passes (no errors)
- [ ] Twitter Card Validator passes
- [ ] LinkedIn Post Inspector shows correct preview
- [ ] Google Rich Results Test shows valid structured data
- [ ] robots.txt validator passes
- [ ] Sitemap XML validator passes
- [ ] No schema errors in Search Console (after indexing)

### Performance Checklist
- [ ] OG image generation <500ms
- [ ] Sitemap generation <2s
- [ ] No LCP regression from new meta tags
- [ ] Image lazy loading improves CLS score
- [ ] Core Web Vitals remain in "Good" range

---

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| OG image generation too slow | High | Medium | Implement background job + cache, use simple template |
| Sitemap too large (>50k URLs) | Medium | Low | Implement sitemap index, paginate |
| Schema validation errors | Medium | Medium | Use schema generators, validate before commit |
| Breaking existing functionality | High | Low | Comprehensive testing, gradual rollout |
| Twitter Card not rendering | Medium | Low | Use fallback to summary card, validate early |
| Svead library bugs | High | Low | Test thoroughly, have fallback to basic meta |

---

## Future Enhancements (Not in Scope)

1. **Multilingual SEO** - hreflang tags for internationalization
2. **AMP Pages** - Accelerated Mobile Pages for content
3. **News Sitemap** - If content categorized as news
4. **Video Sitemap** - Enhanced video SEO
5. **Advanced Analytics** - Search query tracking, position monitoring
6. **A/B Testing** - Test different meta descriptions, titles
7. **Dynamic OG Image Styles** - Multiple templates per content type
8. **Social Media Auto-Posting** - Auto-share new content

---

## Appendix

### A. Svead Configuration Example

```typescript
// In +page.server.ts
export const load = async ({ url, locals }) => {
  const content = await getContent()

  return {
    content,
    meta: {
      // Basic (already implemented)
      title: `${content.title} - Svelte Society`,
      description: content.description,
      url: url.toString(),

      // New additions
      image: `/og-image/${content.slug}`,
      imageAlt: content.title,
      imageWidth: 1200,
      imageHeight: 630,
      type: 'article', // or 'website', 'video.other'
      siteName: 'Svelte Society',

      // Twitter specific
      twitter: {
        card: 'summary_large_image',
        site: '@sveltesociety',
        creator: content.author?.twitter || '@sveltesociety'
      },

      // Article specific (for content pages)
      article: {
        publishedTime: content.created_at,
        modifiedTime: content.updated_at,
        author: content.author?.name,
        tags: content.tags
      }
    }
  }
}
```

### B. wsrv.nl OG Image URLs

For simple OG images using existing thumbnails:

```typescript
// For video content with YouTube thumbnail
const ogImage = `https://images.wsrv.nl/?url=${encodeURIComponent(thumbnailUrl)}&w=1200&h=630&fit=cover&output=jpg&q=90`

// For library content with GitHub social image
const ogImage = content.ogImage
  ? `https://images.wsrv.nl/?url=${encodeURIComponent(content.ogImage)}&w=1200&h=630&fit=cover&output=jpg&q=90`
  : '/og-default.png'
```

### C. Priority Pages for Manual Testing

**Critical Path:**
1. Homepage - https://sveltesociety.dev/
2. Popular recipe - https://sveltesociety.dev/recipe/[popular-slug]
3. Popular video - https://sveltesociety.dev/video/[popular-slug]
4. Popular library - https://sveltesociety.dev/library/[popular-slug]
5. Collection page - https://sveltesociety.dev/collection/[slug]

**Test on Share Platforms:**
- Facebook (personal profile post)
- Twitter/X (tweet with link)
- LinkedIn (company page post)
- Discord (any channel)
- Slack (any channel)

### D. Google Search Console Setup

1. **Verify Domain Ownership**
   - Add DNS TXT record or HTML file verification

2. **Submit Sitemap**
   - Add `https://sveltesociety.dev/sitemap.xml`

3. **Request Indexing** (Optional)
   - Request indexing for critical pages

4. **Monitor Coverage**
   - Check for crawl errors weekly
   - Review index coverage report

### E. Useful Resources

- **Svead Documentation:** https://github.com/josephspurrier/svead
- **Open Graph Protocol:** https://ogp.me/
- **Twitter Card Docs:** https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- **Schema.org Docs:** https://schema.org/docs/schemas.html
- **Google SEO Starter Guide:** https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- **Satori (OG Images):** https://github.com/vercel/satori

---

## Sign-off

This PRD should be reviewed and approved by:
- [ ] Tech Lead
- [ ] Product Owner
- [ ] DevOps (for deployment considerations)

**Prepared by:** Claude (AI Assistant)
**Date:** 2025-10-31
**Version:** 1.0
