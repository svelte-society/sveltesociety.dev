<script>
	import { page } from '$app/stores';

	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'Saved posts', href: '/' },
		{ name: 'CURATED', href: null },
		{ name: 'Announcements', href: '/' },
		{ name: 'Collections', href: '/' },
		{ name: 'CODE / RESOURCES', href: null },
		{ name: 'Templates', href: '/' },
		{ name: 'Components', href: '/' },
		{ name: 'Libraries', href: '/' },
		{ name: 'LEARNING', href: null },
		{ name: 'Videos', href: '/' },
		{ name: 'Recipes', href: '/' },
		{ name: 'Showcase', href: '/' }
	];
</script>

<aside class="w-56 p-4">
	<nav>
		<ul class="text-sm font-bold">
			{#each links as link}
				{#if link.href}
					<li class:active={$page.url.pathname === link.href} class="rounded-sm px-2 py-0.5">
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

<style>
	.active {
		@apply bg-orange-500 text-white;
	}
</style>
