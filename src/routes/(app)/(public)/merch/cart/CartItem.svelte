<script lang="ts">
	import type { MerchCartItem } from '$lib/server/services/merch/cart'
	import { incrementQuantity, decrementQuantity, removeFromCart } from './cart.remote'

	type Props = {
		item: MerchCartItem
		formatPrice: (cents: number) => string
	}

	let { item, formatPrice }: Props = $props()

	const inc = $derived(incrementQuantity.for(item.variant_id))
	const dec = $derived(decrementQuantity.for(item.variant_id))
	const rem = $derived(removeFromCart.for(item.variant_id))
</script>

<div class="flex items-center gap-4 p-4" data-testid="cart-item">
	{#if item.image}
		<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
			<img src={item.image} alt={item.product_title} class="h-full w-full object-cover" />
		</div>
	{/if}

	<div class="min-w-0 flex-1">
		<h3 class="font-bold">{item.product_title}</h3>
		<p class="text-sm text-gray-500">{item.variant_label}</p>
		<p class="text-sm font-semibold">{formatPrice(item.price_cents)}</p>
	</div>

	<div class="flex items-center gap-2">
		<form {...dec}>
			<input {...dec.fields.variant_id.as('hidden', item.variant_id)} />
			<button
				type="submit"
				class="rounded-lg bg-zinc-200 px-2.5 py-1 text-sm font-medium transition-colors hover:bg-zinc-300"
			>
				-
			</button>
		</form>
		<span class="w-8 text-center text-sm font-medium">{item.quantity}</span>
		<form {...inc}>
			<input {...inc.fields.variant_id.as('hidden', item.variant_id)} />
			<button
				type="submit"
				class="rounded-lg bg-zinc-200 px-2.5 py-1 text-sm font-medium transition-colors hover:bg-zinc-300"
			>
				+
			</button>
		</form>
	</div>

	<div class="text-right">
		<p class="font-semibold">
			{formatPrice(item.price_cents * item.quantity)}
		</p>
		<form {...rem}>
			<input {...rem.fields.variant_id.as('hidden', item.variant_id)} />
			<button
				type="submit"
				class="mt-1 text-sm text-gray-500 hover:text-red-600"
				data-testid="cart-remove"
			>
				Remove
			</button>
		</form>
	</div>
</div>
