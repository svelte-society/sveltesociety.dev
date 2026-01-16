<script lang="ts">
	import Check from 'phosphor-svelte/lib/Check'
	import Star from 'phosphor-svelte/lib/Star'
	import Heart from 'phosphor-svelte/lib/Heart'
	import Globe from 'phosphor-svelte/lib/Globe'
	import Megaphone from 'phosphor-svelte/lib/Megaphone'
	import Users from 'phosphor-svelte/lib/Users'
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight'
	import Button from '$lib/ui/Button.svelte'
	import { getSponsorTiers } from './data.remote'

	let tiers = await getSponsorTiers()

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(cents / 100)
	}

	function formatYearlyPrice(cents: number): string {
		const monthly = cents / 12
		return formatPrice(monthly)
	}
</script>

<svelte:head>
	<title>Become a Sponsor | Svelte Society</title>
	<meta
		name="description"
		content="Support the Svelte community and reach thousands of developers. Sponsor Svelte Society with flexible plans."
	/>
</svelte:head>

<div class="mx-auto max-w-5xl">
	<!-- Hero Section -->
	<div class="mb-12 text-center">
		<h1 class="text-4xl font-bold">Become a Sponsor</h1>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
			Support the Svelte community while reaching thousands of developers who build with Svelte
			every day.
		</p>
	</div>

	<!-- Benefits -->
	<div class="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-lg border border-slate-200 bg-white p-6 text-center">
			<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
				<Users size={24} class="text-orange-600" />
			</div>
			<h3 class="font-semibold">Reach Developers</h3>
			<p class="mt-2 text-sm text-slate-600">
				Connect with thousands of Svelte developers actively building projects
			</p>
		</div>

		<div class="rounded-lg border border-slate-200 bg-white p-6 text-center">
			<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
				<Globe size={24} class="text-orange-600" />
			</div>
			<h3 class="font-semibold">Global Visibility</h3>
			<p class="mt-2 text-sm text-slate-600">
				Your brand displayed across our site, reaching a worldwide audience
			</p>
		</div>

		<div class="rounded-lg border border-slate-200 bg-white p-6 text-center">
			<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
				<Heart size={24} class="text-orange-600" />
			</div>
			<h3 class="font-semibold">Support Open Source</h3>
			<p class="mt-2 text-sm text-slate-600">
				Help sustain the Svelte ecosystem and community resources
			</p>
		</div>

		<div class="rounded-lg border border-slate-200 bg-white p-6 text-center">
			<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
				<Megaphone size={24} class="text-orange-600" />
			</div>
			<h3 class="font-semibold">Social Promotion</h3>
			<p class="mt-2 text-sm text-slate-600">
				Premium sponsors get featured in our social channels
			</p>
		</div>
	</div>

	<!-- Pricing Section -->
	<div class="mb-12">
		<h2 class="mb-8 text-center text-2xl font-bold">Choose Your Plan</h2>

		<div class="grid gap-6 lg:grid-cols-2" data-testid="sponsor-tiers">
			{#each tiers as tier (tier.id)}
				{@const features = tier.features}
				<div
					class="relative rounded-xl border-2 bg-white p-8 {tier.name === 'premium'
						? 'border-orange-500 ring-2 ring-orange-200'
						: 'border-slate-200'}"
					data-testid="tier-{tier.name}"
				>
					{#if tier.name === 'premium'}
						<div
							class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 text-sm font-medium text-white"
						>
							<Star size={14} weight="fill" class="mr-1 inline" />
							Most Popular
						</div>
					{/if}

					<div class="mb-6">
						<h3 class="text-xl font-bold">{tier.display_name}</h3>
						<div class="mt-4">
							<span class="text-3xl font-bold text-orange-600">{formatPrice(tier.price_cents)}</span>
							<span class="text-slate-500">/month</span>
						</div>
						<p class="mt-2 text-sm text-slate-500">
							Or {formatPrice(tier.yearly_price_cents)}/year (save ~17%)
						</p>
					</div>

					<ul class="mb-8 space-y-3">
						{#each features as feature}
							<li class="flex items-start gap-3">
								<Check size={20} weight="bold" class="mt-0.5 shrink-0 text-green-600" />
								<span class="text-slate-700">{feature}</span>
							</li>
						{/each}
					</ul>

					<a
						href="/sponsors/submit?tier={tier.name}"
						class="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors {tier.name ===
						'premium'
							? 'bg-orange-500 text-white hover:bg-orange-600'
							: 'border border-orange-500 text-orange-600 hover:bg-orange-50'}"
					>
						Get Started
						<ArrowRight size={18} />
					</a>
				</div>
			{/each}
		</div>
	</div>

	<!-- Billing Options -->
	<div class="mb-12 rounded-lg bg-slate-50 p-8 text-center">
		<h3 class="text-lg font-semibold">Flexible Billing Options</h3>
		<p class="mt-2 text-slate-600">Choose the billing cycle that works for you:</p>
		<div class="mt-4 flex flex-wrap justify-center gap-4">
			<div class="rounded-lg border border-slate-200 bg-white px-4 py-2">
				<span class="font-medium">Monthly</span>
				<span class="text-slate-500"> - Pay as you go</span>
			</div>
			<div class="rounded-lg border border-slate-200 bg-white px-4 py-2">
				<span class="font-medium">Yearly</span>
				<span class="text-slate-500"> - Save ~17%</span>
			</div>
			<div class="rounded-lg border border-slate-200 bg-white px-4 py-2">
				<span class="font-medium">One-time</span>
				<span class="text-slate-500"> - 30 days</span>
			</div>
		</div>
	</div>

	<!-- CTA -->
	<div class="text-center">
		<a href="/sponsors/submit">
			<Button size="lg">
				<Heart size={20} class="mr-2" />
				Become a Sponsor Today
			</Button>
		</a>
		<p class="mt-4 text-sm text-slate-500">
			Questions? <a href="mailto:sponsors@sveltesociety.dev" class="text-orange-600 hover:underline">Contact us</a>
		</p>
	</div>
</div>
