<script lang="ts">
	import { page } from '$app/state'

	type Props = {
		user?: {
			id: string
			username: string
			name: string
			avatar_url: string
		} | null
	}

	let { user }: Props = $props()

	const links = $derived([
		{ name: 'Home', href: '/' },
		{ name: 'Saved', href: '/saved', disabled: !user },
		{ name: 'CURATED', href: null },
		{ name: 'Announcements', href: '/announcement' },
		{ name: 'Collections', href: '/collection' },
		{ name: 'CODE / RESOURCES', href: null },
		{ name: 'Libraries', href: '/library' },
		{ name: 'LEARNING', href: null },
		{ name: 'Videos', href: '/video' },
		{ name: 'Recipes', href: '/recipe' }
	])

	function preserveSearchParams(href: string) {
		const searchParams = page.url.searchParams.toString()
		if (!searchParams) return href
		return `${href}${href.includes('?') ? '&' : '?'}${searchParams}`
	}
</script>

<aside class="hidden sm:block">
	<nav>
		<ul class="text-sm font-bold">
			{#each links as link}
				{#if link.href}
					<li
						title={link.disabled ? 'Please login to view saved content' : ''}
						class={[
							{
								'bg-svelte-500 text-white': page.url.pathname === link.href,
								'cursor-not-allowed': link.disabled
							},
							'w-full rounded-sm px-2 py-0.5'
						]}
					>
						<a
							class={['block w-full', { 'pointer-events-none text-gray-700': link.disabled }]}
							href={preserveSearchParams(link.href)}
							aria-disabled={link.disabled}
						>
							{link.name}
							{link.disabled ? ' (disabled)' : ''}
						</a>
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
