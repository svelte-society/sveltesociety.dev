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

<div class="flex items-center gap-5 p-5" data-testid="cart-item">
	{#if item.image}
		<div class="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50">
			<img src={item.image} alt={item.product_title} class="h-full w-full object-cover" />
		</div>
	{/if}

	<div class="min-w-0 flex-1">
		<h3 class="font-bold tracking-tight">{item.product_title}</h3>
		<p class="mt-0.5 text-sm text-slate-400">{item.variant_label}</p>
		<p class="text-svelte-900 mt-1 font-black tabular-nums">{formatPrice(item.price_cents)}</p>
	</div>

	<div class="flex items-center">
		<div class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-1 py-1">
			<form {...dec}>
				<input {...dec.fields.variant_id.as('hidden', item.variant_id)} />
				<button
					type="submit"
					class="flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
				>
					−
				</button>
			</form>
			<span class="w-7 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
			<form {...inc}>
				<input {...inc.fields.variant_id.as('hidden', item.variant_id)} />
				<button
					type="submit"
					class="flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
				>
					+
				</button>
			</form>
		</div>
	</div>

	<div class="text-right">
		<p class="font-black tabular-nums">
			{formatPrice(item.price_cents * item.quantity)}
		</p>
		<form {...rem}>
			<input {...rem.fields.variant_id.as('hidden', item.variant_id)} />
			<button
				type="submit"
				class="mt-1 text-xs font-medium text-slate-400 transition-colors hover:text-red-600"
				data-testid="cart-remove"
			>
				Remove
			</button>
		</form>
	</div>
</div>
