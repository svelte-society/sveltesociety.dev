<script lang="ts">
	import MapPin from 'phosphor-svelte/lib/MapPin'
	import Clock from 'phosphor-svelte/lib/Clock'
	import CurrencyDollar from 'phosphor-svelte/lib/CurrencyDollar'
	import Buildings from 'phosphor-svelte/lib/Buildings'
	import Star from 'phosphor-svelte/lib/Star'
	import type { ContentWithAuthor, JobMetadata } from '$lib/types/content'

	interface Props {
		job: ContentWithAuthor
		variant?: 'list' | 'featured'
	}

	let { job, variant = 'list' }: Props = $props()

	// Reactive metadata derived from job
	const metadata = $derived(job.metadata as JobMetadata)

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
		return type.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('-')
	}

	const formatSeniorityLevel = (level: string) => {
		return level.charAt(0).toUpperCase() + level.slice(1)
	}

	const formatRemoteStatus = (status: string) => {
		return status.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('-')
	}

	const getTimeAgo = (dateString: string) => {
		const date = new Date(dateString)
		const now = new Date()
		const diff = now.getTime() - date.getTime()
		const days = Math.floor(diff / (1000 * 60 * 60 * 24))

		if (days === 0) return 'Today'
		if (days === 1) return 'Yesterday'
		if (days < 7) return `${days} days ago`
		if (days < 30) return `${Math.floor(days / 7)} weeks ago`
		return `${Math.floor(days / 30)} months ago`
	}

	const salary = $derived(formatSalary(metadata.salary_min, metadata.salary_max, metadata.salary_currency))
	const isPremium = $derived(metadata.tier_name === 'premium')
	const isFeatured = $derived(metadata.tier_name === 'featured' || metadata.tier_name === 'premium')
</script>

<a
	href="/jobs/{job.slug}"
	class="group block rounded-lg border bg-white p-5 transition-all hover:border-orange-300 hover:shadow-md {isFeatured
		? 'border-orange-200 bg-orange-50/30'
		: 'border-slate-200'}"
	data-testid="job-card-{job.id}"
>
	<div class="flex gap-4">
		<!-- Company Logo -->
		{#if metadata.company_logo}
			<div class="hidden shrink-0 sm:block">
				<img
					src={metadata.company_logo}
					alt="{metadata.company_name} logo"
					class="h-14 w-14 rounded-lg object-contain"
				/>
			</div>
		{:else}
			<div
				class="hidden h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 sm:flex"
			>
				<Buildings size={28} class="text-slate-400" />
			</div>
		{/if}

		<!-- Job Info -->
		<div class="min-w-0 flex-1">
			<div class="flex items-start justify-between gap-2">
				<div class="min-w-0">
					<h3
						class="truncate text-lg font-semibold text-slate-900 group-hover:text-orange-600"
					>
						{job.title}
					</h3>
					<p class="text-sm text-slate-600">
						posted by <span class="font-medium text-slate-700">{metadata.company_name}</span>
					</p>
				</div>

				{#if isPremium}
					<span
						class="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-1 text-xs font-medium text-white"
					>
						<Star size={12} weight="fill" /> Premium
					</span>
				{:else if isFeatured}
					<span
						class="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700"
					>
						Featured
					</span>
				{/if}
			</div>

			<p class="mt-2 line-clamp-2 text-sm text-slate-600">{job.description}</p>

			<!-- Tags -->
			<div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
				<span
					class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1"
				>
					{formatPositionType(metadata.position_type)}
				</span>

				<span
					class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1"
				>
					{formatSeniorityLevel(metadata.seniority_level)}
				</span>

				<span
					class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 {metadata
						.remote_status === 'remote'
						? 'bg-green-100 text-green-700'
						: 'bg-slate-100'}"
				>
					<MapPin size={12} />
					{formatRemoteStatus(metadata.remote_status)}
					{#if metadata.location && metadata.remote_status !== 'remote'}
						- {metadata.location}
					{/if}
				</span>

				{#if salary}
					<span
						class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1"
					>
						<CurrencyDollar size={12} />
						{salary}
					</span>
				{/if}

				<span class="ml-auto inline-flex items-center gap-1 text-slate-400">
					<Clock size={12} />
					{getTimeAgo(job.published_at || job.created_at)}
				</span>
			</div>
		</div>
	</div>
</a>
