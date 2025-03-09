<script lang="ts">
import AutoComplete from './AutoComplete.svelte'
import Tag from './Tag.svelte'
import type { TagType } from './Tags.svelte'

let {
	tags = [],
	selectedTags = $bindable([]),
	placeholder = 'Type to search for a tag',
	errors,
	description
}: {
	tags: Array<{ id: number; name: string; slug: string }>
	selectedTags: number[]
	placeholder: string
	errors: any
	description: string
} = $props()

function handleSelect(event: CustomEvent<number>) {
	event.preventDefault()
	addTag(event.detail)
}

function addTag(tagId: number) {
	if (!selectedTags.includes(tagId)) {
		selectedTags = [...selectedTags, tagId]
	}
}

function removeTag(tagId: number) {
	selectedTags = selectedTags.filter((id) => id !== tagId)
}

// Convert numeric ID tags to TagType with string IDs for the Tag component
function convertTag(tag: { id: number; name: string; slug: string }): TagType {
	return {
		id: String(tag.id),
		name: tag.name,
		slug: tag.slug
	};
}
</script>

<div class="space-y-2">
	<AutoComplete
		items={tags}
		{placeholder}
		searchField="name"
		valueField="id"
		on:select={handleSelect}
		error={errors}
	/>
	<div class="mt-2 flex flex-wrap gap-2">
		{#each selectedTags as tagId}
			{@const originalTag = tags.find((t) => t.id === tagId)}
			{#if originalTag}
				{@const tag = convertTag(originalTag)}
				<Tag {tag} onclick={() => removeTag(originalTag.id)} />
			{/if}
		{/each}
	</div>
	{#if errors}
		{#each errors as error}
			<div class={['text-xs text-slate-500', { 'text-red-600': errors}]}>
				{error}
			</div>
		{/each}
	{:else if description}
		<div class="text-xs text-slate-500">
			{description}
		</div>
	{/if}
	{#each selectedTags as tag}
		<input type="hidden" name="tags" value={tag} />
	{/each}
</div>
