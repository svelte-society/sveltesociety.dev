<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";

    export let targetChainId;
    export let targetChainName;

    let connectedWallet;
    let chainId;
    let accounts;

    const dispatch = createEventDispatcher();

    onMount(async () => {
        try {
            prepareDAPPContext();
        } catch (error) {
            alert(error.message);
        }
    });

    async function prepareDAPPContext() {
        if (typeof window.ethereum === "undefined") {
            alert(
                "You need a browserwallet like https://metamask.io to interact with this dApp."
            );
        } else {
            accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            connectedWallet = accounts[0].toLowerCase();

            chainId = await window.ethereum.request({
                method: "eth_chainId",
            });

            dispatch("walletConnected", {
                publicWalletAddress: connectedWallet,
                chainId: chainId,
            });

            window.ethereum.on("chainChanged", handleChainChanged);
            function handleChainChanged(chainId) {
                alert(`the chain has been changed to ${chainId}. So I reload.`);
                window.location.reload();
            }
        }
    }

    // async function switchToAppropriateNetwork() {
    //     await window.ethereum.request({
    //         method: "wallet_switchEthereumChain",
    //         params: [{ chainId: Web3.utils.toHex(1101) }],
    //     });
    // }
</script>

{#if targetChainId != chainId}
    <p><br /></p>
    In order to interact with the FreeJulianAssange dApp and its corresponding 
    <a href="https://github.com/monique-baumann/cultmagazine/blob/staging/smart-contracts/free-julian-assange.sol" target="_blank">smart contract</a> you need to switch to the 
    <a href="https://chainlist.org/chain/1101" target="_blank">{targetChainName}</a> 
     network.

{/if}
