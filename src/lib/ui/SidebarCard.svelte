<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { ClassValue, HTMLAttributes } from 'svelte/elements'
	import { sidebarCardVariants, type SidebarCardPadding } from './sidebarCard.variants'

	type Props = {
		title: string
		padding?: SidebarCardPadding
		class?: ClassValue
		icon?: Snippet
		action?: Snippet
		children: Snippet
		footer?: Snippet
	} & HTMLAttributes<HTMLDivElement>

	let { title, padding, class: className, icon, action, children, footer, ...rest }: Props = $props()
</script>

<div class={[sidebarCardVariants({ padding }), className]} {...rest}>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			{#if icon}
				{@render icon()}
			{/if}
			<h3 class="text-md font-bold">{title}</h3>
		</div>
		{#if action}
			{@render action()}
		{/if}
	</div>

	{@render children()}

	{#if footer}
		<div class="text-right">
			{@render footer()}
		</div>
	{/if}
</div>
