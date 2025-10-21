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
			youtubeId: 'test123'
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
			npmPackage: '@testing-library/svelte',
			githubUrl: 'https://github.com/testing-library/svelte-testing-library',
			stars: 1500
		},
		authorId: 'test_admin_001',
		tags: ['tag_testing', 'tag_svelte'],
		published: true
	},
	{
		id: 'content_blog_001',
		title: 'Test Blog: Getting Started with Svelte 5',
		type: 'blog',
		status: 'published',
		body: '# Getting Started\n\nSvelte 5 introduces powerful new features...',
		slug: 'test-blog-getting-started',
		description: 'A beginner-friendly guide to Svelte 5',
		metadata: null,
		authorId: 'test_admin_001',
		tags: ['tag_tutorial', 'tag_svelte'],
		published: true
	},
	{
		id: 'content_link_001',
		title: 'Test Link: Official Svelte Documentation',
		type: 'link',
		status: 'published',
		body: '',
		slug: 'test-link-svelte-docs',
		description: 'Link to official Svelte documentation',
		metadata: { url: 'https://svelte.dev' },
		authorId: 'test_admin_001',
		tags: [],
		published: true
	},
	{
		id: 'content_pending_001',
		title: 'Test Pending: New Animation Tutorial',
		type: 'recipe',
		status: 'pending_review',
		body: '# Animation Tutorial\n\nLearn how to create smooth animations...',
		slug: 'test-pending-animation-tutorial',
		description: 'Advanced animation techniques',
		metadata: null,
		authorId: 'test_contrib_001',
		tags: ['tag_animation', 'tag_advanced'],
		published: false
	},
	{
		id: 'content_draft_001',
		title: 'Test Draft: Work in Progress Article',
		type: 'blog',
		status: 'draft',
		body: '# WIP\n\nThis is a work in progress...',
		slug: 'test-draft-wip-article',
		description: 'An article being drafted',
		metadata: null,
		authorId: 'test_contrib_001',
		tags: [],
		published: false
	},
	{
		id: 'content_event_001',
		title: 'Test Event: Svelte Summit 2025',
		type: 'event',
		status: 'published',
		body: 'Join us for Svelte Summit 2025!',
		slug: 'test-event-svelte-summit-2025',
		description: 'Annual Svelte community conference',
		metadata: {
			startDate: '2025-11-15T09:00:00Z',
			endDate: '2025-11-15T18:00:00Z',
			location: 'Virtual',
			url: 'https://sveltesummit.test'
		},
		authorId: 'test_admin_001',
		tags: [],
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
 * Test moderation queue entries
 */
export const TEST_MODERATION_QUEUE = [
	{
		type: 'recipe',
		status: 'pending',
		data: {
			title: 'Test Pending: New Animation Tutorial',
			description: 'Advanced animation techniques',
			body: '# Animation Tutorial\n\nLearn how to create smooth animations...',
			type: 'recipe'
		},
		submittedBy: 'test_contrib_001'
	}
] as const

/**
 * Helper to get session expiry date (1 year from now)
 */
export function getSessionExpiry(): string {
	const date = new Date()
	date.setFullYear(date.getFullYear() + 1)
	return date.toISOString()
}

/**
 * Helper to get yesterday's date (for published content)
 */
export function getYesterday(): string {
	return new Date(Date.now() - 86400000).toISOString()
}
