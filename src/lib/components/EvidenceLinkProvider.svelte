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
	let supportLink = '';
	let freedomFanIDOfVisitor;
	let freedomFanInfoOfVisitor = {};
	let notYetApprovedFreedomFans = [];
	let approvedFreedomFans = [];
	let rawInfo;
	let readyForFreedom;
	let numberOfFreedomFans;
	let votingMode = false;
	let showApprovedFreedomFansMode = false;
	let exampleSupportLink = 'https://twitter.com/monique_is_free/status/1703679856200880545';

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

		numberOfFreedomFans = await contract.numberOfFreedomFans();
		freedomFanIDOfVisitor = await contract.getIDOfFreedomFan(publicWalletAddressOfVisitor);

		if (freedomFanIDOfVisitor > 0) {
			freedomFanInfoOfVisitor = await getFreedomFanInfoFromID(freedomFanIDOfVisitor);
		}

		try {
			await collectFreedomFans();
		} catch (error) {
			confirm(error.message);
			confirm(
				'Sorry there might be a synchronization delay. Please reload this page after some seconds.'
			);
		}
		readyForFreedom = true;
	}

	async function getFreedomFanInfoFromID(id) {
		let freedomFanInfo = {};
		rawInfo = await contract.getFreedomFanInfos(id);
		let array = [];
		array = rawInfo.toString().split(',');
		freedomFanInfo.address = array[0];
		freedomFanInfo.supportLink = array[1];
		freedomFanInfo.appliedOn = array[2];
		freedomFanInfo.approvedOn = array[3];
		freedomFanInfo.amountOfReceivedApprovals = array[4];

		return freedomFanInfo;
	}

	async function collectFreedomFans() {
		for (let i = 1; i <= numberOfFreedomFans; i++) {
			const freedomFan = await getFreedomFanInfoFromID(i);
			if (freedomFan.approvedOn == 0) {
				notYetApprovedFreedomFans.push(freedomFan);
			} else {
				approvedFreedomFans.push(freedomFan);
			}
		}
	}

	async function joinFreedomFans() {
		if (supportLink.length < 4) {
			confirm(`please provide a proper support link like ${exampleSupportLink}`);
		} else {
			try {
				await contract.joinFreedomFans(supportLink);
			} catch (error) {
				alert(error.message);
			}
			confirm(
				`thank you. this page will be reloaded in some seconds to get the latest data from the chain`
			);
			setTimeout(() => {
				window.location.reload();
			}, 7 * 1000);
		}
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
			confirm(
				'this page will auto reload in some seconds so you can see your then current amount of coins'
			);
			setTimeout(() => {
				window.location.reload();
			}, 7 * 1000);
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
			try {
				const allowance = await contract.allowance(
					publicWalletAddressOfVisitor,
					smartContractAddressOnChain
				);
				if (Number(allowance) < amountOfCoinsToBeSold) {
					await contract.increaseAllowance(
						smartContractAddressOnChain,
						BigInt(Number(amountOfCoinsToBeSold) * 10 ** 18)
					); // function needs the input in wei
					confirm(`Setting the allowance first. Please repeat after about 20 seconds.`);
				} else {
					alert(amountOfCoinsToBeSold);
					await contract.sell(BigInt(Number(amountOfCoinsToBeSold) * 10 ** 18)); // function needs the input in wei
				}
			} catch (error) {
				alert(error.message);
			}
		}
	}

	async function approve(addressOfFreedomFanToBeApproved) {
		try {
			await contract.approveFreedomFan(addressOfFreedomFanToBeApproved);
		} catch (error) {
			confirm(error.message);
		}
		confirm(
			'Thank you. This page will auto reload in some seconds so you can see if the data has already been updated on chain.'
		);
		setTimeout(() => {
			window.location.reload();
		}, 7 * 1000);
	}

	function earnRewardsByVoting() {
		votingMode = !votingMode;
	}

	function showApprovedFreedomFans() {
		showApprovedFreedomFansMode = !showApprovedFreedomFansMode;
	}

	async function claimCurrentlyAvailableLiquidityBackedMaxRewards() {
		const currentlyAvailableLiquidityBackedMaxRewards = await contract.getCurrentlyAvailableLiquidityBackedMaxRewards();
		confirm(
			`currentlyAvailableLiquidityBackedMaxRewards: ${currentlyAvailableLiquidityBackedMaxRewards}`
		);
		if (currentlyAvailableLiquidityBackedMaxRewards > 0) {
			try {
				await contract.claimCurrentlyAvailableLiquidityBackedMaxRewards();
			} catch (error) {
				alert(error.message);
			}
			confirm('this page will auto reload in some seconds so you can see how much coins you have');
			setTimeout(() => {
				window.location.reload();
			}, 7 * 1000);
		} else {
			confirm(`this transaction would not be successful at the moment`);
		}
	}
</script>

<h3>General Info</h3>
<p><br /><br /></p>
The
<a
	class="break"
	href="https://github.com/monique-baumann/cultmagazine/blob/staging/smart-contracts/free-julian-assange.sol"
	target="_blank">smart contract</a
>
is deployed on
<p><br /></p>
<!-- <a href="https://polygon.technology/polygon-zkevm" target="_blank">Polygon zkEVM</a>  -->
<a href="https://chainlist.org/chain/1101" target="_blank">{targetChainName}</a>.
<p><br /><br /></p>
It has a fixed supply of
<p><br /></p>
<a href="https://zkevm.polygonscan.com/token/{smartContractAddressOnChain}" target="_blank"
	>24.000.000 Julians</a
>.
<p><br /> <br /></p>
It can be found via the address
<p><br /></p>
<a
	class="break"
	href="https://zkevm.polygonscan.com/token/{smartContractAddressOnChain}"
	target="_blank">{smartContractAddressOnChain}</a
>.

<p><br /><br /></p>
You get a free drink at some Freedom of Speech Parties if you prove you have at least 24
<a href="https://zkevm.polygonscan.com/token/{smartContractAddressOnChain}" target="_blank"
	>Julians</a
>.
<p><br /></p>

<Metamask {targetChainId} {targetChainName} on:walletConnected={handleWalletConnected} />
{#if publicWalletAddressOfVisitor != undefined && targetChainId == connectedToChainId}
	<p><br /> <br /></p>
	You are connected with wallet:
	<p><br /></p>
	<a
		class="break"
		href="https://zkevm.polygonscan.com/address/{publicWalletAddressOfVisitor}"
		target="_blank">{publicWalletAddressOfVisitor}</a
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
		You can find a list of all holders
		<a
			href="https://zkevm.polygonscan.com/token/{smartContractAddressOnChain}#balances"
			target="_blank">here</a
		>.
		<p><br /></p>
		Please read
		<a
			class="break"
			href="https://github.com/monique-baumann/cultmagazine/blob/staging/smart-contracts/free-julian-assange.sol"
			target="_blank"
		>
			the code</a
		>. I wrote it in a way that everyone can understand it.
		<p><br /></p>
		{#if freedomFanIDOfVisitor < 1}
			<input
				class="myInputField"
				type="text"
				bind:value={supportLink}
				placeholder="Please provide your support link here"
			/>
			<p><br /></p>

			<button on:click={joinFreedomFans}> Join Freedom Fans </button>
		{:else if freedomFanInfoOfVisitor.approvedOn > 0}
			<p><br /><br /></p>
			<button on:click={earnRewardsByVoting}> Earn Rewards By Voting </button>
			<p><br /></p>

			{#if votingMode}
				{#if notYetApprovedFreedomFans.length == 0}
					There are currently no new prospects. Please talk about CULT.
				{:else}
					<h2>Prospects To Be Approved</h2>
					{#each notYetApprovedFreedomFans as freedomFan}
						<a
							class="break"
							href="https://zkevm.polygonscan.com/address/{freedomFan.address}"
							target="_blank">{freedomFan.address}</a
						>
						<p><br /></p>

						<a class="break" href={freedomFan.supportLink} target="_blank"
							>{freedomFan.supportLink}</a
						>
						<p><br /></p>
						<button on:click={() => approve(freedomFan.address)}> Approve This Freedom Fan</button>
						<hr />
						<p><br /></p>
						<p><br /></p>
					{/each}
				{/if}
			{/if}
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
					placeholder="Invest max 1 Finney = 0.001"
					min="0"
					max={oneHalFinneyInEther}
					step="0.00001"
				/>
				<p><br /></p>
				<button on:click={buyCoinsForEther}> Invest Now </button>
				<p><br /></p>
			{:else}
				<button on:click={wantToInvest}> Invest up to 1 Finney </button>
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

		<p><br /><br /></p>
		<button on:click={showApprovedFreedomFans}> Show Approved Freedom Fans </button>
		<p><br /><br /></p>

		{#if showApprovedFreedomFansMode}
			<p><br /><br /></p>
			<h3>Approved Freedom Fans</h3>
			<p><br /><br /></p>
			{#each approvedFreedomFans as freedomFan}
				<a class="break" href={freedomFan.supportLink} target="_blank">{freedomFan.supportLink}</a>
				<p><br /></p>
				<a
					class="break"
					href="https://zkevm.polygonscan.com/address/{freedomFan.address}"
					target="_blank">{freedomFan.address}</a
				>

				<p><br /></p>
				<hr />
				<p><br /></p>
			{/each}
		{/if}

		{#if freedomFanIDOfVisitor > 0}
			<p><br /></p>
			<h3>Your Master Data</h3>

			<p><br /></p>
			The support link you have provided is:
			<p><br /></p>
			<a class="break" href={freedomFanInfoOfVisitor.supportLink} target="_blank"
				>{freedomFanInfoOfVisitor.supportLink}</a
			>
			<p><br /></p>
			You have applied on<br />
			{freedomFanInfoOfVisitor.appliedOn} (timestamp)
			<p><br /></p>
			You have been fully approved on<br />
			{freedomFanInfoOfVisitor.approvedOn} (timestamp)
			<p><br /></p>
			You have received {freedomFanInfoOfVisitor.amountOfReceivedApprovals} approvals.
			<p><br /></p>
		{/if}
	{/if}
{/if}

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

	.break {
		word-break: break-all;
	}
	/* main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	} */
</style>
