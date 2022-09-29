<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Link from '$layout/Link.svelte';
</script>

<Seo title="CULT Events" />

<p><br /></p>
<div class="text-center">
	<h1>News & Events</h1>
	<p>
		Everyone is invited to add CULT Events via <a
			href="https://www.youtube.com/watch?v=8lGpZkjnkt4"
			target="_blank"
		>
			pull request</a
		>.
	</p>

	<p><br /></p>
	We'll promote events where guests get free entrance when proving they have CULT or RVLT in their wallet.
	We'll also promote CULT related Twitter Spaces and Youtube Live Streams.

	<p><br /></p>
	The latest CULT statistics can be found via
	<a href="https://dune.com/web3_data/CULT" target="_blank"> this link</a>.
	<p><br /></p>

	<p><br /></p>

	Until the
	<a href="https://github.com/cultfamily-on-github/cult-events-microservice" target="_blank">
		CULT Events Microservice
	</a>
	is available, the best way to stay up to date might be to follow some of teh many and to join our community.<br
	/><br />
	<p><br /></p>

	<a href="https://twitter.com/MERP40400977" target="_blank"> MERP - #TALKABOUTCULT</a> <br /><br />
	<a href="https://twitter.com/MrOmodulus" target="_blank"> Mr O</a> <br /><br />
	<a href="https://twitter.com/Artorias_eth" target="_blank"> Artorias</a> <br /><br />
	<a href="https://twitter.com/LittleManPower" target="_blank"> Mr. P</a>

	<p><br /><br /></p>

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
	<p><br /><br /><br /></p>

	<p><br /></p>
	<h3>New CULT Shops Going Live</h3>
	<br /><br />
	<a href="https://dripxkarip.com" target="_blank"> dripxkarip.com</a><br /><br />
	<a href="https://www.shop2revolt.com" target="_blank"> shop2revolt.com</a><br /><br />
	<a href="https://www.cultdaodizayn.com" target="_blank"> cultdaodizayn.com</a>

	<p><br /></p>
	<p><br /></p>
	<h3>Cultoshi is Optimizing the Voting Process</h3>

	<p><br /></p>
	The following content is embedded from
	<a href="https://revolt.cultoshi.com" target="_blank"> revolt.cultoshi.com</a>.
	<p><br /><br /><br /></p>

	<embed type="text/html" src="https://revolt.cultoshi.com/" width="100%" height="1100vh" />
	<p><br /></p>
	<p><br /></p>
	<h3>CULT Chat Feature Under Construction</h3>
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	<p><br /></p>
	<p><br /></p>
	<h3>CULT Market Feature Under Construction</h3>
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.

	<p><br /></p>
	<p><br /></p>
	<h3>CULT News and Events Under Construction</h3>
	<p><br /></p>
	This page will look much better as soon as it embeds the CULT News and Events Microservice which is
	in the cooking.<br /><br />
	<p><br /><br /></p>
</div>

<style>
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
</style>
