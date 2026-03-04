<script lang="ts">
	import { initForm } from '$lib/utils/form.svelte'
	import Avatar from '$lib/ui/Avatar.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import Textarea from '$lib/ui/Textarea.svelte'
	import { getAccountData, updateProfile } from './account.remote'
	import { getMyOrders } from '../merch/orders/data.remote'

	const account = $derived(await getAccountData())
	const { orders: allOrders } = $derived(await getMyOrders())
	const orders = $derived(allOrders.filter((o) => o.status === 'paid'))

	initForm(updateProfile, () => ({
		name: account.name ?? '',
		bio: account.bio ?? '',
		location: account.location ?? '',
		twitter: account.twitter ?? ''
	}))

	function formatDate(iso: string): string {
		if (!iso) return ''
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
	}

	function formatPrice(cents: number | null, currency: string | null): string {
		if (cents == null) return '$0.00'
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency || 'usd'
		}).format(cents / 100)
	}

	function statusBadge(status: string): { class: string; label: string } {
		switch (status) {
			case 'pending':
				return { class: 'border-yellow-200 bg-yellow-50 text-yellow-700', label: 'Pending' }
			case 'submitted':
				return { class: 'border-blue-200 bg-blue-50 text-blue-700', label: 'Submitted' }
			case 'in_production':
				return {
					class: 'border-purple-200 bg-purple-50 text-purple-700',
					label: 'In Production'
				}
			case 'shipped':
				return { class: 'border-green-200 bg-green-50 text-green-700', label: 'Shipped' }
			case 'delivered':
				return { class: 'border-green-200 bg-green-50 text-green-700', label: 'Delivered' }
			default:
				return { class: 'border-slate-200 bg-slate-50 text-slate-600', label: 'Processing' }
		}
	}
</script>

<svelte:head>
	<title>Account Settings | Svelte Society</title>
</svelte:head>

<div class="space-y-8">
	<div>
		<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Your</p>
		<h1 class="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Account Settings</h1>
	</div>

	<!-- Profile Section -->
	<section class="rounded-2xl border border-slate-100 bg-white" data-testid="profile-section">
		<div class="grain flex items-center gap-4 rounded-t-2xl bg-svelte-50 p-6 sm:p-8">
			<Avatar src={account.avatar_url} name={account.name} size="lg" />
			<div>
				<p class="font-bold tracking-tight">{account.username}</p>
				{#if account.email}
					<p class="text-sm text-slate-500">{account.email}</p>
				{/if}
				<p class="mt-0.5 text-xs text-slate-400">
					Member since {formatDate(account.created_at)}
				</p>
			</div>
		</div>

		<form {...updateProfile} class="p-6 sm:p-8" data-testid="profile-form">
			<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Edit Profile</p>

			<fieldset disabled={!!updateProfile.pending} class="mt-4 space-y-4">
				<Input
					{...updateProfile.fields.name.as('text')}
					label="Name"
					placeholder="Your display name"
					issues={updateProfile.fields.name.issues()}
				/>

				<Textarea
					{...updateProfile.fields.bio.as('text')}
					label="Bio"
					rows={3}
					placeholder="Tell us about yourself"
					issues={updateProfile.fields.bio.issues()}
				/>

				<div class="grid gap-4 sm:grid-cols-2">
					<Input
						{...updateProfile.fields.location.as('text')}
						label="Location"
						placeholder="City, Country"
						issues={updateProfile.fields.location.issues()}
					/>

					<Input
						{...updateProfile.fields.twitter.as('text')}
						label="Twitter / X"
						placeholder="@username"
						issues={updateProfile.fields.twitter.issues()}
					/>
				</div>

				<div class="flex items-center gap-3 pt-2">
					<Button
						type="submit"
						variant="primary"
						disabled={!!updateProfile.pending}
						data-testid="save-profile-button"
					>
						{updateProfile.pending ? 'Saving...' : 'Save Changes'}
					</Button>

					{#if updateProfile.result}
						<p
							class="text-sm font-medium {updateProfile.result.success
								? 'text-green-600'
								: 'text-red-600'}"
						>
							{updateProfile.result.message}
						</p>
					{/if}
				</div>
			</fieldset>
		</form>
	</section>

	<!-- Newsletter Section -->
	<section
		class="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8"
		data-testid="newsletter-section"
	>
		<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Newsletter</p>
		<p class="mt-1 text-sm text-slate-400">Manage your newsletter subscription</p>

		<div class="mt-5">
			{#if account.newsletter_preference === 'subscribed'}
				<div class="flex items-center gap-3">
					<span
						class="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
					>
						Subscribed
					</span>
					{#if account.plunk_contact_id}
						<a
							href="https://next-app.useplunk.com/manage/{account.plunk_contact_id}"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
							data-testid="manage-newsletter-link"
						>
							Manage preferences
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="h-3.5 w-3.5"
							>
								<path
									fill-rule="evenodd"
									d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.25a.75.75 0 01-.75-.75z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					{/if}
				</div>
			{:else}
				<div class="flex items-center gap-4">
					<span
						class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
					>
						Not subscribed
					</span>
					<a
						href="/newsletter/subscribe"
						class="text-svelte-900 text-sm font-medium hover:underline"
						data-testid="subscribe-newsletter-link"
					>
						Subscribe
					</a>
				</div>
			{/if}
		</div>
	</section>

	<!-- Orders Section -->
	<section
		class="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8"
		data-testid="orders-section"
	>
		<div class="flex items-center justify-between">
			<div>
				<p class="text-svelte-500 text-xs font-medium uppercase tracking-[0.2em]">Merch</p>
				<p class="mt-1 text-sm text-slate-400">Your recent orders</p>
			</div>
			{#if orders.length > 0}
				<a
					href="/merch/orders"
					class="text-svelte-900 text-sm font-medium hover:underline"
					data-testid="view-all-orders-link"
				>
					View all
				</a>
			{/if}
		</div>

		<div class="mt-5">
			{#if orders.length > 0}
				<div
					class="divide-y divide-slate-100 rounded-xl border border-slate-100"
					data-testid="recent-orders-list"
				>
					{#each orders.slice(0, 3) as order (order.sessionId)}
						<a
							href="/merch/orders/{order.sessionId}"
							class="group flex items-center justify-between p-4 transition-colors hover:bg-slate-50"
						>
							<div>
								<p class="text-sm font-bold tracking-tight">
									{formatDate(order.created)}
								</p>
								<p class="mt-0.5 text-xs text-slate-400">
									{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
								</p>
							</div>
							<div class="flex items-center gap-3">
								<span
									class="rounded-full border px-2.5 py-0.5 text-xs font-medium {statusBadge(
										order.fulfillmentStatus
									).class}"
								>
									{statusBadge(order.fulfillmentStatus).label}
								</span>
								<span class="text-sm font-black tabular-nums">
									{formatPrice(order.amount, order.currency)}
								</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M8.25 4.5l7.5 7.5-7.5 7.5"
									/>
								</svg>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="grain rounded-xl bg-svelte-50 py-10 text-center">
					<p class="text-sm font-bold tracking-tight">No orders yet</p>
					<a
						href="/merch"
						class="text-svelte-900 mt-2 inline-block text-sm font-medium hover:underline"
						data-testid="browse-merch-link"
					>
						Browse the merch store
					</a>
				</div>
			{/if}
		</div>
	</section>
</div>
