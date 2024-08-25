<script lang="ts">
	import { page } from '$app/stores';

	type Tag = {
		id: string;
		name: string;
		slug: string;
	};
	let { tag, onclick }: { tag: Tag; onclick?: () => void } = $props();

	const handleClick = (e) => {
		if (onclick) {
			e.preventDefault();
			onclick();
		}
	};
</script>

<svelte:element
	this={onclick ? 'button' : 'a'}
	href={$page.url.pathname === `/tags/${tag.slug}` ? '/' : `/tags/${tag.slug}`}
	class="flex items-center gap-0.5 rounded border-2 border-svelte-100 bg-svelte-100 px-1 py-0.5 text-xs text-svelte-900"
	class:active={$page.url.pathname === `/tags/${tag.slug}`}
	onclick={onclick ? handleClick : undefined}
	role={onclick ? 'button' : 'link'}
>
	#{tag.name}
	{#if onclick}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<line x1="18" y1="6" x2="6" y2="18"></line>
			<line x1="6" y1="6" x2="18" y2="18"></line>
		</svg>
	{/if}
</svelte:element>

<style>
	.active {
		@apply border-svelte-900;
	}
</style>
