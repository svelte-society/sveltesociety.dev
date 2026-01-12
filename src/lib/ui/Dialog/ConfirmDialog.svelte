<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import Dialog from './Dialog.svelte'
	import DialogClose from './DialogClose.svelte'
	import { dialogBodyVariants } from './dialog.variants'
	import type { DialogSize } from './dialog.variants'

	type BaseProps = {
		id: string
		open?: boolean
		title: string
		size?: DialogSize
		cancelText?: string
		class?: ClassValue
		confirm: Snippet
	}

	type PropsWithDescription = BaseProps & {
		description: string
		children?: never
	}

	type PropsWithChildren = BaseProps & {
		description?: never
		children: Snippet
	}

	type PropsWithNeither = BaseProps & {
		description?: never
		children?: never
	}

	type Props = PropsWithDescription | PropsWithChildren | PropsWithNeither

	let {
		id,
		open = $bindable(false),
		title,
		size,
		cancelText = 'Cancel',
		description,
		children,
		confirm,
		class: className
	}: Props = $props()
</script>

{#snippet footer()}
	<DialogClose>{cancelText}</DialogClose>
	{@render confirm()}
{/snippet}

<Dialog {id} bind:open {title} {size} {footer} class={className}>
	{#if children}
		{@render children()}
	{:else if description}
		<p class={dialogBodyVariants()}>{description}</p>
	{/if}
</Dialog>
