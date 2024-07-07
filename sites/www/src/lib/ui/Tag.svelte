<script lang="ts">
	type Tag = {
		id: string;
		name: string;
	};
	let { tag }: { tag: Tag } = $props();
</script>

<a href="/tag/{tag.id}" class="bg-svelte-100 text-svelte-900 rounded px-1 py-0.5 text-xs">
	# {tag.name}
</a>
