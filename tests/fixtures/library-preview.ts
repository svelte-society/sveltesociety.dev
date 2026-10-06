export const LIBRARY_PREVIEW_FIXTURES = {
	root: {
		id: 'preview_monorepo_root',
		title: 'Preview fixture repository',
		slug: 'preview-fixture-repository',
		externalId: 'preview-fixture/components'
	},
	package: {
		id: 'preview_monorepo_package',
		title: 'Preview fixture Svelte package',
		slug: 'preview-fixture-svelte-package',
		externalId: 'preview-fixture/components/packages/svelte',
		url: 'https://github.com/preview-fixture/components/tree/main/packages/svelte'
	}
} as const
