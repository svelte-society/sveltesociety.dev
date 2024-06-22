<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		primary?: boolean;
		error?: boolean;
		secondary?: boolean;
		small?: boolean;
		large?: boolean;
		fullWidth?: boolean;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		children: Snippet;
		onclick?: () => void;
	};

	const {
		primary,
		secondary,
		error,
		small,
		large,
		fullWidth,
		href,
		type,
		disabled,
		children,
		onclick
	}: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	role={href ? '' : 'button'}
	tabindex="0"
	{type}
	{href}
	{onclick}
	class:primary
	class:secondary
	class:error
	class:small
	class:large
	class:fullWidth
	class:disabled
>
	{@render children()}
</svelte:element>

<style lang="postcss">
	button,
	a {
		@apply inline-flex items-center justify-center rounded-md px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
	}
	.primary {
		@apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
	}
	.secondary {
		@apply bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500;
	}

	.error {
		@apply rounded-md bg-red-600 text-white transition-colors duration-200 hover:bg-red-700;
	}
	.small {
		@apply px-3 py-2 text-sm;
	}
	.large {
		@apply px-6 py-3 text-lg;
	}
	.fullWidth {
		@apply w-full;
	}
	a:disabled,
	button:disabled {
		@apply cursor-not-allowed opacity-50;
	}
</style>
