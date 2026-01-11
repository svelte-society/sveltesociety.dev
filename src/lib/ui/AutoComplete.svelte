<script lang="ts">
	import { Combobox } from 'bits-ui'
	import { inputVariants } from './input.variants'

	// Define a generic type for the items
	type Item = Record<string, any>

	const {
		/** Array of items to display in the autocomplete dropdown */
		items = [],
		/** Field name to use for displaying and searching items */
		searchField = 'name',
		/** Field name to use as the value when an item is selected */
		valueField = 'id',
		/** Placeholder text for the input field */
		placeholder = 'Search...',
		/** Whether to allow creating new items when no match is found */
		createNew = false,
		/** Whether to display the input in an error state */
		error = false,
		/** Callback function when an item is selected */
		onSelect = undefined
	} = $props<{
		items?: Item[]
		searchField?: string
		valueField?: string
		placeholder?: string
		createNew?: boolean
		error?: boolean
		onSelect?: (value: string, item: Item | undefined, isNew?: boolean) => void
	}>()

	let searchValue = $state('')
	let open = $state(false)

	const filteredItems = $derived(
		searchValue === ''
			? []
			: items.filter((item: Item) =>
					item[searchField].toLowerCase().includes(searchValue.toLowerCase())
				)
	)

	const displayItems = $derived(
		createNew &&
			searchValue &&
			!filteredItems.some(
				(item: Item) => item[searchField].toLowerCase() === searchValue.toLowerCase()
			)
			? [{ [searchField]: searchValue, [valueField]: searchValue, isNew: true }, ...filteredItems]
			: filteredItems
	)

	function handleSelect(value: string) {
		const selectedItem = displayItems.find((item: Item) => item[valueField] === value)

		if (selectedItem?.isNew) {
			console.log('create', searchValue)
			if (onSelect) onSelect(value, selectedItem, true)
		} else {
			console.log('select', value)
			if (onSelect) onSelect(value, selectedItem, false)
		}

		searchValue = ''
		open = false
	}

	function handleOpenChange(isOpen: boolean) {
		open = isOpen
		if (!isOpen) {
			searchValue = ''
		}
	}
</script>

<!--
@component
A customizable autocomplete component built with bits-ui Combobox.

Features:
- Filtering items as you type
- Optional "create new" functionality
- Error state styling
- Customizable field mappings
- Callback for selection handling

## Usage

Basic usage:
```svelte
<AutoComplete 
  items={[
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Banana' },
    { id: '3', name: 'Cherry' }
  ]}
  onSelect={(value, item) => console.log('Selected:', item.name)}
/>
```

With custom fields and create option:
```svelte
<AutoComplete 
  items={products}
  searchField="title"
  valueField="productId"
  placeholder="Search products..."
  createNew={true}
  onSelect={(value, item, isNew) => {
    if (isNew) {
      createNewProduct(value);
    } else {
      selectProduct(value);
    }
  }}
/>
```

With error state:
```svelte
<AutoComplete 
  items={users}
  error={formErrors.user}
  onSelect={handleUserSelect}
/>
```
-->

<Combobox.Root type="single" onValueChange={handleSelect} onOpenChange={handleOpenChange} bind:open>
	<div class="relative">
		<Combobox.Input
			oninput={(e) => (searchValue = e.currentTarget.value)}
			{placeholder}
			class={inputVariants({ error })}
		/>
	</div>

	<Combobox.Portal>
		<Combobox.Content
			class="z-10 mt-1 max-h-60 w-[var(--bits-combobox-anchor-width)] overflow-auto rounded-md border bg-white shadow-lg"
		>
			<Combobox.Viewport class="p-0">
				{#if displayItems.length > 0}
					{#each displayItems as item (item[valueField])}
						<Combobox.Item
							value={item[valueField]}
							label={item[searchField]}
							class="flex w-full cursor-pointer px-3 py-2 data-highlighted:bg-blue-100"
						>
							{#snippet children({ selected })}
								{#if item.isNew}
									<span class="font-semibold">Create:</span> {item[searchField]}
								{:else}
									{item[searchField]}
								{/if}
							{/snippet}
						</Combobox.Item>
					{/each}
				{:else}
					<span class="block px-3 py-2 text-sm text-slate-500"> No results found </span>
				{/if}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
