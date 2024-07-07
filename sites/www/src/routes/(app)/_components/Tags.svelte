<script lang="ts">
	import Tag from './Tag.svelte';

	type Tag = {
		id: string;
		name: string;
	};
	let { tags }: { tags: Tag[] } = $props();
</script>

<div>
	<h3 class="text-md mb-2 font-semibold">Popular tags</h3>
	<div class="mb-4 flex flex-wrap gap-2">
		{#each tags as tag}
			<Tag {tag} />
		{/each}
	</div>
</div>
