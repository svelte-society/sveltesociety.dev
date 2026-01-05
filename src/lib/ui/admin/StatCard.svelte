<script lang="ts">
	import type { Icon } from 'phosphor-svelte'

	interface Props {
		title: string
		value: string | number
		subtitle?: string
		icon: typeof Icon
		iconColor?: string
		trend?: {
			value: string
			isPositive: boolean
		}
		href?: string
		testid?: string
	}

	let { title, value, subtitle, icon: IconComponent, iconColor = 'text-svelte-500', trend, href, testid }: Props = $props()
</script>

<div
	class="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
	data-testid={testid}
>
	<div class="flex items-start justify-between">
		<div class="flex-1">
			<p class="text-sm font-medium text-gray-600">{title}</p>
			<h3 class="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
			{#if subtitle}
				<p class="mt-1 text-sm text-gray-500">{subtitle}</p>
			{/if}
			{#if trend}
				<div class="mt-3 flex items-center gap-1">
					<span
						class={[
							'text-sm font-medium',
							trend.isPositive ? 'text-green-600' : 'text-red-600'
						]}
					>
						{trend.isPositive ? '↑' : '↓'} {trend.value}
					</span>
					<span class="text-xs text-gray-500">vs last month</span>
				</div>
			{/if}
		</div>
		<div
			class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-svelte-50 to-svelte-100 transition-transform group-hover:scale-110"
		>
			<IconComponent class={['h-6 w-6', iconColor]} weight="duotone" />
		</div>
	</div>
	{#if href}
		<a
			{href}
			class="mt-4 inline-flex items-center text-sm font-medium text-svelte-500 transition-colors hover:text-svelte-900"
		>
			View details
			<svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</a>
	{/if}
</div>
