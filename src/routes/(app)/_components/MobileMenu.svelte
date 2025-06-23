<script lang="ts">
	import Collapsible from '$lib/ui/Collapsible.svelte'
	import List from 'phosphor-svelte/lib/List'
	import Plus from 'phosphor-svelte/lib/Plus'
	import UpcomingEvents from './UpcomingEvents.svelte'
	import type { Content } from '$lib/types/content'

	type Props = {
		upcomingEvents?: Content[]
		links: {
			name: string
			href: string
			disabled?: boolean
		}[]
	}

	let { upcomingEvents = [], links }: Props = $props()

	let menuOpen = $state(false)

	const closeMenu = () => {
		menuOpen = false
	}
</script>

<Collapsible
	title={menuOpen ? 'Hide Menu' : 'Show Menu'}
	bind:open={menuOpen}
	showOnMobile={true}
	showOnDesktop={false}
>
	{#snippet icon()}
		<List size={20} class="text-gray-600" />
	{/snippet}
	{#snippet children()}
		<div class="space-y-6">
			<div>
				<h3 class="mb-3 text-sm font-semibold text-gray-900">Navigation</h3>
				<nav>
					<ul class="space-y-1 text-sm font-medium">
						{#each links as link}
							{#if !link.disabled && link.href}
								<li>
									<a
										href={link.href}
										class="block w-full rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
										aria-disabled={link.disabled}
										onclick={closeMenu}
									>
										{link.name}
										{link.disabled ? ' (disabled)' : ''}
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</nav>
			</div>

			<div class="space-y-4 border-t border-gray-200 pt-4">
				<div class="text-center">
					<h3 class="mb-2 text-lg font-semibold">Interested in contributing?</h3>
					<a
						href="/submit"
						class="bg-svelte-500 hover:bg-svelte-600 focus:outline-svelte-300 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-2 focus:outline-offset-2"
						onclick={closeMenu}
					>
						<Plus size={16} />
						Submit Post
					</a>
				</div>

				<p class="text-center text-sm text-gray-600">
					Share with the biggest community of Svelte enthusiasts in the world
				</p>

				<div class="rounded bg-amber-100 p-3 text-xs">
					<p class="text-wrap">
						Welcome to Svelte Society, homepage for everything Svelte. Find what you're looking for
						in the navigation above!
					</p>
				</div>

				<div class="grid gap-2 rounded border border-slate-200 bg-gray-50 px-4 py-2 text-sm">
					<h3 class="text-md font-bold">Our sponsors:</h3>
					<ul class="flex flex-wrap gap-2">
						<li>ACME Inc.</li>
						<li>John Doe Inc.</li>
					</ul>
				</div>

				<UpcomingEvents events={upcomingEvents} onLinkClick={closeMenu} />
			</div>
		</div>
	{/snippet}
</Collapsible>
