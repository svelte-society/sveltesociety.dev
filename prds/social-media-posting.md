# Product Requirements Document: Social Media Publishing System

## 1. Executive Summary

Add a social media publishing feature to the admin dashboard that streamlines scheduling and publishing content to BlueSky, Nostr, and LinkedIn. The system will integrate seamlessly with the existing content workflow, allowing admins to review, schedule, and publish social posts from a centralized dashboard.

---

## 2. Goals & Objectives

### Primary Goals

- **Streamline Social Sharing**: Provide a centralized dashboard to schedule and publish content to connected social media platforms
- **Increase Content Reach**: Expand distribution of Svelte Society content across multiple platforms
- **Save Time**: Reduce manual effort required for cross-platform posting with smart scheduling
- **Maintain Brand Consistency**: Ensure consistent messaging across all platforms with templated posts

### Success Metrics

- 90%+ of published content successfully shared to enabled platforms
- 80%+ reduction in time spent on manual social media posting
- Increased referral traffic from social media platforms by 30%
- Zero duplicate posts or posting errors

---

## 3. User Personas

**Primary User: Content Admin/Moderator**

- Publishes and manages content on Svelte Society
- Responsible for social media presence
- Needs efficient workflow to share content
- May want control over what gets posted and when

**Secondary User: Content Editor**

- Creates and submits content for review
- May want to preview social posts
- Limited social media management permissions

---

## 4. Feature Requirements

### 4.1 Core Features (MVP)

#### 4.1.1 Social Media Account Management

- **Account Connection Interface**
  - OAuth-based authentication for BlueSky and LinkedIn
  - Private key authentication for Nostr (nsec/npub)
  - Support multiple accounts per platform
  - Account status indicators (connected, disconnected, error state)
  - Test connection functionality
  - Revoke access capability

- **Account Settings Page** (`/admin/social-media`)
  - List all connected accounts with status
  - Add/remove platform connections
  - Set default accounts for posting
  - View posting history per account
  - Configure posting preferences per platform

#### 4.1.2 Scheduled Publishing

- **Status Trigger Integration**
  - Automatically generate draft social posts when content status changes to `published`
  - Posts are added to the scheduling queue for review (NOT auto-posted)
  - Support for different content types: video, library, recipe, announcement, collection
  - Intelligent content-type-specific posting logic

- **Post Composition Engine**
  - Generate platform-optimized posts from content metadata:
    - **Title**: Use content title (with character limit handling)
    - **Description**: Use content description (truncated/formatted per platform)
    - **URL**: Direct link to content on Svelte Society
    - **Tags**: Convert content tags to hashtags
    - **Media**: Extract and attach thumbnails/images from metadata

- **Platform-Specific Formatting**
  - **BlueSky**: 300 character limit, rich text support, image attachments
  - **Nostr**: NIP-01 (text notes), 280 character soft limit, hashtags, link previews
  - **LinkedIn**: Professional tone, longer descriptions, article cards, 3000 character limit

#### 4.1.3 Post Templates & Customization

- **Template System**
  - Pre-defined templates per content type
  - Variable substitution: `{title}`, `{description}`, `{url}`, `{tags}`
  - Platform-specific template variations
  - Default templates with override capability

- **Template Examples**:

  ```
  Video:
  BlueSky: "🎥 New video: {title}\n\n{description}\n\n{url}"
  Nostr: "🎥 {title}\n\n{description}\n\n{url}\n\n{hashtags}"
  LinkedIn: "Check out our latest Svelte tutorial: {title}\n\n{description}\n\nWatch here: {url}\n\n{hashtags}"

  Library:
  BlueSky: "📦 Featured library: {title}\n\n{description}\n⭐ {stars} stars\n\n{url}"
  Nostr: "📦 {title}\n\n{description}\n⭐ {stars} stars\n\n{url}\n\n{hashtags}"
  LinkedIn: "Discover {title} - {description}\n\n{url}\n\n{hashtags}"
  ```

#### 4.1.4 Manual Post Preview & Editing

- **Pre-Publish Preview**
  - Show generated post for each platform before publishing content
  - Inline editing of social media text
  - Preview character counts and truncation
  - Preview image attachments
  - Option to skip posting to specific platforms

- **Content Edit Page Integration**
  - Add "Social Media" section to content edit form (`/admin/content/[id]`)
  - Toggle switches for each platform
  - Editable post text fields (pre-filled with template)
  - Image/media selection
  - "Preview Post" button

#### 4.1.5 Post Scheduling Dashboard (CORE FEATURE)

- **Main Scheduling Interface** (`/admin/social-media`)
  - Primary view shows all posts in a table/list format
  - Filters: platform, status (draft/scheduled/posted/failed), date range
  - Post status indicators: draft, scheduled, posted, failed
  - Sort by scheduled time, created time, platform

- **Post Management**
  - Inline editing of post content
  - Set publish time with datetime picker or quick actions ("Post Now", "Tomorrow 9am", "Next Week")
  - Delete or skip draft posts
  - Retry failed posts

- **Automatic Draft Generation**
  - When content is published, system automatically creates draft posts for all enabled platforms
  - Drafts appear at top of main dashboard
  - Admins can review, edit, schedule, or publish immediately

#### 4.1.6 Post Queue & Retry Logic

- **Queue System**
  - Queue posts that fail to send immediately
  - Retry logic with exponential backoff
  - Manual retry capability
  - View queued posts in admin dashboard
  - Failed posts remain editable and can be rescheduled

#### 4.1.7 Post History & Analytics

- **Posting History Table** (`/admin/social-media/history`)
  - List all social media posts with:
    - Content title/link
    - Platform(s) posted to
    - Post status (success, failed, queued)
    - Timestamp
    - Link to original social media post
    - Engagement metrics (if available via API)

- **Post Status Indicators**
  - Draft 📝
  - Scheduled 📅
  - Posted ✓
  - Failed ✗ (with error message)
  - Skipped ⊘

---

### 4.2 Advanced Features (Post-MVP)

#### 4.2.1 Bulk Social Posting

- Select multiple published content items
- Bulk post to social media (respecting rate limits)
- Useful for re-promoting older content

#### 4.2.2 Content Type Rules

- Configure posting rules per content type
- Example: "Always auto-post videos, but require manual approval for announcements"
- Role-based posting permissions

#### 4.2.3 Engagement Tracking

- Fetch engagement metrics from platform APIs:
  - Likes, reposts, replies (BlueSky)
  - Reactions, zaps, replies (Nostr via relays)
  - Reactions, shares, comments (LinkedIn)
- Display engagement in post history
- Track referral traffic via UTM parameters

#### 4.2.4 Thread/Multi-Post Support

- Automatically create threads for long-form content
- Support for carousel posts (multiple images)
- Platform-specific multi-post features

#### 4.2.5 AI-Powered Post Generation

- Use existing LLM service (`src/lib/server/services/llm.ts`)
- Generate optimized social media copy
- A/B test different post variations
- Suggest trending hashtags

#### 4.2.6 Image Processing

- Automatic OG image generation for content without thumbnails
- Platform-specific image resizing/cropping
- Add Svelte Society branding overlay

---

## 5. Technical Architecture

### 5.1 Service Layer

**New Service: `SocialMediaService`**
Location: `src/lib/server/services/social-media.ts`

```typescript
class SocialMediaService {
	// Account management
	connectAccount(platform: Platform, credentials: Credentials): Account
	disconnectAccount(accountId: string): boolean
	getConnectedAccounts(): Account[]
	testConnection(accountId: string): boolean

	// Scheduling (NEW CORE FEATURE)
	createDraftPosts(contentId: string): DraftPost[]
	schedulePosts(postIds: string[], scheduledAt: Date): void
	getScheduledPosts(filters?: ScheduleFilters): ScheduledPost[]
	updateScheduledPost(postId: string, updates: Partial<ScheduledPost>): void
	deleteScheduledPost(postId: string): void
	publishNow(postIds: string[]): PostResult[]

	// Posting
	postToSocial(contentId: string, platforms: Platform[]): PostResult[]
	queuePost(post: QueuedPost): void
	retryFailedPost(postId: string): PostResult

	// Templates
	generatePost(content: Content, platform: Platform): PostData
	getTemplate(contentType: ContentType, platform: Platform): Template
	updateTemplate(templateId: string, template: Template): void

	// History
	getPostHistory(filters?: HistoryFilters): SocialPost[]
	getPostByContent(contentId: string): SocialPost[]
}
```

### 5.2 Platform Integrations

**Platform Clients**

- `BlueSkyClient` - AT Protocol API integration
- `NostrClient` - Nostr protocol integration (NIP-01, NIP-02 for relays)
- `LinkedInClient` - LinkedIn API integration

Each client implements common interface:

```typescript
interface SocialClient {
	authenticate(credentials: Credentials): Promise<Token>
	post(content: PostData): Promise<PostResponse>
	getPostMetrics(postId: string): Promise<Metrics>
	validateToken(): Promise<boolean>
}
```

**Nostr-Specific Implementation Notes**:

- Use `nostr-tools` library for signing and relay communication
- Store nsec (private key) encrypted in database
- Connect to multiple relays for redundancy
- Support NIP-19 for key encoding/decoding

### 5.3 Database Schema

**New Tables**:

```sql
-- Social media accounts
CREATE TABLE social_accounts (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL, -- 'bluesky', 'nostr', 'linkedin'
  account_name TEXT NOT NULL,
  account_handle TEXT NOT NULL,
  credentials TEXT NOT NULL, -- Encrypted JSON (OAuth tokens or Nostr nsec)
  relay_urls TEXT, -- Nostr-specific: JSON array of relay URLs
  is_active BOOLEAN DEFAULT true,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Social media posts
CREATE TABLE social_posts (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  post_text TEXT NOT NULL,
  post_data TEXT, -- JSON: images, links, etc.
  external_post_id TEXT, -- Platform's post ID (or Nostr event ID)
  external_url TEXT, -- Link to post on platform
  status TEXT NOT NULL, -- 'draft', 'scheduled', 'posted', 'failed'
  scheduled_at TEXT, -- When to post (NULL = post immediately)
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  posted_at TEXT,
  FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES social_accounts(id) ON DELETE CASCADE
);

-- Post templates
CREATE TABLE social_templates (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  template TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Index for efficient scheduling queries
CREATE INDEX idx_social_posts_scheduled ON social_posts(scheduled_at, status);
CREATE INDEX idx_social_posts_status ON social_posts(status);
```

### 5.4 Integration Points

**Hook into Content Publishing**
Modify `src/routes/(admin)/admin/content/[id]/+page.server.ts`:

```typescript
// After successful update to 'published'
if (content.status === 'published' && locals.socialMediaService) {
	// Automatically create draft social posts for all enabled accounts
	const draftPosts = await locals.socialMediaService.createDraftPosts(content.id)

	// Notify admin that drafts are ready in the scheduling dashboard
	// Posts remain in 'draft' status until admin reviews and schedules them
	console.log(`Created ${draftPosts.length} draft social posts for content ${content.id}`)
}
```

**Background Job for Scheduled Posts**
Create a background job (cron or similar) to publish scheduled posts:

```typescript
// Run every minute
async function processScheduledPosts() {
	const now = new Date()
	const duePostS = await socialMediaService.getScheduledPosts({
		status: 'scheduled',
		dueBefore: now
	})

	for (const post of duePosts) {
		try {
			await socialMediaService.publishNow([post.id])
		} catch (error) {
			// Queue for retry
			await socialMediaService.queuePost(post)
		}
	}
}
```

### 5.5 Admin UI Routes

**New Routes**:

- `/admin/social-media` - **Post scheduling dashboard (PRIMARY VIEW)** - Shows all draft, scheduled, and posted content
- `/admin/social-media/accounts` - Account management (connect/disconnect platforms)
- `/admin/social-media/templates` - Manage post templates (optional, Phase 2+)

**Updated Routes**:

- `/admin/content/[id]` - Add social media preview section
- `/admin/content/new` - Add social media settings

---

## 6. User Workflows

### 6.1 Initial Setup

1. Admin navigates to `/admin/social-media/accounts`
2. Clicks "Connect Account" for each platform (BlueSky, Nostr, LinkedIn)
3. Completes authentication:
   - BlueSky: OAuth flow
   - Nostr: Enter nsec (private key) + configure relays
   - LinkedIn: OAuth flow

### 6.2 Publishing Content with Scheduling (PRIMARY WORKFLOW)

1. Admin publishes content (changes status to "published")
2. System automatically:
   - Generates draft posts for each enabled platform
   - Shows notification: "3 draft social posts created"
3. Admin navigates to `/admin/social-media`
4. Sees draft posts at top of list (status: "draft")
5. For each draft post, admin can:
   - Click to expand and edit post text
   - Choose "Post Now" or set a scheduled time
   - Delete or skip
6. System publishes posts at scheduled times automatically
7. Published posts appear in the same list with status "posted"

### 6.3 Quick Publishing from Content Form

1. Admin edits content in `/admin/content/[id]`
2. Sees "Social Media Preview" section
3. Reviews auto-generated posts for each platform
4. Edits post text if needed
5. Toggles platforms on/off
6. Clicks "Create Drafts" or "Schedule Posts"
7. Drafts appear in scheduling dashboard for final review

### 6.4 Handling Failed Posts

1. Post fails (API error, rate limit, etc.)
2. System queues post for retry
3. Admin sees notification of failed post
4. Admin navigates to queue page
5. Reviews error message
6. Manually retries or edits and retries

---

## 7. Security & Privacy Considerations

### 7.1 Credential Storage

- Store platform credentials encrypted in database
- Use environment variables for encryption keys
- Implement token refresh mechanisms
- Support credential rotation

### 7.2 Permissions

- Role-based access control for social media features
- Only admins can connect/disconnect accounts
- Moderators can view history and retry posts
- Editors can preview but not post

### 7.3 Rate Limiting

- Respect platform API rate limits
- Implement exponential backoff for retries
- Queue posts to avoid hitting limits
- Track API usage per platform

### 7.4 Error Handling

- Graceful degradation if social posting fails
- Don't block content publishing if social post fails
- Log all errors for debugging
- User-friendly error messages

---

## 8. Environment Variables

```env
# BlueSky
BLUESKY_CLIENT_ID=
BLUESKY_CLIENT_SECRET=
BLUESKY_REDIRECT_URI=

# Nostr
NOSTR_DEFAULT_RELAYS=wss://relay.damus.io,wss://nos.lol,wss://relay.nostr.band

# LinkedIn
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_REDIRECT_URI=

# Social Media Feature
SOCIAL_MEDIA_ENABLED=true
SOCIAL_MEDIA_ENCRYPTION_KEY=

# Optional: Background job configuration
SOCIAL_MEDIA_SCHEDULER_INTERVAL=60000  # Check for scheduled posts every 60 seconds
```

---

## 9. Dependencies

### NPM Packages

```json
{
	"@atproto/api": "^0.12.0", // BlueSky
	"nostr-tools": "^2.3.0", // Nostr protocol
	"linkedin-api-client": "^1.0.0", // LinkedIn (or use fetch directly)
	"crypto-js": "^4.2.0" // Encryption for credentials
}
```

### Platform API Documentation

- **BlueSky**: https://docs.bsky.app/docs/api/
- **Nostr**: https://github.com/nostr-protocol/nips
- **LinkedIn**: https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api

---

## 10. Testing Strategy

### Unit Tests

- Template generation logic
- Post formatting/truncation
- Character count validation
- URL shortening
- Hashtag extraction

### Integration Tests

- Mock API responses from platforms
- Test retry logic
- Test queue processing
- Test credential validation

### E2E Tests

- Connect account flow
- Publish content and verify social post
- Edit and retry failed post
- View post history

---

## 11. Implementation Phases

### Phase 1: BlueSky + Basic Dashboard

- [ ] Database schema and migrations
- [ ] BlueSky client implementation
- [ ] Basic `SocialMediaService`
- [ ] Hardcoded template system
- [ ] Main scheduling dashboard UI (`/admin/social-media`)
- [ ] Draft post generation on content publish
- [ ] Manual "Post Now" functionality

### Phase 2: Automatic Scheduling

- [ ] Background job for processing scheduled posts
- [ ] Quick schedule actions (Tomorrow, Next Week, etc.)
- [ ] Retry logic for failed posts

### Phase 3: Account Management

- [ ] Account management UI (`/admin/social-media/accounts`)
- [ ] Add/remove accounts through UI
- [ ] Credential encryption

### Phase 4: Nostr Support

- [ ] Nostr client implementation
- [ ] Nostr account management
- [ ] Multi-platform draft generation

### Phase 5: LinkedIn Support

- [ ] LinkedIn client implementation
- [ ] LinkedIn account management
- [ ] All 3 platforms working

### Phase 6: Polish & Advanced Features

- [ ] Template management UI
- [ ] Better filters and search
- [ ] Inline editing
- [ ] Calendar view (optional)
- [ ] Image attachments (optional)
- [ ] Analytics (optional)

---

## 12. Open Questions

1. **Nostr Relays**: Which relays should we use by default? Should users be able to add custom relays?
2. **Rate Limits**: What are the specific rate limits for BlueSky and LinkedIn?
3. **Image Hosting**: Where should we host images for social posts? Use existing metadata thumbnails?
4. **Duplicate Detection**: How do we prevent duplicate posts if someone re-publishes content?
5. **Content Updates**: Should we create new draft posts if content is updated after initial publish?
6. **Collections**: How should we handle posting collections (post as thread? single post with link?)
7. **Hashtag Strategy**: What hashtags should we use by default? Brand-specific? Topic-specific?
8. **Scheduling Strategy**: What are the optimal posting times for each platform?
9. **Nostr Keys**: Should we support NIP-07 browser extensions or only nsec input?
10. **Background Jobs**: Should we use a cron job, SvelteKit server hooks, or a separate worker process?

---

## 13. Success Criteria

### Definition of Done

- Admins can connect at least one account for each platform (BlueSky, Nostr, LinkedIn)
- Draft posts are automatically created when content is published
- Scheduling dashboard provides clear visibility into all draft and scheduled posts
- Admins can easily schedule posts with custom times or quick actions
- 95% of scheduled posts successfully publish at the scheduled time
- Failed posts are queued and can be manually retried
- Post history is visible and searchable
- Zero content publishing is blocked by social media posting failures
- Documentation is complete for setup and usage

### User Acceptance

- Admin feedback that social posting "just works"
- Reduction in manual posting time by 80%+
- No complaints about duplicate or failed posts
- Increased social media engagement (measured after 1 month)

---

## 14. Future Enhancements

- **Cross-posting to additional platforms**: Mastodon, Facebook, Instagram
- **Social media inbox**: Respond to comments/mentions from admin dashboard
- **Content calendar**: Visual calendar of scheduled social posts
- **Performance analytics**: Track which content performs best on which platforms
- **Audience insights**: Understand follower demographics and engagement patterns
- **Social listening**: Monitor mentions of Svelte Society across platforms

---

This PRD provides a comprehensive roadmap for implementing a robust social media publishing system with intelligent scheduling capabilities. The system integrates seamlessly with your existing content management workflow, automatically creating draft posts for review while giving admins full control over scheduling and publishing. The phased approach allows for iterative development and early feedback, while the extensible architecture supports future enhancements.

## Key Changes from Original Concept

1. **Removed X (Twitter)** - Replaced with Nostr protocol to avoid API costs
2. **Scheduling-First Approach** - Posts are NOT automatically published; instead, drafts are created for admin review and scheduling
3. **Scheduling Dashboard** - New core feature providing centralized view of all draft, scheduled, and published posts
4. **Nostr Integration** - Decentralized social protocol with private key authentication and relay management
