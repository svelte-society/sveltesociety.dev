<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import {
		dialogVariants,
		dialogHeaderVariants,
		dialogFooterVariants,
		type DialogSize
	} from './dialog.variants'

	type Props = {
		id: string
		open?: boolean
		mode?: 'manual' | 'auto'
		size?: DialogSize
		title?: string
		header?: Snippet
		children: Snippet
		footer?: Snippet
		class?: ClassValue
	}

	let {
		id,
		open = $bindable(false),
		mode = 'manual',
		size,
		title,
		header,
		children,
		footer,
		class: className
	}: Props = $props()

	let dialogEl: HTMLDialogElement | null = $state(null)

	// Sync open state with dialog element
	$effect(() => {
		if (!dialogEl) return
		if (open && !dialogEl.open) {
			dialogEl.showModal()
		} else if (!open && dialogEl.open) {
			dialogEl.close()
		}
	})

	function handleClose() {
		open = false
	}

	function handleClick(event: MouseEvent) {
		// Close on backdrop click (when clicking the dialog element itself, not its content)
		if (mode === 'auto' && event.target === dialogEl) {
			open = false
		}
	}
</script>

<dialog
	bind:this={dialogEl}
	{id}
	class={[dialogVariants({ size }), className]}
	onclose={handleClose}
	onclick={handleClick}
>
	{#if header}
		{@render header()}
	{:else if title}
		<h2 class={dialogHeaderVariants()}>{title}</h2>
	{/if}
	{@render children()}
	{#if footer}
		<div class={dialogFooterVariants()}>
			{@render footer()}
		</div>
	{/if}
</dialog>
