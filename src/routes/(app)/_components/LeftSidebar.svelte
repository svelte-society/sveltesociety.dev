<script lang="ts">
	import { page } from '$app/state'

	type Props = {
		links: {
			name: string
			href: string | null
			disabled?: boolean
			isShortcut?: boolean
		}[]
	}

	let { links }: Props = $props()

	const activeShortcutHref = $derived(
		links.find((link) => link.isShortcut && link.href === page.url.pathname)?.href
	)

	function isLinkActive(link: { href: string; isShortcut?: boolean }): boolean {
		const pathname = page.url.pathname
		if (pathname === link.href) return true
		if (link.href !== '/' && pathname.startsWith(link.href + '/')) {
			if (activeShortcutHref && !link.isShortcut) return false
			return true
		}
		return false
	}
</script>

<aside
	class="sticky top-(--header-height) ml-4 hidden max-h-[calc(100vh-var(--header-height))] overflow-y-auto py-8 sm:block"
>
	<nav>
		<ul class="text-sm font-bold">
			{#each links as link}
				{#if !link.disabled}
					{#if link.href}
						<li
							title={link.disabled ? 'Please login to view saved content' : ''}
							class={[
								{
									'bg-svelte-500 text-white': isLinkActive(link),
									'cursor-not-allowed': link.disabled
								},
								'w-full rounded-sm px-2 py-0.5'
							]}
						>
							<a
								class={['block w-full', { 'pointer-events-none text-gray-700': link.disabled }]}
								href={link.href}
								aria-disabled={link.disabled}
							>
								{link.name}
								{link.disabled ? ' (disabled)' : ''}
							</a>
						</li>
					{:else}
						<li
							class="mt-4 px-2 pt-2 pb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase"
						>
							{link.name}
						</li>
					{/if}
				{/if}
			{/each}
		</ul>
	</nav>
</aside>
