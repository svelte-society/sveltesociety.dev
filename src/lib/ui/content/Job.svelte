<script lang="ts">
	import MapPin from 'phosphor-svelte/lib/MapPin'
	import { page } from '$app/state'
	import { buildToggleHref, isValueActive } from '../filter/url-helpers'
	import type { ContentWithAuthor, JobMetadata } from '$lib/types/content'
	import type { CardVariant } from '../contentCard.variants'

	interface Props {
		content: ContentWithAuthor
		variant?: CardVariant
	}

	let { content, variant = 'list' }: Props = $props()

	const metadata = $derived(content.metadata as JobMetadata)

	// Filter param mappings
	const getPositionHref = (positionType: string) =>
		buildToggleHref(page.url, page.route.id, page.params, 'position', positionType)
	const getLevelHref = (level: string) =>
		buildToggleHref(page.url, page.route.id, page.params, 'level', level)
	const getRemoteHref = (status: string) =>
		buildToggleHref(page.url, page.route.id, page.params, 'remote', status)

	const isPositionActive = $derived(isValueActive(page.url, 'position', metadata?.position_type))
	const isLevelActive = $derived(isValueActive(page.url, 'level', metadata?.seniority_level))
	const isRemoteActive = $derived(isValueActive(page.url, 'remote', metadata?.remote_status))

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
</script>

{#if metadata}
	<div class="flex flex-wrap items-center gap-2">
		<a
			href={getPositionHref(metadata.position_type)}
			data-sveltekit-preload-data="off"
			class={[
				'flex items-center gap-0.5 rounded border px-1.5 py-1 text-xs',
				isPositionActive
					? 'border-svelte-300 bg-svelte-100 text-svelte-900 hover:bg-svelte-200'
					: 'border-slate-200 bg-slate-100 text-zinc-800 hover:bg-slate-200',
				'focus:outline-2 focus:outline-offset-2 focus:outline-svelte-300'
			]}
		>
			{formatPositionType(metadata.position_type)}
		</a>

		<a
			href={getLevelHref(metadata.seniority_level)}
			data-sveltekit-preload-data="off"
			class={[
				'flex items-center gap-0.5 rounded border px-1.5 py-1 text-xs',
				isLevelActive
					? 'border-svelte-300 bg-svelte-100 text-svelte-900 hover:bg-svelte-200'
					: 'border-slate-200 bg-slate-100 text-zinc-800 hover:bg-slate-200',
				'focus:outline-2 focus:outline-offset-2 focus:outline-svelte-300'
			]}
		>
			{formatSeniorityLevel(metadata.seniority_level)}
		</a>

		<a
			href={getRemoteHref(metadata.remote_status)}
			data-sveltekit-preload-data="off"
			class={[
				'flex items-center gap-1 rounded border px-1.5 py-1 text-xs',
				isRemoteActive
					? 'border-svelte-300 bg-svelte-100 text-svelte-900 hover:bg-svelte-200'
					: metadata.remote_status === 'remote'
						? 'border-green-200 bg-green-100 text-green-700 hover:bg-green-200'
						: 'border-slate-200 bg-slate-100 text-zinc-800 hover:bg-slate-200',
				'focus:outline-2 focus:outline-offset-2 focus:outline-svelte-300'
			]}
		>
			<MapPin size={12} />
			{formatRemoteStatus(metadata.remote_status)}
			{#if metadata.location && metadata.remote_status !== 'remote'}
				- {metadata.location}
			{/if}
		</a>

		{#if salary}
			<span class="flex items-center gap-0.5 rounded border border-slate-200 bg-slate-100 px-1.5 py-1 text-xs text-zinc-800">
				{salary}
			</span>
		{/if}
	</div>
{/if}
