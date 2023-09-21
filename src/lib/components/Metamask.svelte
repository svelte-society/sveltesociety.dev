<script>
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let targetChainId;
	export let targetChainName;

	let connectedWallet;
	let chainId;
	let accounts;
	let visitorHasBrowserWallet;
	let visitorIsConnectedViaBrowserWallet;
	let componentReady = false;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		if (typeof window.ethereum === 'undefined') {
			alert('You need a browserwallet like https://metamask.io to interact with this dApp.');
			visitorHasBrowserWallet = false;
		} else {
			visitorHasBrowserWallet = true;
			const result = await ethereum.request({ method: 'eth_accounts' });
			// alert(result);
			if (result == '') {
				// in this case the visitor needs to click the connect metamask button
				visitorIsConnectedViaBrowserWallet = false;
			} else {
				await prepareDAPPData(result);
				visitorIsConnectedViaBrowserWallet = true;
			}
		}
		componentReady = true;
	});

	async function prepareDAPPData(connectedWalletFromEarlier) {
		connectedWallet = connectedWalletFromEarlier;

		chainId = await window.ethereum.request({
			method: 'eth_chainId'
		});

		dispatch('walletConnected', {
			publicWalletAddress: connectedWallet,
			chainId: chainId
		});

		window.ethereum.on('chainChanged', handleChainChanged);
		function handleChainChanged(chainId) {
			alert(`the chain has been changed to ${chainId}. So I reload.`);
			window.location.reload();
		}
	}
	async function connectViaMetamask() {
		try {
			accounts = await window.ethereum.request({
				method: 'eth_requestAccounts'
			});

			await prepareDAPPData(accounts[0]);
			visitorIsConnectedViaBrowserWallet = true;
		} catch (error) {
			alert(error.message);
		}
	}

	// async function switchToAppropriateNetwork() {
	//     await window.ethereum.request({
	//         method: "wallet_switchEthereumChain",
	//         params: [{ chainId: Web3.utils.toHex(1101) }],
	//     });
	// }
</script>

	{#if visitorHasBrowserWallet}
		{#if visitorIsConnectedViaBrowserWallet}
			{#if targetChainId != chainId}
				<p><br /></p>
				In order to interact with the correct 
				<a
					href="https://github.com/monique-baumann/cultmagazine/blob/staging/smart-contracts/free-julian-assange.sol"
					target="_blank">smart contract</a
				>
				you need to switch in your browserwallet to the
				<a href="https://chainlist.org/chain/1101" target="_blank">{targetChainName}</a>
				network.
			{/if}
		{:else}
			<p><br /><br /><br /></p>
			<button class="button" on:click={connectViaMetamask}> Connect Metamask </button>
			<p><br /></p>
		{/if}
	{:else}
		<p><br /><br /></p>
		Please download a browserwallet which you trust like
		<a href="https://metamask.io" target="_blank">metamask.io</a>
		or use the integrated browserwallet in the
		<a href="https://brave.com" target="_blank">brave.com</a> browser.

		<p><br /></p>
	{/if}

<style>
	button {
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
</style>
