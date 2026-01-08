<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import {
		buttonVariants,
		type ButtonSize,
		type ButtonVariant,
		type ButtonWidth,
		type ButtonThickness
	} from './button.variants'
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'

	type Props = {
		children: Snippet
		variant?: ButtonVariant
		size?: ButtonSize
		width?: ButtonWidth
		thickness?: ButtonThickness
		class?: ClassValue,
	} & (({ href: string } & HTMLAnchorAttributes) | ({ href?: never } & HTMLButtonAttributes))

	let { children, variant, size, width, thickness, href, class: className, ...rest }: Props =
		$props()
</script>

{#if href}
	<a
		class={[buttonVariants({ variant, size, thickness }), className]}
		{href}
		{...rest as HTMLAnchorAttributes}>{@render children()}</a
	>
{:else}
	<button
		class={[buttonVariants({ variant, size, thickness }), className]}
		{...rest as HTMLButtonAttributes}
	>
		{@render children()}
	</button>
{/if}
