<script lang="ts">
	import { page } from '$app/state'

	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'Saved', href: '/saved' },
		{ name: 'CURATED', href: null },
		{ name: 'Announcements', href: '/announcement' },
		{ name: 'Collections', href: '/collection' },
		{ name: 'CODE / RESOURCES', href: null },
		{ name: 'Templates', href: '/template' },
		{ name: 'Libraries', href: '/library' },
		{ name: 'LEARNING', href: null },
		{ name: 'Videos', href: '/video' },
		{ name: 'Recipes', href: '/recipe' },
		{ name: 'Showcase', href: '/showcase' }
	]

	function preserveSearchParams(href: string) {
		const searchParams = page.url.searchParams.toString()
		if (!searchParams) return href
		return `${href}${href.includes('?') ? '&' : '?'}${searchParams}`
	}
</script>

<aside>
	<nav>
		<ul class="text-sm font-bold">
			{#each links as link}
				{#if link.href}
					<li
						class={[
							{ 'bg-svelte-500 text-white': page.url.pathname === link.href },
							'w-full rounded-sm px-2 py-0.5'
						]}
					>
						<a class="block w-full" href={preserveSearchParams(link.href)}>{link.name}</a>
					</li>
				{:else}
					<li class="mt-2 px-2 py-0.5 text-xs font-extralight">
						{link.name}
					</li>
				{/if}
			{/each}
		</ul>
	</nav>
</aside>
