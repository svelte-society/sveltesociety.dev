<script>
	import { page } from '$app/stores';

	export let nodes;
</script>

<ul>
	{#each nodes.filter((r) => r.layout !== 'recipeCategory') as node}
		<li class:active={$page.url.pathname.includes(node.path)}>
			<a href={node.path}>{node.title}</a>
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		display: grid;
		gap: var(--s-2);
	}
	a {
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
	li.active a {
		font-weight: bold;
	}
	@media screen and (max-width: 1024px) {
		ul {
			grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		}
	}
	@media screen and (max-width: 600px) {
		ul {
			grid-template-columns: 1fr;
		}
	}
</style>
