<script lang="ts">
	import { Button } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		children,
		href,
		primary = false
	} = $props<{
		children: Snippet;
		href: string | undefined;
		primary?: boolean;
	}>();
</script>

<Button.Root
	class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 active:scale-98
    inline-flex h-12 items-center justify-center px-[21px]
    text-[15px] font-semibold active:transition-all {primary ? 'primary' : ''}"
	{href}
>
	{@render children()}
</Button.Root>

<style>
	.primary {
		@apply bg-orange-500 text-white;
	}
</style>
