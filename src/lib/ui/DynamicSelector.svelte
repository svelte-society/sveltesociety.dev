<script lang="ts">
	import { draggable, droppable, type DragDropState } from '@thisux/sveltednd'
	import DotsNine from 'phosphor-svelte/lib/DotsNine'
	import Empty from 'phosphor-svelte/lib/Empty'
	import Trash from 'phosphor-svelte/lib/Trash'

	import { fade } from 'svelte/transition'
	import { flip } from 'svelte/animate'
	import type { Component } from 'svelte'
	import { Combobox } from 'bits-ui'
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import Check from 'phosphor-svelte/lib/Check'
	import TagIcon from 'phosphor-svelte/lib/Tag'
	import type { RemoteFormField } from '@sveltejs/kit'

	interface Option {
		value: string
		label: string
		avatar?: string
	}

	type Props = {
		name: string
		options: Option[]
		label: string
		description: string
		placeholder?: string
		Icon?: Component
		'data-testid'?: string
		field: RemoteFormField<string[]>
	}

	let {
		name,
		options,
		label,
		description,
		placeholder = `Select ${name}`,
		Icon = TagIcon,
		'data-testid': testId,
		field
	}: Props = $props()

	let searchValue = $state('')
	let open = $state(false)

	// Get field issues for error display
	const issues = $derived(field.issues() ?? [])
	const hasErrors = $derived(issues.length > 0)

	// Filter options to exclude already selected items and match search
	const filteredOptions = $derived.by(() => {
		const selectedValues = field.value() || []
		const available = options.filter((option) => !selectedValues.includes(option.value))
		if (searchValue === '') return available
		return available.filter((option) =>
			option.label.toLowerCase().includes(searchValue.toLowerCase())
		)
	})

	function handleSelect(value: string | undefined) {
		if (!value) return

		if (!field.value()) {
			field.set([])
		}
		if (!field.value().includes(value)) {
			field.set([...field.value(), value])
		}

		// Reset search and close dropdown
		searchValue = ''
		open = false
	}

	function handleOpenChange(isOpen: boolean) {
		open = isOpen
		if (!isOpen) {
			searchValue = ''
		}
	}

	// Handle drops between containers
	function handleDrop(state: DragDropState<string>) {
		const { draggedItem, targetContainer } = state

		const dragIndex = field.value().findIndex((item: string) => item === draggedItem)
		const dropIndex = parseInt(targetContainer ?? '0')

		if (dragIndex !== -1 && !isNaN(dropIndex)) {
			field.set([
				...field.value().slice(0, dragIndex), // Items before the dragged item
				...field.value().slice(dragIndex + 1, field.value().length) // Items after the dragged item
			])

			// Insert the dragged item at the drop position
			field.set([
				...field.value().slice(0, dropIndex),
				draggedItem,
				...field.value().slice(dropIndex)
			])
		}
	}
</script>

<input {...field.as('select multiple')} class="hidden" />

<div class="space-y-2 rounded-md border-2 border-slate-200 p-4">
	<div class="flex flex-col gap-2">
		<label class="text-xs font-medium outline-none">
			{label}
			<Combobox.Root
				type="single"
				bind:open
				onOpenChange={handleOpenChange}
				onValueChange={handleSelect}
			>
				<div class="relative mt-2">
					<Icon class="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
					<Combobox.Input
						data-testid={testId}
						clearOnDeselect
						oninput={(e) => (searchValue = e.currentTarget.value)}
						onfocus={() => (open = true)}
						{placeholder}
						autocomplete="off"
						class="w-full rounded-md border-2 px-8 py-1.5 text-sm text-slate-800 placeholder-slate-500 focus:outline-2 focus:outline-sky-200 {hasErrors
							? 'border-red-300 bg-red-50 text-red-600'
							: 'border-transparent bg-slate-100'}"
					/>
					<Combobox.Trigger class="absolute end-2 top-1/2 -translate-y-1/2 text-slate-500">
						<CaretUpDown class="size-4" />
					</Combobox.Trigger>
				</div>

				<Combobox.Portal>
					<Combobox.Content
						class="z-50 mt-1 max-h-60 w-[var(--bits-combobox-anchor-width)] overflow-auto rounded-md border bg-white shadow-lg"
					>
						<Combobox.Viewport class="p-1">
							{#if filteredOptions.length > 0}
								{#each filteredOptions as option (option.value)}
									<Combobox.Item
										value={option.value}
										label={option.label}
										class="flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm data-highlighted:bg-slate-100"
									>
										{#snippet children({ selected })}
											{#if option.avatar}
												<img src={option.avatar} alt="" class="h-6 w-6 rounded-full object-cover" />
											{:else}
												<div
													class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-xs font-medium text-slate-700"
												>
													{option.label.charAt(0).toUpperCase()}
												</div>
											{/if}
											<span class="flex-1">{option.label}</span>
											{#if selected}
												<Check class="h-4 w-4 text-sky-600" />
											{/if}
										{/snippet}
									</Combobox.Item>
								{/each}
							{:else}
								<span class="block px-3 py-2 text-sm text-slate-500">No results found</span>
							{/if}
						</Combobox.Viewport>
					</Combobox.Content>
				</Combobox.Portal>
			</Combobox.Root>
		</label>
		{#if hasErrors}
			{#each issues as issue}
				<div class="text-xs text-red-600">{issue.message}</div>
			{/each}
		{:else}
			<div class="text-xs text-slate-500">{description}</div>
		{/if}
	</div>

	<ul class="space-y-2 rounded-md bg-slate-100 p-4">
		{#each field.value() as item, index (item)}
			{@const optionItem = options.find((c) => c.value === item)}
			<li
				class="flex cursor-grab items-center justify-between gap-2 rounded-md border-2 border-gray-100 bg-white p-2 transition-all duration-300"
				use:draggable={{
					container: index.toString(),
					dragData: item
				}}
				use:droppable={{
					container: index.toString(),
					callbacks: { onDrop: handleDrop }
				}}
				animate:flip={{ duration: 200 }}
				in:fade={{ duration: 150 }}
				out:fade={{ duration: 150 }}
			>
				<div class="flex items-center gap-2">
					{#if optionItem?.avatar}
						<img src={optionItem.avatar} alt="" class="h-6 w-6 rounded-full object-cover" />
					{:else}
						<div
							class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-xs font-medium text-slate-700"
						>
							{optionItem?.label?.charAt(0).toUpperCase() || '?'}
						</div>
					{/if}
					{optionItem?.label}
				</div>
				<div class="flex items-center gap-2">
					<DotsNine />
					<button
						type="button"
						class="cursor-pointer"
						title="Remove {optionItem?.label}"
						onmousedown={(e) => {
							field.set(field.value().filter((i: string) => i !== item))
						}}
					>
						<Trash class="text-red-600" />
					</button>
				</div>
			</li>
		{:else}
			<p class="flex items-center gap-2 text-sm text-gray-500">
				<Empty />
				<span>No {name} selected</span>
			</p>
		{/each}
	</ul>
</div>
