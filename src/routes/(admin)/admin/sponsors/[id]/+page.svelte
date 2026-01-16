<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import Select from '$lib/ui/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import { initForm } from '$lib/utils/form.svelte'
	import { getSponsor, updateSponsor, activateSponsor, pauseSponsor, cancelSponsor } from '../data.remote'
	import Handshake from 'phosphor-svelte/lib/Handshake'
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import { formatRelativeDate } from '$lib/utils/date'

	const sponsorId = page.params.id!
	const sponsor = $derived(await getSponsor({ id: sponsorId }))

	const form = initForm(updateSponsor, () => ({
		id: sponsorId,
		company_name: sponsor?.company_name ?? '',
		tagline: sponsor?.tagline ?? '',
		website_url: sponsor?.website_url ?? '',
		discount_code: sponsor?.discount_code ?? '',
		discount_description: sponsor?.discount_description ?? '',
		status: sponsor?.status ?? 'pending'
	}))

	const statusOptions = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'active', label: 'Active' },
		{ value: 'paused', label: 'Paused' },
		{ value: 'expired', label: 'Expired' },
		{ value: 'cancelled', label: 'Cancelled' }
	]

	const colorMap = new Map([
		['pending', 'warning'],
		['active', 'success'],
		['paused', 'info'],
		['expired', 'danger'],
		['cancelled', 'danger']
	])

	function getStatusColor(status: string): string {
		return colorMap.get(status) || 'default'
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Edit Sponsor"
		description={sponsor?.company_name || 'Loading...'}
		icon={Handshake}
	>
		{#snippet actions()}
			<a
				href="/admin/sponsors"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow transition-all hover:bg-gray-50"
			>
				<ArrowLeft class="h-4 w-4" />
				Back to Sponsors
			</a>
		{/snippet}
	</PageHeader>

	{#if sponsor}
		<div class="grid gap-8 lg:grid-cols-[2fr_1fr]">
			<!-- Main Form -->
			<div class="space-y-6">
				<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Sponsor Details</h3>
					<form {...updateSponsor} class="space-y-4">
						<input {...updateSponsor.fields.id.as('hidden', sponsorId)} />

						<Input
							{...updateSponsor.fields.company_name.as('text')}
							label="Company Name"
							placeholder="Company name"
							issues={updateSponsor.fields.company_name.issues()}
						/>

						<TextArea
							{...updateSponsor.fields.tagline.as('text')}
							label="Tagline"
							placeholder="A short description of the company"
							rows={3}
							issues={updateSponsor.fields.tagline.issues()}
						/>

						<Input
							{...updateSponsor.fields.website_url.as('url')}
							label="Website URL"
							placeholder="https://example.com"
							issues={updateSponsor.fields.website_url.issues()}
						/>

						<div class="grid gap-4 sm:grid-cols-2">
							<Input
								{...updateSponsor.fields.discount_code.as('text')}
								label="Discount Code"
								placeholder="e.g., SVELTE20"
								issues={updateSponsor.fields.discount_code.issues()}
							/>
							<Input
								{...updateSponsor.fields.discount_description.as('text')}
								label="Discount Description"
								placeholder="e.g., 20% off first month"
								issues={updateSponsor.fields.discount_description.issues()}
							/>
						</div>

						<Select
							{...updateSponsor.fields.status.as('text')}
							label="Status"
							options={statusOptions}
							issues={updateSponsor.fields.status.issues()}
						/>

						<div class="flex justify-end gap-3 border-t border-gray-200 pt-4">
							<Button type="submit">Save Changes</Button>
						</div>
					</form>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Logo Preview -->
				<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Logo</h3>
					<img
						src={getCachedImageWithPreset(sponsor.logo_url, 'medium')}
						alt="{sponsor.company_name} logo"
						class="mx-auto h-32 w-32 rounded-lg border border-gray-200 object-contain"
					/>
				</div>

				<!-- Subscription Info -->
				<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Subscription</h3>
					<dl class="space-y-3 text-sm">
						<div class="flex justify-between">
							<dt class="text-gray-500">Status</dt>
							<dd><Badge color={getStatusColor(sponsor.status)} text={sponsor.status} /></dd>
						</div>
						{#if sponsor.tier_name}
							<div class="flex justify-between">
								<dt class="text-gray-500">Tier</dt>
								<dd class="font-medium">{sponsor.tier_name}</dd>
							</div>
						{/if}
						{#if sponsor.billing_type}
							<div class="flex justify-between">
								<dt class="text-gray-500">Billing</dt>
								<dd class="capitalize">{sponsor.billing_type}</dd>
							</div>
						{/if}
						{#if sponsor.current_period_end}
							<div class="flex justify-between">
								<dt class="text-gray-500">Current Period Ends</dt>
								<dd>{formatRelativeDate(sponsor.current_period_end)}</dd>
							</div>
						{/if}
						{#if sponsor.expires_at}
							<div class="flex justify-between">
								<dt class="text-gray-500">Expires</dt>
								<dd>{formatRelativeDate(sponsor.expires_at)}</dd>
							</div>
						{/if}
					</dl>
				</div>

				<!-- Contact Info -->
				<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Contact</h3>
					<dl class="space-y-3 text-sm">
						{#if sponsor.contact_email}
							<div class="flex justify-between">
								<dt class="text-gray-500">Email</dt>
								<dd>
									<a href="mailto:{sponsor.contact_email}" class="text-svelte-500 hover:underline">
										{sponsor.contact_email}
									</a>
								</dd>
							</div>
						{/if}
						<div class="flex justify-between">
							<dt class="text-gray-500">Website</dt>
							<dd>
								<a href={sponsor.website_url} target="_blank" rel="noopener" class="text-svelte-500 hover:underline">
									Visit Site
								</a>
							</dd>
						</div>
					</dl>
				</div>

				<!-- Quick Actions -->
				<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
					<div class="flex flex-col gap-2">
						{#if sponsor.status === 'pending'}
							<form {...activateSponsor}>
								<input {...activateSponsor.fields.id.as('hidden', sponsorId)} />
								<Button type="submit" variant="primary" class="w-full">
									Activate Sponsor
								</Button>
							</form>
						{:else if sponsor.status === 'active'}
							<form {...pauseSponsor}>
								<input {...pauseSponsor.fields.id.as('hidden', sponsorId)} />
								<Button type="submit" variant="secondary" class="w-full">
									Pause Sponsor
								</Button>
							</form>
						{:else if sponsor.status === 'paused'}
							<form {...activateSponsor}>
								<input {...activateSponsor.fields.id.as('hidden', sponsorId)} />
								<Button type="submit" variant="primary" class="w-full">
									Reactivate Sponsor
								</Button>
							</form>
						{/if}
						{#if sponsor.status !== 'cancelled' && sponsor.status !== 'expired'}
							<form {...cancelSponsor}>
								<input {...cancelSponsor.fields.id.as('hidden', sponsorId)} />
								<Button type="submit" variant="danger" class="w-full">
									Cancel Sponsor
								</Button>
							</form>
						{/if}
					</div>
				</div>

				<!-- Timestamps -->
				<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Timeline</h3>
					<dl class="space-y-3 text-sm">
						<div class="flex justify-between">
							<dt class="text-gray-500">Created</dt>
							<dd>{formatRelativeDate(sponsor.created_at)}</dd>
						</div>
						{#if sponsor.activated_at}
							<div class="flex justify-between">
								<dt class="text-gray-500">Activated</dt>
								<dd>{formatRelativeDate(sponsor.activated_at)}</dd>
							</div>
						{/if}
						<div class="flex justify-between">
							<dt class="text-gray-500">Updated</dt>
							<dd>{formatRelativeDate(sponsor.updated_at)}</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	{:else}
		<div class="py-10 text-center">
			<p class="text-gray-500">Sponsor not found.</p>
			<a href="/admin/sponsors" class="text-svelte-500 mt-2 inline-block hover:underline">
				Back to sponsors
			</a>
		</div>
	{/if}
</div>
