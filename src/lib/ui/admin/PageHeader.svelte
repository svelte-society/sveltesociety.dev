<script lang="ts">
	import type { Icon } from 'phosphor-svelte'
	import type { Snippet } from 'svelte'

	interface Props {
		title: string
		description: string
		icon: typeof Icon
		actions?: Snippet
	}

	let { title, description, icon: IconComponent, actions }: Props = $props()
</script>

<div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-svelte-500 via-svelte-300 to-svelte-100 p-8 shadow-lg">
	<div class="relative z-10">
		<div class="flex items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-lg backdrop-blur-sm">
					<IconComponent class="h-7 w-7 text-svelte-500" weight="duotone" />
				</div>
				<div>
					<h1 class="text-3xl font-bold text-white">{title}</h1>
					<p class="mt-1 text-sm text-white/90">
						{description}
					</p>
				</div>
			</div>
			{#if actions}
				<div class="shrink-0">
					{@render actions()}
				</div>
			{/if}
		</div>
	</div>
	<div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
</div>
