<script module lang="ts">
	export type TagType = {
		id: string
		name: string
		slug: string
		color?: string
	}
</script>

<script lang="ts">
	import Tag from './Tag.svelte'

	let { tags }: { tags: TagType[] } = $props()
</script>

<ul class="flex flex-wrap gap-2">
	{#each tags as tag}
		<li>
			<Tag {tag} />
		</li>
	{/each}
</ul>
