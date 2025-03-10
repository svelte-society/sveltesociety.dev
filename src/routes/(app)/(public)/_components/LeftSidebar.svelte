<script>
import { page } from '$app/stores'

const links = [
	{ name: 'Home', href: '/' },
	{ name: 'Saved', href: '/saved' },
	{ name: 'CURATED', href: null },
	{ name: 'Announcements', href: '/announcements' },
	{ name: 'Collections', href: '/collections' },
	{ name: 'CODE / RESOURCES', href: null },
	{ name: 'Templates', href: '/templates' },
	{ name: 'Components', href: '/components' },
	{ name: 'Libraries', href: '/libraries' },
	{ name: 'LEARNING', href: null },
	{ name: 'Videos', href: '/videos' },
	{ name: 'Recipes', href: '/recipes' },
	{ name: 'Showcase', href: '/showcase' }
]
</script>

<aside class="w-48 px-4 py-10">
	<nav>
		<ul class="text-sm font-bold">
			{#each links as link}
				{#if link.href}
					<li class={[{'bg-svelte-900 text-white': $page.url.pathname === link.href }, 'rounded-sm px-2 py-0.5']}>
						<a href={link.href}>{link.name}</a>
					</li>
				{:else}
					<li class="mt-2 px-2 py-0.5 text-xs font-thin">
						{link.name}
					</li>
				{/if}
			{/each}
		</ul>
	</nav>
</aside>
