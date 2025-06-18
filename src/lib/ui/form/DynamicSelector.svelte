<script lang="ts">
	import { draggable, droppable, type DragDropState } from '@thisux/sveltednd'
	import DotsNine from 'phosphor-svelte/lib/DotsNine'
	import Empty from 'phosphor-svelte/lib/Empty'
	import ReadCvLogo from 'phosphor-svelte/lib/ReadCvLogo'
	import Trash from 'phosphor-svelte/lib/Trash'

	import { fade } from 'svelte/transition'
	import { flip } from 'svelte/animate'
	import type { SuperForm } from 'sveltekit-superforms'
	import { getContext } from 'svelte'
	import type { Component } from 'svelte'
	import DynamicInput from '$lib/ui/form/DynamicInput.svelte'
	type Props = {
		name: string
		options: { label: string; value: string }[]
		label: string
		description: string
		Icon?: Component
	}

	let { name, options, label, description, Icon }: Props = $props()

	const form: SuperForm<Record<string, any>, any> = getContext('form')

	const { form: formData } = form

	// Handle drops between containers
	function handleDrop(state: DragDropState<string>) {
		const { draggedItem, targetContainer } = state

		const dragIndex = $formData[name].findIndex((item: string) => item === draggedItem)
		const dropIndex = parseInt(targetContainer ?? '0')

		if (dragIndex !== -1 && !isNaN(dropIndex)) {
			$formData[name] = [
				...$formData[name].slice(0, dragIndex), // Items before the dragged item
				...$formData[name].slice(dragIndex + 1, $formData[name].length) // Items after the dragged item
			]

			// Insert the dragged item at the drop position
			$formData[name] = [
				...$formData[name].slice(0, dropIndex),
				draggedItem,
				...$formData[name].slice(dropIndex)
			]
		}
	}
</script>

<div class="space-y-2 rounded-md border-2 border-slate-200 p-4">
	<DynamicInput
		{name}
		{label}
		{description}
		type="text"
		{options}
		placeholder="Select {name}"
		{Icon}
	/>

	<ul class="space-y-2 rounded-md bg-slate-100 p-4">
		{#each $formData[name] as item, index (item)}
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
					<ReadCvLogo />
					{optionItem?.label}
				</div>
				<div class="flex items-center gap-2">
					<DotsNine />
					<button
						type="button"
						class="cursor-pointer"
						title="Remove {optionItem?.label}"
						onclick={() => {
							$formData[name] = $formData[name].filter((i: string) => i !== item)
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
