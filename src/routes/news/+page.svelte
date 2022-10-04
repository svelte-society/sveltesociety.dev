<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Link from '$layout/Link.svelte';
</script>

<Seo title="CULT News" />

<div class="text-center">
	<h2>News</h2>
	The latest CULT statistics can be found via
	<a href="https://dune.com/web3_data/CULT" target="_blank"> this link</a>. 
	<p><br></p> 
	The latest CULT Magazine news can be received with our
	<a href="https://t.me/cultmagazine_bot" target="_blank"> telegram news bot</a>.

	<h4>Communities</h4>
	Please follow each other on
	<a href="https://twitter.com/MrOmodulus" target="_blank"> Twitter</a>.

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

	<h4>Events</h4>

	We'll promote CULT related live streams taking place on
	<a href="https://rumble.com/c/c-1902267" target="_blank"> rumble.com </a>
	and on
	<a href="https://onlycultfans.org/" target="_blank"> onlycultfans.org</a> <p><br></p> 
	Additionally we'll promote many kinds of events where guests get free entrance when proving they have
	<a href="https://coinmarketcap.com/currencies/cult-dao" target="_blank"> CULT </a>
	or
	<a href="https://coinmarketcap.com/currencies/revolt-2-earn" target="_blank"> RVLT </a>

	in their wallet.

	<h4>Miscellaneous</h4>

	<h6>CULT Shops Going Live</h6>

	<a href="https://dripxkarip.com" target="_blank"> dripxkarip.com</a> -
	<a href="https://www.shop2revolt.com" target="_blank"> shop2revolt.com</a> -
	<a href="https://www.cultdaodizayn.com" target="_blank"> cultdaodizayn.com</a>

	<h6>Cultoshi Optimizes the Voting Process</h6>

	<!-- The following content is embedded from -->
	<a href="https://revolt.cultoshi.com" target="_blank"> revolt.cultoshi.com</a>.

	<h6>CULT Mag NFTs</h6>

	The plan is to list
	<a href="https://github.com/cultfamily-on-github/cult-mag-nfts" target="_blank"> CULT Mag NFTs</a>
	here to validate their authenticity.<br /><br />

	<h6>CULT Resources</h6>

	<!-- 
	Everyone is invited to add CULT resources via
	<a href="https://www.youtube.com/watch?v=8lGpZkjnkt4" target="_blank"> pull request</a>.<br /> -->

	The plan is that
	<a href="https://github.com/cultfamily-on-github/cult-resources-microservice/blob/main/README.md">
		CULT resources
	</a>support you while you
	<a href="https://cultdao.io/rvlt.pdf" target="_blank"> Revolt 2 Earn</a>.

	<h6>Meme Collection</h6>

	A pretty cool CULT Meme Collection can be found
	<a
		href="https://twitter.com/MrOmodulus/status/1557855262630768642?s=20&t=RmW7uokNAFP40Cj8GeMGzw"
		target="_blank"
	>
		here</a
	>

	and
	<a href="https://discord.com/channels/931866010447929364/984899457097269359" target="_blank">
		here</a
	>.

	<h6>Evidence Links of Approved Acts</h6>
	<div style="margin-top: 7vh;">
		<embed
			src="https://dune.com/embeds/1281907/2196555/23003dfb-6d8a-4a5a-9321-e295fe23b20b"
			width="100%"
			height="700"
		/>
	</div>
</div>

<style>
	ul {
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--s-20);
		row-gap: var(--s-5);
		justify-content: space-around;
		text-align: center;
		margin-top: 3vh;
	}

	img {
		width: 128px;
	}

</style>
