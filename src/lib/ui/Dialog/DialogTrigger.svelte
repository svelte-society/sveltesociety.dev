<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import Button from '../Button.svelte'
	import type { ButtonVariant, ButtonSize } from '../button.variants'

	type Props = {
		target?: string
		onclick?: () => void
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
		onclick,
		variant,
		size,
		disabled,
		class: className,
		children,
		'aria-label': ariaLabel,
		'data-testid': testId
	}: Props = $props()

	function handleClick() {
		if (onclick) {
			onclick()
		} else if (target) {
			const dialog = document.getElementById(target) as HTMLDialogElement | null
			if (dialog && !dialog.open) {
				dialog.showModal()
			}
		}
	}
</script>

<Button
	type="button"
	onclick={handleClick}
	{variant}
	{size}
	{disabled}
	class={className}
	aria-label={ariaLabel}
	data-testid={testId}
>
	{@render children()}
</Button>
