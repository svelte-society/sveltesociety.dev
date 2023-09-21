<script>
	import Metamask from "./Metamask.svelte";
	import { ethers } from "ethers";
	import { smartContractABI } from '../constants'

 	export let targetChainId
	export let targetChainName
	export let smartContractAddressOnChain; 
	
	let publicWalletAddressOfVisitor;
	let connectedToChainId;
	let amountOfCoinsInSmartContractItself;
	let amountOfCoinsInVisitorsWallet;
	let contract;
	
	async function handleWalletConnected(event) {
		publicWalletAddressOfVisitor = event.detail.publicWalletAddress;
		connectedToChainId = event.detail.chainId;
		const provider = new ethers.BrowserProvider(window.ethereum)
		const signer = await provider.getSigner()
		contract = new ethers.Contract(smartContractAddressOnChain, smartContractABI, signer)
		amountOfCoinsInSmartContractItself = 
		ethers.formatEther((await contract.balanceOf(smartContractAddressOnChain)));
		amountOfCoinsInVisitorsWallet = 
		ethers.formatEther((await contract.balanceOf(publicWalletAddressOfVisitor)));
	}

	async function startProject() {
		await contract.startProject()
		window.location.reload();
	}
	async function claimCurrentlyAvailableLiquidityBackedMaxRewards() {
		await contract.claimCurrentlyAvailableLiquidityBackedMaxRewards()
		confirm("please reload this page after some seconds to see how much coins you have")
	}

</script>

<main>

	<Metamask 
	targetChainId={targetChainId} 
	targetChainName={targetChainName} 
	on:walletConnected={handleWalletConnected} />

	{#if publicWalletAddressOfVisitor != undefined}
		<p><br /></p>
		You are connected with wallet:
		<p />
		{publicWalletAddressOfVisitor}
		<p />
		on chain Id:
		<p />
		{connectedToChainId}
		<p />

		You might be interested in
		<p />
		<a href="https://chainid.network/" target="_blank">chainid.network</a>
		and in
		<p />
		<a href="https://chainlist.org/" target="_blank">chainlist.org</a>

		<p><br></p>

		This dApp allows you to interact with the following smart contract: <p></p>
	 	<a target="_blank" href="https://zkevm.polygonscan.com/address/{smartContractAddressOnChain}">
			{smartContractAddressOnChain}
		</a>	
		 on {targetChainName}.

		<p><br></p>
		Within the smart contract itself there are currently <p></p>
		{amountOfCoinsInSmartContractItself} Coins.
		<p><br></p>
		You currently have <p></p>
		{amountOfCoinsInVisitorsWallet} Coins.
		<p><br></p>
		<button on:click={startProject}>
			Start Project
		</button>
		<p><br></p>
		<button on:click={claimCurrentlyAvailableLiquidityBackedMaxRewards}>
			Claim Currently Available Rewards
		</button>
	{:else}
		Please check Metamask Browserextension and reload.
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
