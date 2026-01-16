/**
 * Test data configuration for E2E tests
 * This file contains all test users, content, tags, and other fixtures
 * used to seed the test database.
 */

/**
 * Test user credentials for E2E tests
 */
export const TEST_USERS = {
	admin: {
		id: 'test_admin_001',
		email: 'admin@test.local',
		username: 'test_admin',
		name: 'Test Admin',
		password: 'test_password_admin',
		sessionToken: 'test_session_admin_token',
		avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
		bio: 'Admin user for testing',
		roleValue: 'admin'
	},
	contributor: {
		id: 'test_contrib_001',
		email: 'contributor@test.local',
		username: 'test_contributor',
		name: 'Test Contributor',
		password: 'test_password_contributor',
		sessionToken: 'test_session_contributor_token',
		avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
		bio: 'Contributor user for testing',
		roleValue: 'moderator'
	},
	viewer: {
		id: 'test_viewer_001',
		email: 'viewer@test.local',
		username: 'test_viewer',
		name: 'Test Viewer',
		password: 'test_password_viewer',
		sessionToken: 'test_session_viewer_token',
		avatarUrl: 'https://avatars.githubusercontent.com/u/3?v=4',
		bio: 'Viewer user for testing',
		roleValue: 'member'
	},
	// User for testing newsletter modal auto-show (has null newsletter_preference)
	newsletter_new: {
		id: 'test_newsletter_001',
		email: 'newsletter@test.local',
		username: 'test_newsletter',
		name: 'Test Newsletter User',
		password: 'test_password_newsletter',
		sessionToken: 'test_session_newsletter_token',
		avatarUrl: 'https://avatars.githubusercontent.com/u/4?v=4',
		bio: 'User for newsletter modal testing',
		roleValue: 'member'
	}
} as const

/**
 * Test tags
 */
export const TEST_TAGS = [
	{ id: 'tag_svelte', name: 'svelte', slug: 'svelte', color: '#ff3e00' },
	{ id: 'tag_sveltekit', name: 'sveltekit', slug: 'sveltekit', color: '#ff3e00' },
	{ id: 'tag_testing', name: 'testing', slug: 'testing', color: '#22c55e' },
	{ id: 'tag_components', name: 'components', slug: 'components', color: '#3b82f6' },
	{ id: 'tag_animation', name: 'animation', slug: 'animation', color: '#a855f7' },
	{ id: 'tag_forms', name: 'forms', slug: 'forms', color: '#f59e0b' },
	{ id: 'tag_routing', name: 'routing', slug: 'routing', color: '#14b8a6' },
	{ id: 'tag_state', name: 'state-management', slug: 'state-management', color: '#ec4899' },
	{ id: 'tag_tutorial', name: 'tutorial', slug: 'tutorial', color: '#8b5cf6' },
	{ id: 'tag_advanced', name: 'advanced', slug: 'advanced', color: '#ef4444' }
] as const

/**
 * Test content items
 */
export const TEST_CONTENT = [
	{
		id: 'content_recipe_001',
		title: 'Test Recipe: Building a Counter Component',
		type: 'recipe',
		status: 'published',
		body: '# Counter Component\n\nA simple counter component using Svelte 5 runes.\n\n```svelte\n<script>\nlet count = $state(0);\n</script>\n\n<button onclick={() => count++}>\n  Count: {count}\n</button>\n```',
		slug: 'test-recipe-counter-component',
		description: 'Learn how to build a simple counter component',
		metadata: { difficulty: 'beginner', readTime: 5 },
		authorId: 'test_admin_001',
		tags: ['tag_svelte', 'tag_components', 'tag_tutorial'],
		published: true
	},
	{
		id: 'content_video_001',
		title: 'Test Video: Svelte 5 Introduction',
		type: 'video',
		status: 'published',
		body: 'Introduction to Svelte 5 features and runes.',
		slug: 'test-video-svelte-5-intro',
		description: 'A comprehensive introduction to Svelte 5',
		metadata: {
			url: 'https://www.youtube.com/watch?v=test123',
			duration: 600,
			youtubeId: 'test123',
			thumbnail: 'https://i.ytimg.com/vi/test123/maxresdefault.jpg',
			channelTitle: 'Svelte Society'
		},
		authorId: 'test_admin_001',
		tags: ['tag_svelte', 'tag_sveltekit'],
		published: true
	},
	{
		id: 'content_library_001',
		title: 'Test Library: Svelte Testing Library',
		type: 'library',
		status: 'published',
		body: 'A testing library for Svelte components.',
		slug: 'test-library-testing-library',
		description: 'Utilities for testing Svelte components',
		metadata: {
			npm: '@testing-library/svelte',
			github: 'https://github.com/testing-library/svelte-testing-library',
			stars: 1500,
			thumbnail: 'https://opengraph.githubassets.com/test/testing-library/svelte-testing-library'
		},
		authorId: 'test_admin_001',
		tags: ['tag_testing', 'tag_svelte'],
		published: true
	},
	{
		id: 'content_library_002',
		title: 'Test Library: Svelte Store Utils',
		type: 'library',
		status: 'published',
		body: 'Utility functions for Svelte stores.',
		slug: 'test-library-store-utils',
		description: 'Helpful utilities for working with Svelte stores',
		metadata: {
			npm: 'svelte-store-utils',
			github: 'https://github.com/svelte-society/svelte-store-utils',
			stars: 500,
			forks: 50,
			issues: 5,
			updatedAt: '2024-01-15T10:00:00Z',
			thumbnail: 'https://opengraph.githubassets.com/test/svelte-society/svelte-store-utils'
		},
		authorId: 'test_admin_001',
		tags: ['tag_state', 'tag_svelte'],
		published: true
	},
	{
		id: 'content_announcement_001',
		title: 'Test Announcement: Svelte 5 Released',
		type: 'announcement',
		status: 'published',
		body: '# Svelte 5 is Here!\n\nWe are excited to announce the release of Svelte 5...',
		slug: 'test-announcement-svelte-5-released',
		description: 'Major new release of Svelte with runes and more',
		metadata: null,
		authorId: 'test_admin_001',
		tags: ['tag_svelte'],
		published: true
	},
	{
		id: 'content_collection_001',
		title: 'Test Collection: Best Svelte Components',
		type: 'collection',
		status: 'published',
		body: '# Best Svelte Components\n\nA curated list of the best Svelte components...',
		slug: 'test-collection-best-components',
		description: 'Curated collection of top Svelte components',
		metadata: null,
		authorId: 'test_admin_001',
		tags: ['tag_components'],
		published: true,
		children: ['content_library_001', 'content_recipe_001']
	},
	{
		id: 'content_resource_001',
		title: 'Test Resource: Svelte Documentation',
		type: 'resource',
		status: 'published',
		body: '',
		slug: 'test-resource-svelte-docs',
		description: 'Official Svelte documentation and learning resources',
		metadata: {
			link: 'https://svelte.dev',
			image: 'https://svelte.dev/images/twitter-thumbnail.jpg'
		},
		authorId: 'test_admin_001',
		tags: ['tag_svelte', 'tag_tutorial'],
		published: true
	}
] as const

/**
 * Helper to get expiration date (60 days from now)
 */
function getExpiresAt(): string {
	const date = new Date()
	date.setDate(date.getDate() + 60)
	return date.toISOString()
}

/**
 * Test job listings
 */
export const TEST_JOBS = [
	{
		id: 'content_job_001',
		title: 'Senior Svelte Developer',
		type: 'job',
		status: 'published',
		body: `## About the Role

We're looking for a Senior Svelte Developer to join our growing team. You'll be working on cutting-edge web applications using Svelte 5 and SvelteKit.

### Responsibilities
- Lead development of new features using Svelte 5
- Mentor junior developers
- Contribute to architecture decisions
- Write clean, maintainable code

### Requirements
- 5+ years of frontend development experience
- 2+ years with Svelte/SvelteKit
- Strong TypeScript skills
- Experience with testing frameworks`,
		slug: 'senior-svelte-developer-acme',
		description:
			"Join our team as a Senior Svelte Developer and build amazing web applications using Svelte 5 and SvelteKit. You'll be working on cutting-edge projects that push the boundaries of what's possible on the web.\n\nWe're looking for someone who is passionate about creating exceptional user experiences and writing clean, maintainable code. You'll have the opportunity to mentor junior developers and contribute to architecture decisions that shape the future of our platform.\n\nThis is a fully remote position with competitive compensation, equity, and a flexible work environment that values work-life balance.",
		metadata: {
			company_name: 'Acme Corp',
			company_logo: 'https://ui-avatars.com/api/?name=Acme+Corp&background=ff3e00&color=fff',
			company_website: 'https://acme.example.com',
			employer_email: 'jobs@acme.example.com',
			position_type: 'full-time',
			seniority_level: 'senior',
			salary_min: 120000,
			salary_max: 160000,
			salary_currency: 'USD',
			remote_status: 'remote',
			remote_restrictions: 'US/Canada only',
			location: null,
			tier_id: 'tier_premium',
			tier_name: 'premium',
			expires_at: getExpiresAt(),
			payment_id: 'payment_001'
		},
		authorId: 'test_admin_001',
		tags: ['tag_svelte', 'tag_sveltekit'],
		published: true
	},
	{
		id: 'content_job_002',
		title: 'Frontend Engineer - Svelte',
		type: 'job',
		status: 'published',
		body: `## The Opportunity

TechStart is seeking a talented Frontend Engineer to help build our next-generation SaaS platform.

### What You'll Do
- Build responsive, accessible UI components
- Collaborate with designers and backend engineers
- Optimize performance and user experience
- Participate in code reviews

### What We're Looking For
- 3+ years of frontend experience
- Proficiency in Svelte or willingness to learn
- CSS/Tailwind expertise
- Good communication skills`,
		slug: 'frontend-engineer-svelte-techstart',
		description:
			"Build beautiful, performant web applications with Svelte at TechStart. We're a fast-growing SaaS company looking for talented engineers who want to make a real impact on our product and millions of users worldwide.\n\nAs a Frontend Engineer, you'll collaborate closely with designers and backend engineers to deliver pixel-perfect, accessible UI components. You'll have ownership over key features and the autonomy to make technical decisions that improve our codebase.\n\nWe offer a hybrid work environment in our beautiful San Francisco office, comprehensive benefits, and the opportunity to grow with an innovative team.",
		metadata: {
			company_name: 'TechStart',
			company_logo: 'https://ui-avatars.com/api/?name=TechStart&background=3b82f6&color=fff',
			company_website: 'https://techstart.example.com',
			employer_email: 'careers@techstart.example.com',
			position_type: 'full-time',
			seniority_level: 'mid',
			salary_min: 90000,
			salary_max: 120000,
			salary_currency: 'USD',
			remote_status: 'hybrid',
			remote_restrictions: null,
			location: 'San Francisco, CA',
			tier_id: 'tier_featured',
			tier_name: 'featured',
			expires_at: getExpiresAt(),
			payment_id: 'payment_002'
		},
		authorId: 'test_admin_001',
		tags: ['tag_svelte', 'tag_components'],
		published: true
	},
	{
		id: 'content_job_003',
		title: 'Junior Svelte Developer',
		type: 'job',
		status: 'published',
		body: `## Start Your Career with Us

Perfect opportunity for developers new to Svelte who want to grow their skills.

### The Role
- Work alongside senior developers
- Build features using Svelte 5
- Learn best practices and modern tooling
- Grow your skills in a supportive environment

### Requirements
- Some experience with JavaScript/TypeScript
- Basic understanding of web development
- Enthusiasm to learn Svelte
- Strong problem-solving skills`,
		slug: 'junior-svelte-developer-growthco',
		description:
			"Launch your career as a Svelte developer at GrowthCo, where we believe in investing in talent and helping you grow. This is the perfect opportunity for developers who are eager to learn and build real-world applications.\n\nYou'll work alongside experienced senior developers who are passionate about mentoring and knowledge sharing. Our supportive environment encourages questions, experimentation, and continuous learning.\n\nWe're located in the heart of Austin's tech scene, offering a vibrant office culture, competitive salary, and a clear path for career advancement.",
		metadata: {
			company_name: 'GrowthCo',
			company_logo: 'https://ui-avatars.com/api/?name=GrowthCo&background=22c55e&color=fff',
			company_website: 'https://growthco.example.com',
			employer_email: 'hr@growthco.example.com',
			position_type: 'full-time',
			seniority_level: 'junior',
			salary_min: 60000,
			salary_max: 80000,
			salary_currency: 'USD',
			remote_status: 'on-site',
			remote_restrictions: null,
			location: 'Austin, TX',
			tier_id: 'tier_basic',
			tier_name: 'basic',
			expires_at: getExpiresAt(),
			payment_id: 'payment_003'
		},
		authorId: 'test_admin_001',
		tags: ['tag_svelte'],
		published: true
	},
	{
		id: 'content_job_004',
		title: 'Svelte Consultant (Contract)',
		type: 'job',
		status: 'published',
		body: `## Contract Opportunity

Looking for an experienced Svelte consultant for a 6-month project.

### Project Details
- Migrate existing React app to SvelteKit
- Set up CI/CD and testing
- Train internal team on Svelte best practices

### Requirements
- Expert-level Svelte/SvelteKit knowledge
- Experience with React migrations
- Strong consulting/communication skills
- Available for 40 hours/week`,
		slug: 'svelte-consultant-contract-enterprise',
		description:
			"Help Enterprise Inc. migrate their flagship product from React to SvelteKit as a contract consultant. This is a high-impact, 6-month engagement with potential for extension based on project needs.\n\nYou'll be the technical lead on this migration, working directly with stakeholders to define the roadmap, set up best practices, and ensure a smooth transition. You'll also train their internal team on Svelte development patterns.\n\nWe offer competitive hourly rates, flexible working hours, and the opportunity to work with a Fortune 500 company on a transformative project.",
		metadata: {
			company_name: 'Enterprise Inc',
			company_logo: 'https://ui-avatars.com/api/?name=Enterprise&background=6366f1&color=fff',
			company_website: 'https://enterprise.example.com',
			employer_email: 'contracts@enterprise.example.com',
			position_type: 'contract',
			seniority_level: 'principal',
			salary_min: 150,
			salary_max: 200,
			salary_currency: 'USD',
			remote_status: 'remote',
			remote_restrictions: 'EU timezone preferred',
			location: null,
			tier_id: 'tier_premium',
			tier_name: 'premium',
			expires_at: getExpiresAt(),
			payment_id: 'payment_004'
		},
		authorId: 'test_admin_001',
		tags: ['tag_svelte', 'tag_sveltekit'],
		published: true
	},
	{
		id: 'content_job_005',
		title: 'Svelte/SvelteKit Intern',
		type: 'job',
		status: 'published',
		body: `## Summer Internship

Join us for a summer internship focused on Svelte development.

### What You'll Learn
- Modern frontend development with Svelte 5
- SvelteKit for full-stack applications
- Testing and CI/CD practices
- Agile development methodology

### Who Should Apply
- Currently pursuing CS or related degree
- Basic JavaScript knowledge
- Interest in modern web development
- Available for summer 2025`,
		slug: 'svelte-intern-summer-startup',
		description:
			"Summer internship opportunity to learn Svelte at Startup Labs, one of NYC's most exciting startups. Perfect for students who want hands-on experience with modern web development in a fast-paced environment.\n\nDuring your internship, you'll work on real features that ship to production, participate in code reviews, and learn from experienced engineers. We provide structured mentorship and regular feedback to ensure you get the most out of your experience.\n\nWe offer competitive hourly pay, a hybrid work arrangement, and the possibility of a full-time offer for outstanding performers.",
		metadata: {
			company_name: 'Startup Labs',
			company_logo: 'https://ui-avatars.com/api/?name=Startup+Labs&background=f59e0b&color=fff',
			company_website: 'https://startuplabs.example.com',
			employer_email: 'internships@startuplabs.example.com',
			position_type: 'internship',
			seniority_level: 'entry',
			salary_min: 25,
			salary_max: 30,
			salary_currency: 'USD',
			remote_status: 'hybrid',
			remote_restrictions: null,
			location: 'New York, NY',
			tier_id: 'tier_basic',
			tier_name: 'basic',
			expires_at: getExpiresAt(),
			payment_id: 'payment_005'
		},
		authorId: 'test_admin_001',
		tags: ['tag_svelte'],
		published: true
	}
] as const

/**
 * Test bookmarks/saves
 */
export const TEST_SAVES = [
	{ userId: 'test_viewer_001', contentId: 'content_recipe_001' },
	{ userId: 'test_viewer_001', contentId: 'content_video_001' },
	{ userId: 'test_contrib_001', contentId: 'content_library_001' }
] as const

/**
 * Helper to get expiration date for sponsors (30 days from now)
 */
function getSponsorExpiresAt(): string {
	const date = new Date()
	date.setDate(date.getDate() + 30)
	return date.toISOString()
}

/**
 * Test sponsors (matches sponsors table schema)
 */
export const TEST_SPONSORS = [
	{
		id: 'sponsor_001',
		company_name: 'Acme Dev Tools',
		logo_url: 'https://ui-avatars.com/api/?name=Acme&background=ff3e00&color=fff',
		tagline: 'Developer tools that just work',
		website_url: 'https://acme.example.com',
		discount_code: 'SVELTE20',
		discount_description: '20% off for Svelte developers',
		contact_email: 'sponsors@acme.example.com',
		status: 'active',
		activated_at: new Date().toISOString(),
		expires_at: null // Managed by subscription
	},
	{
		id: 'sponsor_002',
		company_name: 'CloudHost Pro',
		logo_url: 'https://ui-avatars.com/api/?name=CloudHost&background=3b82f6&color=fff',
		tagline: 'Fast and reliable hosting for Svelte apps',
		website_url: 'https://cloudhost.example.com',
		discount_code: null,
		discount_description: null,
		contact_email: 'hello@cloudhost.example.com',
		status: 'active',
		activated_at: new Date().toISOString(),
		expires_at: null
	},
	{
		id: 'sponsor_003',
		company_name: 'Pending Corp',
		logo_url: 'https://ui-avatars.com/api/?name=Pending&background=f59e0b&color=fff',
		tagline: 'Awaiting approval',
		website_url: 'https://pending.example.com',
		discount_code: null,
		discount_description: null,
		contact_email: 'contact@pending.example.com',
		status: 'pending',
		activated_at: null,
		expires_at: null
	},
	{
		id: 'sponsor_004',
		company_name: 'Awaiting Inc',
		logo_url: 'https://ui-avatars.com/api/?name=Awaiting&background=8b5cf6&color=fff',
		tagline: 'Waiting for activation',
		website_url: 'https://awaiting.example.com',
		discount_code: null,
		discount_description: null,
		contact_email: 'hello@awaiting.example.com',
		status: 'pending',
		activated_at: null,
		expires_at: null
	}
] as const

/**
 * Test sponsor subscriptions (links sponsors to tiers)
 */
export const TEST_SPONSOR_SUBSCRIPTIONS = [
	{
		id: 'subscription_001',
		sponsor_id: 'sponsor_001',
		tier_id: 'sponsor_tier_premium',
		billing_type: 'monthly',
		stripe_subscription_id: null,
		stripe_customer_id: null,
		stripe_checkout_session_id: 'test_session_001',
		amount_cents: 24900,
		currency: 'usd',
		status: 'active',
		current_period_start: new Date().toISOString(),
		current_period_end: getSponsorExpiresAt()
	},
	{
		id: 'subscription_002',
		sponsor_id: 'sponsor_002',
		tier_id: 'sponsor_tier_basic',
		billing_type: 'yearly',
		stripe_subscription_id: null,
		stripe_customer_id: null,
		stripe_checkout_session_id: 'test_session_002',
		amount_cents: 99900,
		currency: 'usd',
		status: 'active',
		current_period_start: new Date().toISOString(),
		current_period_end: getSponsorExpiresAt()
	},
	{
		id: 'subscription_003',
		sponsor_id: 'sponsor_003',
		tier_id: 'sponsor_tier_basic',
		billing_type: 'one_time',
		stripe_subscription_id: null,
		stripe_customer_id: null,
		stripe_checkout_session_id: 'test_session_003',
		amount_cents: 9900,
		currency: 'usd',
		status: 'incomplete', // Pending payment
		current_period_start: null,
		current_period_end: null
	},
	{
		id: 'subscription_004',
		sponsor_id: 'sponsor_004',
		tier_id: 'sponsor_tier_premium',
		billing_type: 'monthly',
		stripe_subscription_id: null,
		stripe_customer_id: null,
		stripe_checkout_session_id: 'test_session_004',
		amount_cents: 24900,
		currency: 'usd',
		status: 'incomplete', // Pending payment
		current_period_start: null,
		current_period_end: null
	}
] as const

/**
 * Test sponsor tiers
 */
export const TEST_SPONSOR_TIERS = [
	{
		id: 'sponsor_tier_basic',
		name: 'basic',
		display_name: 'Basic',
		price_cents: 9900,
		yearly_price_cents: 99900,
		one_time_price_cents: 9900,
		features: ['Logo in sidebar', 'Logo in feed', 'Link to website'],
		max_tagline_length: 100,
		logo_size: 'normal',
		display_order: 1
	},
	{
		id: 'sponsor_tier_premium',
		name: 'premium',
		display_name: 'Premium',
		price_cents: 24900,
		yearly_price_cents: 249900,
		one_time_price_cents: 24900,
		features: [
			'Large logo in sidebar',
			'Large logo in feed',
			'Link to website',
			'Discount code display',
			'Priority placement'
		],
		max_tagline_length: 200,
		logo_size: 'large',
		display_order: 2
	}
] as const

/**
 * Test feed items for feed builder testing
 * Includes both CTA items and sponsor-linked items
 */
export const TEST_FEED_ITEMS = [
	{
		id: 'feed_item_cta_001',
		content_id: null,
		sponsor_id: null,
		item_type: 'cta',
		title: 'Join the Svelte Community',
		description: 'Connect with thousands of Svelte developers worldwide',
		button_text: 'Join Now',
		button_href: '/community',
		position_type: 'random',
		position_fixed: null,
		position_range_min: 3,
		position_range_max: 8,
		start_date: null,
		end_date: null,
		is_active: true,
		priority: 50,
		created_by: 'test_admin_001'
	},
	{
		id: 'feed_item_sponsor_001',
		content_id: null,
		sponsor_id: 'sponsor_001', // Acme Dev Tools - Premium tier
		item_type: 'sponsor',
		title: null,
		description: null,
		button_text: null,
		button_href: null,
		position_type: 'random',
		position_fixed: null,
		position_range_min: 2,
		position_range_max: 5,
		start_date: new Date().toISOString(),
		end_date: getSponsorExpiresAt(),
		is_active: true,
		priority: 100, // Premium sponsors get higher priority
		created_by: null
	},
	{
		id: 'feed_item_sponsor_002',
		content_id: null,
		sponsor_id: 'sponsor_002', // CloudHost Pro - Basic tier
		item_type: 'sponsor',
		title: null,
		description: null,
		button_text: null,
		button_href: null,
		position_type: 'random',
		position_fixed: null,
		position_range_min: 5,
		position_range_max: 10,
		start_date: new Date().toISOString(),
		end_date: getSponsorExpiresAt(),
		is_active: true,
		priority: 50, // Basic sponsors get lower priority
		created_by: null
	}
] as const

/**
 * Test pending content entries (replacing moderation queue)
 * These are content items with status='pending_review' awaiting moderation
 */
export const TEST_PENDING_CONTENT = [
	{
		id: 'content_pending_001',
		title: 'Test Pending: New Animation Tutorial',
		type: 'recipe',
		status: 'pending_review',
		body: '# Animation Tutorial\n\nLearn how to create smooth animations...',
		slug: 'test-pending-animation-tutorial',
		description: 'Advanced animation techniques',
		metadata: {
			submitter_notes: '',
			submitted_at: new Date().toISOString()
		},
		authorId: 'test_contrib_001',
		tags: ['tag_animation', 'tag_svelte']
	},
	{
		id: 'content_pending_002',
		title: 'Svelte 5 Fundamentals Tutorial',
		type: 'video',
		status: 'pending_review',
		body: '',
		slug: 'test-pending-svelte-5-fundamentals',
		description: 'Learn Svelte 5 fundamentals in this comprehensive tutorial',
		metadata: {
			watchUrl: 'https://www.youtube.com/watch?v=test456',
			embedUrl: 'https://www.youtube.com/embed/test456',
			thumbnail: 'https://i.ytimg.com/vi/test456/maxresdefault.jpg',
			submitter_notes: '',
			submitted_at: new Date().toISOString()
		},
		authorId: 'test_viewer_001',
		tags: ['tag_svelte', 'tag_tutorial']
	}
] as const

/**
 * Helper to get session expiry date (1 year from now)
 * Format matches what SessionService expects for SQLite
 */
export function getSessionExpiry(): string {
	const date = new Date()
	date.setFullYear(date.getFullYear() + 1)
	return date.toISOString().replace('T', ' ').replace('Z', '')
}

/**
 * Helper to get yesterday's date (for published content)
 * Format matches what SessionService expects for SQLite
 */
export function getYesterday(): string {
	return new Date(Date.now() - 86400000).toISOString().replace('T', ' ').replace('Z', '')
}
