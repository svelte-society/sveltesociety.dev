<script lang="ts">
	import { page } from '$app/state'
	import { formatRelativeDate } from '$lib/utils/date'
	import {
		formatSalary,
		formatPositionType,
		formatSeniorityLevel,
		formatRemoteStatus
	} from '$lib/utils/job-formatters'
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft'
	import MapPin from 'phosphor-svelte/lib/MapPin'
	import Buildings from 'phosphor-svelte/lib/Buildings'
	import GlobeHemisphereWest from 'phosphor-svelte/lib/GlobeHemisphereWest'
	import Warning from 'phosphor-svelte/lib/Warning'
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle'
	import Schema from '$lib/ui/Schema.svelte'
	import Button from '$lib/ui/Button.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import { applyToJob } from './job.remote'

	let { data } = $props()

	const { jobId, message } = applyToJob.fields
	const isAdmin = page.data.isAdmin

	const salary = $derived(
		formatSalary(
			data.job.metadata.salary_min,
			data.job.metadata.salary_max,
			data.job.metadata.salary_currency
		)
	)
</script>

<svelte:head>
	<title>{data.job.title} at {data.job.metadata.company_name} | Svelte Jobs</title>
	<meta name="description" content={data.job.description} />
</svelte:head>

{#if data.schemas}
	<Schema schema={data.schemas} />
{/if}

<!-- Navigation -->
<nav class="mb-4">
	<a
		href="/?type=job"
		class="group inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-orange-500"
		data-testid="back-to-jobs"
	>
		<ArrowLeft size={16} class="transition-transform group-hover:-translate-x-1" />
		Back to all jobs
	</a>
</nav>

<!-- Expired Warning -->
{#if data.isExpired}
	<div
		class="mb-4 flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm"
		data-testid="expired-warning"
	>
		<Warning size={18} class="shrink-0 text-amber-600" />
		<span class="text-amber-800">This position has been filled. Applications are no longer being accepted.</span>
	</div>
{/if}

<!-- Main Card (ContentCard style) -->
<article
	class="grid min-w-0 gap-2 rounded-lg px-4 py-4 sm:px-6 sm:py-5 bg-zinc-50"
	data-testid="job-detail-card"
>
	<!-- Top Row: Type + Company | Date -->
	<div class="grid grid-cols-[1fr_auto] items-start justify-between gap-2 text-xs sm:gap-0">
		<div class="flex min-w-0 flex-wrap items-center">
			<span class="shrink-0 font-semibold capitalize">Job&nbsp;</span>
			<span class="flex min-w-0 max-w-full text-gray-500">
				<span class="shrink-0">posted by&nbsp;</span>
				<span class="truncate font-medium text-gray-700">{data.job.metadata.company_name}</span>
				{#if data.job.metadata.company_website}
					<a
						href={data.job.metadata.company_website}
						target="_blank"
						rel="noopener noreferrer"
						class="ml-1.5 text-gray-400 hover:text-orange-500"
					>
						<GlobeHemisphereWest size={14} />
					</a>
				{/if}
			</span>
		</div>
		<div class="text-gray-500">
			{formatRelativeDate(data.job.published_at)}
		</div>
	</div>

	<!-- Logo + Title + Description -->
	<div class="mt-4 flex gap-4">
		<!-- Company Logo -->
		{#if data.job.metadata.company_logo}
			<div class="shrink-0">
				<img
					src={data.job.metadata.company_logo}
					alt="{data.job.metadata.company_name} logo"
					class="h-16 w-16 rounded-lg object-contain sm:h-20 sm:w-20"
				/>
			</div>
		{:else}
			<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 sm:h-20 sm:w-20">
				<Buildings size={32} class="text-slate-400" />
			</div>
		{/if}

		<!-- Title + Pills -->
		<div class="flex min-w-0 flex-1 flex-col justify-between">
			<h1 class="text-lg font-bold sm:text-xl">
				{data.job.title}
				{#if isAdmin}
					<a
						data-testid="edit-link"
						class="text-svelte-900 ml-4 text-sm"
						href="/admin/content/{data.job.id}">Edit</a
					>
				{/if}
			</h1>

			<!-- Pills -->
			<div class="flex flex-wrap items-center gap-2">
				<span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
					{formatPositionType(data.job.metadata.position_type)}
				</span>

				<span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
					{formatSeniorityLevel(data.job.metadata.seniority_level)}
				</span>

				<span class={[
					'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs',
					data.job.metadata.remote_status === 'remote' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
				]}>
					<MapPin size={12} />
					{formatRemoteStatus(data.job.metadata.remote_status)}
					{#if data.job.metadata.location && data.job.metadata.remote_status !== 'remote'}
						- {data.job.metadata.location}
					{/if}
				</span>

				{#if salary}
					<span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
						{salary}
					</span>
				{/if}

				{#if data.job.metadata.remote_restrictions}
					<span class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-600">
						{data.job.metadata.remote_restrictions}
					</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Job Description -->
	<div class="mt-6 min-w-0">
		<div class="prose prose-sm min-w-0 max-w-none text-gray-700">
			{#if data.job.rendered_body}
				{@html data.job.rendered_body}
			{:else}
				<p class="whitespace-pre-wrap">{data.job.body || data.job.description}</p>
			{/if}
		</div>
	</div>

	<!-- Divider -->
	<hr class="my-6 border-slate-200" />

	<!-- Apply Section -->
	<div>
		<h2 class="mb-3 text-sm font-semibold text-slate-700">Apply for this position</h2>

		{#if data.isExpired}
			<p class="text-sm text-slate-500">This job is no longer accepting applications.</p>
		{:else if data.hasApplied}
			<div class="flex items-center gap-2" data-testid="already-applied">
				<CheckCircle size={18} weight="fill" class="text-green-600" />
				<span class="text-sm font-medium text-green-700">You've already applied for this position</span>
			</div>
		{:else if data.user}
			<form {...applyToJob} class="space-y-3">
				<input {...jobId.as('hidden', data.job.id)} />
				<TextArea
					{...message.as('text')}
					label="Message (optional)"
					placeholder="Tell them why you're interested in this role..."
					rows={3}
					data-testid="application-message"
				/>
				<Button data-testid="apply-button">Submit Application</Button>
			</form>
		{:else}
			<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<p class="text-sm text-slate-600">Sign in to apply for this position</p>
				<a
					href="/login?redirect=/job/{data.job.slug}"
					class="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
					data-testid="login-to-apply"
				>
					Sign in to Apply
				</a>
			</div>
		{/if}
	</div>
</article>
