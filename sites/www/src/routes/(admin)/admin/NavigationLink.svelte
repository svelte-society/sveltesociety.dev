<script lang="ts">
	import type { Link } from './types';

	export let item: Link;
	export let isActive: (href: string) => boolean;
	export let moderationCount: number = 0;
	export let isCollapsed: boolean = false;
</script>

<li>
	<a
		href={item.href}
		class="relative flex items-center rounded-lg p-2 text-gray-600 hover:bg-slate-100 hover:text-gray-800"
		class:bg-slate-100={isActive(item.href)}
		class:text-gray-800={isActive(item.href)}
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
				class="absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
				class:h-5={!isCollapsed}
				class:w-5={!isCollapsed}
				class:collapsed={isCollapsed}
				class:not-collapsed={!isCollapsed}
			>
				{moderationCount}
			</span>
		{/if}
	</a>
</li>

<style lang="postcss">
	.collapsed {
		@apply bottom-0 left-auto right-0 top-auto h-4 w-4;
	}
	.not-collapsed {
		@apply bottom-0 right-2.5 top-2.5;
	}
</style>
