<script lang="ts">
	import { page } from '$app/state'
	import type { NavLink } from './+layout.svelte'
	import NavigationLink from './NavigationLink.svelte'
	import { ArrowLeft } from 'phosphor-svelte'

	let isCollapsed = $state(true)

	function isActive(href: string) {
		if (href === '/admin') {
			return page.url.pathname === href
		}
		return page.url.pathname.startsWith(href)
	}

	interface Props {
		links: NavLink[]
		moderationCount?: number
	}

	let { links, moderationCount }: Props = $props()

	const homeLink: NavLink = {
		href: '/',
		label: 'Back to Home',
		icon: ArrowLeft,
		allowedRoles: ['admin', 'moderator', 'editor']
	}
</script>

<aside
	class="hidden h-full w-64 flex-col bg-white shadow-lg transition-all duration-300 md:flex"
	aria-label="Admin sidebar"
>
	<!-- Sidebar Header -->
	<div class="border-b border-gray-200 p-6">
		<h2 class="text-lg font-bold text-gray-900">Admin Panel</h2>
	</div>

	<!-- Navigation -->
	<div class="flex flex-grow flex-col gap-2 p-4">
		<nav class="flex-grow">
			<ul class="space-y-1">
				{#each links as item}
					<NavigationLink
						{item}
						{isActive}
						moderationCount={item.href === '/admin/moderation' ? moderationCount : 0}
					/>
				{/each}
			</ul>
		</nav>
	</div>

	<!-- Footer -->
	<ul class="border-t border-gray-200 p-4">
		<NavigationLink item={homeLink} isActive={() => false} {isCollapsed} />
	</ul>
</aside>
