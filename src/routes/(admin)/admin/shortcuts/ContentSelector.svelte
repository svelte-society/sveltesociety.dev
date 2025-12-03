<script lang="ts">
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import Check from 'phosphor-svelte/lib/Check'
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass'
	import { Combobox } from 'bits-ui'
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

	function handleInput(query: string) {
		searchQuery = query
		if (debounceTimer) clearTimeout(debounceTimer)
		debounceTimer = setTimeout(() => search(query), 300)
	}

	// Load initial options
	$effect(() => {
		search('')
	})
</script>

<Combobox.Root
	type="single"
	bind:value
	{name}
	{disabled}
	onInputValueChange={handleInput}
>
	<div class="relative">
		<Combobox.Input
			class="focus:outline-svelte-300 w-full rounded-md border-2 border-transparent bg-slate-100 py-1.5 pr-8 pl-8 text-sm placeholder-slate-500 focus:outline-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
			{placeholder}
			{disabled}
			data-testid={testId}
		/>
		<MagnifyingGlass class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
		<Combobox.Trigger class="absolute right-2 top-1/2 -translate-y-1/2">
			<CaretUpDown class="size-4 text-gray-500" />
		</Combobox.Trigger>
	</div>

	<Combobox.Portal>
		<Combobox.Content
			class="z-50 w-(--bits-combobox-anchor-width) min-w-(--bits-combobox-anchor-width) rounded-xl bg-white px-1 py-3 shadow-2xl outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1"
		>
			{#if isLoading}
				<div class="px-3 py-2 text-sm text-gray-500">Searching...</div>
			{:else if options.length === 0}
				<div class="px-3 py-2 text-sm text-gray-500">
					{searchQuery ? 'No content found' : 'Start typing to search'}
				</div>
			{:else}
				{#each options as option (option.id)}
					<Combobox.Item
						value={option.id}
						label={`${option.title} (${option.type})`}
						class="flex h-10 w-full cursor-pointer items-center rounded-sm py-3 pr-1.5 pl-3 text-sm outline-hidden select-none data-disabled:opacity-50 data-highlighted:bg-gray-100"
					>
						{#snippet children({ selected })}
							<div class="flex flex-col">
								<span class="font-medium">{option.title}</span>
								<span class="text-xs text-gray-500">{option.type}</span>
							</div>
							{#if selected}
								<div class="ml-auto">
									<Check />
								</div>
							{/if}
						{/snippet}
					</Combobox.Item>
				{/each}
			{/if}
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
