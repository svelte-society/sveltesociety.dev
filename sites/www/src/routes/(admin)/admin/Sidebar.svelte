<script lang="ts">
	import { page } from '$app/stores';
	import type { Link } from './types';
	import NavigationLink from './NavigationLink.svelte';

	let isCollapsed = $state(false);

	function isActive(href: string) {
		if (href === '/admin') {
			return $page.url.pathname === href;
		}
		return $page.url.pathname.startsWith(href);
	}

	let { links, moderationCount } = $props();

	const homeLink: Link = {
		href: '/',
		label: 'Back to Home',
		icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
	};
</script>

<aside
	class="flex h-full flex-col bg-white shadow-md transition-all duration-300"
	class:w-52={!isCollapsed}
	class:w-18={isCollapsed}
	aria-label="Admin sidebar"
>
	<div class="flex flex-grow flex-col gap-2 p-4">
		<button
			on:click={() => (isCollapsed = !isCollapsed)}
			class="flex items-center rounded-lg p-2 text-gray-600 hover:bg-slate-100 hover:text-gray-800"
			aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			aria-expanded={!isCollapsed}
		>
			<svg
				class="h-6 w-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d={isCollapsed ? 'M4 6h16M4 12h16M4 18h16' : 'M6 18L18 6M6 6l12 12'}
				></path>
			</svg>
			<span class:sr-only={isCollapsed} class="ml-2">Collapse Menu</span>
		</button>
		<hr class="mx-auto h-1 w-4/5 rounded-full bg-gray-300" />
		<h2 class="text-xl font-bold text-gray-800" class:sr-only={isCollapsed}>Admin Panel</h2>
		<nav class="flex-grow">
			<ul class="space-y-2">
				{#each links as item}
					<NavigationLink
						{item}
						{isActive}
						moderationCount={item.href === '/admin/moderation' ? moderationCount : 0}
						{isCollapsed}
					/>
				{/each}
			</ul>
		</nav>
	</div>
	<ul class="border-t border-gray-200 p-4">
		<NavigationLink item={homeLink} isActive={() => false} {isCollapsed} />
	</ul>
</aside>
