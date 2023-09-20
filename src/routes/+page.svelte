<script lang="ts">
	import EvidenceLinkProvider from '$components/EvidenceLinkProvider.svelte';
	import Link from '$layout/Link.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="Home"
	description="We are a network of cultdao.io fans promoting freedom, fairness, education and love."
/>

<h2 class="text-center">CULT Magazine</h2>
<section class="text-center">
	<!-- We foster decentralized cryptocurrencies to ensure there is no ground for corrupt politicians.
	<p><br /></p> -->
	We give freedom to those who support freedom, fairness and peace.

	<EvidenceLinkProvider></EvidenceLinkProvider>
	<div class="iframediv">
		<iframe
		class="rumble"
		width="100%"
		height="600"
		src="https://rumble.com/embed/v1j2t8l/?pub=1e5w3p"
		frameborder="0"
		allowfullscreen
		title="The A-Team Supports Rumble"
		/>
	</div>
	<p><br></p>
	
</section>





<style>
	/* .cultandrvltpricedirectionindicatordiv {
		margin-left: auto;
		margin-right: auto;
		text-align: center;
		width: 42%;
	}
	.cultandrvltpricedirectionindicator {
		width: 700px;
	} */
	/* .embedonlycultfans {
		margin-top: 4vh;
	}

	@media (max-width: 1000px) {
		.embedonlycultfans {
			display: none;
		}
	} */
	/* .centeredImage {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 50%;
	} */
	
</style>
