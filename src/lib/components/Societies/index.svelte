<script>
	import Icon from '$lib/components/Icon/index.svelte';
	import societies from './societies.json';
</script>

<!--society section-->
<div class="society-wrapper">
	<h3 class="title">Societies around the world</h3>
	{#each societies as society}
		{#if society.continent}
			<h4 class="continent">{society.continent}</h4>
		{:else}
			<h5 class="society">{society.country}</h5>
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
		padding: var(--s-8);
		box-shadow: var(--shadow-dreamy);
		border-radius: var(--s-2);
	}
	h4.continent {
		font-size: var(--font-400);
		color: var(--dark-gray);
		margin-block-start: var(--s-8);
		margin-block-end: var(--s-4);
		margin-left: -8px;
	}
	ul.society {
		margin-top: var(--s-0);
		margin-bottom: var(--s-4);
		list-style-type: none;
	}
	h5.society {
		font-size: var(--font-300);
		margin-bottom: 0;
	}
	span.icon-wrapper {
		font-size: var(--font-200);
		margin-top: var(--s-1);
		margin-bottom: var(--s-1);
	}

	/* mobile design */
	@media only screen and (max-width: 768px) {
		.society-wrapper {
			flex: 0 1 auto;
			margin-top: 5%;
			margin-left: auto;
			margin-right: auto;
			padding: var(--s-8);
		}
	}
</style>
