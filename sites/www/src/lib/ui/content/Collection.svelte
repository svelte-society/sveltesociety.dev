<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	interface CollectionProps {
		children: any[];
	}

	let { slug, type, children = [] }: CollectionProps = $props();
</script>

<ul class="mb-4 flex flex-col gap-1.5">
	{#each children as child}
		<li class="border border-slate-200 bg-slate-100 px-2.5 py-1.5">
			<h2 class="text-md font-bold"><a href="/{child.type}/{child.slug}">{child.title}</a></h2>
			<span class="flex text-xs"
				><span class="mr-0.5 font-bold capitalize">{child.type}</span> posted by {child.author} • {child.published_at}</span
			>
		</li>
	{/each}
</ul>
<Button href="/{type}/{slug}" tertiary fullWidth>Open collection</Button>
