<script lang="ts">
	import '$styles/highlight.css';
	import { categories } from '$lib/stores/recipes';

	export let data;

	categories.set(data.categories);
</script>

<div class="old-container">
	<slot />
</div>

<style>
	.old-container {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		margin: 0 auto;
		width: 100%;
		max-width: var(--max-width);
	}

	:global(article blockquote) {
		background: rgba(255, 62, 1, 0.2);
		border-radius: 5px 0px 0px 5px;
		color: black;
		border-left: 2px solid #ff3e01;
	}
	.old-container :global(h2),
	.old-container :global(h3) {
		margin-top: 2rem;
		margin-bottom: 1.25rem;
	}
	.old-container :global(p) {
		margin-bottom: 1.25rem;
	}
	.old-container :global(li) {
		margin-bottom: 1.1rem;
	}
</style>
