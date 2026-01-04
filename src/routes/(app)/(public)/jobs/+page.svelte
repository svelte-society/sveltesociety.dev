<script lang="ts">
	import Briefcase from 'phosphor-svelte/lib/Briefcase'
	import Plus from 'phosphor-svelte/lib/Plus'
	import JobCard from '$lib/ui/jobs/JobCard.svelte'
	import LinkSelect from '$lib/ui/filter/LinkSelect.svelte'
	import { getJobListings } from './jobs.remote'
	import { page } from '$app/state'
	import Pagination from '$lib/ui/Pagination.svelte'

	let { jobs, count, filters, meta } = $derived(await getJobListings({ url: page.url }))

	const remoteOptions = [
		{ value: 'all', label: 'All Locations' },
		{ value: 'remote', label: 'Remote' },
		{ value: 'hybrid', label: 'Hybrid' },
		{ value: 'on-site', label: 'On-Site' }
	]

	const typeOptions = [
		{ value: 'all', label: 'All Types' },
		{ value: 'full-time', label: 'Full-Time' },
		{ value: 'part-time', label: 'Part-Time' },
		{ value: 'contract', label: 'Contract' },
		{ value: 'internship', label: 'Internship' }
	]

	const levelOptions = [
		{ value: 'all', label: 'All Levels' },
		{ value: 'entry', label: 'Entry Level' },
		{ value: 'junior', label: 'Junior' },
		{ value: 'mid', label: 'Mid-Level' },
		{ value: 'senior', label: 'Senior' },
		{ value: 'principal', label: 'Principal/Staff' }
	]
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
</svelte:head>

<div class="grid gap-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold">Svelte Jobs</h1>
			<p class="mt-1 text-slate-600">
				Find your next position in the Svelte ecosystem
			</p>
		</div>
		<a
			href="/jobs/submit"
			class="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-orange-600"
			data-testid="post-job-button"
		>
			<Plus size={20} weight="bold" />
			Post a Job
		</a>
	</div>

	<!-- Filters -->
	<div class="flex flex-wrap items-center gap-3">
		<LinkSelect options={remoteOptions} paramName="remote" defaultValue="all" />
		<LinkSelect options={typeOptions} paramName="type" defaultValue="all" />
		<div class="hidden sm:block">
			<LinkSelect options={levelOptions} paramName="level" defaultValue="all" />
		</div>
	</div>

	<!-- Job Listings -->
	<div class="grid gap-4" data-testid="job-listings">
		{#if count > 0}
			{#each jobs as job (job.id)}
				<JobCard {job} />
			{/each}
		{:else}
			<div
				class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 py-16 text-center"
				data-testid="no-jobs-message"
			>
				<Briefcase size={48} class="mb-4 text-slate-400" />
				<h2 class="text-xl font-semibold text-slate-700">No jobs found</h2>
				<p class="mt-2 text-slate-500">
					{#if filters.remote !== 'all' || filters.type !== 'all' || filters.level !== 'all'}
						Try adjusting your filters to see more results.
					{:else}
						Be the first to post a job opportunity!
					{/if}
				</p>
				<a
					href="/jobs/submit"
					class="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-600"
				>
					<Plus size={18} />
					Post a Job
				</a>
			</div>
		{/if}
	</div>

	<!-- Pagination -->
	{#if count > 20}
		<Pagination {count} perPage={20} />
	{/if}

	<!-- CTA Section -->
	<div class="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-2xl font-bold">Hiring Svelte Developers?</h2>
			<p class="mt-2 text-orange-100">
				Reach thousands of Svelte developers looking for their next opportunity.
			</p>
			<a
				href="/jobs/submit"
				class="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-orange-600 transition-colors hover:bg-orange-50"
			>
				Post a Job Starting at $199
			</a>
		</div>
	</div>
</div>
