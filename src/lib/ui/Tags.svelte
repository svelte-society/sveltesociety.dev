<script lang="ts">
import Tag from './Tag.svelte'

type TagType = {
	id: string
	name: string
	slug: string
}
let { tags }: { tags: TagType[] } = $props()
</script>

<div class="flex flex-wrap gap-2">
	{#each tags as tag}
		<Tag {tag} />
	{/each}
</div>
