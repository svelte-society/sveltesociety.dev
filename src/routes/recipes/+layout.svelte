<script lang="ts">
	import { categories } from '$lib/stores/recipes';
	import '$styles/highlight.css';
	export let data;
	categories.set(data.categories);
</script>

<div class="container">
	<slot />
</div>

<style>
	:global(article blockquote) {
		background: rgba(255, 62, 1, 0.2);
		border-radius: 5px 0px 0px 5px;
		color: black;
		border-left: 2px solid #ff3e01;
	}
	.container :global(h2),
	.container :global(h3) {
		margin-top: 2rem;
		margin-bottom: 1.25rem;
	}
	.container :global(p) {
		margin-bottom: 1.25rem;
	}
	.container :global(li) {
		margin-bottom: 1.1rem;
	}
</style>
