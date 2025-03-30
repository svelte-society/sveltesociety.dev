<script lang="ts">
	import TypeIcon from '$lib/ui/TypeIcon.svelte'
	import type { Content } from '$lib/types/content'
	import { draggable, droppable, type DragDropState } from '@thisux/sveltednd'
	import { DotsNine } from 'phosphor-svelte'
	import { fade } from 'svelte/transition'
	import { flip } from 'svelte/animate'

	type Props = {
		selectedContent: string[]
		content: Content[]
	}

	let { selectedContent = $bindable([]), content }: Props = $props()

	// Handle drops between containers
	function handleDrop(state: DragDropState<string>) {
		const { draggedItem, targetContainer } = state

		const dragIndex = selectedContent.findIndex((item: string) => item === draggedItem)
		const dropIndex = parseInt(targetContainer ?? '0')

		if (dragIndex !== -1 && !isNaN(dropIndex)) {
			selectedContent = [
				...selectedContent.slice(0, dragIndex), // Items before the dragged item
				...selectedContent.slice(dragIndex + 1, selectedContent.length) // Items after the dragged item
			]

			// Insert the dragged item at the drop position
			selectedContent = [
				...selectedContent.slice(0, dropIndex),
				draggedItem,
				...selectedContent.slice(dropIndex)
			]
		}
	}
</script>

<!-- Make a droppable container -->
<div class="space-y-2 rounded-md bg-gray-100 p-4">
	{#each selectedContent as item, index (item)}
		{@const contentItem = content.find((c) => c.id === item)}
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
				{#if contentItem?.type.includes(contentItem.type)}
					<TypeIcon
						type={contentItem.type as 'recipe' | 'video' | 'library' | 'announcement' | 'showcase'}
					/>
				{:else}
					<TypeIcon type="recipe" />
				{/if}
				{contentItem?.title}
			</div>
			<DotsNine />
		</div>
	{/each}
</div>
