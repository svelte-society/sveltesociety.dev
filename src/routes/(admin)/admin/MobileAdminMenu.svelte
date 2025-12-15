<script lang="ts">
	import Collapsible from '$lib/ui/Collapsible.svelte'
	import { List, ArrowLeft } from 'phosphor-svelte'
	import { page } from '$app/state'
	import type { NavLink } from './+layout.svelte'

	type Props = {
		links: NavLink[]
	}

	let { links }: Props = $props()

	let menuOpen = $state(false)

	const closeMenu = () => {
		menuOpen = false
	}

	function isActive(href: string) {
		if (href === '/admin') {
			return page.url.pathname === href
		}
		return page.url.pathname.startsWith(href)
	}

	const homeLink: NavLink = {
		href: '/',
		label: 'Back to Home',
		icon: ArrowLeft,
		allowedRoles: []
	}
</script>

<div class="md:hidden">
	<Collapsible
		title={menuOpen ? 'Hide Admin Menu' : 'Show Admin Menu'}
		bind:open={menuOpen}
		showOnMobile={true}
		showOnDesktop={false}
	>
		{#snippet icon()}
			<List size={20} class="text-gray-600" />
		{/snippet}
		{#snippet children()}
			{@const HomeIconComponent = homeLink.icon}
			<div class="space-y-4">
				<div>
					<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-900 uppercase">
						Admin Menu
					</h3>
					<nav>
						<ul class="space-y-1">
							{#each links as item}
								{@const IconComponent = item.icon}
								<li>
									<a
										href={item.href}
										class={[
											{
												'bg-svelte-50 text-svelte-900 font-medium': isActive(item.href),
												'text-gray-600 hover:bg-gray-50': !isActive(item.href)
											},
											'relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:text-gray-900'
										]}
										onclick={closeMenu}
									>
										<IconComponent
											class="h-5 w-5 shrink-0"
											weight={isActive(item.href) ? 'fill' : 'regular'}
										/>
										<span class="text-sm">{item.label}</span>
									</a>
								</li>
							{/each}
						</ul>
					</nav>
				</div>

				<div class="border-t border-gray-200 pt-4">
					<a
						href={homeLink.href}
						class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
						onclick={closeMenu}
					>
						<HomeIconComponent class="h-5 w-5 shrink-0" weight="regular" />
						<span class="text-sm font-medium">{homeLink.label}</span>
					</a>
				</div>
			</div>
		{/snippet}
	</Collapsible>
</div>
