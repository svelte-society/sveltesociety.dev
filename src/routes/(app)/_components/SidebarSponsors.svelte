<script lang="ts">
	import Plus from 'phosphor-svelte/lib/Plus'
</script>

<div class="grid gap-3 rounded border border-slate-200 bg-gray-50 p-4">
	<div class="flex items-center justify-between">
		<h3 class="text-md font-bold">Sponsors</h3>
		<a href="/sponsors" class="text-svelte-500 text-xs hover:underline">Learn more</a>
	</div>

	<div class="space-y-2">
		{#each Array(3) as _, i (i)}
			<a
				href="/sponsors"
				class="group grid grid-cols-[auto_1fr] gap-3 rounded border border-dashed border-slate-300 bg-white p-2 transition-colors hover:border-orange-400 hover:bg-orange-50"
			>
				<!-- Placeholder logo -->
				<div
					class="flex h-10 w-10 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 transition-colors group-hover:border-orange-400 group-hover:bg-orange-100"
				>
					<Plus size={16} class="text-slate-400 transition-colors group-hover:text-orange-500" />
				</div>
				<!-- Placeholder content -->
				<div class="flex flex-col justify-center">
					<span
						class="text-xs font-medium text-slate-400 transition-colors group-hover:text-orange-600"
					>
						Your company here
					</span>
					<span class="text-[10px] text-slate-400">Sponsor slot available</span>
				</div>
			</a>
		{/each}
	</div>

	<p class="text-xs text-gray-600">
		Support Svelte Society and get your company featured to thousands of developers.
	</p>

	<a
		href="/sponsors"
		class="mt-1 block rounded bg-orange-500 px-3 py-1.5 text-center text-xs font-medium text-white transition-colors hover:bg-orange-600"
	>
		Become a Sponsor
	</a>
</div>
