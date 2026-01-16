<script lang="ts">
	import Plus from 'phosphor-svelte/lib/Plus'
	import Star from 'phosphor-svelte/lib/Star'
	import Tag from 'phosphor-svelte/lib/Tag'
	import { type SidebarSponsor } from './types'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'

	let { sponsors = [] }: { sponsors?: SidebarSponsor[] } = $props()

	// Max slots to show (3 total: sponsors + placeholders)
	const MAX_SLOTS = 3
	const placeholderCount = Math.max(0, MAX_SLOTS - sponsors.length)
	const isPremium = (logoSize?: string) => logoSize === 'large'
</script>

<div class="grid gap-3 rounded border border-slate-200 bg-gray-50 p-4">
	<div class="flex items-center justify-between">
		<h3 class="text-md font-bold">Sponsors</h3>
		<a href="/sponsors/submit" class="text-svelte-500 text-xs hover:underline">Learn more</a>
	</div>

	<div class="space-y-2">
		{#each sponsors as sponsor (sponsor.id)}
			<a
				href={sponsor.website_url}
				target="_blank"
				rel="noopener sponsored"
				class="group grid gap-3 rounded border border-slate-200 bg-white p-2 transition-colors hover:border-orange-400 hover:bg-orange-50"
				class:grid-cols-[auto_1fr]={sponsor.logo_size === 'normal'}
			>
				<!-- Logo -->
				{#if sponsor.logo_size === 'large'}
					<!-- Premium: Large centered logo -->
					<div class="flex flex-col items-center gap-2">
						<img
							src={getCachedImageWithPreset(sponsor.logo_url, 'thumbnail')}
							alt="{sponsor.company_name} logo"
							class="h-16 w-full rounded border border-slate-200 bg-white object-contain p-2"
						/>
						<div class="w-full text-center">
							<span class="text-xs font-medium text-slate-700">
								{sponsor.company_name}
								<Star size={12} weight="fill" class="ml-1 inline-block text-amber-500" />
							</span>
							<p class="mt-0.5 line-clamp-2 text-[10px] text-slate-500">{sponsor.tagline}</p>
							{#if sponsor.discount_code}
								<span
									class="mt-1 inline-flex items-center gap-1 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700"
								>
									<Tag size={10} />
									{sponsor.discount_code}
								</span>
							{/if}
						</div>
					</div>
				{:else}
					<!-- Basic: Normal grid layout -->
					<img
						src={getCachedImageWithPreset(sponsor.logo_url, 'thumbnail')}
						alt="{sponsor.company_name} logo"
						class="h-10 w-10 rounded border border-slate-200 bg-white object-contain p-1"
					/>
					<div class="flex min-w-0 flex-col justify-center">
						<span class="truncate text-xs font-medium text-slate-700">
							{sponsor.company_name}
						</span>
						<span class="line-clamp-1 text-[10px] text-slate-500">{sponsor.tagline}</span>
						{#if sponsor.discount_code}
							<span
								class="mt-0.5 inline-flex w-fit items-center gap-1 rounded bg-green-100 px-1 py-0.5 text-[9px] font-medium text-green-700"
							>
								<Tag size={8} />
								{sponsor.discount_code}
							</span>
						{/if}
					</div>
				{/if}
			</a>
		{/each}

		{#each Array(placeholderCount) as _, i (i)}
			<a
				href="/sponsors/submit"
				class="group grid grid-cols-[auto_1fr] gap-3 rounded border border-dashed border-slate-300 bg-white p-2 transition-colors hover:border-orange-400 hover:bg-orange-50"
			>
				<!-- Placeholder logo -->
				<div
					class="flex h-10 w-10 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 transition-colors group-hover:border-orange-400 group-hover:bg-orange-100"
				>
					<Plus size={16} class="text-slate-400 transition-colors group-hover:text-orange-500" />
				</div>
				<!-- Placeholder content -->
				<div class="flex flex-col justify-center">
					<span
						class="text-xs font-medium text-slate-400 transition-colors group-hover:text-orange-600"
					>
						Your company here
					</span>
					<span class="text-[10px] text-slate-400">Sponsor slot available</span>
				</div>
			</a>
		{/each}
	</div>

	<p class="text-xs text-gray-600">
		Support Svelte Society and get your company featured to thousands of developers.
	</p>

	<a
		href="/sponsors/submit"
		class="mt-1 block rounded bg-orange-500 px-3 py-1.5 text-center text-xs font-medium text-white transition-colors hover:bg-orange-600"
	>
		Become a Sponsor
	</a>
</div>
