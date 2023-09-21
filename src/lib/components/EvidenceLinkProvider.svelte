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
	let amountOfCoinsToBeSold;
	let visitorWantsToSellCoins;
	let visitorWantsToInvest;
	let oneHalFinneyInEther = 0.001;
	let ethAmountToBeInvested;
	let evidenceLink;
	let freedomFanIDOfVisitor;
	let freedomFanInfoOfVisitor = {};
	let rawInfo;
	let freedomFanInfoOfArray;
	let readyForFreedom;

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

		freedomFanIDOfVisitor = await contract.getIDOfFreedomFan(publicWalletAddressOfVisitor);
		rawInfo = await contract.getFreedomFanInfos(freedomFanIDOfVisitor);

		freedomFanInfoOfArray = rawInfo.toString().split(',');
		freedomFanInfoOfVisitor.address = freedomFanInfoOfArray[0];
		freedomFanInfoOfVisitor.evidenceLink = freedomFanInfoOfArray[1];
		freedomFanInfoOfVisitor.appliedOn = freedomFanInfoOfArray[2];
		freedomFanInfoOfVisitor.approvedOn = freedomFanInfoOfArray[3];
		freedomFanInfoOfVisitor.amountOfReceivedApprovals = freedomFanInfoOfArray[4];

		readyForFreedom = true;
	}

	async function joinFreedomFans() {
		try {
			await contract.joinFreedomFans(evidenceLink);
		} catch (error) {
			alert(error.message);
		}
		confirm(
			`thank you. this page will be reloaded in some seconds to get the latest data from the chain`
		);
		setTimeout(() => {
			window.location.reload();
		}, 3 * 1000);
	}

	async function wantToInvest() {
		visitorWantsToInvest = true;
	}

	async function wantToSellCoins() {
		amountOfCoinsToBeSold = amountOfCoinsInVisitorsWallet; // as a default
		visitorWantsToSellCoins = true;
	}

	async function buyCoinsForEther() {
		const options = { value: Number(ethAmountToBeInvested) * 10 ** 18 };
		try {
			await contract.buy(options);
			setTimeout(() => {
				confirm(
					'this page will auto reload in some seconds so you can see your then current amount of coins'
				);
			}, 5 * 1000);
		} catch (error) {
			alert(error.message);
		}
	}

	async function sellCoins() {
		if (amountOfCoinsInVisitorsWallet < amountOfCoinsToBeSold) {
			alert(
				`you have tried to sell ${amountOfCoinsToBeSold}. You only have ${amountOfCoinsInVisitorsWallet} in this wallet`
			);
		} else {
			confirm(`you are about to sell ${amountOfCoinsToBeSold} Coins.`);
			try {
				const allowance = await contract.allowance(
					publicWalletAddressOfVisitor,
					smartContractAddressOnChain
				);
				if (allowance < amountOfCoinsToBeSold) {
					await contract.increaseAllowance(
						smartContractAddressOnChain,
						BigInt(Number(amountOfCoinsToBeSold) * 10 ** 18)
					); // function needs the input in wei
					confirm(
						`setting the allowance - please wait some seconds while executing the first of 2 transactions necessary for the sale of ${amountOfCoinsToBeSold} Coins.`
					);
					setTimeout(async () => {
						await contract.sell(BigInt(Number(amountOfCoinsToBeSold) * 10 ** 18)); // function needs the input in wei
					}, 5 * 1000);
				} else {
					await contract.sell(BigInt(Number(amountOfCoinsToBeSold) * 10 ** 18)); // function needs the input in wei
				}
			} catch (error) {
				alert(error.message);
			}
			confirm(
				'this page will auto reload in some seconds so you can see your then current amount of coins'
			);
			setTimeout(() => {
				window.location.reload();
			}, 7 * 1000);
		}
	}

	async function claimCurrentlyAvailableLiquidityBackedMaxRewards() {
		const currentPotentialMaxRewards = await contract.maxRewardPerFreedomFan(
			publicWalletAddressOfVisitor
		);
		const currentBalanceOfCoinsInSmartContract = await contract.balanceOf(
			smartContractAddressOnChain
		);
		confirm(
			`currentPotentialMaxRewards: ${currentPotentialMaxRewards}``currentBalanceOfCoinsInSmartContract: ${currentBalanceOfCoinsInSmartContract}`
		);
		if (currentPotentialMaxRewards > 0 && currentBalanceOfCoinsInSmartContract > 0) {
			try {
				await contract.claimCurrentlyAvailableLiquidityBackedMaxRewards();
			} catch (error) {
				alert(error.message);
			}
			confirm('this page will auto reload in some seconds so you can see how much coins you have');
			setTimeout(() => {
				window.location.reload();
			}, 5 * 1000);
		} else {
			confirm(`this transaction would not be successful at the moment`);
			confirm(`currentPotentialMaxRewards: ${currentPotentialMaxRewards}`);
			confirm(`currentBalanceOfCoinsInSmartContract: ${currentBalanceOfCoinsInSmartContract}`);
		}
	}
</script>

<main>
	The
	<a
		href="https://github.com/monique-baumann/cultmagazine/blob/staging/smart-contracts/free-julian-assange.sol"
		target="_blank">smart contract</a
	>
	is deployed on
	<!-- <a href="https://polygon.technology/polygon-zkevm" target="_blank">Polygon zkEVM</a>  -->
	<a href="https://chainlist.org/chain/1101" target="_blank">{targetChainName}</a>
	with the address
	<a href="https://zkevm.polygonscan.com/token/{smartContractAddressOnChain}" target="_blank"
		>{smartContractAddressOnChain}</a
	>.

	<Metamask {targetChainId} {targetChainName} on:walletConnected={handleWalletConnected} />
	{#if publicWalletAddressOfVisitor != undefined && targetChainId == connectedToChainId}
		<p><br /> <br /></p>
		You are connected with wallet:
		<p><br /></p>
		<a href="https://zkevm.polygonscan.com/address/{publicWalletAddressOfVisitor}" target="_blank"
			>{publicWalletAddressOfVisitor}</a
		>

		<p />

		{#if readyForFreedom}
			<p><br /></p>
			Within the smart contract itself there are currently
			<p />
			{amountOfCoinsInSmartContractItself} Julians.
			<p><br /></p>
			Your currently connected wallet has
			<p />
			{amountOfCoinsInVisitorsWallet} Julians.
			<p><br /></p>
			<p><br /></p>
			{#if freedomFanIDOfVisitor == undefined}
				<input
					class="myInputField"
					type="text"
					bind:value={evidenceLink}
					placeholder="Please provide your evidence link here"
				/>
				<p><br /></p>

				{#if evidenceLink != undefined}
					<button on:click={joinFreedomFans}> Join Freedom Fans </button>
				{/if}
			{:else}

				The evidence link you have provided is: <p><br></p>
				<a href="{freedomFanInfoOfVisitor.evidenceLink}" target="_blank">{freedomFanInfoOfVisitor.evidenceLink}</a>
				<p><br></p>
				You have applied on (timestamp) ({freedomFanInfoOfVisitor.appliedOn})
				<p><br></p>
				You have been fully approved on (timestamp) ({freedomFanInfoOfVisitor.approvedOn})
				<p><br></p>
				You have received ({freedomFanInfoOfVisitor.amountOfReceivedApprovals}) approvals.
				<p><br /></p>
				<p><br /></p>
				<button on:click={claimCurrentlyAvailableLiquidityBackedMaxRewards}>
					Claim Currently Available Rewards
				</button>
				<p><br /></p>
				<p><br /></p>
				{#if visitorWantsToInvest}
					<input
						class="myInputField"
						type="number"
						bind:value={ethAmountToBeInvested}
						placeholder="Invest max 1 Finney"
						min="0"
						max={oneHalFinneyInEther}
						step="0.00001"
					/>
					<p><br /></p>
					<button on:click={buyCoinsForEther}> Invest Now </button>
					<p><br /></p>
				{:else}
					<button on:click={wantToInvest}> Invest Coins </button>
				{/if}
				<p><br /></p>
				<p><br /></p>
				{#if visitorWantsToSellCoins}
					<input
						class="myInputField"
						type="number"
						bind:value={amountOfCoinsToBeSold}
						placeholder="How much to sell?"
						max={amountOfCoinsInVisitorsWallet}
					/>
					<p><br /></p>
					<button on:click={sellCoins}> Sell Now </button>
					<p><br /></p>
				{:else}
					<button on:click={wantToSellCoins}> Sell Coins </button>
				{/if}
			{/if}
		{/if}
	{/if}
</main>

<style>
	.myInputField {
		border-radius: var(--border-radius);
		font-size: medium;
		font-weight: bold;
		padding: var(--s-4) var(--s-6);
		border-radius: var(--s-1);
		min-width: 100%;
		width: 100%;
	}
	button {
		min-width: 100%;
		width: 100%;
		text-decoration: none;
		display: block;
		border-radius: var(--border-radius);
		display: inline-block;
		font-size: medium;
		font-weight: bold;
		padding: var(--s-4) var(--s-6);
		border-radius: var(--s-1);
		background-color: rgb(10, 156, 235);
		color: var(--white);
		box-shadow: var(--shadow-short);
		transition: all 0.2s ease-out;
	}

	button:hover {
		cursor: pointer;
		filter: brightness(1.1);
		box-shadow: var(--shadow-diffuse);
	}
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
