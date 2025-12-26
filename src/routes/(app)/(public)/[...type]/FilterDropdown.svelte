<script lang="ts">
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import CaretRight from 'phosphor-svelte/lib/CaretRight'

	// Dummy data for now
	const filterOptions = {
		categories: [
			{ label: 'Recipe', value: 'recipe' },
			{ label: 'Video', value: 'video' },
			{ label: 'Library', value: 'library' },
			{ label: 'Resource', value: 'resource' },
			{ label: 'Announcement', value: 'announcement' },
			{ label: 'Collection', value: 'collection' }
		],
		tags: [
			{ label: 'SvelteKit', value: 'sveltekit' },
			{ label: 'Components', value: 'components' },
			{ label: 'Animation', value: 'animation' },
			{ label: 'Forms', value: 'forms' },
			{ label: 'State Management', value: 'state-management' },
			{ label: 'Testing', value: 'testing' },
			{ label: 'TypeScript', value: 'typescript' },
			{ label: 'CSS', value: 'css' }
		],
		authors: [
			{ label: 'Rich Harris', value: 'rich-harris' },
			{ label: 'Geoff Rich', value: 'geoff-rich' },
			{ label: 'Dominik G', value: 'dominik-g' },
			{ label: 'Puru Vijay', value: 'puru-vijay' }
		]
	}
</script>

<div class="group/dropdown relative inline-block">
	<!-- Trigger button - styled like Select component -->
	<button
		type="button"
		class="grid w-full min-w-36 grid-cols-[1fr_auto] items-center rounded-md border-2 border-transparent bg-slate-100 px-3 py-1 pl-2 text-left text-sm focus:outline-2 focus:outline-svelte-300"
	>
		Add Filter
		<CaretUpDown class="ml-auto size-4 text-gray-500" />
	</button>

	<!-- First level dropdown - styled like Select content -->
	<div
		class="invisible absolute left-0 top-full z-50 mt-1 min-w-44 rounded-xl bg-white px-1 py-3 opacity-0 shadow-2xl transition-all select-none group-focus-within/dropdown:visible group-focus-within/dropdown:opacity-100"
	>
		<!-- Categories -->
		<div class="group/categories relative">
			<button
				type="button"
				class="flex h-8 w-full items-center justify-between rounded-sm py-3 pr-1.5 pl-3 text-left text-sm outline-hidden hover:bg-gray-100 focus:bg-gray-100"
			>
				<span>Categories</span>
				<CaretRight class="size-4 text-gray-400" />
			</button>
			<!-- Categories submenu -->
			<div
				class="invisible absolute left-full top-0 ml-1 min-w-44 rounded-xl bg-white px-1 py-3 opacity-0 shadow-2xl transition-all select-none group-focus-within/categories:visible group-focus-within/categories:opacity-100"
			>
				{#each filterOptions.categories as category (category.value)}
					<a
						href="/{category.value}"
						class="flex h-8 w-full items-center rounded-sm py-3 pr-1.5 pl-3 text-sm outline-hidden hover:bg-gray-100 focus:bg-gray-100"
					>
						{category.label}
					</a>
				{/each}
			</div>
		</div>

		<!-- Tags -->
		<div class="group/tags relative">
			<button
				type="button"
				class="flex h-8 w-full items-center justify-between rounded-sm py-3 pr-1.5 pl-3 text-left text-sm outline-hidden hover:bg-gray-100 focus:bg-gray-100"
			>
				<span>Tags</span>
				<CaretRight class="size-4 text-gray-400" />
			</button>
			<!-- Tags submenu -->
			<div
				class="invisible absolute left-full top-0 ml-1 min-w-44 rounded-xl bg-white px-1 py-3 opacity-0 shadow-2xl transition-all select-none group-focus-within/tags:visible group-focus-within/tags:opacity-100"
			>
				{#each filterOptions.tags as tag (tag.value)}
					<a
						href="?tags={tag.value}"
						class="flex h-8 w-full items-center rounded-sm py-3 pr-1.5 pl-3 text-sm outline-hidden hover:bg-gray-100 focus:bg-gray-100"
					>
						{tag.label}
					</a>
				{/each}
			</div>
		</div>

		<!-- Authors -->
		<div class="group/authors relative">
			<button
				type="button"
				class="flex h-8 w-full items-center justify-between rounded-sm py-3 pr-1.5 pl-3 text-left text-sm outline-hidden hover:bg-gray-100 focus:bg-gray-100"
			>
				<span>Authors</span>
				<CaretRight class="size-4 text-gray-400" />
			</button>
			<!-- Authors submenu -->
			<div
				class="invisible absolute left-full top-0 ml-1 min-w-44 rounded-xl bg-white px-1 py-3 opacity-0 shadow-2xl transition-all select-none group-focus-within/authors:visible group-focus-within/authors:opacity-100"
			>
				{#each filterOptions.authors as author (author.value)}
					<a
						href="?author={author.value}"
						class="flex h-8 w-full items-center rounded-sm py-3 pr-1.5 pl-3 text-sm outline-hidden hover:bg-gray-100 focus:bg-gray-100"
					>
						{author.label}
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
