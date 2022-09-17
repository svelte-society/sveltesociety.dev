<script lang="ts">
	import Link from '$layout/Link.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="Home"
	description="Svelte Society is a community-driven effort to organise and promote SvelteJS."
/>

<article class="container">
	<h1 class="text-center">CULT Magazine</h1>
	<section class="text-center">
		<p>
			We are a volunteer network of <a
				href="https://coinmarketcap.com/currencies/cult-dao/"
				target="_blank">CULTDAO</a
			> fans promoting freedom, fairness, education, transparency and love.
		</p>
		<p>
			Everyone is invited to collect and contribute to this decentralized magazine via <a
				href="https://github.com/michael-spengler/cultmagazine"
				target="_blank">pull request</a
			>.
		</p>
		<p>
			You might be interested in <br /> <a href="/cultproposals">CULT Proposals</a>, <br />
			<a href="/cultproposals">RVLT Proposals</a><br />
			<a href="/cultproposals">Markets</a><br />
			<a href="/cultproposals">CULT Events</a><br />
			<a href="/cultproposals">CULT News</a><br />
			<a href="/cultproposals">CULT Resources</a><br />
			and other useful information in the context of our
			<a href="https://coinmarketcap.com/currencies/cult-dao/" target="_blank">CULT</a>.
		</p>
		<p>
			If you want to reach out to us or find like-minded people from around the world you can check
			out the resources below:
		</p>
	</section>
	<ul>
		<Link path="https://discord.gg/wearecultdao">
			<img src="images/discord.svg" alt="" />
			Discord
		</Link>
		<Link path="https://rumble.com/c/c-1902267">
			<img src="images/youtube.svg" alt="" />
			YouTube
		</Link>
		<Link path="https://twitter.com/MrOmodulus">
			<img src="images/twitter.svg" alt="" />
			Twitter
		</Link>
	</ul>
	<ul>
		<Link path="https://doc.cultdao.io/">
			<img src="images/newsletter.svg" alt="" />
			Newsletter
		</Link>
		<Link path="https://www.reddit.com/r/cultdao/">
			<img src="images/reddit.svg" alt="" />
			Reddit
		</Link>
		<Link path="https://www.cultradio.com/">
			<img src="images/radio.svg" alt="" />
			Podcast
		</Link>
	</ul>
	<p class="text-center">
		We also run the <a href="https://cultsummit.com/">CULT Summit</a> conference.
	</p>
</article>

<style>
	article {
		max-width: 1024px;
		display: grid;
		gap: var(--s-10);
	}
	h1 {
		margin: 0;
	}
	section {
		display: grid;
		gap: var(--s-5);
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--s-20);
		row-gap: var(--s-5);
		justify-content: space-around;
		text-align: center;
	}
	img {
		width: 128px;
	}

	@media (min-width: 1280px) {
		article {
			gap: var(--s-20);
		}
	}
</style>
