<script lang="ts">
	type Tag = {
		id: string;
		name: string;
	};
	let { tag }: { tag: Tag } = $props();
</script>

<a href="/tag/{tag.id}" class="rounded bg-orange-100 px-1 py-0.5 text-xs text-orange-600">
	# {tag.name}
</a>
