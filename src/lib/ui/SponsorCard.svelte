<script lang="ts">
	import Star from 'phosphor-svelte/lib/Star'
	import Tag from 'phosphor-svelte/lib/Tag'
	import ArrowSquareOut from 'phosphor-svelte/lib/ArrowSquareOut'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'

	interface Props {
		id: string
		company_name: string
		logo_url: string
		tagline: string
		website_url: string
		discount_code: string | null
		discount_description: string | null
		tier_name: string
		logo_size: 'normal' | 'large'
	}

	let {
		company_name,
		logo_url,
		tagline,
		website_url,
		discount_code,
		discount_description,
		tier_name,
		logo_size
	}: Props = $props()

	const isPremium = logo_size === 'large'
</script>

<div
	data-testid="sponsor-card"
	class="relative rounded-lg border p-4 transition-colors sm:p-6 {isPremium
		? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50'
		: 'border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/50'}"
>
	<div class="mb-2 flex items-center justify-between text-xs">
		<span class="font-medium uppercase tracking-wide text-gray-400">Sponsor</span>
		{#if isPremium}
			<span
				class="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700"
			>
				<Star size={10} weight="fill" />
				Premium
			</span>
		{/if}
	</div>

	<a
		href={website_url}
		target="_blank"
		rel="noopener sponsored"
		class="group flex gap-4 {isPremium ? 'flex-col items-center text-center sm:flex-row sm:text-left' : ''}"
	>
		<!-- Logo -->
		<div class="shrink-0">
			<img
				src={getCachedImageWithPreset(logo_url, 'thumbnail')}
				alt="{company_name} logo"
				class="rounded-lg border border-slate-200 bg-white object-contain p-2 {isPremium
					? 'h-20 w-20 sm:h-24 sm:w-24'
					: 'h-16 w-16'}"
			/>
		</div>

		<!-- Content -->
		<div class="min-w-0 flex-1">
			<h2
				class="flex items-center gap-2 text-lg font-semibold text-gray-900 group-hover:text-orange-600 sm:text-xl"
			>
				{company_name}
				<ArrowSquareOut size={16} class="shrink-0 opacity-50" />
			</h2>
			<p class="mt-1 text-sm text-gray-600 sm:text-base {isPremium ? '' : 'line-clamp-2'}">
				{tagline}
			</p>

			{#if discount_code}
				<div class="mt-3 flex flex-wrap items-center gap-2">
					<span
						class="inline-flex items-center gap-1.5 rounded-md bg-green-100 px-2.5 py-1 text-sm font-medium text-green-700"
					>
						<Tag size={14} />
						{discount_code}
					</span>
					{#if discount_description}
						<span class="text-sm text-gray-500">{discount_description}</span>
					{/if}
				</div>
			{/if}
		</div>
	</a>
</div>
