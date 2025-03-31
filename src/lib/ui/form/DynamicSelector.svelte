<script lang="ts">
	import TypeIcon from '$lib/ui/TypeIcon.svelte'
	import { draggable, droppable, type DragDropState } from '@thisux/sveltednd'
	import { DotsNine } from 'phosphor-svelte'
	import { fade } from 'svelte/transition'
	import { flip } from 'svelte/animate'
	import type { SuperForm } from 'sveltekit-superforms'
	import { getContext } from 'svelte'
	import DynamicInput from '$lib/ui/form/DynamicInput.svelte'
	type Props = {
		name: string
		options: { label: string; value: string }[]
		label: string
		description: string
	}

	let { name, options, label, description }: Props = $props()

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

<DynamicInput {name} {label} {description} type="text" {options} placeholder="Select {name}" />

<div class="space-y-2 rounded-md bg-gray-100 p-4">
	{#each $formData[name] as item, index (item)}
		{@const optionItem = options.find((c) => c.value === item)}
		<div
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
				<TypeIcon type="recipe" />
				{optionItem?.label}
			</div>
			<DotsNine />
		</div>
	{/each}
</div>
