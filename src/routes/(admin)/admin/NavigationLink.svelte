<script lang="ts">
	import type { NavLink } from './+layout.svelte'

	interface Props {
		item: NavLink
		isActive: (href: string) => boolean
	}

	let { item, isActive }: Props = $props()

	const IconComponent = $derived(item.icon)
</script>

<li>
	<a
		href={item.href}
		class={[
			{
				'bg-svelte-50 text-svelte-900 font-medium shadow-sm': isActive(item.href),
				'text-gray-600 hover:bg-gray-50': !isActive(item.href)
			},
			'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:text-gray-900'
		]}
	>
		<IconComponent
			class="h-5 w-5 shrink-0 transition-transform group-hover:scale-110"
			weight={isActive(item.href) ? 'fill' : 'regular'}
		/>
		<span class="text-sm">{item.label}</span>
		{#if item.badge && item.badge > 0}
			<span
				class="ml-auto inline-flex items-center justify-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800"
			>
				{item.badge}
			</span>
		{/if}
	</a>
</li>
