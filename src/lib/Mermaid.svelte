<script>
	import { onMount } from 'svelte';

	let graph = null;
	let png = null;

	onMount(() => {
		png =
			'https://mermaid.ink/img/' +
			btoa(JSON.stringify({ code: graph.textContent }))
				.replaceAll('+', '-')
				.replaceAll('/', '_')
				.replaceAll('=', '');
	});
</script>

<pre bind:this={graph}><slot /></pre>
<img src={png} alt="Mermaid graph" />

<style>
	pre {
		display: none;
	}
	img {
		margin: 0 auto;
	}
</style>
