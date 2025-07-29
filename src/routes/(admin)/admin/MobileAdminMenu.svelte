<script module lang="ts">
	export type Link = {
		href: string
		label: string
		icon: string
		allowedRoles: string[]
	}
</script>

<script lang="ts">
	import Collapsible from '$lib/ui/Collapsible.svelte'
	import List from 'phosphor-svelte/lib/List'
	import { page } from '$app/state'

	type Props = {
		links: Link[]
		moderationCount?: number
	}

	let { links, moderationCount = 0 }: Props = $props()

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

	const homeLink: Link = {
		href: '/',
		label: 'Back to Home',
		icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
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
			<div class="space-y-4">
				<div>
					<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-900 uppercase">
						Admin Menu
					</h3>
					<nav>
						<ul class="space-y-2">
							{#each links as item}
								<li>
									<a
										href={item.href}
										class={[
											{ 'bg-slate-100 text-gray-800': isActive(item.href) },
											'relative flex items-center rounded-lg p-3 text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-800'
										]}
										onclick={closeMenu}
									>
										<svg
											class="h-5 w-5 flex-shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d={item.icon}
											></path>
										</svg>
										<span class="ml-3 font-medium">{item.label}</span>
										{#if item.href === '/admin/moderation' && moderationCount && moderationCount > 0}
											<span
												class="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white"
											>
												{moderationCount > 99 ? '99+' : moderationCount}
											</span>
										{/if}
									</a>
								</li>
							{/each}
						</ul>
					</nav>
				</div>

				<div class="border-t border-gray-200 pt-4">
					<a
						href={homeLink.href}
						class="flex items-center rounded-lg p-3 text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-800"
						onclick={closeMenu}
					>
						<svg
							class="h-5 w-5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={homeLink.icon}
							></path>
						</svg>
						<span class="ml-3 font-medium">{homeLink.label}</span>
					</a>
				</div>
			</div>
		{/snippet}
	</Collapsible>
</div>
