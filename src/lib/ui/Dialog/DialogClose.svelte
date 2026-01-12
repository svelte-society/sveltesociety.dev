<script lang="ts">
	import type { Snippet } from 'svelte'
	import Button from '../Button.svelte'
	import type { ButtonVariant, ButtonSize } from '../button.variants'

	type Props = {
		variant?: ButtonVariant
		size?: ButtonSize
		children: Snippet
	}

	let { variant = 'secondary', size, children }: Props = $props()
</script>

<form method="dialog">
	<Button type="submit" {variant} {size}>
		{@render children()}
	</Button>
</form>
