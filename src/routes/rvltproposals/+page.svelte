<script>
	import Seo from '$lib/components/Seo.svelte';
	import Link from '$layout/Link.svelte';
</script>

<Seo title="RVLT Proposals" />

<div class="text-center">
	<h2>Revolt 2 Earn</h2>
	<p><br /></p>

	Here you can earn money while doing valuable things like supporting the CULTDAO. After you
	completed your work you can
	<a href="https://revolt.cultdao.io/submitProposal" target="_blank">
		submit a link to your work</a
	>. The community votes on each proposal deciding whether or not you receive a reward. <br /><br />

	The reward comes from the
	<a href="https://cultdao.io/rvlt.pdf" target="_blank"> Revolt 2 Earn </a>
	Treasury. The Revolt 2 Earn Treasury is automatically filled by everyone who buys, sells or transfers
	our deflationary currency named
	<a href="https://coinmarketcap.com/currencies/revolt-2-earn/" target="_blank"> RVLT</a>
	because 0.4% of each RVLT transaction automatically goes to this treasury.

	<p><br /><br /></p>
	If you face any difficulties feel free to reach out to our
	<a href="https://discord.gg/wearecultdao" target="_blank"> discord community</a>.

	<p><br /><br /></p>
	<p><br /><br /></p>

	<h3>RVLT Tokenomics</h3>
	<p><br /></p>
	<div
		class="text-center"
		style="width: 100%; margin-left: auto; margin-right: auto; margin-bottom: 10vh"
	>
		<img src="/images/revolt-2-earn-tokenomics.png" alt="" style="width: 100%; text-align:center" />
	</div>

	<h3>Join Us We Rock</h3>

	<p><br /></p>
	<article class="container">
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

		<embed
			src="https://dune.com/embeds/1279330/2192235/161e3edb-480c-451b-835f-078db00181e3"
			width="100%"
			height="700"
		/>

		<p><br /></p>
		<embed
			src="https://dune.com/embeds/1279317/2192218/6c162b5d-c755-4122-8596-cb70b3e0b254"
			width="100%"
			height="200"
		/>

		<p><br /></p>
		<div style="margin-left: auto; margin-right:auto; width: 50vw">
			<embed
				src="https://dune.com/embeds/1279379/2192339/a875789e-a062-49cb-9dfe-56ccf806d722"
				width="100%"
				height="200"
			/>
		</div>

		<!-- <p><br /></p>
<embed
	src="https://dune.com/embeds/1280979/2194908/ec83050f-257e-45b4-a382-f791020293c0"
	width="100%"
	height="700"
/> -->
	</article>
</div>

<style>
	article {
		max-width: 1024px;
		display: grid;
		gap: var(--s-10);
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
