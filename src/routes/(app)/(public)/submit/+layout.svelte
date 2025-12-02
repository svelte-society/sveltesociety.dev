<script lang="ts">
	import { page } from '$app/state'
	import ReadCvLogo from 'phosphor-svelte/lib/ReadCvLogo'
	import Video from 'phosphor-svelte/lib/Video'
	import Package from 'phosphor-svelte/lib/Package'
	import Link from 'phosphor-svelte/lib/Link'

	let { children } = $props()

	const isActive = (type: string) => page.url.pathname === `/submit/${type}`

	const contentTypes = [
		{
			type: 'recipe',
			label: 'Recipe',
			icon: ReadCvLogo,
			description: 'Share a code recipe or tutorial'
		},
		{ type: 'video', label: 'Video', icon: Video, description: 'Submit a YouTube video' },
		{ type: 'library', label: 'Library', icon: Package, description: 'Add a library or package' },
		{ type: 'resource', label: 'Resource', icon: Link, description: 'Share a useful resource' }
	]
</script>

<div class="mx-auto grid max-w-3xl gap-6">
	<h1 class="text-2xl font-bold">Submit Content</h1>
	<p class="text-sm text-slate-600">
		Before making a submission, please ensure that the content you are submitting is not already
		listed on the site. Use the search bar to check if the content is already listed.
	</p>

	<nav class="grid grid-cols-2 gap-4 sm:grid-cols-4" data-testid="content-type-nav">
		{#each contentTypes as { type, label, icon: Icon, description }}
			<a
				href="/submit/{type}"
				class="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors {isActive(
					type
				)
					? 'border-orange-500 bg-orange-50'
					: 'border-slate-200 hover:border-orange-300 hover:bg-orange-50'}"
				data-testid="submit-{type}-link"
			>
				<Icon size={32} class={isActive(type) ? 'text-orange-600' : 'text-slate-600'} />
				<span class="font-medium">{label}</span>
				<span class="text-xs text-slate-500">{description}</span>
			</a>
		{/each}
	</nav>

	{@render children()}
</div>
