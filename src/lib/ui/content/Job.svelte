<script lang="ts">
	import MapPin from 'phosphor-svelte/lib/MapPin'
	import CurrencyDollar from 'phosphor-svelte/lib/CurrencyDollar'
	import Star from 'phosphor-svelte/lib/Star'
	import type { ContentWithAuthor, JobMetadata } from '$lib/types/content'
	import type { CardVariant } from '../contentCard.variants'

	interface Props {
		content: ContentWithAuthor
		variant?: CardVariant
	}

	let { content, variant = 'list' }: Props = $props()

	const metadata = $derived(content.metadata as JobMetadata)

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

	const salary = $derived(
		formatSalary(metadata?.salary_min, metadata?.salary_max, metadata?.salary_currency)
	)
	const isPremium = $derived(metadata?.tier_name === 'premium')
	const isFeatured = $derived(
		metadata?.tier_name === 'featured' || metadata?.tier_name === 'premium'
	)
</script>

{#if metadata}
	<!-- Premium/Featured Badge + Pills -->
	<div class="flex flex-wrap items-center gap-2">
		{#if isPremium}
			<span
				class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-1 text-xs font-medium text-white"
			>
				<Star size={12} weight="fill" /> Premium
			</span>
		{:else if isFeatured}
			<span
				class="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700"
			>
				Featured
			</span>
		{/if}

		<span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
			{formatPositionType(metadata.position_type)}
		</span>

		<span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
			{formatSeniorityLevel(metadata.seniority_level)}
		</span>

		<span
			class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs {metadata.remote_status ===
			'remote'
				? 'bg-green-100 text-green-700'
				: 'bg-slate-100 text-slate-500'}"
		>
			<MapPin size={12} />
			{formatRemoteStatus(metadata.remote_status)}
			{#if metadata.location && metadata.remote_status !== 'remote'}
				- {metadata.location}
			{/if}
		</span>

		{#if salary}
			<span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
				<CurrencyDollar size={12} />
				{salary}
			</span>
		{/if}
	</div>
{/if}
