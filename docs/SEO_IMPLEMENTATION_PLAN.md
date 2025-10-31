# SEO Implementation Plan - Phased Approach

**Strategy:** Small, incremental phases that can be implemented, tested, and committed independently.
**Goal:** Each phase is shippable and adds value on its own.

---

## Overview

Total: **12 phases** across **5-7 days**

Each phase:
- ✅ Takes 1-4 hours
- ✅ Has clear acceptance criteria
- ✅ Can be tested independently
- ✅ Can be committed to git
- ✅ Adds visible value

---

## Phase 1: SEO Configuration Foundation (1 hour)

**Goal:** Create centralized SEO constants and utilities

### Tasks
1. Create `/src/lib/seo/config.ts`
2. Define all SEO constants (site name, URLs, defaults)
3. Create `/src/lib/seo/utils.ts` for helper functions
4. Add TypeScript types for SEO config

### Deliverables
```typescript
// src/lib/seo/config.ts
export const SEO_CONFIG = {
  siteName: 'Svelte Society',
  siteUrl: 'https://sveltesociety.dev',
  // ... all constants
}

// src/lib/seo/utils.ts
export function formatMetaDescription(text: string, maxLength = 160): string
export function sanitizeTitle(title: string): string
```

### Testing
- [ ] Import config in any file works
- [ ] TypeScript types are correct
- [ ] No runtime errors

### Acceptance Criteria
- [ ] Config file exists with all constants
- [ ] Utils file exists with helper functions
- [ ] TypeScript builds without errors
- [ ] Can be imported and used

**Commit:** "Add SEO configuration and utilities foundation"

---

## Phase 2: robots.txt Implementation (1.5 hours)

**Goal:** Allow search engines to crawl properly

### Tasks
1. Create `/src/routes/robots.txt/+server.ts`
2. Implement GET handler
3. Define allowed/disallowed paths
4. Add sitemap reference
5. Set proper headers and caching

### Deliverables
```typescript
// Returns text/plain with proper robots directives
// Caches for 24 hours
// Disallows /admin, /api, /saved, /login
// References sitemap.xml
```

### Testing
- [ ] Visit `/robots.txt` in browser
- [ ] Verify content-type is `text/plain`
- [ ] Check cache headers present
- [ ] Validate with http://www.robotstxt.org/validator.html
- [ ] Verify all paths are correct

### Acceptance Criteria
- [ ] `/robots.txt` returns 200
- [ ] Content is valid robots.txt format
- [ ] Admin/API routes are disallowed
- [ ] Sitemap URL is included
- [ ] Cache headers set to 24 hours
- [ ] Passes online validator

**Commit:** "Add robots.txt endpoint for search engine crawling"

---

## Phase 3: Sitemap Foundation (2 hours)

**Goal:** Basic sitemap with static pages

### Tasks
1. Create `/src/routes/sitemap.xml/+server.ts`
2. Implement XML generation helper
3. Add static pages (home, about, terms, privacy)
4. Set proper headers and caching
5. Add category pages (recipe, video, library, collection, announcement)

### Deliverables
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static and category pages -->
</urlset>
```

### Testing
- [ ] Visit `/sitemap.xml` in browser
- [ ] Verify content-type is `application/xml`
- [ ] Check XML is well-formed
- [ ] Validate with https://www.xml-sitemaps.com/validate-xml-sitemap.html
- [ ] Verify all static URLs included

### Acceptance Criteria
- [ ] `/sitemap.xml` returns 200
- [ ] Valid XML format
- [ ] Includes ~10 static/category URLs
- [ ] Has lastmod, priority, changefreq
- [ ] Cache headers set to 1 hour
- [ ] Passes XML validator

**Commit:** "Add sitemap.xml with static and category pages"

---

## Phase 4: Sitemap Dynamic Content (2 hours)

**Goal:** Add all published content to sitemap

### Tasks
1. Query all published content from database
2. Add content URLs to sitemap
3. Use `updated_at` for lastmod dates
4. Set priorities based on content type
5. Optimize query performance

### Deliverables
```typescript
// Queries: recipes, videos, libraries, collections, announcements
// Adds ~hundreds of URLs to sitemap
// Uses proper priorities (0.8-0.9)
```

### Testing
- [ ] Visit `/sitemap.xml` and check content count
- [ ] Verify recipe URLs included
- [ ] Verify video URLs included
- [ ] Verify library URLs included
- [ ] Check lastmod dates are correct
- [ ] Test with empty database (should not error)
- [ ] Measure generation time (<2s)

### Acceptance Criteria
- [ ] All published content appears in sitemap
- [ ] URLs are correctly formatted
- [ ] Dates are ISO 8601 format
- [ ] Priorities are appropriate
- [ ] Generation time <2 seconds
- [ ] Handles edge cases (no content, new types)

**Commit:** "Add dynamic content to sitemap.xml"

---

## Phase 5: Resource Hints (15 min)

**Goal:** Optimize external resource loading

### Tasks
1. Update `/src/app.html`
2. Add preconnect for wsrv.nl image CDN
3. Add dns-prefetch for Umami analytics
4. Add dns-prefetch for YouTube (if used)

### Deliverables
```html
<link rel="preconnect" href="https://images.wsrv.nl" crossorigin>
<link rel="dns-prefetch" href="https://umami.sveltesociety.dev">
```

### Testing
- [ ] View page source, verify hints present
- [ ] Check Chrome DevTools → Network → Timing
- [ ] Verify connection time improved

### Acceptance Criteria
- [ ] Resource hints in `<head>`
- [ ] Preconnect to image CDN
- [ ] DNS prefetch for analytics
- [ ] No console errors

**Commit:** "Add resource hints for external services"

---

## Phase 6: Enhanced Meta Configuration (3 hours)

**Goal:** Extend Svead config to support full OG/Twitter tags

### Tasks
1. Research Svead's full configuration options
2. Create TypeScript type for extended meta config
3. Update layout to pass extended config to Svead
4. Update 1-2 sample pages with full meta
5. Verify Svead renders all tags

### Deliverables
```typescript
// Type definition for extended meta
interface ExtendedMeta {
  title: string
  description: string
  url: string
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  type?: string
  siteName?: string
  locale?: string
  twitter?: {
    card: string
    site: string
    creator?: string
  }
  article?: {
    publishedTime?: string
    modifiedTime?: string
    author?: string
  }
}
```

### Testing
- [ ] Update homepage meta config
- [ ] Update one recipe page meta config
- [ ] View page source, check for OG tags
- [ ] Verify all fields render correctly
- [ ] Test with missing optional fields

### Acceptance Criteria
- [ ] Type definition complete
- [ ] Layout accepts extended config
- [ ] Svead renders OG tags
- [ ] Svead renders Twitter tags
- [ ] Sample pages have full meta
- [ ] No TypeScript errors

**Commit:** "Extend Svead configuration for OG and Twitter tags"

---

## Phase 7: Homepage Meta Tags (1 hour)

**Goal:** Complete meta tags for homepage

### Tasks
1. Update `/src/routes/(app)/(public)/+page.server.ts`
2. Add full OG tags (title, description, image, type)
3. Add Twitter Card tags
4. Add canonical URL
5. Use default OG image (create placeholder if needed)

### Deliverables
```typescript
meta: {
  title: 'Svelte Society - Community of Svelte Developers',
  description: '...',
  url: 'https://sveltesociety.dev/',
  image: '/og-default.png',
  type: 'website',
  // ... full config
}
```

### Testing
- [ ] Visit homepage
- [ ] View page source, verify all meta tags
- [ ] Test with Facebook Sharing Debugger
- [ ] Test with Twitter Card Validator
- [ ] Verify canonical URL present

### Acceptance Criteria
- [ ] Homepage has all OG tags
- [ ] Homepage has Twitter Card tags
- [ ] Homepage has canonical URL
- [ ] Facebook Sharing Debugger passes (may show missing image)
- [ ] Twitter Card Validator shows correct card type

**Commit:** "Add complete meta tags to homepage"

---

## Phase 8: Content Detail Pages Meta Tags (3 hours)

**Goal:** Add full meta tags to all content detail pages

### Tasks
1. Update `/src/routes/(app)/(public)/[type]/[slug]/+page.server.ts`
2. Add full OG tags based on content
3. Determine `og:type` by content type (article vs video.other)
4. Add Twitter Card tags
5. Add canonical URL
6. Handle missing descriptions gracefully

### Deliverables
```typescript
// Dynamic meta based on content
meta: {
  title: `${content.title} - Svelte Society`,
  description: content.description || generateDescription(content),
  url: url.toString(),
  image: `/og-image/${content.slug}`, // placeholder for now
  type: content.type === 'video' ? 'video.other' : 'article',
  // ... twitter, article fields
}
```

### Testing
- [ ] Test recipe detail page
- [ ] Test video detail page
- [ ] Test library detail page
- [ ] Test collection detail page
- [ ] Test announcement detail page
- [ ] View source, verify meta tags
- [ ] Test with content that has no description
- [ ] Test Facebook Sharing Debugger
- [ ] Test Twitter Card Validator

### Acceptance Criteria
- [ ] All content types have full meta tags
- [ ] OG type is correct (article/video.other)
- [ ] Twitter Card tags present
- [ ] Canonical URLs correct
- [ ] Handles missing data gracefully
- [ ] At least 3 pages tested manually

**Commit:** "Add complete meta tags to content detail pages"

---

## Phase 9: Category & Static Pages Meta Tags (2 hours)

**Goal:** Complete meta tags for category and static pages

### Tasks
1. Update `/src/routes/(app)/(public)/[...type]/+page.server.ts` (categories)
2. Create/update `/src/routes/(app)/(public)/about/+page.server.ts`
3. Verify terms and privacy pages have meta
4. Update saved page if needed
5. Convert user profile page to use Svead (from `<svelte:head>`)

### Deliverables
```typescript
// Category pages: /recipe, /video, etc.
// Static pages: /about, /terms, /privacy
// All use Svead with full config
```

### Testing
- [ ] Test `/recipe` category page
- [ ] Test `/video` category page
- [ ] Test `/library` category page
- [ ] Test `/about` page
- [ ] Test `/terms` page
- [ ] Test `/privacy` page
- [ ] Test user profile page
- [ ] Verify no pages still use `<svelte:head>` for SEO

### Acceptance Criteria
- [ ] All category pages have meta tags
- [ ] About page has meta tags
- [ ] Static pages have meta tags
- [ ] User profile uses Svead
- [ ] No raw `<svelte:head>` for meta tags
- [ ] Facebook Sharing Debugger passes for sample pages

**Commit:** "Add complete meta tags to category and static pages"

---

## Phase 10: Default OG Image (1 hour)

**Goal:** Create fallback OG image for pages

### Tasks
1. Design simple 1200x630px default OG image
2. Include Svelte Society branding
3. Save as `/static/og-default.png`
4. Optimize file size (<200KB)
5. Update all pages to use default if no custom image

### Deliverables
- Static file: `/static/og-default.png`
- All pages reference default image

### Testing
- [ ] Verify image exists at `/og-default.png`
- [ ] Check dimensions (1200x630px)
- [ ] Test in Facebook Sharing Debugger
- [ ] Test in Twitter Card Validator
- [ ] Verify file size reasonable

### Acceptance Criteria
- [ ] Default OG image exists
- [ ] Correct dimensions (1200x630)
- [ ] File size <200KB
- [ ] All pages use default if no custom image
- [ ] Social previews show image

**Commit:** "Add default OG image for social sharing"

---

## Phase 11: Dynamic OG Image Generation - Setup (3 hours)

**Goal:** Set up infrastructure for generating OG images

### Tasks
1. Choose implementation (recommend: `@vercel/og` or `satori`)
2. Install dependencies: `bun add @vercel/og` (or `satori sharp`)
3. Create `/src/routes/og-image/[slug]/+server.ts`
4. Implement basic template
5. Test with sample content

### Deliverables
```typescript
// GET /og-image/[slug]
// Returns PNG image (1200x630)
// Branded template with content title
```

### Testing
- [ ] Visit `/og-image/test-slug` in browser
- [ ] Verify PNG image renders
- [ ] Check dimensions (1200x630)
- [ ] Test with long title
- [ ] Test with missing content (fallback)
- [ ] Measure generation time (<500ms target)

### Acceptance Criteria
- [ ] Endpoint returns valid PNG
- [ ] Image has correct dimensions
- [ ] Branding is visible
- [ ] Content title displays
- [ ] Handles missing content gracefully
- [ ] Generation time <500ms (or cached)

**Commit:** "Add dynamic OG image generation endpoint"

---

## Phase 12: Dynamic OG Image Generation - Integration (2 hours)

**Goal:** Connect OG images to content pages

### Tasks
1. Update meta configs to use `/og-image/[slug]` URLs
2. Implement caching for generated images
3. Add rate limiting (optional but recommended)
4. Test across different content types
5. Update homepage to use custom OG image if desired

### Deliverables
```typescript
// All content pages now use:
// image: `/og-image/${content.slug}`
```

### Testing
- [ ] Test recipe page OG image
- [ ] Test video page OG image
- [ ] Test library page OG image
- [ ] Facebook Sharing Debugger shows custom image
- [ ] Twitter Card Validator shows custom image
- [ ] Test caching (second load is fast)
- [ ] Test rate limiting if implemented

### Acceptance Criteria
- [ ] All content pages use dynamic OG images
- [ ] Images generate successfully
- [ ] Caching works
- [ ] Facebook shows custom images
- [ ] Twitter shows custom images
- [ ] Performance acceptable

**Commit:** "Connect dynamic OG images to content pages"

---

## Phase 13: Schema.org Infrastructure (2 hours)

**Goal:** Set up schema generators

### Tasks
1. Create `/src/lib/seo/schema/` directory
2. Create `index.ts` with type definitions
3. Create `organization.ts` generator
4. Create `website.ts` generator
5. Create schema rendering component/helper

### Deliverables
```typescript
// src/lib/seo/schema/organization.ts
export function generateOrganizationSchema(): object

// src/lib/seo/schema/website.ts
export function generateWebSiteSchema(): object

// Component or helper to render JSON-LD
```

### Testing
- [ ] Import schema generators
- [ ] Generate Organization schema
- [ ] Generate WebSite schema
- [ ] Validate JSON output
- [ ] Test with Google Rich Results Test

### Acceptance Criteria
- [ ] Schema generators exist
- [ ] Return valid JSON-LD objects
- [ ] TypeScript types correct
- [ ] Can be imported and used
- [ ] Pass Rich Results Test validation

**Commit:** "Add Schema.org infrastructure and base generators"

---

## Phase 14: Homepage Schema (1 hour)

**Goal:** Add Organization and WebSite schema to homepage

### Tasks
1. Update homepage to include schemas
2. Add Organization schema
3. Add WebSite schema with SearchAction
4. Render as JSON-LD in page
5. Test and validate

### Deliverables
```svelte
<!-- Homepage -->
<svelte:head>
  <script type="application/ld+json">
    {JSON.stringify([organizationSchema, websiteSchema])}
  </script>
</svelte:head>
```

### Testing
- [ ] View homepage source
- [ ] Verify JSON-LD present
- [ ] Check schema is valid JSON
- [ ] Test with Google Rich Results Test
- [ ] Verify SearchAction is correct

### Acceptance Criteria
- [ ] Homepage has both schemas
- [ ] JSON-LD is valid
- [ ] Rich Results Test passes
- [ ] No console errors
- [ ] SearchAction URL template correct

**Commit:** "Add Organization and WebSite schema to homepage"

---

## Phase 15: Content Schema Generators (3 hours)

**Goal:** Create schema generators for all content types

### Tasks
1. Create `article.ts` for recipes/libraries (TechArticle)
2. Create `video.ts` for videos (VideoObject)
3. Create `software.ts` for libraries (SoftwareSourceCode)
4. Create `breadcrumb.ts` for all pages (BreadcrumbList)
5. Test each generator with sample data

### Deliverables
```typescript
// src/lib/seo/schema/article.ts
export function generateArticleSchema(content, url): object

// src/lib/seo/schema/video.ts
export function generateVideoSchema(content, url): object

// src/lib/seo/schema/software.ts
export function generateSoftwareSchema(content, url): object

// src/lib/seo/schema/breadcrumb.ts
export function generateBreadcrumbSchema(items): object
```

### Testing
- [ ] Test each generator with sample content
- [ ] Validate JSON output
- [ ] Check all required fields present
- [ ] Test with Google Rich Results Test
- [ ] Verify dates are ISO 8601 format

### Acceptance Criteria
- [ ] All content schema generators exist
- [ ] Return valid JSON-LD objects
- [ ] Include all required fields
- [ ] Pass Rich Results Test
- [ ] Handle missing optional fields

**Commit:** "Add content schema generators for all types"

---

## Phase 16: Recipe/Library Schema Integration (2 hours)

**Goal:** Add schemas to recipe and library pages

### Tasks
1. Update recipe detail page to include TechArticle schema
2. Update library detail page to include SoftwareSourceCode schema
3. Add BreadcrumbList to both
4. Test and validate

### Deliverables
```svelte
<!-- Recipe/Library pages -->
<svelte:head>
  <script type="application/ld+json">
    {JSON.stringify([articleSchema, breadcrumbSchema])}
  </script>
</svelte:head>
```

### Testing
- [ ] Test recipe page with Rich Results Test
- [ ] Test library page with Rich Results Test
- [ ] Verify breadcrumbs appear correctly
- [ ] Check all schema fields populated
- [ ] Test with multiple sample pages

### Acceptance Criteria
- [ ] Recipe pages have TechArticle schema
- [ ] Library pages have SoftwareSourceCode schema
- [ ] Both have BreadcrumbList
- [ ] Rich Results Test passes
- [ ] Breadcrumbs display correctly

**Commit:** "Add schema to recipe and library pages"

---

## Phase 17: Video Schema Integration (1.5 hours)

**Goal:** Add VideoObject schema to video pages

### Tasks
1. Update video detail page to include VideoObject schema
2. Add BreadcrumbList
3. Include YouTube metadata (thumbnail, embedUrl, etc.)
4. Test and validate

### Deliverables
```svelte
<!-- Video pages -->
<svelte:head>
  <script type="application/ld+json">
    {JSON.stringify([videoSchema, breadcrumbSchema])}
  </script>
</svelte:head>
```

### Testing
- [ ] Test video page with Rich Results Test
- [ ] Verify video-specific fields present
- [ ] Check thumbnail URL
- [ ] Test breadcrumbs
- [ ] Test with multiple video pages

### Acceptance Criteria
- [ ] Video pages have VideoObject schema
- [ ] Includes BreadcrumbList
- [ ] All video fields populated
- [ ] Rich Results Test passes
- [ ] Thumbnail and URLs correct

**Commit:** "Add VideoObject schema to video pages"

---

## Phase 18: Collection/Announcement Schema (1 hour)

**Goal:** Add appropriate schema to remaining content types

### Tasks
1. Decide schema type for collections (Article or ItemList)
2. Add schema to collection pages
3. Add schema to announcement pages
4. Include BreadcrumbList
5. Test and validate

### Deliverables
- Schemas for collections and announcements
- BreadcrumbList on all pages

### Testing
- [ ] Test collection page
- [ ] Test announcement page
- [ ] Rich Results Test validation
- [ ] Verify breadcrumbs

### Acceptance Criteria
- [ ] Collections have appropriate schema
- [ ] Announcements have appropriate schema
- [ ] BreadcrumbList present
- [ ] Rich Results Test passes

**Commit:** "Add schema to collection and announcement pages"

---

## Phase 19: Image Optimization (2 hours)

**Goal:** Optimize images for performance

### Tasks
1. Add `loading="lazy"` to below-fold images
2. Add `decoding="async"` to all images
3. Add `fetchpriority="high"` to hero images
4. Audit all image components
5. Test performance impact

### Deliverables
```svelte
<!-- Below fold images -->
<img src="..." loading="lazy" decoding="async" ... />

<!-- Hero images -->
<img src="..." fetchpriority="high" decoding="async" ... />
```

### Testing
- [ ] Test homepage with DevTools
- [ ] Check LCP (Largest Contentful Paint)
- [ ] Verify lazy loading working
- [ ] Test CLS (Cumulative Layout Shift)
- [ ] Run Lighthouse audit

### Acceptance Criteria
- [ ] Below-fold images have lazy loading
- [ ] All images have async decoding
- [ ] Hero images have high priority
- [ ] No CLS regression
- [ ] Lighthouse performance maintained/improved

**Commit:** "Optimize image loading for performance"

---

## Phase 20: E2E Tests for SEO (3 hours)

**Goal:** Add automated tests for SEO implementation

### Tasks
1. Create `/tests/e2e/seo/meta-tags.spec.ts`
2. Test homepage meta tags
3. Test content page meta tags
4. Test OG image URLs return 200
5. Test structured data presence
6. Add to CI pipeline

### Deliverables
```typescript
// tests/e2e/seo/meta-tags.spec.ts
test.describe('SEO Meta Tags', () => {
  test('homepage has all required meta tags', ...)
  test('content pages have OG tags', ...)
  test('og:image URLs return 200', ...)
  test('content pages have structured data', ...)
})
```

### Testing
- [ ] Run tests locally: `bun run test:integration tests/e2e/seo`
- [ ] Verify all tests pass
- [ ] Test in CI pipeline
- [ ] Check coverage

### Acceptance Criteria
- [ ] SEO test file exists
- [ ] Tests cover homepage
- [ ] Tests cover content pages
- [ ] Tests verify OG images
- [ ] Tests verify structured data
- [ ] All tests pass
- [ ] Tests run in CI

**Commit:** "Add E2E tests for SEO meta tags and structured data"

---

## Phase 21: Manual Validation (2 hours)

**Goal:** Manually validate all SEO implementations

### Tasks
1. Test robots.txt validator
2. Test sitemap.xml validator
3. Test Facebook Sharing Debugger (5+ pages)
4. Test Twitter Card Validator (5+ pages)
5. Test Google Rich Results Test (5+ pages)
6. Run Lighthouse SEO audit
7. Document any issues

### Testing Checklist
- [ ] robots.txt validator passes
- [ ] Sitemap validator passes
- [ ] Facebook Sharing Debugger: homepage
- [ ] Facebook Sharing Debugger: recipe page
- [ ] Facebook Sharing Debugger: video page
- [ ] Facebook Sharing Debugger: library page
- [ ] Facebook Sharing Debugger: collection page
- [ ] Twitter Card Validator: homepage
- [ ] Twitter Card Validator: content pages (3+)
- [ ] Rich Results Test: homepage
- [ ] Rich Results Test: recipe page
- [ ] Rich Results Test: video page
- [ ] Rich Results Test: library page
- [ ] Lighthouse SEO score ≥95

### Deliverables
- Validation report with screenshots
- List of any issues found
- Fixes for issues (if any)

### Acceptance Criteria
- [ ] All validators pass
- [ ] Facebook previews look correct
- [ ] Twitter cards display properly
- [ ] Rich results show correctly
- [ ] Lighthouse score ≥95
- [ ] No critical issues

**Commit:** "Validate SEO implementation across all tools"

---

## Phase 22: Documentation Updates (1 hour)

**Goal:** Update project documentation

### Tasks
1. Update `tests/README.md` with SEO test coverage
2. Create/update `docs/SEO.md` with maintenance guide
3. Update main `README.md` if needed
4. Add SEO section to contributing guide (if exists)
5. Document any deviations from PRD

### Deliverables
- Updated documentation
- Developer guide for maintaining SEO
- Testing documentation

### Acceptance Criteria
- [ ] tests/README.md updated
- [ ] SEO developer guide exists
- [ ] All docs accurate
- [ ] Easy to understand for new developers

**Commit:** "Update documentation for SEO implementation"

---

## Phase 23: Google Search Console Setup (30 min)

**Goal:** Submit sitemap to Google

### Tasks
1. Verify domain ownership in Google Search Console
2. Submit sitemap URL
3. Request indexing for key pages (optional)
4. Set up weekly email reports
5. Document process

### Deliverables
- Google Search Console configured
- Sitemap submitted
- Documentation of setup

### Acceptance Criteria
- [ ] Domain verified
- [ ] Sitemap submitted and processing
- [ ] Key pages indexed (or requested)
- [ ] Monitoring set up

**Note:** This phase happens after deployment to production

---

## Phase 24: Final Polish & Review (2 hours)

**Goal:** Final checks before marking complete

### Tasks
1. Review all commits
2. Test full user journey (homepage → content → social share)
3. Run full test suite
4. Check all acceptance criteria from PRD
5. Performance check (Core Web Vitals)
6. Create summary report

### Testing
- [ ] All Playwright tests pass
- [ ] Lighthouse SEO ≥95
- [ ] No console errors
- [ ] All meta tags present
- [ ] All schemas valid
- [ ] OG images working
- [ ] Performance acceptable

### Deliverables
- Final validation report
- Performance metrics
- Summary of implementation

### Acceptance Criteria
- [ ] All P0 features complete
- [ ] All tests pass
- [ ] All acceptance criteria met
- [ ] Performance targets met
- [ ] Ready for production

**Commit:** "SEO implementation complete - ready for launch"

---

## Progress Tracking

Use this section to track overall progress:

### Week 1
- [ ] Phase 1: SEO Config (1h)
- [ ] Phase 2: robots.txt (1.5h)
- [ ] Phase 3: Sitemap Foundation (2h)
- [ ] Phase 4: Sitemap Dynamic (2h)
- [ ] Phase 5: Resource Hints (0.25h)
- [ ] Phase 6: Enhanced Meta Config (3h)
- [ ] Phase 7: Homepage Meta (1h)
- [ ] Phase 8: Content Meta (3h)
- [ ] Phase 9: Category/Static Meta (2h)
- [ ] Phase 10: Default OG Image (1h)

**Day 1-3 Total: ~16.75 hours**

### Week 2
- [ ] Phase 11: OG Image Setup (3h)
- [ ] Phase 12: OG Image Integration (2h)
- [ ] Phase 13: Schema Infrastructure (2h)
- [ ] Phase 14: Homepage Schema (1h)
- [ ] Phase 15: Content Schema Generators (3h)
- [ ] Phase 16: Recipe/Library Schema (2h)
- [ ] Phase 17: Video Schema (1.5h)
- [ ] Phase 18: Collection/Announcement Schema (1h)
- [ ] Phase 19: Image Optimization (2h)

**Day 4-5 Total: ~17.5 hours**

### Week 3 (Testing & Launch)
- [ ] Phase 20: E2E Tests (3h)
- [ ] Phase 21: Manual Validation (2h)
- [ ] Phase 22: Documentation (1h)
- [ ] Phase 23: Search Console (0.5h)
- [ ] Phase 24: Final Polish (2h)

**Day 6-7 Total: ~8.5 hours**

---

## Total Estimated Time

**42.75 hours** = **5-6 days** for 1 developer

**Can be completed in 3-4 days with 2 developers:**
- Developer 1: Phases 1-10 (meta tags focus)
- Developer 2: Phases 11-18 (images & schema focus)
- Both: Phases 19-24 (testing & polish)

---

## Risk Mitigation

### If Timeline Slips
**Priority order:**
1. Phases 1-5 (robots, sitemap, hints) - **Critical**
2. Phases 6-9 (meta tags) - **Critical**
3. Phase 10 (default OG image) - **Critical**
4. Phases 13-18 (schema) - **High Priority**
5. Phases 11-12 (dynamic OG images) - **Can use default images initially**
6. Phase 19 (image optimization) - **Post-launch OK**

### If Issues Arise
- Each phase is independent
- Can skip dynamic OG images and use default
- Can add schema types post-launch
- Core SEO (robots, sitemap, meta) is non-negotiable

---

## Success Criteria (Final)

Before marking SEO complete:

### Technical
- [x] robots.txt accessible and valid
- [x] sitemap.xml accessible with all content
- [x] All pages have Open Graph tags
- [x] All pages have Twitter Card tags
- [x] All pages have canonical URLs
- [x] OG images working (default or dynamic)
- [x] All major schemas implemented
- [x] Resource hints in place
- [x] E2E tests pass
- [x] Lighthouse SEO ≥95

### Validation
- [x] robots.txt validator passes
- [x] Sitemap validator passes
- [x] Facebook Sharing Debugger passes (5+ pages)
- [x] Twitter Card Validator passes (5+ pages)
- [x] Google Rich Results Test passes (5+ pages)

### Performance
- [x] OG image generation <500ms (or cached)
- [x] Sitemap generation <2s
- [x] No LCP regression
- [x] Core Web Vitals in "Good" range

---

**Ready to start? Begin with Phase 1!**
