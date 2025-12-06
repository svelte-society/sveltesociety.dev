<script lang="ts">
	import PencilSimple from 'phosphor-svelte/lib/PencilSimple'
	import Button from '$lib/ui/Button.svelte'

	type Props = {
		href: string
		label?: string
	}

	let { href, label = 'Edit' }: Props = $props()
</script>

<Button {href} variant="ghost" size="icon" aria-label={label} data-testid="edit-button">
	<PencilSimple class="h-5 w-5" weight="bold" />
</Button>
