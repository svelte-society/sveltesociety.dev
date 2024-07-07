<script lang="ts">
	import Tag from './Tag.svelte';

	type Tag = {
		id: string;
		name: string;
		slug: string;
	};
	let { tags }: { tags: Tag[] } = $props();
</script>

<div class="flex flex-wrap gap-2">
	{#each tags as tag}
		<Tag {tag} />
	{/each}
</div>
