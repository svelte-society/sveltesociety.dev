<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		triggerContent: Snippet
		children: Snippet
		triggerLabel: string
		triggerClass?: string
		triggerTestId?: string
		menuLabel?: string
		align?: 'left' | 'right'
		menuClass?: string
		menuItemSelector?: string
	}

	let {
		triggerContent,
		children,
		triggerLabel,
		triggerClass = '',
		triggerTestId,
		menuLabel = 'Menu options',
		align = 'left',
		menuClass = '',
		menuItemSelector = '[role="menuitem"]'
	}: Props = $props()

	let containerEl: HTMLDivElement | undefined = $state()
	let triggerEl: HTMLDivElement | undefined = $state()
	let menuEl: HTMLDivElement | undefined = $state()
	let isOpen = $state(false)
	// Force close state for Escape key - allows closing while keeping focus
	let forceClosed = $state(false)

	function handleFocusIn() {
		isOpen = true
		// Clear force close on any focus - menu should reopen
		forceClosed = false
	}

	function handleFocusOut(e: FocusEvent) {
		if (containerEl && !containerEl.contains(e.relatedTarget as Node)) {
			isOpen = false
			forceClosed = false
		}
	}

	function getMenuItems(): HTMLElement[] {
		if (!menuEl) return []
		return Array.from(menuEl.querySelectorAll<HTMLElement>(menuItemSelector))
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault()
			// Instead of blurring, just force close - keeps focus on trigger
			forceClosed = true
			triggerEl?.focus()
			return
		}

		const items = getMenuItems()
		if (items.length === 0) return

		const currentIndex = items.findIndex((item) => item === document.activeElement)

		if (e.key === 'ArrowDown') {
			e.preventDefault()
			// Clear force close when navigating
			forceClosed = false
			if (document.activeElement === triggerEl) {
				items[0]?.focus()
			} else if (currentIndex >= 0 && currentIndex < items.length - 1) {
				items[currentIndex + 1]?.focus()
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			// Clear force close when navigating
			forceClosed = false
			if (currentIndex > 0) {
				items[currentIndex - 1]?.focus()
			} else if (currentIndex === 0) {
				triggerEl?.focus()
			}
		}
	}

	let wasFocusedBeforeClick = false

	function handleTriggerMousedown() {
		wasFocusedBeforeClick = document.activeElement === triggerEl
	}

	function handleTriggerClick() {
		if (forceClosed) {
			// If force closed, clicking should reopen
			forceClosed = false
		} else if (wasFocusedBeforeClick) {
			// Toggle close if already focused and open
			forceClosed = true
		}
	}

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			if (forceClosed) {
				// If force closed, key should reopen
				forceClosed = false
			} else if (isOpen) {
				// Toggle close if open
				forceClosed = true
			}
		}
	}

	const alignmentClass = align === 'right' ? 'right-0' : 'left-0'

	export function focusTrigger() {
		triggerEl?.focus()
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	role="group"
	class="group/dropdown relative inline-block"
	data-force-closed={forceClosed || undefined}
	bind:this={containerEl}
	onfocusin={handleFocusIn}
	onfocusout={handleFocusOut}
	onkeydown={handleKeydown}
>
	<div
		role="button"
		tabindex="0"
		data-testid={triggerTestId}
		aria-haspopup="true"
		aria-expanded={isOpen && !forceClosed}
		aria-label={triggerLabel}
		bind:this={triggerEl}
		onmousedown={handleTriggerMousedown}
		ontouchstart={handleTriggerMousedown}
		onclick={handleTriggerClick}
		onkeydown={handleTriggerKeydown}
		class={triggerClass}
	>
		{@render triggerContent()}
	</div>

	<div
		role="menu"
		aria-label={menuLabel}
		bind:this={menuEl}
		class="invisible absolute top-full z-50 mt-1 select-none group-focus-within/dropdown:visible group-data-[force-closed]/dropdown:invisible {alignmentClass} {menuClass}"
	>
		{@render children()}
	</div>
</div>
