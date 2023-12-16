<script>
	const booksFromPublisher = [
		{
			name: 'Svelte 3 Up and Running',
			link: 'https://www.amazon.com/dp/B08D6T6BKS/',
			author: 'Alessandro Segala'
		},
		{
			name: 'Svelte and Sapper in Action',
			link: 'https://www.manning.com/books/svelte-and-sapper-in-action',
			author: 'R. Mark Volkmann'
		},
		{
			name: 'SvelteKit Up and Running',
			link: 'https://sveltekitbook.dev',
			author: 'Dylan Hildenbrand'
		},
		{
			name: 'Svelte with Test-Driven Development',
			link: 'https://www.amazon.com/dp/1837638330',
			author: 'Daniel Irvine'
		}
	];
	const booksSelfPublished = [
		{
			name: 'Svelte Handbook',
			link: 'https://flaviocopes.com/page/svelte-handbook/',
			author: 'Flavio Copes'
		},
		{
			name: 'Simple Svelte',
			link: 'https://wfq.gumroad.com/l/simple_svelte',
			author: 'Darren Wang'
		}
	];
</script>

<div>
	<h2>Books</h2>

	<div>There are a few books from major publishers:</div>
	<ul>
		{#each booksFromPublisher as { name, link, author }}
			<li><a href={link} target="_blank">{name}</a> by {author}</li>
		{/each}
	</ul>

	<div>As well as a couple self-published books:</div>
	<ul>
		{#each booksSelfPublished as { name, link, author }}
			<li><a href={link} target="_blank">{name}</a> by {author}</li>
		{/each}
	</ul>

	<h2>Videos</h2>

	<div>Rich Harris, the creator of Svelte, taught a course:</div>
	<ul>
		<li>
			<a href="https://frontendmasters.com/courses/svelte/" target="_blank">Frontend Masters</a>
		</li>
	</ul>

	<div>There are also a number of third-party courses:</div>
	<ul>
		<li><a href="https://egghead.io/browse/frameworks/svelte" target="_blank">Egghead</a></li>
		<li>
			<a href="https://www.udemy.com/courses/search/?q=sveltejs+svelte" target="_blank">Udemy</a> (Note:
			Udemy frequently has discounts over 90%)
		</li>
		<li><a href="https://www.pluralsight.com/search?q=svelte" target="_blank">Pluralsight</a></li>
	</ul>

	<div>Finally, there are also YouTube channels and playlists that teach Svelte:</div>
	<ul>
		<li>
			<a href="https://youtube.com/channel/UCg6SQd5jnWo5Y70rZD9SQFA" target="_blank"
				>Svelte Master</a
			>
		</li>
		<li>
			<a href="https://youtu.be/zojEMeQGGHs" target="_blank">Svelte Tutorial for Beginners</a> by The
			Net Ninja
		</li>
	</ul>

	<h2>Discovery</h2>
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
	}
</style>
