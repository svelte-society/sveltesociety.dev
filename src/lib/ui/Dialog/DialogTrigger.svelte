<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import Button from '../Button.svelte'
	import type { ButtonVariant, ButtonSize } from '../button.variants'

	type Props = {
		target: string
		variant?: ButtonVariant
		size?: ButtonSize
		disabled?: boolean
		class?: ClassValue
		children: Snippet
		'aria-label'?: string
		'data-testid'?: string
	}

	let {
		target,
		variant,
		size,
		disabled,
		class: className,
		children,
		'aria-label': ariaLabel,
		'data-testid': testId
	}: Props = $props()

	function openDialog() {
		const dialog = document.getElementById(target) as HTMLDialogElement | null
		if (dialog && !dialog.open) {
			dialog.showModal()
		}
	}
</script>

<Button
	type="button"
	onclick={openDialog}
	{variant}
	{size}
	{disabled}
	class={className}
	aria-label={ariaLabel}
	data-testid={testId}
>
	{@render children()}
</Button>
