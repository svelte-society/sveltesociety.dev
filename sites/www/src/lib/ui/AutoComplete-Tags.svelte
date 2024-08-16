<script lang="ts">
	import AutoComplete from './AutoComplete.svelte';
	import Tag from './Tag.svelte';

	export let tags: Array<{ id: number; name: string }> = [];
	export let selectedTags: number[] = [];
	export let placeholder: string = 'Type to search for a tag';
	export let errors: any;
	export let description: string;

	function handleSelect(event: CustomEvent<number>) {
		event.preventDefault();
		addTag(event.detail);
	}

	function addTag(tagId: number) {
		if (!selectedTags.includes(tagId)) {
			selectedTags = [...selectedTags, tagId];
		}
	}

	function removeTag(tagId: number) {
		selectedTags = selectedTags.filter((id) => id !== tagId);
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
			{@const tag = tags.find((t) => t.id === tagId)}
			{#if tag}
				<Tag {tag} onclick={() => removeTag(tag.id)} />
			{/if}
		{/each}
	</div>
	{#if errors}
		{#each errors as error}
			<div class="text-xs text-slate-500" class:error={errors}>
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

<style lang="postcss">
	div .error {
		@apply text-red-600;
	}
</style>
