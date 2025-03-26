<script lang="ts">
	import Button from '$lib/ui/Button.svelte'

	let value = $state('')
</script>

<form
	method="GET"
	action="/"
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
			class="h-8 w-full rounded-md border-none bg-slate-100 pr-16 pl-8 text-sm text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-slate-300 focus:outline-none"
			type="search"
			name="search"
			placeholder="Search by title, description or body..."
		/>
		<div class="sr-only">
			<Button type="submit">Search</Button>
		</div>
	</div>
</form>
