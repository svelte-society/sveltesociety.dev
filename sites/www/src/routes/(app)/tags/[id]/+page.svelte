<script lang="ts">
	import Tag from '$lib/ui/Tag.svelte';

	let { data } = $props();

	console.log(data);
</script>

<Tag tag={data.tag} />
