# SEO Implementation Checklist

**Target Completion:** Before Production Launch
**Estimated Effort:** 5-7 days

Use this checklist to track progress on SEO implementation. Check off items as completed.

---

## Phase 1: Foundation (Day 1) - 6-8 hours

### robots.txt Implementation

- [ ] Create `/src/routes/robots.txt/+server.ts`
- [ ] Allow all public content routes
- [ ] Disallow `/admin/*`, `/api/*`, `/saved`, `/login`
- [ ] Include sitemap URL reference
- [ ] Test accessibility at `/robots.txt`
- [ ] Validate with http://www.robotstxt.org/validator.html
- [ ] Returns `text/plain` content type

### sitemap.xml Generation

- [ ] Create `/src/routes/sitemap.xml/+server.ts`
- [ ] Query all published content from database
- [ ] Include recipes, videos, libraries, collections, announcements
- [ ] Include static pages (home, about, terms, privacy)
- [ ] Add `lastmod` dates from `updated_at`
- [ ] Set priority values (homepage: 1.0, content: 0.8, etc.)
- [ ] Implement 1-hour caching
- [ ] Test accessibility at `/sitemap.xml`
- [ ] Validate with https://www.xml-sitemaps.com/validate-xml-sitemap.html
- [ ] Returns `application/xml` content type

### Resource Hints

- [ ] Add preconnect to `https://images.wsrv.nl` in `src/app.html`
- [ ] Add dns-prefetch for `https://umami.sveltesociety.dev`
- [ ] Test with Chrome DevTools Network tab

### SEO Config File

- [ ] Create `/src/lib/seo/config.ts`
- [ ] Define site constants (name, URL, description)
- [ ] Define default meta values
- [ ] Define OG image dimensions
- [ ] Define Twitter handle

---

## Phase 2: Meta Tags (Day 2) - 8-10 hours

### Svead Configuration Extension

- [ ] Update layout to pass extended meta config to Svead
- [ ] Configure OG tag support
- [ ] Configure Twitter Card support
- [ ] Add canonical URL support

### Homepage Meta Tags

- [ ] Add Open Graph tags
- [ ] Add Twitter Card tags
- [ ] Add canonical URL
- [ ] Test with Facebook Sharing Debugger
- [ ] Test with Twitter Card Validator

### Content Detail Pages

- [ ] Update `/[type]/[slug]/+page.server.ts` with full meta
- [ ] Add `og:image` field
- [ ] Add `og:type` field (article/video.other)
- [ ] Add `og:site_name`
- [ ] Add `twitter:card`, `twitter:site`, `twitter:image`
- [ ] Add canonical URL
- [ ] Test recipe page
- [ ] Test video page
- [ ] Test library page

### Category Pages

- [ ] Update `/[...type]/+page.server.ts` with full meta
- [ ] Add OG tags for category pages
- [ ] Add Twitter Card tags
- [ ] Add canonical URL
- [ ] Test `/recipe` page
- [ ] Test `/video` page
- [ ] Test `/library` page

### Static Pages

- [ ] Update `/about/+page.server.ts` (create if missing)
- [ ] Add meta tags to about page
- [ ] Update `/terms/+page.server.ts` meta
- [ ] Update `/privacy/+page.server.ts` meta

### User Profile Pages

- [ ] Convert `/user/[username]/+page.svelte` to use Svead
- [ ] Remove raw `<svelte:head>` usage
- [ ] Add complete OG tags
- [ ] Add Twitter Card tags
- [ ] Add canonical URL

### Collections & Announcements

- [ ] Verify collection pages have full meta
- [ ] Verify announcement pages have full meta

---

## Phase 3: OG Images (Day 3) - 6-8 hours

### OG Image Infrastructure

- [ ] Choose implementation approach (Satori/Vercel OG recommended)
- [ ] Install required dependencies
- [ ] Create `/src/routes/og-image/[slug]/+server.ts`
- [ ] Design branded template (1200x630px)
- [ ] Include Svelte Society branding
- [ ] Include content title
- [ ] Include content type badge
- [ ] Test image generation

### Fallback Images

- [ ] Create default OG image for pages without content
- [ ] Save to `/static/og-default.png`
- [ ] Ensure 1200x630px dimensions

### Integration

- [ ] Update meta configs to use `/og-image/[slug]` URLs
- [ ] Test video content OG images
- [ ] Test recipe content OG images
- [ ] Test library content OG images
- [ ] Test collection OG images

### Performance

- [ ] Implement caching for generated images
- [ ] Test generation time (<500ms target)
- [ ] Add rate limiting (10 req/min per IP)
- [ ] Handle generation errors gracefully

### Validation

- [ ] Test OG image URL returns 200
- [ ] Test OG image displays in Facebook Sharing Debugger
- [ ] Test OG image displays in Twitter Card Validator
- [ ] Test OG image displays in LinkedIn Post Inspector

---

## Phase 4: Structured Data (Day 4) - 8-10 hours

### Schema.org Infrastructure

- [ ] Create `/src/lib/seo/schema/` directory
- [ ] Create schema type definitions
- [ ] Create schema generator utilities

### Organization Schema (Homepage)

- [ ] Create `/src/lib/seo/schema/organization.ts`
- [ ] Implement Organization schema
- [ ] Add to homepage
- [ ] Validate with Google Rich Results Test

### WebSite Schema (Homepage)

- [ ] Create `/src/lib/seo/schema/website.ts`
- [ ] Implement WebSite schema with SearchAction
- [ ] Add to homepage
- [ ] Validate search action in Rich Results Test

### VideoObject Schema (Video Pages)

- [ ] Create `/src/lib/seo/schema/video.ts`
- [ ] Implement VideoObject schema
- [ ] Add to video detail pages
- [ ] Include thumbnailUrl, uploadDate, contentUrl
- [ ] Validate in Rich Results Test

### TechArticle Schema (Recipe Pages)

- [ ] Create `/src/lib/seo/schema/article.ts`
- [ ] Implement TechArticle schema
- [ ] Add to recipe detail pages
- [ ] Include author, datePublished, dateModified
- [ ] Validate in Rich Results Test

### SoftwareSourceCode Schema (Library Pages)

- [ ] Create `/src/lib/seo/schema/software.ts`
- [ ] Implement SoftwareSourceCode schema
- [ ] Add to library detail pages
- [ ] Include codeRepository, programmingLanguage
- [ ] Validate in Rich Results Test

### BreadcrumbList Schema (All Content Pages)

- [ ] Create `/src/lib/seo/schema/breadcrumb.ts`
- [ ] Implement BreadcrumbList schema generator
- [ ] Add to all content detail pages
- [ ] Test 3-level breadcrumb (Home > Category > Content)
- [ ] Validate in Rich Results Test

### Schema Rendering

- [ ] Create component to render JSON-LD
- [ ] Handle multiple schemas per page (array format)
- [ ] Ensure proper escaping of user content
- [ ] Test schema appears in page source

---

## Phase 5: Testing & Polish (Day 5) - 4-6 hours

### Playwright E2E Tests

- [ ] Create `/tests/e2e/seo/meta-tags.spec.ts`
- [ ] Test homepage has all required meta tags
- [ ] Test content pages have OG tags
- [ ] Test content pages have Twitter Cards
- [ ] Test content pages have canonical URLs
- [ ] Test content pages have structured data
- [ ] Test OG image URLs return 200
- [ ] Add to CI pipeline
- [ ] Update `tests/README.md` with SEO coverage

### Image Optimization

- [ ] Add `loading="lazy"` to below-fold images
- [ ] Add `decoding="async"` to all images
- [ ] Add `fetchpriority="high"` to hero images
- [ ] Verify images have width/height attributes

### Manual Testing - Tools

- [ ] Run Lighthouse SEO audit (target: ≥95)
- [ ] Validate robots.txt
- [ ] Validate sitemap.xml
- [ ] Test Facebook Sharing Debugger (homepage)
- [ ] Test Facebook Sharing Debugger (recipe page)
- [ ] Test Facebook Sharing Debugger (video page)
- [ ] Test Twitter Card Validator (homepage)
- [ ] Test Twitter Card Validator (recipe page)
- [ ] Test Twitter Card Validator (video page)
- [ ] Test LinkedIn Post Inspector (homepage)
- [ ] Test LinkedIn Post Inspector (content page)
- [ ] Test Google Rich Results Test (homepage)
- [ ] Test Google Rich Results Test (recipe page)
- [ ] Test Google Rich Results Test (video page)
- [ ] Validate all schemas with Schema.org validator

### Manual Testing - Sample URLs

- [ ] Test homepage (`/`)
- [ ] Test recipe category (`/recipe`)
- [ ] Test video category (`/video`)
- [ ] Test library category (`/library`)
- [ ] Test collection category (`/collection`)
- [ ] Test announcement category (`/announcement`)
- [ ] Test 3 different recipe pages
- [ ] Test 3 different video pages
- [ ] Test 3 different library pages
- [ ] Test about page (`/about`)
- [ ] Test terms page (`/terms`)
- [ ] Test privacy page (`/privacy`)

### Cross-Platform Sharing Tests

- [ ] Share homepage on Facebook (check preview)
- [ ] Share recipe page on Facebook (check preview)
- [ ] Share video page on Twitter (check preview)
- [ ] Share library page on LinkedIn (check preview)
- [ ] Share content in Discord (check embed)
- [ ] Share content in Slack (check unfurl)

### Documentation

- [ ] Create `docs/SEO.md` with developer guide
- [ ] Document how to add meta tags to new pages
- [ ] Document schema generators usage
- [ ] Document OG image generation
- [ ] Update `tests/README.md` with SEO test coverage
- [ ] Add SEO section to main `README.md` if needed

---

## Post-Implementation (Launch Day)

### Google Search Console

- [ ] Verify domain ownership
- [ ] Submit sitemap URL
- [ ] Request indexing for key pages (optional)
- [ ] Set up weekly monitoring alerts

### Final Validation

- [ ] All Playwright tests pass
- [ ] Lighthouse SEO score ≥95
- [ ] No console errors on any page
- [ ] All meta tags render correctly
- [ ] All OG images load successfully
- [ ] All schemas validate

---

## Post-Launch Monitoring (Week 1)

- [ ] Check Search Console for crawl errors (daily)
- [ ] Monitor sitemap indexing status
- [ ] Review structured data errors (if any)
- [ ] Monitor OG image generation success rate
- [ ] Check Core Web Vitals metrics
- [ ] Review social sharing analytics

---

## Optional Enhancements (P2 - Post-Launch)

### Static Page Prerendering

- [ ] Configure prerender for `/about`
- [ ] Configure prerender for `/terms`
- [ ] Configure prerender for `/privacy`
- [ ] Test prerendered pages

### RSS Feed

- [ ] Create `/src/routes/rss.xml/+server.ts`
- [ ] Include latest 50 items
- [ ] Validate RSS format
- [ ] Add RSS link to homepage

### Advanced Schema

- [ ] Event schema for upcoming events
- [ ] Person schema for user profiles
- [ ] ItemList schema for category pages

---

## Success Criteria (All Must Pass)

### Technical

- ✅ robots.txt returns 200 and is valid
- ✅ sitemap.xml returns 200 and is valid
- ✅ All pages have Open Graph tags
- ✅ All pages have Twitter Card tags
- ✅ All pages have canonical URLs
- ✅ OG images generate successfully
- ✅ All schemas validate in Rich Results Test
- ✅ Lighthouse SEO score ≥95
- ✅ All Playwright tests pass
- ✅ No console errors

### Validation Tools (No Errors)

- ✅ Facebook Sharing Debugger
- ✅ Twitter Card Validator
- ✅ LinkedIn Post Inspector
- ✅ Google Rich Results Test
- ✅ robots.txt validator
- ✅ Sitemap XML validator

### Performance

- ✅ OG image generation <500ms
- ✅ Sitemap generation <2s
- ✅ No LCP regression
- ✅ Core Web Vitals in "Good" range

---

## Sign-off

**Implementation Complete:** **_ / _** / \_\_\_

**Tested By:** **\*\***\_\_\_\_**\*\***

**Approved By:** **\*\***\_\_\_\_**\*\***

**Ready for Launch:** ☐ Yes ☐ No

**Notes:**

---

---

---
