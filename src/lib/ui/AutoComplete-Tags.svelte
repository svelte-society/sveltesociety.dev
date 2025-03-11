<script lang="ts">
import AutoComplete from './AutoComplete.svelte'
import Tag from './Tag.svelte'
import type { TagType } from './Tags.svelte'

let {
	/** Array of tags to choose from */
	tags = [],
	/** Array of selected tag IDs */
	selectedTags = $bindable([]),
	/** Placeholder text for the input field */
	placeholder = 'Type to search for a tag',
	/** Error messages to display */
	errors,
	/** Description text to display below the component */
	description,
	/** Callback function when a tag is selected */
	onTagSelect = undefined
}: {
	tags: Array<{ id: number; name: string; slug: string }>
	selectedTags: number[]
	placeholder: string
	errors: any
	description: string
	onTagSelect?: (tagId: number) => void
} = $props()

/**
 * Handle the selection from the AutoComplete component
 */
function handleSelect(value: string, item: any) {
	if (value) {
		// Convert string value to number since our tags use numeric IDs
		const tagId = Number(value)
		addTag(tagId)
		
		// Call the onTagSelect callback if provided
		if (onTagSelect) onTagSelect(tagId)
	}
}

/**
 * Add a tag to the selected tags list if it's not already there
 */
function addTag(tagId: number) {
	if (!selectedTags.includes(tagId)) {
		selectedTags = [...selectedTags, tagId]
	}
}

/**
 * Remove a tag from the selected tags list
 */
function removeTag(tagId: number) {
	selectedTags = selectedTags.filter((id) => id !== tagId)
}

/**
 * Convert numeric ID tags to TagType with string IDs for the Tag component
 */
function convertTag(tag: { id: number; name: string; slug: string }): TagType {
	return {
		id: String(tag.id),
		name: tag.name,
		slug: tag.slug
	};
}
</script>

<!--
@component
A tag selection component that uses AutoComplete for searching and selecting tags.

Features:
- Search for tags as you type
- Add and remove tags from selection
- Display selected tags as removable tag chips
- Support for error messages and description text
- Callback for tag selection

## Usage

Basic usage:
```svelte
<AutoCompleteTags 
  tags={[
    { id: 1, name: 'JavaScript', slug: 'javascript' },
    { id: 2, name: 'TypeScript', slug: 'typescript' },
    { id: 3, name: 'Svelte', slug: 'svelte' }
  ]}
  bind:selectedTags={selectedTagIds}
/>
```

With custom placeholder and description:
```svelte
<AutoCompleteTags 
  tags={availableTags}
  bind:selectedTags={selectedTagIds}
  placeholder="Search for technologies..."
  description="Select all technologies used in your project"
/>
```

With error handling and selection callback:
```svelte
<AutoCompleteTags 
  tags={availableTags}
  bind:selectedTags={selectedTagIds}
  errors={form.errors?.tags}
  onTagSelect={(tagId) => {
    console.log(`Tag ${tagId} was selected`);
    validateForm();
  }}
/>
```
-->

<div class="space-y-2">
	<AutoComplete
		items={tags}
		{placeholder}
		searchField="name"
		valueField="id"
		error={errors ? true : false}
		onSelect={handleSelect}
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
			<div class="text-xs text-red-600">
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
