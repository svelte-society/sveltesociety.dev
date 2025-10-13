<script lang="ts">
	import type { Snippet } from 'svelte'
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
	} & (({ href: string } & HTMLAnchorAttributes) | ({ href?: never } & HTMLButtonAttributes))

	let { children, variant, size, width, href, ...rest }: Props = $props()
</script>

{#if href}
	<a class={buttonVariants({ variant, size })} {href} {...rest as HTMLAnchorAttributes}
		>{@render children()}</a
	>
{:else}
	<button class={buttonVariants({ variant, size })} {...rest as HTMLButtonAttributes}>
		{@render children()}
	</button>
{/if}
