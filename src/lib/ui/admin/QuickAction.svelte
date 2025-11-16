<script lang="ts">
	import type { Icon } from 'phosphor-svelte'

	interface Props {
		title: string
		description: string
		icon: typeof Icon
		href: string
		iconColor?: string
		bgColor?: string
		testid?: string
	}

	let { title, description, icon: IconComponent, href, iconColor = 'text-svelte-500', bgColor = 'bg-svelte-50', testid }: Props = $props()
</script>

<a
	{href}
	class="group flex items-start gap-4 rounded-lg bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-svelte-500/20"
	data-testid={testid}
>
	<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg {bgColor} transition-transform group-hover:scale-110">
		<IconComponent class="h-5 w-5 {iconColor}" weight="duotone" />
	</div>
	<div class="flex-1 min-w-0">
		<h4 class="font-medium text-gray-900 group-hover:text-svelte-500 transition-colors">{title}</h4>
		<p class="mt-0.5 text-sm text-gray-500">{description}</p>
	</div>
	<svg
		class="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-svelte-500"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
	</svg>
</a>
