<script lang="ts">
	import Tote from 'phosphor-svelte/lib/Tote'
	import { getCart } from '../(public)/merch/cart/cart.remote'

	let cartData = $derived(await getCart())
	let itemCount = $derived(cartData.summary.itemCount)
</script>

<a
	href="/merch/cart"
	class="relative flex items-center text-gray-700 hover:text-gray-900"
	aria-label="Shopping cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})"
	data-testid="cart-icon"
>
	<Tote class="h-6 w-6" weight="bold" />
	{#if itemCount > 0}
		<span
			class="bg-svelte-900 absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
			data-testid="cart-count"
		>
			{itemCount > 9 ? '9+' : itemCount}
		</span>
	{/if}
</a>
