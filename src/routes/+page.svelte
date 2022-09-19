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
			We are a network of <a href="https://cultdao.io" target="_blank">cultdao.io</a> fans promoting
			freedom,
			<a href="https://github.com/michael-spengler/fairness/blob/main/README.md" target="_blank">
				fairness</a
			>, education, and <a href="https://cultkamasutra.eth.limo/" target="_blank"> love</a>.
		</p>
		<p>
			Everyone is invited to collect and contribute to this decentralized magazine via <a
				href="https://github.com/michael-spengler/cultmagazine"
				target="_blank">pull request</a
			>.
		</p>
		<p>
			Each contribution can be submitted as an <a
				href="https://revolt.cultdao.io/submitProposal"
				target="_blank">act of revolt</a
			>.
		</p>
		<p>You might be interested in</p>
		<p>
			<a href="/cultproposals">CULT Proposals</a><br />
		</p>
		<p>
			<a href="/rvltproposals">RVLT Proposals</a><br />
		</p>
		<p>
			<a href="/news">CULT News</a><br />
		</p>
		<p>
			<a href="/events">CULT Events</a><br />
		</p>
		<p>
			<a href="/resources">CULT Resources</a><br />
		</p>
		<p>
			<a href="/markets">CULT Markets</a><br />
		</p>
		<!-- <p>
			<a href="/markets">CULT Chats (coming soon)</a><br />
		</p> -->
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
		We also recommend to visit
		<a href="https://cultoshi.com" target="_blank"> cultoshi.com</a>,
		<a href="https://www.shop2revolt.com" target="_blank"> shop2revolt.com</a>,
		<a href="https://www.cultdaodizayn.com" target="_blank"> cultdaodizayn.com</a>
	</p>

	<div class="text-center">
		<h3>Basic Tips for Newcomers</h3>
		<p><br /></p>

		<ol>
			<li>
				1. read the <a href="https://cultdao.io/manifesto.pdf" target="_blank"> manifesto </a>
			</li>
			<li>
				2. install <a href="https://metamask.io" target="_blank"> metamask.io </a>
			</li>
			<li>
				3. Add CULT asset --> custom token in metamask via smart contract address
				0xf0f9d895aca5c8678f706fb8216fa22957685a13
			</li>
			<li>
				4. buy (the dip) CULT on
				<a href="https://uniswap.org" target="_blank"> uniswap.org </a>
			</li>
		</ol>

		<!-- not adding the following yet because we might care about cookie stuff beforehand -->
		<!-- <iframe width="420" height="315" src="https://www.youtube.com/watch?v=fW8amMCVAJQ&t=2s" /> -->
	</div>
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
