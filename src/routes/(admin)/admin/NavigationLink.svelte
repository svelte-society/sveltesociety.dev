<script lang="ts">
	import type { Link } from './types'

	interface Props {
		item: Link
		isActive: (href: string) => boolean
		moderationCount?: number
	}

	let { item, isActive, moderationCount = 0 }: Props = $props()
</script>

<li>
	<a
		href={item.href}
		class={[
			{ 'bg-slate-100 text-gray-800': isActive(item.href) },
			'relative flex items-center rounded-lg p-2 text-gray-600 hover:bg-slate-100 hover:text-gray-800'
		]}
	>
		<svg
			class="h-6 w-6"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}></path>
		</svg>
		<span class="ml-2">{item.label}</span>
		{#if moderationCount && moderationCount > 0}
			<span
				class="absolute top-2.5 right-2.5 bottom-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white"
			>
				{moderationCount > 99 ? '99+' : moderationCount}
			</span>
		{/if}
	</a>
</li>
