<script lang="ts">
	import booksFromPublisher from './booksFromPublisher.json';
	import booksSelfPublished from './booksSelfPublished.json';
	import editor from './editor.json';
	import videoCourses from './videoCourses.json';
	import youtube from './youtube.json';
</script>

<div>
	<h2 id="books">Books</h2>

	<div>There are a few books from major publishers:</div>
	<ul>
		{#each booksFromPublisher as { title, url, description }}
			<li>
				<a href={url} target="_blank">{title}</a>{#if description}&nbsp;- {description}{/if}
			</li>
		{/each}
	</ul>

	<div>As well as a couple self-published books:</div>
	<ul>
		{#each booksSelfPublished as { title, url, description }}
			<li>
				<a href={url} target="_blank">{title}</a>{#if description}&nbsp;- {description}{/if}
			</li>
		{/each}
	</ul>

	<h2 id="videos">Videos</h2>

	<div>Rich Harris, the creator of Svelte, taught a course:</div>
	<ul>
		<li>
			<a href="https://frontendmasters.com/courses/svelte/" target="_blank">Frontend Masters</a>
		</li>
	</ul>

	<div>There are also a number of third-party courses:</div>
	<ul>
		{#each videoCourses as { title, url, description }}
			<li>
				<a href={url} target="_blank">{title}</a>{#if description}&nbsp;- {description}{/if}
			</li>
		{/each}
	</ul>

	<div>Finally, there are also YouTube channels and playlists that teach Svelte:</div>
	<ul>
		{#each youtube as { title, url, description }}
			<li>
				<a href={url} target="_blank">{title}</a>{#if description}&nbsp;- {description}{/if}
			</li>
		{/each}
	</ul>

	<h2 id="editor-support">Editor Support</h2>

	<ul>
		{#each editor as { title, url, description }}
			<li><a href={url} target="_blank">{title}</a> - {description}</li>
		{/each}
	</ul>

	<h2 id="discovery">Discovery</h2>

	<ul>
		<li>
			For a curated list of SvelteKit examples in the wild, see
			<a href="https://github.com/janosh/awesome-sveltekit" target="_blank">awesome-sveltekit</a>
		</li>
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
