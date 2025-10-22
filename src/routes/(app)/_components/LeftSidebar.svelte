<script lang="ts">
	import { page } from '$app/state'

	type Props = {
		links: {
			name: string
			href: string
			disabled?: boolean
		}[]
	}

	let { links }: Props = $props()
</script>

<aside
	class="sticky top-[var(--header-height)] ml-4 hidden max-h-[calc(100vh_-_var(--header-height))] overflow-y-auto py-8 sm:block"
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
									'bg-svelte-500 text-white': page.url.pathname === link.href,
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
						<li class="mt-2 px-2 py-0.5 text-xs font-thin">
							{link.name}
						</li>
					{/if}
				{/if}
			{/each}
		</ul>
	</nav>
</aside>
