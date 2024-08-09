<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let items: any[] = [];
	export let searchField: string = 'name';
	export let valueField: string = 'id';
	export let placeholder: string = 'Search...';
	export let createNew: boolean = false;
	export let error: false;

	let inputValue = '';
	let filteredItems: any[] = [];
	let selectedIndex = -1;
	let showDropdown = false;

	const dispatch = createEventDispatcher();

	$: {
		if (inputValue) {
			filteredItems = items.filter((item) =>
				item[searchField].toLowerCase().includes(inputValue.toLowerCase())
			);
			if (
				createNew &&
				!filteredItems.some((item) => item[searchField].toLowerCase() === inputValue.toLowerCase())
			) {
				filteredItems = [{ [searchField]: inputValue, isNew: true }, ...filteredItems];
			}
		} else {
			filteredItems = [];
		}
		selectedIndex = -1;
	}

	function handleInput() {
		showDropdown = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedIndex = (selectedIndex + 1) % filteredItems.length;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
		} else if (event.key === 'Enter' && selectedIndex !== -1) {
			event.preventDefault();
			selectItem(filteredItems[selectedIndex]);
		}
	}

	function selectItem(item: any) {
		if (item.isNew) {
			dispatch('create', inputValue);
		} else {
			dispatch('select', item[valueField]);
		}
		inputValue = '';
		showDropdown = false;
	}

	function handleBlur() {
		setTimeout(() => {
			showDropdown = false;
		}, 200);
	}
</script>

<div class="relative">
	<input
		type="text"
		bind:value={inputValue}
		oninput={handleInput}
		onkeydown={handleKeydown}
		onblur={handleBlur}
		class:error
		{placeholder}
		class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 pr-7 text-sm text-slate-800 placeholder-slate-500"
	/>
	{#if showDropdown && filteredItems.length > 0}
		<ul
			class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg"
		>
			{#each filteredItems || [] as item, index}
				<li>
					<button
						class="flex w-full cursor-pointer px-3 py-2 hover:bg-gray-100"
						class:bg-blue-100={index === selectedIndex}
						onclick={() => selectItem(item)}
					>
						{#if item.isNew}
							<a href=""><span class="font-semibold">Create:</span> {item[searchField]}</a>
						{:else}
							<slot name="item" {item}>
								{item[searchField]}
							</slot>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="postcss">
	input.error {
		@apply border-red-300 bg-red-50 text-red-600;
	}
</style>
