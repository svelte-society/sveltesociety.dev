<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import AutoComplete from './AutoComplete.svelte';
	import Tag from './Tag.svelte';

	export let tags: Array<{ id: number; name: string }> = [];
	export let selectedTags: number[] = [];
	export let placeholder: string = 'Type to search or create a tag';

	const dispatch = createEventDispatcher();

	function handleCreate(event: CustomEvent<string>) {
		const newTag = { id: Math.max(0, ...tags.map((t) => t.id)) + 1, name: event.detail };
		tags = [...tags, newTag];
		addTag(newTag.id);
		dispatch('create', newTag);
	}

	function handleSelect(event: CustomEvent<number>) {
		addTag(event.detail);
	}

	function addTag(tagId: number) {
		if (!selectedTags.includes(tagId)) {
			selectedTags = [...selectedTags, tagId];
			dispatch('add', tagId);
		}
	}

	function removeTag(tagId: number) {
		selectedTags = selectedTags.filter((id) => id !== tagId);
		dispatch('remove', tagId);
	}
</script>

<div class="space-y-2">
	<AutoComplete
		items={tags}
		{placeholder}
		searchField="name"
		valueField="id"
		createNew={true}
		on:create={handleCreate}
		on:select={handleSelect}
	/>

	<div class="mt-2 flex flex-wrap gap-2">
		{#each selectedTags as tagId}
			{@const tag = tags.find((t) => t.id === tagId)}
			{#if tag}
				<Tag {tag} />
				<span class="flex items-center rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800">
					{tag.name}
					<button
						on:click={() => removeTag(tag.id)}
						class="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
					>
						&times;
					</button>
				</span>
			{/if}
		{/each}
	</div>
</div>
