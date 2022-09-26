<script lang="ts">
	import Communities from '$lib/components/Communities/index.svelte';
	import EventListElement from '$lib/components/EventListElement/index.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<Seo title="Events" />

<p><br /></p>
<div class="text-center">
	<h1>CULT Events</h1>
	<p>
		Everyone is invited to add CULT events via <a
			href="https://www.youtube.com/watch?v=8lGpZkjnkt4"
			target="_blank"
		>
			pull request</a
		>.
	</p>

	<p><br /></p>
	We promote events where guests get free entrance when proving they have CULT or RVLT in their wallet.
	<p><br /></p>
	We also promote CULT related Twitter Spaces and Youtube Live Streams.

	<p><br /></p>
	<!-- <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Manifesto Mondays. Relax with frens<a href="https://t.co/mpFzpAlRut">https://t.co/mpFzpAlRut</a></p>&mdash; Mr O (@MrOmodulus) <a href="https://twitter.com/MrOmodulus/status/1571846579262218240?ref_src=twsrc%5Etfw">September 19, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
 -->
	<!-- <p><br /></p>
	The following is just to get some design- / layout ideas -->

	Until the 
	<a href="https://github.com/cultfamily-on-github/cult-events-microservice" target="_blank">
		CULT Events Microservice 
	</a>
	is available, the best way to stay up to date might be to follow some
	of teh many and to join our community.<br /><br />
	<p><br /></p>

	<a href="https://twitter.com/MERP40400977" target="_blank"> MERP - #TALKABOUTCULT</a> <br /><br />
	<a href="https://twitter.com/MrOmodulus" target="_blank"> Mr O</a> <br /><br />
	<a href="https://twitter.com/Artorias_eth" target="_blank"> Artorias</a> <br /><br />
	<a href="https://twitter.com/iamcomingundone" target="_blank"> Holly</a>

	<p><br><br></p>
	The following is to document some design ideas for the CULT Events Microservice.
	<p><br><br></p>
</div>
<article class="wrapper">
	<section class="event-wrapper">
		{#each data.events as event}
			<EventListElement
				title={event.title}
				url={'/events/' + event.filename.replace('.svx', '')}
				date={event.date}
			/>
		{/each}
	</section>
	<Communities />
</article>

<style>
	.wrapper {
		display: flex;
	}
	.event-wrapper {
		flex: 1 1 auto;
		margin: 1%;
	}
	/* mobile design */
	@media only screen and (max-width: 768px) {
		.wrapper {
			display: flex;
			flex-direction: column;
		}
	}
</style>
