export const CONTENT_SOURCE_FIXTURES = {
	library: {
		id: 'review_source_library',
		type: 'library',
		metadata: {
			github: 'https://github.com/example/svelte-components',
			packagePath: 'packages/svelte',
			submitter_notes:
				'Svelte components in a monorepo.\n<img data-testid="notes-html-probe" src=x onerror="alert(1)">'
		}
	},
	resource: {
		id: 'review_source_resource',
		type: 'resource',
		metadata: { link: 'https://svelte.dev/docs/svelte/overview' }
	},
	video: {
		id: 'review_source_video',
		type: 'video',
		metadata: { watchUrl: 'https://www.youtube.com/watch?v=abc123_-XYZ' }
	},
	imported: {
		id: 'review_source_imported',
		type: 'library',
		metadata: {
			packageUrl: 'https://github.com/example/ui/tree/next/packages/svelte',
			externalSource: {
				source: 'github',
				externalId: 'example/ui',
				url: 'https://github.com/example/ui',
				lastFetched: '2026-09-25T10:00:00.000Z'
			}
		}
	},
	unsafe: {
		id: 'review_source_unsafe',
		type: 'library',
		metadata: {
			github: 'javascript:alert(1)',
			packageUrl: 'data:text/html,<script>alert(1)</script>',
			externalSource: { source: 'github', url: 'javascript:alert(1)' },
			submitter_notes: 'These URLs need review.'
		}
	},
	noSource: {
		id: 'review_source_none',
		type: 'recipe',
		metadata: {}
	}
} as const
