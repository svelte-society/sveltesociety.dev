<script lang="ts">
	import '$styles/highlight.css';
	import { categories } from '$lib/stores/recipes';

	export let data;

	categories.set(data.categories);
</script>

<div class="mx-auto grid w-full max-w-7xl grid-cols-1">
	<slot />
</div>

<style>
	:global(article blockquote) {
		background: rgba(255, 62, 1, 0.2);
		border-radius: 5px 0px 0px 5px;
		color: black;
		border-left: 2px solid #ff3e01;
	}
	div :global(h2),
	div :global(h3) {
		margin-top: 2rem;
		margin-bottom: 1.25rem;
	}
	div :global(p) {
		margin-bottom: 1.25rem;
	}
	div :global(li) {
		margin-bottom: 1.1rem;
	}
</style>
