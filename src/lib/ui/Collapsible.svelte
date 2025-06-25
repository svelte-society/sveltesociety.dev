<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui'
	import { slide } from 'svelte/transition'

	type Props = {
		title: string
		icon?: any
		open?: boolean
		showOnMobile?: boolean
		showOnDesktop?: boolean
		triggerClass?: string
		contentClass?: string
		children: any
	}

	let {
		title,
		icon,
		open = $bindable(false),
		showOnMobile = true,
		showOnDesktop = true,
		triggerClass = '',
		contentClass = '',
		children
	}: Props = $props()

	let isOpen = $state(open)

	// Sync with external open prop
	$effect(() => {
		isOpen = open
	})

	$effect(() => {
		open = isOpen
	})

	// Determine visibility classes
	let visibilityClass = $derived(() => {
		if (showOnMobile && showOnDesktop) return ''
		if (showOnMobile && !showOnDesktop) return 'sm:hidden'
		if (!showOnMobile && showOnDesktop) return 'hidden sm:block'
		return 'hidden' // Neither mobile nor desktop
	})
</script>

<div class={visibilityClass()}>
	<CollapsiblePrimitive.Root bind:open={isOpen}>
		<CollapsiblePrimitive.Trigger
			class="focus:outline-svelte-300 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-[background-color] hover:bg-slate-100 focus:outline-2 focus:outline-offset-2 {triggerClass}"
		>
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
				class:rotate-180={isOpen}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
				></path>
			</svg>
		</CollapsiblePrimitive.Trigger>

		<CollapsiblePrimitive.Content forceMount>
			{#snippet child({ props, open })}
				{#if open}
					<div
						transition:slide={{ duration: 200 }}
						{...props}
						class="my-4 rounded-lg border border-slate-200 bg-white p-4 {contentClass}"
					>
						{@render children()}
					</div>
				{/if}
			{/snippet}
		</CollapsiblePrimitive.Content>
	</CollapsiblePrimitive.Root>
</div>
