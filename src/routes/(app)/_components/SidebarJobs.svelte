<script lang="ts">
	import Briefcase from 'phosphor-svelte/lib/Briefcase'
	import MapPin from 'phosphor-svelte/lib/MapPin'
	import Plus from 'phosphor-svelte/lib/Plus'
	import Star from 'phosphor-svelte/lib/Star'
	import { type SidebarJob } from './types'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import { formatSalaryCompact } from '$lib/utils/job-formatters'
	import SidebarCard from '$lib/ui/SidebarCard.svelte'
	import Button from '$lib/ui/Button.svelte'

	let { jobs = [] }: { jobs?: SidebarJob[] } = $props()

	const remoteLabels: Record<string, string> = {
		remote: 'Remote',
		hybrid: 'Hybrid',
		'on-site': 'On-Site'
	}

	// Max slots to show (3 total: jobs + placeholders)
	const MAX_SLOTS = 3
	const placeholderCount = $derived(Math.max(0, MAX_SLOTS - jobs.length))

	const isPremium = (tierName?: string) => tierName?.toLowerCase() === 'premium'
</script>

<SidebarCard title="Jobs">
	{#snippet action()}
		<Button href="/jobs/submit" variant="secondary" size="thin" data-sveltekit-preload-data="off">
			<Plus size={12} />
			Post
		</Button>
	{/snippet}

	<div class="space-y-3">
		{#each jobs as job (job.id)}
			{@const salary = formatSalaryCompact(job.salary_min, job.salary_max, job.salary_currency)}
			<div class="grid grid-cols-[auto_1fr] gap-3">
				<!-- Logo column -->
				{#if job.company_logo}
					<img
						src={getCachedImageWithPreset(job.company_logo, 'thumbnail')}
						alt="{job.company_name} logo"
						class="h-10 w-10 rounded border border-slate-200 bg-white object-contain"
					/>
				{:else}
					<div
						class="flex h-10 w-10 items-center justify-center rounded border border-slate-200 bg-white"
					>
						<Briefcase size={20} class="text-slate-400" />
					</div>
				{/if}
				<!-- Content column -->
				<div class="min-w-0">
					<h4 class="truncate text-sm font-semibold">
						<a
							href="/job/{job.slug}"
							class="hover:text-svelte-500"
							data-sveltekit-preload-data="off"
						>
							{job.title}
						</a>
						{#if isPremium(job.tier_name)}
							<Star size={12} weight="fill" class="ml-1 inline-block text-amber-500" />
						{/if}
					</h4>
					<p class="truncate text-xs text-gray-600">{job.company_name}</p>
					<div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
						<span class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium uppercase">
							{remoteLabels[job.remote_status] || job.remote_status}
						</span>
						{#if job.location}
							<span class="flex min-w-0 items-center gap-0.5">
								<MapPin size={10} />
								<span class="truncate">{job.location}</span>
							</span>
						{/if}
						{#if salary}
							<span class="text-green-600">{salary}</span>
						{/if}
					</div>
				</div>
			</div>
		{/each}

		{#each Array(placeholderCount) as _, i (i)}
			<a
				href="/jobs/submit"
				class="group grid grid-cols-[auto_1fr] gap-3 rounded border border-dashed border-slate-300 bg-white p-2 transition-colors hover:border-svelte-400 hover:bg-svelte-50"
				data-sveltekit-preload-data="off"
			>
				<!-- Placeholder logo -->
				<div
					class="flex h-10 w-10 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 transition-colors group-hover:border-svelte-400 group-hover:bg-svelte-100"
				>
					<Plus size={16} class="text-slate-400 transition-colors group-hover:text-svelte-500" />
				</div>
				<!-- Placeholder content -->
				<div class="flex flex-col justify-center">
					<span
						class="text-xs font-medium text-slate-400 transition-colors group-hover:text-svelte-600"
					>
						Post your job here
					</span>
					<span class="text-[10px] text-slate-400">Reach Svelte developers</span>
				</div>
			</a>
		{/each}
	</div>

	{#snippet footer()}
		{#if jobs && jobs.length > 0}
			<a
				href="/job"
				class="text-svelte-500 text-xs hover:underline"
				data-sveltekit-preload-data="off"
			>
				View all →
			</a>
		{/if}
	{/snippet}
</SidebarCard>
