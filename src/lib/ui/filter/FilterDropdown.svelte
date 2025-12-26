<script lang="ts">
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import FilterSubmenu from './FilterSubmenu.svelte'

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
		<FilterSubmenu
			label="Categories"
			items={filterOptions.categories}
			buildHref={(item) => `/${item.value}`}
		/>
		<FilterSubmenu
			label="Tags"
			items={filterOptions.tags}
			buildHref={(item) => `?tags=${item.value}`}
		/>
		<FilterSubmenu
			label="Authors"
			items={filterOptions.authors}
			buildHref={(item) => `?author=${item.value}`}
		/>
	</div>
</div>
