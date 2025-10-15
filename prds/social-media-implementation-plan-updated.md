# Social Media Feature - Updated Implementation Plan

## Overview

This updated plan reflects the current state of the implementation and breaks remaining work into small, focused phases with clear deliverables.

**Current Status:** The foundation is complete (database schema, service layer, templates management, post list view with calendar). Now we need to build the functionality to manage accounts and create/post content.

---

## ✅ Completed Phases

### Phase 0: Enable Remote Functions ✅
- Remote functions enabled in svelte.config.js
- App uses SvelteKit remote functions throughout

### Phase 1: Database Schema ✅
- Migration 005_social_media.sql with all tables
- Migration 006_default_social_templates.sql with default templates
- Types defined in `$lib/schema/social.ts`

### Phase 2: Service Layer ✅
- `SocialService` class with all CRUD methods
- Service attached to `locals` in hooks

### Phase 3: Template Management ✅
- Template list view (`/admin/social/templates`)
- Create new templates (`/admin/social/templates/new`)
- Delete templates (functionality exists)
- Template variables documentation

### Phase 4: Post List View ✅
- Main dashboard (`/admin/social`)
- Calendar view for scheduled posts
- Filter by status and platform
- Table view with post details
- Post generation service (`generatePostsForContent`)

---

## 🚧 Remaining Work - Broken Into Small Phases

### Phase 5: Template Editing
**Goal**: Allow editing existing templates through the UI

**What to Build**:
1. Create `/admin/social/templates/[id]/+page.svelte`
2. Add form to edit template content
3. Add `updateTemplate` remote function in `data.remote.ts`
4. Reuse same form layout as create template

**Deliverables**:
- ✅ Can click "Edit" on template list
- ✅ Form pre-filled with existing template data
- ✅ Can update template text
- ✅ Changes save to database
- ✅ Returns to template list after save

**Files to Create/Modify**:
- `src/routes/(admin)/admin/social/templates/[id]/+page.svelte` (new)
- `src/routes/(admin)/admin/social/templates/data.remote.ts` (add updateTemplate)

---

### Phase 6: Account Management UI - List & Add
**Goal**: Show connected accounts and add new BlueSky accounts

**What to Build**:
1. Create `/admin/social/accounts/+page.svelte`
2. Show list of connected accounts
3. Form to add new BlueSky account (identifier + app password)
4. Test connection before saving
5. Store credentials (plain text for now, encryption in Phase 11)

**Deliverables**:
- ✅ Navigate to `/admin/social/accounts`
- ✅ See list of connected accounts (empty at first)
- ✅ Form to add BlueSky account
- ✅ Credentials tested before saving
- ✅ Account appears in list after adding
- ✅ Can set account as default

**Files to Create**:
- `src/routes/(admin)/admin/social/accounts/+page.svelte` (new)
- `src/routes/(admin)/admin/social/accounts/data.remote.ts` (new)

**Implementation Notes**:
- Use `@atproto/api` for BlueSky
- Test connection with `agent.login()` before saving
- Store credentials as JSON string in database
- Show platform badge (BlueSky only for now)

---

### Phase 7: Account Management - Delete & Toggle
**Goal**: Remove accounts and toggle active status

**What to Build**:
1. Delete account button with confirmation
2. Toggle active/inactive status
3. Prevent deleting last active account for a platform

**Deliverables**:
- ✅ Can delete accounts
- ✅ Confirmation dialog before delete
- ✅ Can toggle account active status
- ✅ UI updates after changes

**Files to Modify**:
- `src/routes/(admin)/admin/social/accounts/+page.svelte`
- `src/routes/(admin)/admin/social/accounts/data.remote.ts`

---

### Phase 8: Create Social Media Post - UI Only
**Goal**: UI to create a new social media post (draft mode only)

**What to Build**:
1. Create `/admin/social/new/+page.svelte`
2. Form with:
   - Content selector (dropdown of published content)
   - Platform selector (based on connected accounts)
   - Auto-generated post text preview
   - Editable textarea for post text
   - Schedule datetime picker (optional)
3. Save as draft (don't post yet)

**Deliverables**:
- ✅ Navigate to `/admin/social/new`
- ✅ Select content from dropdown
- ✅ Select platform
- ✅ See auto-generated post text
- ✅ Edit post text
- ✅ Set scheduled time (optional)
- ✅ Save as draft
- ✅ Draft appears in main list

**Files to Create**:
- `src/routes/(admin)/admin/social/new/+page.svelte` (new)
- `src/routes/(admin)/admin/social/new/data.remote.ts` (new)

**Implementation Notes**:
- Use `generatePostsForContent` to create initial post text
- Allow manual override of generated text
- If scheduled_at is set, status = 'scheduled', else 'draft'

---

### Phase 9: Edit & Delete Posts
**Goal**: Edit existing draft/scheduled posts and delete posts

**What to Build**:
1. Create `/admin/social/[id]/+page.svelte`
2. Edit form (similar to create)
3. Update post text and scheduled time
4. Delete post with confirmation

**Deliverables**:
- ✅ Click "Edit" from post list
- ✅ Form pre-filled with post data
- ✅ Can edit post text
- ✅ Can change scheduled time
- ✅ Can delete post
- ✅ Changes save and return to list

**Files to Create/Modify**:
- `src/routes/(admin)/admin/social/[id]/+page.svelte` (new)
- `src/routes/(admin)/admin/social/[id]/data.remote.ts` (new)
- `src/routes/(admin)/admin/social/+page.svelte` (wire up Edit/Delete buttons)
- `src/routes/(admin)/admin/social/data.remote.ts` (add updatePost, deletePost)

---

### Phase 10: BlueSky Client - Post Now
**Goal**: Actually post to BlueSky when "Post Now" button is clicked

**What to Build**:
1. BlueSky client class (`src/lib/server/clients/bluesky.ts`)
2. Login with credentials
3. Post text to BlueSky
4. Save external post ID and URL
5. Update post status to "posted"
6. "Post Now" button functionality

**Deliverables**:
- ✅ Click "Post Now" from post list
- ✅ Post successfully published to BlueSky
- ✅ Post status updates to "posted"
- ✅ External URL saved
- ✅ Can click link to view post on BlueSky

**Files to Create/Modify**:
- `src/lib/server/clients/bluesky.ts` (new)
- `src/routes/(admin)/admin/social/data.remote.ts` (add postNow remote function)
- `src/routes/(admin)/admin/social/+page.svelte` (wire up Post Now button)

**Dependencies**:
```bash
bun add @atproto/api
```

**Implementation Notes**:
- Create agent and login for each post (or cache session)
- Handle errors gracefully (set status to 'failed', save error message)
- Extract post URI and convert to web URL

---

### Phase 11: Credential Encryption
**Goal**: Encrypt account credentials before storing

**What to Build**:
1. Encryption utility functions
2. Encrypt credentials when creating accounts
3. Decrypt when using credentials
4. Add ENCRYPTION_KEY to environment variables

**Deliverables**:
- ✅ Credentials encrypted in database
- ✅ Encryption key stored in .env
- ✅ Existing accounts continue to work
- ✅ New accounts automatically encrypted

**Files to Create/Modify**:
- `src/lib/server/utils/encryption.ts` (new)
- `src/lib/server/services/social.ts` (use encryption for credentials)
- `src/routes/(admin)/admin/social/accounts/data.remote.ts` (encrypt on create)
- `.env.development` (add ENCRYPTION_KEY)

**Implementation Notes**:
- Use Web Crypto API or `crypto-js` for AES-256-GCM encryption
- Generate random IV for each encryption
- Store IV alongside encrypted data
- Migration script to encrypt existing credentials (optional)

---

### Phase 12: Background Scheduler - Post at Scheduled Time
**Goal**: Automatically post scheduled posts at their scheduled time

**What to Build**:
1. Background job function (`processScheduledPosts`)
2. Run every minute to check for due posts
3. Post to appropriate platform
4. Retry failed posts (up to 3 times)
5. Trigger job on server start

**Deliverables**:
- ✅ Scheduled posts automatically publish at scheduled time
- ✅ Post status updates to "posted" after publishing
- ✅ Failed posts retry automatically
- ✅ Failed posts show error message after max retries

**Files to Create/Modify**:
- `src/lib/server/jobs/process-scheduled-posts.ts` (new)
- `src/hooks.server.ts` (start interval timer)

**Implementation Notes**:
- Use `setInterval` in hooks.server.ts (simple approach)
- Query for posts where `status = 'scheduled' AND scheduled_at <= NOW()`
- Reuse BlueSky client from Phase 10
- Increment retry_count on failure
- Set status to 'failed' after 3 retries

**Alternative**: API endpoint + external cron job (production-ready)

---

### Phase 13: Auto-Generate Posts on Content Publish
**Goal**: Automatically create draft posts when content is published

**What to Build**:
1. Hook into content publishing workflow
2. When content status changes to "published", generate drafts
3. Create draft for each active account
4. Use templates to generate post text
5. Show toast notification

**Deliverables**:
- ✅ Publishing content creates draft posts automatically
- ✅ Drafts appear in `/admin/social`
- ✅ One draft per active platform account
- ✅ Toast notification shows "X draft posts created"

**Files to Modify**:
- `src/routes/(admin)/admin/content/[id]/+page.server.ts` (add hook)
- `src/lib/server/services/post-generator.ts` (enhance if needed)

**Implementation Notes**:
- Only create drafts if content is newly published (not re-published)
- Don't block content publishing if social draft creation fails
- Use existing `generatePostsForContent` function

---

### Phase 14: Post Preview in Content Edit
**Goal**: Preview and customize social posts from content edit page

**What to Build**:
1. Add "Social Media" section to content edit form
2. Show generated posts for each platform
3. Allow inline editing before creating drafts
4. Toggle platforms on/off
5. Create drafts directly from content page

**Deliverables**:
- ✅ Content edit page shows social media section
- ✅ Preview post for each connected platform
- ✅ Edit post text inline
- ✅ Toggle platforms to skip
- ✅ Button to create drafts immediately

**Files to Modify**:
- `src/routes/(admin)/admin/content/[id]/+page.svelte` (add section)
- `src/routes/(admin)/admin/content/[id]/+page.server.ts` (optional form action)

**Implementation Notes**:
- Use `generatePosts` remote function from `/admin/social/data.remote.ts`
- Show character count for each platform
- Highlight when over limit

---

## 🔮 Future Enhancements (Post-MVP)

### Phase 15: Nostr Support
- Install `nostr-tools`
- Create Nostr client
- Add Nostr account management
- Support nsec private key input
- Configure relay URLs

### Phase 16: LinkedIn Support
- Research LinkedIn Share API
- Create LinkedIn client
- Add OAuth flow
- Add LinkedIn account management
- Support LinkedIn-specific formatting

### Phase 17: Image Attachments
- Upload images with posts
- Attach existing content thumbnails
- Platform-specific image requirements
- Image preview in post list

### Phase 18: Enhanced Scheduling
- Quick schedule buttons ("Tomorrow 9am", "Next Monday")
- Bulk scheduling
- Schedule all drafts at once
- Optimal posting time suggestions

### Phase 19: Analytics & Engagement
- Fetch engagement metrics from platform APIs
- Display likes, shares, comments
- Track click-through rates with UTM parameters
- Performance dashboard

### Phase 20: Polish & UX
- Inline editing in post list
- Bulk actions (delete, schedule, post)
- Better error messages
- Loading states
- Success/error toasts

---

## Implementation Order Summary

**RECOMMENDED ORDER FOR COMPLETION:**

1. **Phase 5** - Template Editing (quick win, completes templates feature)
2. **Phase 6** - Account Management - Add Accounts (required for everything else)
3. **Phase 7** - Account Management - Delete/Toggle (completes account feature)
4. **Phase 8** - Create Posts UI (core feature)
5. **Phase 9** - Edit/Delete Posts (completes post management)
6. **Phase 10** - BlueSky Client (makes posting actually work!)
7. **Phase 13** - Auto-generate on Publish (main workflow automation)
8. **Phase 11** - Credential Encryption (security - do before production)
9. **Phase 12** - Background Scheduler (fully automated posting)
10. **Phase 14** - Post Preview in Content Edit (nice UX enhancement)

**Phases 15-20** can be done in any order based on priority.

---

## Success Criteria

After completing Phases 5-13, the feature should:
- ✅ Allow connecting BlueSky accounts
- ✅ Manage templates (create, edit, delete)
- ✅ Create social media posts (manually or auto-generated)
- ✅ Edit and delete posts
- ✅ Post immediately to BlueSky ("Post Now")
- ✅ Schedule posts for future
- ✅ Automatically post at scheduled time
- ✅ Auto-create drafts when content is published
- ✅ Credentials encrypted securely
- ✅ 95%+ reliability for scheduled posts

---

## Key Differences from Original Plan

**What Changed:**
1. ❌ **Removed UI-first phases** - Database and service layer already done
2. ✅ **Smaller, more focused phases** - Each phase is 1-2 hours max
3. ✅ **Clear dependencies** - Each phase builds on previous
4. ✅ **Account management comes first** - Required for everything else
5. ✅ **Post Now before Scheduling** - Simpler to test and debug
6. ✅ **Encryption as separate phase** - Can be done after core functionality works

**Implementation Philosophy:**
- Each phase leaves app in working state
- Test manually after each phase
- Commit after each phase
- Don't move forward until current phase works perfectly
