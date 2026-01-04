<script lang="ts">
	import Check from 'phosphor-svelte/lib/Check'
	import Star from 'phosphor-svelte/lib/Star'
	import Briefcase from 'phosphor-svelte/lib/Briefcase'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import Select from '$lib/ui/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte'
	import ImageUpload from '$lib/ui/ImageUpload.svelte'
	import { submitJob, getJobTiers } from './submit.remote'

	const {
		company_name,
		company_logo,
		company_website,
		employer_email,
		title,
		description,
		body,
		position_type,
		seniority_level,
		remote_status,
		remote_restrictions,
		location,
		salary_min,
		salary_max,
		salary_currency,
		tier_id
	} = submitJob.fields

	let tiers = await getJobTiers()
	let selectedTierId = $state(tiers[0]?.id || '')

	const positionTypes = [
		{ value: 'full-time', label: 'Full-Time' },
		{ value: 'part-time', label: 'Part-Time' },
		{ value: 'contract', label: 'Contract' },
		{ value: 'internship', label: 'Internship' }
	]

	const seniorityLevels = [
		{ value: 'entry', label: 'Entry Level' },
		{ value: 'junior', label: 'Junior' },
		{ value: 'mid', label: 'Mid-Level' },
		{ value: 'senior', label: 'Senior' },
		{ value: 'principal', label: 'Principal / Staff' }
	]

	const remoteOptions = [
		{ value: 'remote', label: 'Remote' },
		{ value: 'hybrid', label: 'Hybrid' },
		{ value: 'on-site', label: 'On-Site' }
	]

	const formatPrice = (cents: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(cents / 100)
	}
</script>

<svelte:head>
	<title>Post a Job | Svelte Jobs</title>
	<meta
		name="description"
		content="Reach thousands of Svelte developers. Post your job listing and find the perfect candidate."
	/>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<div class="mb-8 text-center">
		<h1 class="text-3xl font-bold">Post a Svelte Job</h1>
		<p class="mt-2 text-slate-600">
			Reach thousands of Svelte developers looking for their next opportunity
		</p>
	</div>

	<!-- Pricing Tiers -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold">Select a Plan</h2>
		<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4" data-testid="pricing-tiers">
			{#each tiers as tier}
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
						<p class="text-sm text-slate-500">{tier.duration_days} days</p>
					</div>

					<ul class="space-y-2">
						{#each features as feature}
							<li class="flex items-start gap-2 text-sm">
								<Check
									size={16}
									weight="bold"
									class="mt-0.5 shrink-0 text-green-600"
								/>
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

	<!-- Job Submission Form -->
	<form {...submitJob} enctype="multipart/form-data" class="space-y-8">
		<input {...tier_id.as('hidden', selectedTierId)} />

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
					{...employer_email.as('email')}
					label="Contact Email"
					placeholder="jobs@acme.com"
					description="We'll send applications and updates to this email"
					issues={employer_email.issues()}
					data-testid="employer-email-input"
				/>

				<Input
					{...company_website.as('url')}
					label="Company Website (optional)"
					placeholder="https://acme.com"
					issues={company_website.issues()}
					data-testid="company-website-input"
				/>

				<ImageUpload
					{...company_logo.as('file')}
					label="Company Logo (optional)"
					description="PNG, JPG, or WebP. Max 2MB."
					issues={company_logo.issues()}
					data-testid="company-logo-input"
				/>
			</div>
		</div>

		<!-- Job Details -->
		<div class="rounded-lg border border-slate-200 bg-white p-6">
			<h2 class="mb-4 text-xl font-semibold">Job Details</h2>
			<div class="space-y-4">
				<Input
					{...title.as('text')}
					label="Job Title"
					placeholder="Senior Svelte Developer"
					issues={title.issues()}
					data-testid="job-title-input"
				/>

				<TextArea
					{...description.as('text')}
					label="Short Description"
					placeholder="Brief overview of the role (shown in job listings)"
					rows={3}
					issues={description.issues()}
					data-testid="job-description-input"
				/>

				<MarkdownEditor
					{...body.as('text')}
					label="Full Job Description"
					placeholder="Detailed job requirements, responsibilities, benefits, etc."
					description="Use markdown to format your job description"
					rows={12}
					issues={body.issues()}
					data-testid="job-body-input"
				/>

				<div class="grid gap-4 sm:grid-cols-2">
					<Select
						{...position_type.as('select')}
						label="Position Type"
						options={positionTypes}
						issues={position_type.issues()}
						data-testid="position-type-select"
					/>

					<Select
						{...seniority_level.as('select')}
						label="Seniority Level"
						options={seniorityLevels}
						issues={seniority_level.issues()}
						data-testid="seniority-level-select"
					/>
				</div>
			</div>
		</div>

		<!-- Location -->
		<div class="rounded-lg border border-slate-200 bg-white p-6">
			<h2 class="mb-4 text-xl font-semibold">Location</h2>
			<div class="space-y-4">
				<Select
					{...remote_status.as('select')}
					label="Remote Status"
					options={remoteOptions}
					issues={remote_status.issues()}
					data-testid="remote-status-select"
				/>

				<Input
					{...location.as('text')}
					label="Office Location (optional)"
					placeholder="San Francisco, CA"
					description="For hybrid or on-site positions"
					issues={location.issues()}
					data-testid="location-input"
				/>

				<Input
					{...remote_restrictions.as('text')}
					label="Location Requirements (optional)"
					placeholder="e.g., US-only, EU timezone, etc."
					issues={remote_restrictions.issues()}
					data-testid="remote-restrictions-input"
				/>
			</div>
		</div>

		<!-- Salary -->
		<div class="rounded-lg border border-slate-200 bg-white p-6">
			<h2 class="mb-4 text-xl font-semibold">Compensation (optional)</h2>
			<p class="mb-4 text-sm text-slate-600">
				Jobs with salary information get 40% more applications
			</p>
			<div class="grid gap-4 sm:grid-cols-3">
				<Input
					{...salary_min.as('text')}
					type="number"
					label="Minimum Salary"
					placeholder="80000"
					issues={salary_min.issues()}
					data-testid="salary-min-input"
				/>

				<Input
					{...salary_max.as('text')}
					type="number"
					label="Maximum Salary"
					placeholder="120000"
					issues={salary_max.issues()}
					data-testid="salary-max-input"
				/>

				<Select
					{...salary_currency.as('select')}
					label="Currency"
					options={[
						{ value: 'USD', label: 'USD ($)' },
						{ value: 'EUR', label: 'EUR (€)' },
						{ value: 'GBP', label: 'GBP (£)' }
					]}
					data-testid="salary-currency-select"
				/>
			</div>
		</div>

		<!-- Submit -->
		<div class="flex items-center justify-between rounded-lg bg-slate-50 p-6">
			<div>
				<p class="font-semibold">
					Total: {formatPrice(tiers.find((t) => t.id === selectedTierId)?.price_cents || 0)}
				</p>
				<p class="text-sm text-slate-600">
					Your job will be live for{' '}
					{tiers.find((t) => t.id === selectedTierId)?.duration_days || 30} days
				</p>
			</div>
			<Button data-testid="submit-job-button">
				<Briefcase size={18} class="mr-2" />
				Continue to Payment
			</Button>
		</div>
	</form>
</div>
