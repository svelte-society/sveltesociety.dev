<script lang="ts">
	import books from './books.json';
	import extensions from './extensions.json';
	import misc from './misc.json';
	import videos from './videos.json';
</script>

<div>
	<h2>Books</h2>

	<ul>
		{#each books as { title, url, description }}
			<li><a href={url} target="_blank">{title}</a> - {description}</li>
		{/each}
	</ul>

	<h2>Videos</h2>

	<ul>
		{#each videos as { title, url, description }}
			<li><a href={url} target="_blank">{title}</a> - {description}</li>
		{/each}
	</ul>

	<h2>Extensions</h2>

	<ul>
		{#each extensions as { title, url, description }}
			<li><a href={url} target="_blank">{title}</a> - {description}</li>
		{/each}
	</ul>

	<h2>Discovery</h2>

	<ul>
		<li>
			For a curated list of SvelteKit examples in the wild, see
			<a href="https://github.com/janosh/awesome-sveltekit" target="_blank">awesome-sveltekit</a>
		</li>
	</ul>

	<h2>Miscellaneous</h2>

	<ul>
		{#each misc as { title, url, description }}
			<li><a href={url} target="_blank">{title}</a> - {description}</li>
		{/each}
	</ul>
</div>

<style>
	h2 {
		margin-bottom: var(--s-6);
	}
	ul {
		padding-left: var(--s-6);
		margin-top: var(--s-6);
		margin-bottom: var(--s-10);
	}
	li {
		list-style: circle;
		line-height: 150%;
		margin-bottom: var(--s-1);
	}
</style>
