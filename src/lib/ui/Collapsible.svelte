<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import {
		collapsibleTriggerVariants,
		collapsibleContentVariants,
		type CollapsibleTriggerVariant,
		type CollapsibleContentPadding
	} from './collapsible.variants'

	type Props = {
		title: string
		icon?: Snippet
		open?: boolean
		variant?: CollapsibleTriggerVariant
		padding?: CollapsibleContentPadding
		triggerClass?: ClassValue
		contentClass?: ClassValue
		children: Snippet
	}

	let {
		title,
		icon,
		open = $bindable(false),
		variant,
		padding,
		triggerClass,
		contentClass,
		children
	}: Props = $props()

	function handleToggle(event: Event) {
		open = (event as ToggleEvent).newState === 'open'
	}
</script>

<details {open} ontoggle={handleToggle}>
	<summary class={[collapsibleTriggerVariants({ variant }), triggerClass]}>
		<div class="flex items-center gap-2">
			{#if icon}
				{@render icon()}
			{/if}
			<span class="font-medium text-gray-900">
				{title}
			</span>
		</div>
		<svg
			class="h-4 w-4 text-gray-500 transition-transform duration-200"
			class:rotate-180={open}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
			></path>
		</svg>
	</summary>

	<div class={[collapsibleContentVariants({ padding }), contentClass]}>
		{@render children()}
	</div>
</details>

<style>
	/* Hide default marker */
	summary::marker,
	summary::-webkit-details-marker {
		display: none;
	}

	/* Ensure summary doesn't show list-item marker */
	summary {
		list-style: none;
	}

	/* Base styles for content animation */
	details::details-content {
		overflow: clip;
		height: 0;
	}

	/* Open state */
	details[open]::details-content {
		height: auto;
	}

	/* Animation for browsers that support interpolate-size */
	@supports (interpolate-size: allow-keywords) {
		details {
			interpolate-size: allow-keywords;
		}

		details::details-content {
			transition:
				height 0.2s ease,
				content-visibility 0.2s ease allow-discrete;
		}
	}
</style>
