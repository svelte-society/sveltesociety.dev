<script lang="ts">
	import Briefcase from 'phosphor-svelte/lib/Briefcase'
	import MapPin from 'phosphor-svelte/lib/MapPin'
	import Star from 'phosphor-svelte/lib/Star'
	import { type SidebarJob } from './types'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'

	let { jobs = [], onLinkClick }: { jobs?: SidebarJob[]; onLinkClick?: () => void } = $props()

	const remoteLabels: Record<string, string> = {
		remote: 'Remote',
		hybrid: 'Hybrid',
		'on-site': 'On-Site'
	}

	const isPremium = (tierName?: string) => tierName === 'premium' || tierName === 'featured'
</script>

{#if jobs && jobs.length > 0}
	<div class="grid gap-3 rounded border border-slate-200 bg-gray-50 p-4">
		<div class="flex items-center justify-between">
			<h3 class="text-md font-bold">Jobs</h3>
			<a href="/?type=job" class="text-svelte-500 text-xs hover:underline" onclick={onLinkClick}
				>View all</a
			>
		</div>
		<div class="space-y-3">
			{#each jobs as job}
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
								onclick={onLinkClick}
							>
								{job.title}
							</a>
							{#if isPremium(job.tier_name)}
								<Star
									size={12}
									weight="fill"
									class="ml-1 inline-block text-amber-500"
								/>
							{/if}
						</h4>
						<p class="truncate text-xs text-gray-600">{job.company_name}</p>
						<div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
							<span
								class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium uppercase"
							>
								{remoteLabels[job.remote_status] || job.remote_status}
							</span>
							{#if job.location}
								<span class="flex items-center gap-0.5">
									<MapPin size={10} />
									<span class="truncate">{job.location}</span>
								</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
		<a
			href="/jobs/submit"
			class="mt-1 block rounded bg-orange-500 px-3 py-1.5 text-center text-xs font-medium text-white transition-colors hover:bg-orange-600"
			onclick={onLinkClick}
		>
			Post a Job
		</a>
	</div>
{/if}
