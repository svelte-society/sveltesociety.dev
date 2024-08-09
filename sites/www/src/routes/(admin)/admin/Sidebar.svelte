<script lang="ts">
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import type { Link } from './types';
	import NavigationLink from './NavigationLink.svelte';

	export let moderationCount: number;

	const isCollapsed = writable(false);

	function toggleSidebar() {
		isCollapsed.update((value) => !value);
	}

	function isActive(href: string) {
		if (href === '/admin') {
			return $page.url.pathname === href;
		}
		return $page.url.pathname.startsWith(href);
	}

	const links: Link[] = [
		{
			href: '/admin',
			label: 'Dashboard',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
		},
		{
			href: '/admin/users',
			label: 'Users',
			icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
		},
		{
			href: '/admin/roles',
			label: 'Roles',
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
		},
		{
			href: '/admin/content',
			label: 'Content',
			icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
		},
		{
			href: '/admin/collections',
			label: 'Collections',
			icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
		},
		{
			href: '/admin/moderation',
			label: 'Moderation',
			icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
		}
	];

	const homeLink: Link = {
		href: '/',
		label: 'Back to Home',
		icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
	};
</script>

<aside
	class="flex h-full flex-col bg-white shadow-md transition-all duration-300"
	class:w-52={!$isCollapsed}
	class:w-18={$isCollapsed}
	aria-label="Admin sidebar"
>
	<div class="flex flex-grow flex-col gap-2 p-4">
		<button
			on:click={toggleSidebar}
			class="flex items-center rounded-lg p-2 text-gray-600 hover:bg-slate-100 hover:text-gray-800"
			aria-label={$isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			aria-expanded={!$isCollapsed}
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
					d={$isCollapsed ? 'M4 6h16M4 12h16M4 18h16' : 'M6 18L18 6M6 6l12 12'}
				></path>
			</svg>
			<span class:sr-only={$isCollapsed} class="ml-2">Collapse Menu</span>
		</button>
		<hr class="mx-auto h-1 w-4/5 rounded-full bg-gray-300" />
		<h2 class="text-xl font-bold text-gray-800" class:sr-only={$isCollapsed}>Admin Panel</h2>
		<nav class="flex-grow">
			<ul class="space-y-2">
				{#each links as item}
					<NavigationLink
						{item}
						{isActive}
						moderationCount={item.href === '/admin/moderation' ? moderationCount : 0}
						isCollapsed={$isCollapsed}
					/>
				{/each}
			</ul>
		</nav>
	</div>
	<ul class="border-t border-gray-200 p-4">
		<NavigationLink item={homeLink} isActive={() => false} isCollapsed={$isCollapsed} />
	</ul>
</aside>
