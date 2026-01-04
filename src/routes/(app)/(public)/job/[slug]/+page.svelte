<script lang="ts">
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft'
	import MapPin from 'phosphor-svelte/lib/MapPin'
	import Clock from 'phosphor-svelte/lib/Clock'
	import CurrencyDollar from 'phosphor-svelte/lib/CurrencyDollar'
	import Buildings from 'phosphor-svelte/lib/Buildings'
	import Globe from 'phosphor-svelte/lib/Globe'
	import Envelope from 'phosphor-svelte/lib/Envelope'
	import Users from 'phosphor-svelte/lib/Users'
	import Star from 'phosphor-svelte/lib/Star'
	import Warning from 'phosphor-svelte/lib/Warning'
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle'
	import Schema from '$lib/ui/Schema.svelte'
	import Button from '$lib/ui/Button.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import { applyToJob } from './job.remote'

	let { data } = $props()

	const { jobId, message } = applyToJob.fields

	const formatSalary = (min?: number | null, max?: number | null, currency = 'USD') => {
		if (!min && !max) return null
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency,
			maximumFractionDigits: 0
		})
		if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`
		if (min) return `From ${formatter.format(min)}`
		if (max) return `Up to ${formatter.format(max)}`
		return null
	}

	const formatPositionType = (type: string) => {
		return type
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('-')
	}

	const formatSeniorityLevel = (level: string) => {
		return level.charAt(0).toUpperCase() + level.slice(1)
	}

	const formatRemoteStatus = (status: string) => {
		return status
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('-')
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	const salary = $derived(
		formatSalary(
			data.job.metadata.salary_min,
			data.job.metadata.salary_max,
			data.job.metadata.salary_currency
		)
	)

	const isPremium = $derived(data.job.metadata.tier_name === 'premium')
	const isFeatured = $derived(
		data.job.metadata.tier_name === 'featured' || data.job.metadata.tier_name === 'premium'
	)
</script>

<svelte:head>
	<title>{data.job.title} at {data.job.metadata.company_name} | Svelte Jobs</title>
	<meta name="description" content={data.job.description} />
</svelte:head>

{#if data.schemas}
	<Schema schema={data.schemas} />
{/if}

<div class="mx-auto max-w-4xl">
	<!-- Back Link -->
	<a
		href="/?type=job"
		class="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-orange-600"
		data-testid="back-to-jobs"
	>
		<ArrowLeft size={16} />
		Back to all jobs
	</a>

	<!-- Expired Warning -->
	{#if data.isExpired}
		<div
			class="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800"
			data-testid="expired-warning"
		>
			<Warning size={24} />
			<div>
				<p class="font-medium">This job posting has expired</p>
				<p class="text-sm">
					This position is no longer accepting applications.
				</p>
			</div>
		</div>
	{/if}

	<!-- Job Header -->
	<div
		class="rounded-lg border bg-white p-6 {isFeatured ? 'border-orange-200' : 'border-slate-200'}"
	>
		<div class="flex flex-col gap-6 sm:flex-row">
			<!-- Company Logo -->
			{#if data.job.metadata.company_logo}
				<div class="shrink-0">
					<img
						src={data.job.metadata.company_logo}
						alt="{data.job.metadata.company_name} logo"
						class="h-20 w-20 rounded-lg object-contain"
					/>
				</div>
			{:else}
				<div
					class="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100"
				>
					<Buildings size={40} class="text-slate-400" />
				</div>
			{/if}

			<!-- Job Info -->
			<div class="flex-1">
				<div class="flex items-start justify-between gap-4">
					<div>
						<h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">
							{data.job.title}
						</h1>
						<p class="mt-1 text-lg text-slate-600">
							{data.job.metadata.company_name}
						</p>
					</div>

					{#if isPremium}
						<span
							class="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-sm font-medium text-white"
						>
							<Star size={14} weight="fill" /> Premium
						</span>
					{:else if isFeatured}
						<span
							class="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-700"
						>
							Featured
						</span>
					{/if}
				</div>

				<!-- Quick Info -->
				<div class="mt-4 flex flex-wrap gap-3">
					<span
						class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm"
					>
						{formatPositionType(data.job.metadata.position_type)}
					</span>

					<span
						class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm"
					>
						{formatSeniorityLevel(data.job.metadata.seniority_level)}
					</span>

					<span
						class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm {data.job
							.metadata.remote_status === 'remote'
							? 'bg-green-100 text-green-700'
							: 'bg-slate-100'}"
					>
						<MapPin size={14} />
						{formatRemoteStatus(data.job.metadata.remote_status)}
						{#if data.job.metadata.location && data.job.metadata.remote_status !== 'remote'}
							- {data.job.metadata.location}
						{/if}
					</span>

					{#if salary}
						<span
							class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm"
						>
							<CurrencyDollar size={14} />
							{salary}
						</span>
					{/if}
				</div>

				<!-- Meta Info -->
				<div class="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
					<span class="inline-flex items-center gap-1">
						<Clock size={14} />
						Posted {formatDate(data.job.published_at || data.job.created_at)}
					</span>

					{#if data.job.metadata.expires_at}
						<span class="inline-flex items-center gap-1">
							<Clock size={14} />
							Expires {formatDate(data.job.metadata.expires_at)}
						</span>
					{/if}

					<span class="inline-flex items-center gap-1">
						<Users size={14} />
						{data.applicationCount}
						{data.applicationCount === 1 ? 'applicant' : 'applicants'}
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 grid gap-6 lg:grid-cols-3">
		<!-- Job Description -->
		<div class="lg:col-span-2">
			<div class="rounded-lg border border-slate-200 bg-white p-6">
				<h2 class="mb-4 text-xl font-semibold">About this position</h2>
				<div class="prose prose-slate max-w-none">
					{#if data.job.rendered_body}
						{@html data.job.rendered_body}
					{:else}
						<p class="whitespace-pre-wrap">{data.job.body || data.job.description}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Apply Section -->
			<div class="rounded-lg border border-slate-200 bg-white p-6">
				<h2 class="mb-4 text-lg font-semibold">Apply for this position</h2>

				{#if data.isExpired}
					<div class="text-center text-slate-500">
						<p>This job is no longer accepting applications.</p>
					</div>
				{:else if data.hasApplied}
					<div
						class="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700"
						data-testid="already-applied"
					>
						<CheckCircle size={20} />
						<span>You have already applied for this position.</span>
					</div>
				{:else if data.user}
					<form {...applyToJob} class="space-y-4">
						<input {...jobId.as('hidden', data.job.id)} />

						<TextArea
							{...message.as('text')}
							placeholder="Introduce yourself and explain why you're a great fit for this role..."
							label="Message (optional)"
							rows={4}
							data-testid="application-message"
						/>

						<Button class="w-full" data-testid="apply-button">
							Submit Application
						</Button>

						<p class="text-center text-xs text-slate-500">
							The employer will receive your profile and contact information.
						</p>
					</form>
				{:else}
					<div class="text-center">
						<p class="mb-4 text-slate-600">
							Sign in to apply for this position.
						</p>
						<a
							href="/login?redirect=/job/{data.job.slug}"
							class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-orange-600"
							data-testid="login-to-apply"
						>
							Sign in to Apply
						</a>
					</div>
				{/if}
			</div>

			<!-- Company Info -->
			<div class="rounded-lg border border-slate-200 bg-white p-6">
				<h2 class="mb-4 text-lg font-semibold">About the company</h2>

				<div class="space-y-3">
					<div class="flex items-center gap-3">
						{#if data.job.metadata.company_logo}
							<img
								src={data.job.metadata.company_logo}
								alt="{data.job.metadata.company_name} logo"
								class="h-10 w-10 rounded object-contain"
							/>
						{:else}
							<div
								class="flex h-10 w-10 items-center justify-center rounded bg-slate-100"
							>
								<Buildings size={20} class="text-slate-400" />
							</div>
						{/if}
						<span class="font-medium">{data.job.metadata.company_name}</span>
					</div>

					{#if data.job.metadata.company_website}
						<a
							href={data.job.metadata.company_website}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700"
						>
							<Globe size={14} />
							Visit website
						</a>
					{/if}

					{#if data.job.metadata.remote_restrictions}
						<div class="mt-4 border-t pt-4">
							<p class="text-sm font-medium text-slate-700">Location Requirements</p>
							<p class="mt-1 text-sm text-slate-600">
								{data.job.metadata.remote_restrictions}
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
