<script lang="ts">
	import { page } from '$app/state'
	import type { Link } from './types'
	import NavigationLink from './NavigationLink.svelte'

	let isCollapsed = $state(true)

	function isActive(href: string) {
		if (href === '/admin') {
			return page.url.pathname === href
		}
		return page.url.pathname.startsWith(href)
	}

	interface Props {
		links: Link[]
		moderationCount?: number
	}

	let { links, moderationCount }: Props = $props()

	const homeLink: Link = {
		href: '/',
		label: 'Back to Home',
		icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
	}
</script>

<aside
	class="flex h-full w-52 flex-col bg-white shadow-md transition-all duration-300"
	aria-label="Admin sidebar"
>
	<div class="flex flex-grow flex-col gap-2 p-4">
		<nav class="flex-grow">
			<ul class="space-y-2">
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
	<ul class="border-t border-gray-200 p-4">
		<NavigationLink item={homeLink} isActive={() => false} {isCollapsed} />
	</ul>
</aside>
