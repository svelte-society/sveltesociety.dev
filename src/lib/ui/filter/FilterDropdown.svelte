<script lang="ts">
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import FilterSubmenu from './FilterSubmenu.svelte'
	import { getCategories, getTags, getAuthors } from './data.remote'
	import { afterNavigate } from '$app/navigation'
	import Dropdown from '$lib/ui/Dropdown.svelte'

	let dropdownRef: { focusTrigger: () => void } | undefined = $state()
	let shouldFocusTrigger = $state(false)

	afterNavigate(() => {
		if (shouldFocusTrigger) {
			dropdownRef?.focusTrigger()
			shouldFocusTrigger = false
		}
	})

	function handleSelect() {
		shouldFocusTrigger = true
	}
</script>

<Dropdown
	bind:this={dropdownRef}
	triggerLabel="Add filter"
	triggerClass="grid w-full min-w-36 cursor-pointer grid-cols-[1fr_auto] items-center rounded-md border-2 border-transparent bg-slate-100 px-3 py-1 pl-2 text-left text-sm focus:outline-2 focus:outline-svelte-300"
	menuLabel="Filter options"
	menuClass="left-0 right-0 min-w-44 rounded-xl bg-white px-1 py-3 shadow-2xl"
	menuItemSelector=":scope > div > div[role='menuitem']"
>
	{#snippet triggerContent()}
		Add Filter
		<CaretUpDown class="ml-auto size-4 text-gray-500" />
	{/snippet}

	<FilterSubmenu label="Categories" paramName="type" getItems={getCategories} onSelect={handleSelect} />
	<FilterSubmenu label="Tags" paramName="tags" getItems={getTags} onSelect={handleSelect} />
	<FilterSubmenu label="Authors" paramName="authors" getItems={getAuthors} onSelect={handleSelect} />
</Dropdown>
