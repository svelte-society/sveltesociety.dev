<script>
	export let nodes;
</script>

<ul>
	{#each nodes.filter((r) => r.meta.layout !== 'recipeCategory') as node}
		<li class:active={node.path.includes(node.path)}>
			<a href={node.path}>{node.meta.title}</a>
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 1rem 0 0 1.75rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	}
	li::before {
		content: '•';
		color: var(--svelte-grey-light);
		display: inline-block;
		width: 1em;
		margin-left: -1em;
	}
	li.active::before {
		color: var(--svelte-grey);
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
