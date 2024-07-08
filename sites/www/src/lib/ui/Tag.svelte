<script lang="ts">
	import { page } from '$app/stores';

	type Tag = {
		id: string;
		name: string;
		slug: string;
	};
	let { tag }: { tag: Tag } = $props();
</script>

<a
	href="/tags/{tag.slug}"
	class="bg-svelte-100 border-svelte-100 text-svelte-900 rounded border-2 px-1 py-0.5 text-xs"
	class:active={$page.url.pathname === `/tags/${tag.slug}`}
>
	# {tag.name}
</a>

<style>
	.active {
		@apply border-svelte-900;
	}
</style>
