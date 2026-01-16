<script lang="ts">
	import { page } from '$app/state'
	import Check from 'phosphor-svelte/lib/Check'
	import Star from 'phosphor-svelte/lib/Star'
	import Heart from 'phosphor-svelte/lib/Heart'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import Select from '$lib/ui/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import ImageUpload from '$lib/ui/ImageUpload.svelte'
	import { submitSponsor, getSponsorTiers } from './submit.remote'

	const {
		company_name,
		logo,
		tagline,
		website_url,
		discount_code,
		discount_description,
		tier_id,
		billing_type
	} = submitSponsor.fields

	let tiers = await getSponsorTiers()

	// Get initial tier from URL if provided
	const initialTierName = page.url.searchParams.get('tier')
	const initialTier = initialTierName ? tiers.find((t) => t.name === initialTierName) : tiers[0]

	let selectedTierId = $state(initialTier?.id || tiers[0]?.id || '')
	let selectedBillingType = $state<'monthly' | 'yearly' | 'one_time'>('monthly')

	let selectedTier = $derived(tiers.find((t) => t.id === selectedTierId))

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(cents / 100)
	}

	function getCurrentPrice(): number {
		if (!selectedTier) return 0
		switch (selectedBillingType) {
			case 'monthly':
				return selectedTier.price_cents
			case 'yearly':
				return selectedTier.yearly_price_cents
			case 'one_time':
				return selectedTier.one_time_price_cents
		}
	}

	function getBillingLabel(): string {
		switch (selectedBillingType) {
			case 'monthly':
				return '/month'
			case 'yearly':
				return '/year'
			case 'one_time':
				return ' one-time (30 days)'
		}
	}

	const billingOptions = [
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'yearly', label: 'Yearly (save ~17%)' },
		{ value: 'one_time', label: 'One-time (30 days)' }
	]
</script>

<svelte:head>
	<title>Become a Sponsor | Svelte Society</title>
	<meta
		name="description"
		content="Support the Svelte community and get your brand in front of thousands of developers."
	/>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<div class="mb-8 text-center">
		<h1 class="text-3xl font-bold">Become a Sponsor</h1>
		<p class="mt-2 text-slate-600">
			Support the Svelte community and reach thousands of developers
		</p>
	</div>

	<!-- Tier Selection -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold">Select Your Tier</h2>
		<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4" data-testid="pricing-tiers">
			{#each tiers as tier (tier.id)}
				{@const features = tier.features}
				<button
					type="button"
					onclick={() => (selectedTierId = tier.id)}
					class="relative flex flex-col items-start rounded-lg border-2 p-6 text-left transition-all {selectedTierId ===
					tier.id
						? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
						: 'border-slate-200 hover:border-orange-300'}"
					data-testid="tier-{tier.name}"
				>
					{#if tier.name === 'premium'}
						<div
							class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-xs font-medium text-white"
						>
							<Star size={12} weight="fill" class="mr-1 inline" />
							Best Value
						</div>
					{/if}

					<div class="mb-4">
						<h3 class="text-lg font-semibold">{tier.display_name}</h3>
						<p class="text-2xl font-bold text-orange-600">{formatPrice(tier.price_cents)}</p>
						<p class="text-sm text-slate-500">per month</p>
					</div>

					<ul class="space-y-2">
						{#each features as feature}
							<li class="flex items-start gap-2 text-sm">
								<Check size={16} weight="bold" class="mt-0.5 shrink-0 text-green-600" />
								<span>{feature}</span>
							</li>
						{/each}
					</ul>

					{#if selectedTierId === tier.id}
						<div
							class="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500"
						>
							<Check size={14} weight="bold" class="text-white" />
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Billing Type Selection -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold">Billing Cycle</h2>
		<div class="flex flex-wrap gap-3">
			{#each billingOptions as option (option.value)}
				<button
					type="button"
					onclick={() => (selectedBillingType = option.value as typeof selectedBillingType)}
					class="rounded-lg border-2 px-4 py-2 font-medium transition-all {selectedBillingType ===
					option.value
						? 'border-orange-500 bg-orange-50 text-orange-700'
						: 'border-slate-200 hover:border-orange-300'}"
					data-testid="billing-{option.value}"
				>
					{option.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Sponsor Submission Form -->
	<form {...submitSponsor} enctype="multipart/form-data" class="space-y-8">
		<input {...tier_id.as('hidden', selectedTierId)} />
		<input {...billing_type.as('hidden', selectedBillingType)} />

		<!-- Company Information -->
		<div class="rounded-lg border border-slate-200 bg-white p-6">
			<h2 class="mb-4 text-xl font-semibold">Company Information</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				<Input
					{...company_name.as('text')}
					label="Company Name"
					placeholder="Acme Inc."
					issues={company_name.issues()}
					data-testid="company-name-input"
				/>

				<Input
					{...website_url.as('url')}
					label="Website URL"
					placeholder="https://acme.com"
					issues={website_url.issues()}
					data-testid="website-url-input"
				/>

				<div class="sm:col-span-2">
					<ImageUpload
						{...logo.as('file')}
						label="Company Logo"
						description="PNG, JPG, or WebP. Recommended: 200x200px or larger."
						issues={logo.issues()}
						data-testid="logo-input"
					/>
				</div>

				<div class="sm:col-span-2">
					<TextArea
						{...tagline.as('text')}
						label="Tagline"
						placeholder="Your company tagline or slogan"
						description="Max {selectedTier?.max_tagline_length ?? 100} characters for this tier"
						maxlength={selectedTier?.max_tagline_length ?? 100}
						rows={2}
						issues={tagline.issues()}
						data-testid="tagline-input"
					/>
				</div>
			</div>
		</div>

		<!-- Optional Discount -->
		<div class="rounded-lg border border-slate-200 bg-white p-6">
			<h2 class="mb-4 text-xl font-semibold">Discount for Svelte Developers (Optional)</h2>
			<p class="mb-4 text-sm text-slate-600">
				Offer a special discount to the Svelte community. This will be displayed alongside your
				sponsorship.
			</p>
			<div class="grid gap-4 sm:grid-cols-2">
				<Input
					{...discount_code.as('text')}
					label="Discount Code"
					placeholder="SVELTE20"
					issues={discount_code.issues()}
					data-testid="discount-code-input"
				/>

				<Input
					{...discount_description.as('text')}
					label="Discount Description"
					placeholder="20% off for Svelte developers"
					issues={discount_description.issues()}
					data-testid="discount-description-input"
				/>
			</div>
		</div>

		<!-- Submit -->
		<div class="flex items-center justify-between rounded-lg bg-slate-50 p-6">
			<div>
				<p class="font-semibold">Total: {formatPrice(getCurrentPrice())}{getBillingLabel()}</p>
				<p class="text-sm text-slate-600">
					{#if selectedBillingType === 'one_time'}
						Your sponsorship will be active for 30 days
					{:else}
						Cancel anytime. No long-term commitment required.
					{/if}
				</p>
			</div>
			<Button data-testid="submit-sponsor-button">
				<Heart size={18} class="mr-2" />
				Continue to Payment
			</Button>
		</div>
	</form>
</div>
