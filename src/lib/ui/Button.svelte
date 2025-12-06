<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import {
		buttonVariants,
		type ButtonSize,
		type ButtonVariant,
		type ButtonWidth
	} from './button.variants'
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'

	type Props = {
		children: Snippet
		variant?: ButtonVariant
		size?: ButtonSize
		width?: ButtonWidth
		class?: ClassValue
	} & (({ href: string } & HTMLAnchorAttributes) | ({ href?: never } & HTMLButtonAttributes))

	let { children, variant, size, width, href, class: className, ...rest }: Props = $props()
</script>

{#if href}
	<a class={[buttonVariants({ variant, size }), className]} {href} {...rest as HTMLAnchorAttributes}
		>{@render children()}</a
	>
{:else}
	<button class={[buttonVariants({ variant, size }), className]} {...rest as HTMLButtonAttributes}>
		{@render children()}
	</button>
{/if}
