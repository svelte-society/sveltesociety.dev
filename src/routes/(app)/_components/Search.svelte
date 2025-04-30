<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import { page } from '$app/state'

	let value = $state(page.url.searchParams.get('query') || '')

	// Get all search params except 'query' to preserve them
	const otherParams = $derived(
		Array.from(page.url.searchParams.entries()).filter(([key]) => key !== 'query')
	)
</script>

<form
	method="GET"
	action={page.url.pathname}
	data-sveltekit-keepfocus
	data-sveltekit-replacestate
	data-sveltekit-noscroll
	class="relative w-full"
>
	<div class="relative">
		<div class="pointer-events-none absolute inset-y-0 left-2.5 flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 text-slate-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</div>
		<input
			bind:value
			class="h-8 w-full overflow-hidden rounded-md border-none bg-slate-100 pr-2 pl-8 text-sm text-nowrap overflow-ellipsis text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-slate-300 focus:outline-none"
			type="query"
			name="query"
			placeholder="Search by title, description or body..."
		/>
		{#each otherParams as [key, value]}
			<input type="hidden" name={key} {value} />
		{/each}
		<div class="sr-only">
			<Button type="submit">Search</Button>
		</div>
	</div>
</form>
