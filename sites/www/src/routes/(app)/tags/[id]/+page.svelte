<script lang="ts">
	import Tag from '$lib/ui/Tag.svelte';

	let { data } = $props();
</script>

<Tag tag={data.tag} />
