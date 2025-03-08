<script lang="ts">
import Button from '$lib/ui/Button.svelte'

interface Props {
	title: string
	buttonText: string
	buttonHref: string
}

let { title, buttonText, buttonHref }: Props = $props()
</script>

<div class="mb-4 grid grid-cols-[1fr_auto] content-start gap-2">
	<h1 class="text-xl font-bold">{title}</h1>
	<Button small primary icon_left="plus" href={buttonHref}>{buttonText}</Button>
</div>
