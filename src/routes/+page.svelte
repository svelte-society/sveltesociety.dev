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
	<p><br></p>
	We have launched a decentralized crypto currency to free Julian Assange. 
	<p><br></p>
	The 
	<a href="https://github.com/monique-baumann/cultmagazine/blob/staging/smart-contracts/free-julian-assange.sol" target="_blank">smart contract</a> is deployed on 
	<!-- <a href="https://polygon.technology/polygon-zkevm" target="_blank">Polygon zkEVM</a>  -->
	<a href="https://chainlist.org/chain/1101" target="_blank">Polygon zkEVM</a> 
	with the address 
	<a href="https://zkevm.polygonscan.com/token/0x0c11a215b82d3143b1913ab9ff37d2caa0d423bf" 
	target="_blank">0x0c11a215b82d3143b1913ab9ff37d2caa0d423bf</a>.
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
	<EvidenceLinkProvider></EvidenceLinkProvider>

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
