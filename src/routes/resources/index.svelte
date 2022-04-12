<script>
	const booksFromPublisher = [
		{
			name: 'Svelte Handbook',
			link: 'https://flaviocopes.com/page/svelte-handbook/',
			author: 'Flavio Copes'
		},
		{
			name: 'Svelte 3 Up and Running',
			link: 'https://www.amazon.com/dp/B08D6T6BKS/',
			author: 'Alessandro Segala'
		},
		{
			name: 'Svelte and Sapper in Action',
			link: 'https://www.manning.com/books/svelte-and-sapper-in-action',
			author: 'R. Mark Volkmann'
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

	<div>There are a couple books from major publishers:</div>
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
</div>

<style>
	ul {
		margin-top: var(--s-10);
		margin-bottom: var(--s-10);
	}
	li {
		list-style: circle;
		line-height: 150%;
	}
</style>
