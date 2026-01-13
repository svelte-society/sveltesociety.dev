<script lang="ts">
	import { browser } from '$app/environment'
	import { draggable, droppable, type DragDropState } from '@thisux/sveltednd'
	import DotsNine from 'phosphor-svelte/lib/DotsNine'
	import Empty from 'phosphor-svelte/lib/Empty'
	import Trash from 'phosphor-svelte/lib/Trash'
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import TagIcon from 'phosphor-svelte/lib/Tag'

	import { fade } from 'svelte/transition'
	import { flip } from 'svelte/animate'
	import type { Component } from 'svelte'
	import type { RemoteFormField } from '@sveltejs/kit'
	import FormFieldFeedback from './FormFieldFeedback.svelte'
	import {
		dynamicSelectorInputVariants,
		dynamicSelectorDropdownVariants,
		dynamicSelectorOptionVariants,
		dynamicSelectorItemVariants
	} from './dynamicSelector.variants'

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
		placeholder,
		Icon = TagIcon,
		'data-testid': testId,
		field
	}: Props = $props()

	let searchValue = $state('')
	let open = $state(false)
	let selectedIndex = $state(-1)
	let inputElement: HTMLInputElement | undefined = $state()

	const issues = $derived(field.issues() ?? [])
	const hasErrors = $derived(issues.length > 0)

	const filteredOptions = $derived.by(() => {
		const selectedValues = field.value() || []
		const available = options.filter((option) => !selectedValues.includes(option.value))
		if (searchValue === '') return available
		return available.filter((option) =>
			option.label.toLowerCase().includes(searchValue.toLowerCase())
		)
	})

	function handleSelect(value: string) {
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
		selectedIndex = -1
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!open || filteredOptions.length === 0) {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				open = true
			}
			return
		}

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault()
				selectedIndex = Math.min(selectedIndex + 1, filteredOptions.length - 1)
				break
			case 'ArrowUp':
				event.preventDefault()
				selectedIndex = Math.max(selectedIndex - 1, 0)
				break
			case 'Enter':
				event.preventDefault()
				if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
					handleSelect(filteredOptions[selectedIndex].value)
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

<!-- Datalist fallback for no-JS -->
{#if !browser}
	<datalist id="{name}-options">
		{#each options as option (option.value)}
			<option value={option.label}></option>
		{/each}
	</datalist>
{/if}

<div class="space-y-2 rounded-md border-2 border-slate-200 p-4">
	<div class="flex flex-col gap-2">
		<label class="text-xs font-medium outline-none">
			{label}
			<div class="relative mt-2">
				<Icon class="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
				<input
					bind:this={inputElement}
					data-testid={testId}
					type="text"
					list={browser ? undefined : `${name}-options`}
					autocomplete={browser ? 'off' : 'on'}
					oninput={(e) => {
						searchValue = e.currentTarget.value
						open = true
						selectedIndex = -1
					}}
					onfocus={() => (open = true)}
					onblur={handleBlur}
					onkeydown={handleKeydown}
					placeholder={placeholder || `Select ${name}`}
					value={searchValue}
					class={dynamicSelectorInputVariants({ error: hasErrors })}
				/>
				<button
					type="button"
					class="absolute end-2 top-1/2 -translate-y-1/2 text-slate-500"
					onclick={() => {
						open = !open
						inputElement?.focus()
					}}
					tabindex={-1}
				>
					<CaretUpDown class="size-4" />
				</button>

				<!-- Custom dropdown for JS -->
				{#if browser && open}
					<ul role="listbox" class={dynamicSelectorDropdownVariants()}>
						{#if filteredOptions.length > 0}
							{#each filteredOptions as option, i (option.value)}
								<li
									role="option"
									aria-selected={i === selectedIndex}
									class={dynamicSelectorOptionVariants({ highlighted: i === selectedIndex })}
									onmousedown={() => handleSelect(option.value)}
									onmouseenter={() => (selectedIndex = i)}
								>
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
								</li>
							{/each}
						{:else}
							<li class="px-3 py-2 text-sm text-slate-500">No results found</li>
						{/if}
					</ul>
				{/if}
			</div>
		</label>
		<FormFieldFeedback {issues} {description} />
	</div>

	<ul class="space-y-2 rounded-md bg-slate-100 p-4">
		{#each field.value() as item, index (item)}
			{@const optionItem = options.find((c) => c.value === item)}
			<li
				class="relative"
				animate:flip={{ duration: 200 }}
				in:fade={{ duration: 150 }}
				out:fade={{ duration: 150 }}
			>
				<div
					class={dynamicSelectorItemVariants()}
					use:draggable={{
						container: index.toString(),
						dragData: item
					}}
					use:droppable={{
						container: index.toString(),
						callbacks: { onDrop: handleDrop }
					}}
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
					<DotsNine />
				</div>
				<button
					type="button"
					class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
					title="Remove {optionItem?.label}"
					onclick={() => {
						field.set(field.value().filter((i: string) => i !== item))
					}}
				>
					<Trash class="text-red-600" />
				</button>
			</li>
		{:else}
			<p class="flex items-center gap-2 text-sm text-gray-500">
				<Empty />
				<span>No {name} selected</span>
			</p>
		{/each}
	</ul>
</div>
