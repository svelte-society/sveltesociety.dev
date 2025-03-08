<script lang="ts">
import type { Link } from './types'

interface Props {
	item: Link
	isActive: (href: string) => boolean
	moderationCount?: number
	isCollapsed: boolean
}

let { item, isActive, moderationCount = 0, isCollapsed }: Props = $props()
</script>

<li>
	<a
		href={item.href}
		class={[{ 'bg-slate-100 text-gray-800': isActive(item.href) }, 'relative flex items-center rounded-lg p-2 text-gray-600 hover:bg-slate-100 hover:text-gray-800']}
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
		<span class={[{ 'sr-only': isCollapsed }, 'ml-2']}>{item.label}</span>
		{#if moderationCount && moderationCount > 0}
			<span
				class={[{'-right-1 bottom-1 h-4 min-w-4 px-1': isCollapsed, 'bottom-0 right-2.5 top-2.5 h-5 min-w-5 px-1': !isCollapsed}, 'absolute flex items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white']}
			>
				{moderationCount > 99 ? '99+' : moderationCount}
			</span>
		{/if}
	</a>
</li>
