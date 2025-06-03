<script lang="ts">
	import Button from '$lib/ui/Button.svelte'

	interface Props {
		title: string
		newHref?: string
		newLabel?: string
		children?: any
	}

	let { title, newHref, newLabel = 'New', children }: Props = $props()
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
		<h1 class="text-xl font-bold">{title}</h1>
		{#if newHref}
			<Button small primary icon_left="plus" href={newHref}>{newLabel}</Button>
		{/if}
	</div>

	{@render children?.()}
</div>
