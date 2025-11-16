<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import Plus from 'phosphor-svelte/lib/Plus'

	interface Props {
		title: string
		newHref?: string
		newLabel?: string
		children?: any
	}

	let { title, newHref, newLabel = 'New', children }: Props = $props()
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">{title}</h1>
		{#if newHref}
			<Button size="sm" href={newHref}><Plus weight="bold" />{newLabel}</Button>
		{/if}
	</div>

	{@render children?.()}
</div>
