<script lang="ts">
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import FilterSubmenu from './FilterSubmenu.svelte'
	import { getCategories, getTags, getAuthors } from './data.remote'
	import { afterNavigate } from '$app/navigation'

	let isOpen = $state(false)
	let shouldFocusTrigger = $state(false)

	afterNavigate(() => {
		if (shouldFocusTrigger) {
			triggerEl?.focus()
			shouldFocusTrigger = false
		}
	})

	function handleSelect() {
		shouldFocusTrigger = true
	}

	let wasFocusedBeforeClick = false

	function handleTriggerMousedown() {
		wasFocusedBeforeClick = document.activeElement === triggerEl
	}

	function handleTriggerClick() {
		if (wasFocusedBeforeClick) {
			triggerEl?.blur()
		}
	}

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			if (isOpen) {
				triggerEl?.blur()
			}
		}
	}
	let containerEl: HTMLDivElement | undefined = $state()
	let triggerEl: HTMLDivElement | undefined = $state()
	let menuEl: HTMLDivElement | undefined = $state()

	function handleFocusIn() {
		isOpen = true
	}

	function handleFocusOut(e: FocusEvent) {
		if (containerEl && !containerEl.contains(e.relatedTarget as Node)) {
			isOpen = false
		}
	}

	function getMenuItems(): HTMLElement[] {
		if (!menuEl) return []
		return Array.from(menuEl.querySelectorAll<HTMLElement>(':scope > div > div[role="menuitem"]'))
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault()
			isOpen = false
			if (document.activeElement instanceof HTMLElement) {
				document.activeElement.blur()
			}
			return
		}

		const items = getMenuItems()
		if (items.length === 0) return

		const currentIndex = items.findIndex((item) => item === document.activeElement)

		if (e.key === 'ArrowDown') {
			e.preventDefault()
			if (document.activeElement === triggerEl) {
				items[0]?.focus()
			} else if (currentIndex >= 0 && currentIndex < items.length - 1) {
				items[currentIndex + 1]?.focus()
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			if (currentIndex > 0) {
				items[currentIndex - 1]?.focus()
			} else if (currentIndex === 0) {
				triggerEl?.focus()
			}
		}
	}

</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	role="group"
	class="group/dropdown relative inline-block"
	bind:this={containerEl}
	onfocusin={handleFocusIn}
	onfocusout={handleFocusOut}
	onkeydown={handleKeydown}
>
	<div
		role="button"
		tabindex="0"
		aria-haspopup="true"
		aria-expanded={isOpen}
		aria-label="Add filter"
		bind:this={triggerEl}
		onmousedown={handleTriggerMousedown}
		ontouchstart={handleTriggerMousedown}
		onclick={handleTriggerClick}
		onkeydown={handleTriggerKeydown}
		class="grid w-full min-w-36 cursor-pointer grid-cols-[1fr_auto] items-center rounded-md border-2 border-transparent bg-slate-100 px-3 py-1 pl-2 text-left text-sm focus:outline-2 focus:outline-svelte-300"
	>
		Add Filter
		<CaretUpDown class="ml-auto size-4 text-gray-500" />
	</div>

	<div
		role="menu"
		aria-label="Filter options"
		bind:this={menuEl}
		class="invisible absolute left-0 right-0 top-full z-50 mt-1 rounded-xl bg-white px-1 py-3 opacity-0 shadow-2xl transition-all select-none group-focus-within/dropdown:visible group-focus-within/dropdown:opacity-100"
	>
		<FilterSubmenu label="Categories" paramName="type" getItems={getCategories} onSelect={handleSelect} />
		<FilterSubmenu label="Tags" paramName="tags" getItems={getTags} onSelect={handleSelect} />
		<FilterSubmenu label="Authors" paramName="authors" getItems={getAuthors} onSelect={handleSelect} />
	</div>
</div>
