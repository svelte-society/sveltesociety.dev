<script lang="ts">
	import { browser } from '$app/environment'
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import Check from 'phosphor-svelte/lib/Check'
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass'
	import { searchAvailableContent } from './shortcuts.remote'

	type ContentOption = {
		id: string
		title: string
		type: string
	}

	type Props = {
		value?: string
		name: string
		excludeShortcutId?: string
		placeholder?: string
		disabled?: boolean
		testId?: string
	}

	let {
		value = $bindable(),
		name,
		excludeShortcutId,
		placeholder = 'Search content...',
		disabled = false,
		testId
	}: Props = $props()

	let searchQuery = $state('')
	let options = $state<ContentOption[]>([])
	let isLoading = $state(false)
	let open = $state(false)
	let selectedIndex = $state(-1)
	let inputElement: HTMLInputElement | undefined = $state()
	let debounceTimer: ReturnType<typeof setTimeout> | null = null

	const selectedOption = $derived(options.find((opt) => opt.id === value))

	async function search(query: string) {
		isLoading = true
		try {
			options = await searchAvailableContent({
				search: query,
				excludeShortcutId,
				limit: 20
			})
		} catch (error) {
			console.error('Error searching content:', error)
			options = []
		} finally {
			isLoading = false
		}
	}

	function handleSearchInput(e: Event) {
		const query = (e.target as HTMLInputElement).value
		searchQuery = query
		open = true
		selectedIndex = -1
		if (debounceTimer) clearTimeout(debounceTimer)
		debounceTimer = setTimeout(() => search(query), 300)
	}

	function handleSelect(option: ContentOption) {
		value = option.id
		searchQuery = option.title
		open = false
		selectedIndex = -1
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!open || options.length === 0) {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				open = true
			}
			return
		}

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault()
				selectedIndex = Math.min(selectedIndex + 1, options.length - 1)
				break
			case 'ArrowUp':
				event.preventDefault()
				selectedIndex = Math.max(selectedIndex - 1, 0)
				break
			case 'Enter':
				event.preventDefault()
				if (selectedIndex >= 0 && selectedIndex < options.length) {
					handleSelect(options[selectedIndex])
				}
				break
			case 'Escape':
				event.preventDefault()
				open = false
				selectedIndex = -1
				break
		}
	}

	function handleBlur() {
		// Delay to allow click events on dropdown items to fire
		setTimeout(() => {
			open = false
			selectedIndex = -1
		}, 150)
	}
</script>

<!-- Hidden input for form submission -->
<input type="hidden" {name} {value} {disabled} />

<div class="relative">
	<input
		bind:this={inputElement}
		type="text"
		class="w-full rounded-md border-2 border-transparent bg-slate-100 py-1.5 pr-8 pl-8 text-sm placeholder-slate-500 focus:outline-2 focus:outline-svelte-300 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
		{placeholder}
		{disabled}
		value={searchQuery || selectedOption?.title || ''}
		oninput={handleSearchInput}
		onfocus={() => (open = true)}
		onblur={handleBlur}
		onkeydown={handleKeydown}
		data-testid={testId}
	/>
	<MagnifyingGlass class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
	<button
		type="button"
		class="absolute right-2 top-1/2 -translate-y-1/2"
		onclick={() => {
			open = !open
			inputElement?.focus()
		}}
		tabindex={-1}
		{disabled}
	>
		<CaretUpDown class="size-4 text-gray-500" />
	</button>

	<!-- Custom dropdown for JS -->
	{#if browser && open}
		<ul
			role="listbox"
			class="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-xl bg-white px-1 py-3 shadow-2xl"
		>
			{#if isLoading}
				<li class="px-3 py-2 text-sm text-gray-500">Searching...</li>
			{:else if options.length === 0}
				<li class="px-3 py-2 text-sm text-gray-500">
					{searchQuery ? 'No content found' : 'Start typing to search'}
				</li>
			{:else}
				{#each options as option, i (option.id)}
					<li
						role="option"
						aria-selected={i === selectedIndex}
						class="flex h-10 w-full cursor-pointer items-center rounded-sm py-3 pr-1.5 pl-3 text-sm {i ===
						selectedIndex
							? 'bg-gray-100'
							: 'hover:bg-gray-100'}"
						onmousedown={() => handleSelect(option)}
						onmouseenter={() => (selectedIndex = i)}
					>
						<div class="flex flex-col">
							<span class="font-medium">{option.title}</span>
							<span class="text-xs text-gray-500">{option.type}</span>
						</div>
						{#if option.id === value}
							<div class="ml-auto">
								<Check />
							</div>
						{/if}
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>
