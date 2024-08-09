<script lang="ts">
	import type { Link } from './types';

	export let item: Link;
	export let isActive: (href: string) => boolean;
	export let moderationCount: number = 0;
	export let isCollapsed: boolean;
</script>

<li>
	<a
		href={item.href}
		class="flex items-center rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200"
		class:bg-gray-200={isActive(item.href)}
		aria-label={isCollapsed ? item.label : undefined}
		aria-current={isActive(item.href) ? 'page' : undefined}
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
		<span class:sr-only={isCollapsed} class="ml-2">{item.label}</span>
		{#if moderationCount > 0}
			<span
				class="ml-auto inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-white"
				aria-label={`${moderationCount} items awaiting moderation`}
			>
				{moderationCount}
			</span>
		{/if}
	</a>
</li>
