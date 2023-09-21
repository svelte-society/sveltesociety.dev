<script>
	import Metamask from './Metamask.svelte';
	import { ethers } from 'ethers';
	import { freeJulianAssangeABI } from '../constants';

	export let targetChainId;
	export let targetChainName;
	export let smartContractAddressOnChain;

	let publicWalletAddressOfVisitor;
	let connectedToChainId;
	let amountOfCoinsInSmartContractItself;
	let amountOfCoinsInVisitorsWallet;
	let contract;
	let visitorWantsToJoin;

	async function handleWalletConnected(event) {
		publicWalletAddressOfVisitor = event.detail.publicWalletAddress;
		connectedToChainId = event.detail.chainId;
		const provider = new ethers.BrowserProvider(window.ethereum);
		const signer = await provider.getSigner();
		contract = new ethers.Contract(smartContractAddressOnChain, freeJulianAssangeABI, signer);
		amountOfCoinsInSmartContractItself = ethers.formatEther(
			await contract.balanceOf(smartContractAddressOnChain)
		);
		amountOfCoinsInVisitorsWallet = ethers.formatEther(
			await contract.balanceOf(publicWalletAddressOfVisitor)
		);
	}

	async function join() {
		visitorWantsToJoin = true;
	}
	async function buyCoins() {
		await contract.buy();
	}
	async function sellCoins() {
		await contract.sell();
	}
	async function claimCurrentlyAvailableLiquidityBackedMaxRewards() {
		await contract.claimCurrentlyAvailableLiquidityBackedMaxRewards();
		confirm('please reload this page after some seconds to see how much coins you have');
	}
</script>

<main>

	The 
	<a href="https://github.com/monique-baumann/cultmagazine/blob/staging/smart-contracts/free-julian-assange.sol" target="_blank">smart contract</a> is deployed on 
	<!-- <a href="https://polygon.technology/polygon-zkevm" target="_blank">Polygon zkEVM</a>  -->
	<a href="https://chainlist.org/chain/1101" target="_blank">{targetChainName}</a> 
	with the address 
	<a href="https://zkevm.polygonscan.com/token/{smartContractAddressOnChain}" 
	target="_blank">{smartContractAddressOnChain}</a>.



	{#if visitorWantsToJoin}
		<Metamask {targetChainId} {targetChainName} on:walletConnected={handleWalletConnected} />
	{/if}

	{#if publicWalletAddressOfVisitor != undefined}
		<p><br /></p>
		You are connected with wallet:
		<p />
		{publicWalletAddressOfVisitor}
		<p />
		
		<p><br /></p>
		Within the smart contract itself there are currently
		<p />
		{amountOfCoinsInSmartContractItself} Coins.
		<p><br /></p>
		Your currently connected wallet has
		<p />
		{amountOfCoinsInVisitorsWallet} Coins.
		<p><br /></p>
		<p><br /></p>
		<button on:click={claimCurrentlyAvailableLiquidityBackedMaxRewards}>
			Claim Currently Available Rewards
		</button>
		<p><br /></p>
		<p><br /></p>
		<button on:click={buyCoins}> Buy Coins </button>
		<p><br /></p>
		<p><br /></p>
		<button on:click={sellCoins}> Sell Coins </button>
	{:else}
		<p><br /></p>
		<button on:click={join}> Connect Metamask </button>
		<p><br /></p>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
