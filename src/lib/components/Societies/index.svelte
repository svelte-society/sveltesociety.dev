<script>
	import Icon from '$lib/components/Icon/index.svelte';
	import societies from './societies.json';
</script>

<!--society section-->
<div class="society-wrapper">
	<h3 class="title">Societies around the world</h3>
	{#each societies as society}
		{#if society.continent}
			<h6 class="continent">{society.continent}</h6>
		{:else}
			<p class="society">{society.country}</p>
			<ul class="society">
				<li>
					<span class="icon-wrapper">
						<Icon name="globe" />
						<a href={society.url} rel="noopener">{society.name}</a>
					</span>
				</li>
				{#if society.twitter}
					<span class="icon-wrapper">
						<Icon name="twitter" />
						<a href="https://twitter.com/{society.twitter}" rel="noopener">{society.twitter}</a>
					</span>
				{/if}
				{#if society.telegram}
					<span class="icon-wrapper"
						><Icon name="telegram" />
						<a href={society.telegram} target="_blank" rel="noopener">Join on Telegram</a></span
					>
				{/if}

				{#if society.youtube}
					<span class="icon-wrapper"
						><Icon name="youtube" />
						<a href={society.youtube} target="_blank" rel="noopener"
							>{society.name} YouTube Channel</a
						></span
					>
				{/if}

				{#if society.githuburl}
					<li>
						<span class="icon-wrapper">
							<Icon name="github" />
							<a href={society.githuburl} target="_blank" rel="noopener">GitHub</a>
						</span>
					</li>
				{/if}
			</ul>
		{/if}
	{/each}
</div>

<style>
	.society-wrapper {
		flex: 0 1 auto;
		margin-top: 5%;
		margin-left: 5%;
		margin-right: 0;
		padding: 2rem;
		--tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
			var(--tw-shadow);
		border-radius: 0.5rem;
	}
	h5.title {
		font-size: 1.5em;
		margin-block-start: 0.8em;
		margin-block-end: 0.5em;
	}
	h6.continent {
		font-size: 25px;
		color: #64748b;
		margin-block-start: 2em;
		margin-block-end: 1em;
		margin-left: -8px;
	}
	ul.society {
		margin-top: 0;
		list-style-type: none;
	}
	p.society {
		margin-bottom: 0;
	}
	span.icon-wrapper {
		font-size: 0.8em;
	}

	/* mobile design */
	@media only screen and (max-width: 768px) {
		.society-wrapper {
			flex: 0 1 auto;
			margin-top: 5%;
			padding: 2rem;
			--tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
			box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
				var(--tw-shadow);
		}
	}
</style>
