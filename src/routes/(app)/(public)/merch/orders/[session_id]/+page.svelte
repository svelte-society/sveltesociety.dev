<script lang="ts">
	import { page } from '$app/state'
	import { getMyOrder } from '../data.remote'

	let order = $derived(await getMyOrder({ sessionId: page.params.session_id! }))

	function formatPrice(cents: number | null, currency: string | null): string {
		if (cents == null) return '$0.00'
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency || 'usd'
		}).format(cents / 100)
	}

	function formatDate(iso: string): string {
		if (!iso) return ''
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const timelineSteps = ['pending', 'received', 'in_production', 'quality_control', 'completed'] as const

	const stepLabels: Record<string, string> = {
		pending: 'Pending',
		received: 'Received',
		in_production: 'In Production',
		quality_control: 'Quality Control',
		completed: 'Completed'
	}

	function getStepIndex(status: string): number {
		const idx = timelineSteps.indexOf(status as (typeof timelineSteps)[number])
		return idx >= 0 ? idx : 0
	}

	function statusBadge(status: string): { class: string; label: string } {
		switch (status) {
			case 'pending':
				return { class: 'border-yellow-200 bg-yellow-50 text-yellow-700', label: 'Pending' }
			case 'received':
				return { class: 'border-blue-200 bg-blue-50 text-blue-700', label: 'Received' }
			case 'in_production':
				return {
					class: 'border-purple-200 bg-purple-50 text-purple-700',
					label: 'In Production'
				}
			case 'quality_control':
				return { class: 'border-indigo-200 bg-indigo-50 text-indigo-700', label: 'Quality Control' }
			case 'completed':
				return { class: 'border-green-200 bg-green-50 text-green-700', label: 'Completed' }
			case 'cancelled':
				return { class: 'border-red-200 bg-red-50 text-red-700', label: 'Cancelled' }
			case 'refunded':
				return { class: 'border-slate-200 bg-slate-50 text-slate-600', label: 'Refunded' }
			default:
				return { class: 'border-slate-200 bg-slate-50 text-slate-600', label: 'Processing' }
		}
	}
</script>

<svelte:head>
	<title>Order Detail | Merch | Svelte Society</title>
</svelte:head>

{#if order}
	{@const currentStep = getStepIndex(order.fulfillmentStatus)}
	{@const isCancelledOrRefunded =
		order.fulfillmentStatus === 'cancelled' || order.fulfillmentStatus === 'refunded'}

	<div class="space-y-8">
		<!-- Breadcrumb -->
		<nav class="flex items-center gap-2 text-sm">
			<a href="/merch" class="text-svelte-900 hover:underline">Merch</a>
			<span class="text-slate-300">/</span>
			<a href="/merch/orders" class="text-svelte-900 hover:underline">Orders</a>
			<span class="text-slate-300">/</span>
			<span class="font-medium text-slate-900">Detail</span>
		</nav>

		<!-- Header -->
		<div class="flex items-start justify-between">
			<div>
				<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Order</p>
				<h1 class="mt-1 text-2xl font-black tracking-tight">Order Detail</h1>
				<p class="mt-1 text-sm text-slate-400">{formatDate(order.created)}</p>
			</div>
			<span
				class="rounded-full border px-3 py-1 text-xs font-medium {statusBadge(order.fulfillmentStatus).class}"
			>
				{statusBadge(order.fulfillmentStatus).label}
			</span>
		</div>

		<!-- Fulfillment Timeline -->
		{#if !isCancelledOrRefunded}
			<div class="rounded-2xl border border-slate-100 bg-white p-6">
				<p class="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
					Fulfillment Progress
				</p>
				<div class="flex items-center justify-between">
					{#each timelineSteps as step, i}
						<div class="flex flex-col items-center gap-2">
							<div class="relative">
								{#if i <= currentStep}
									<div
										class="bg-svelte-900 flex h-8 w-8 items-center justify-center rounded-full text-white {i === currentStep ? 'ring-svelte-100 ring-4' : ''}"
									>
										{#if i < currentStep}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												class="h-4 w-4"
											>
												<path
													fill-rule="evenodd"
													d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
													clip-rule="evenodd"
												/>
											</svg>
										{:else}
											<div class="h-2 w-2 rounded-full bg-white"></div>
										{/if}
									</div>
								{:else}
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white"
									>
										<div class="h-2 w-2 rounded-full bg-slate-200"></div>
									</div>
								{/if}
							</div>
							<span
								class="text-center text-[10px] font-medium uppercase tracking-[0.1em] {i <= currentStep ? 'text-svelte-900' : 'text-slate-400'}"
							>
								{stepLabels[step]}
							</span>
						</div>
						{#if i < timelineSteps.length - 1}
							<div
								class="mx-1 mb-6 h-0.5 flex-1 rounded-full {i < currentStep ? 'bg-svelte-900' : 'bg-slate-200'}"
							></div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		<!-- Line Items -->
		<div class="rounded-2xl border border-slate-100 bg-white">
			<div class="border-b border-slate-100 px-5 py-4">
				<h2 class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Items</h2>
			</div>
			<div class="divide-y divide-slate-100">
				{#each order.lineItems as item}
					<div class="flex items-center justify-between p-5">
						<div>
							<p class="font-bold tracking-tight">{item.description}</p>
							<p class="mt-0.5 text-sm text-slate-400">Qty: {item.quantity}</p>
						</div>
						<p class="font-black tabular-nums">
							{formatPrice(item.amountTotal, item.currency)}
						</p>
					</div>
				{/each}
			</div>
			<div class="border-t border-slate-100 px-5 py-4">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-slate-500">Total</span>
					<span class="text-svelte-900 text-lg font-black tabular-nums"
						>{formatPrice(order.amount, order.currency)}</span
					>
				</div>
			</div>
		</div>

		<!-- Shipping Address -->
		{#if order.shippingAddress}
			<div class="rounded-2xl border border-slate-100 bg-white p-5">
				<h2 class="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
					Shipping Address
				</h2>
				<div class="space-y-0.5 text-sm text-slate-600">
					<p class="font-medium text-slate-900">{order.shippingAddress.name}</p>
					<p>{order.shippingAddress.line1}</p>
					{#if order.shippingAddress.line2}
						<p>{order.shippingAddress.line2}</p>
					{/if}
					<p>
						{order.shippingAddress.city}{order.shippingAddress.state
							? `, ${order.shippingAddress.state}`
							: ''}
						{order.shippingAddress.postalCode}
					</p>
					<p>{order.shippingAddress.country}</p>
				</div>
			</div>
		{/if}

		<!-- Tracking -->
		{#if order.trackingNumber}
			<div class="rounded-2xl border border-slate-100 bg-white p-5">
				<h2 class="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
					Tracking
				</h2>
				<p class="text-sm text-slate-600">
					Tracking Number: <code class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium"
						>{order.trackingNumber}</code
					>
				</p>
			</div>
		{/if}

		<a
			href="/merch/orders"
			class="text-svelte-900 inline-flex items-center gap-1 text-sm font-medium hover:underline"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-3.5 w-3.5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
			</svg>
			Back to Orders
		</a>
	</div>
{:else}
	<div class="py-16 text-center">
		<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Not Found</p>
		<h1 class="mt-2 text-2xl font-black tracking-tight">Order not found</h1>
		<p class="mt-3 text-slate-500">This order doesn't exist or you don't have access to it.</p>
		<a
			href="/merch/orders"
			class="text-svelte-900 mt-6 inline-block text-sm font-medium hover:underline"
			>&larr; Back to Orders</a
		>
	</div>
{/if}
