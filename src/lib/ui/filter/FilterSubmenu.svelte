<script lang="ts">
	import CaretRight from 'phosphor-svelte/lib/CaretRight'
	import Check from 'phosphor-svelte/lib/Check'
	import { page } from '$app/state'
	import { buildToggleHref, isValueActive } from './url-helpers'

	export type Item = {
		label: string
		value: string
	}

	type Props = {
		label: string
		paramName: string
		items?: Item[]
		getItems?: () => Promise<Item[]> | Item[]
		onSelect?: () => void
	}

	let { label, paramName, items, getItems, onSelect }: Props = $props()

	function fetchItems(): Promise<Item[]> | Item[] {
		if (items) return items
		if (getItems) return getItems()
		return []
	}

	let isOpen = $state(false)
	let containerEl: HTMLDivElement | undefined = $state()
	let triggerEl: HTMLDivElement | undefined = $state()
	let submenuEl: HTMLDivElement | undefined = $state()

	function handleFocusIn() {
		isOpen = true
	}

	function handleFocusOut(e: FocusEvent) {
		if (containerEl && !containerEl.contains(e.relatedTarget as Node)) {
			isOpen = false
		}
	}

	function getSubmenuItems(): HTMLElement[] {
		if (!submenuEl) return []
		return Array.from(submenuEl.querySelectorAll<HTMLElement>('a'))
	}

	function handleKeydown(e: KeyboardEvent) {
		const submenuItems = getSubmenuItems()

		if (e.key === 'ArrowRight' && document.activeElement === triggerEl) {
			e.preventDefault()
			submenuItems[0]?.focus()
			return
		}

		if (e.key === 'ArrowLeft') {
			e.preventDefault()
			triggerEl?.focus()
			return
		}

		const currentIndex = submenuItems.findIndex((item) => item === document.activeElement)
		if (currentIndex < 0) return

		if (e.key === 'ArrowDown' && currentIndex < submenuItems.length - 1) {
			e.preventDefault()
			submenuItems[currentIndex + 1]?.focus()
		} else if (e.key === 'ArrowUp' && currentIndex > 0) {
			e.preventDefault()
			submenuItems[currentIndex - 1]?.focus()
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	role="group"
	class="group/submenu relative"
	bind:this={containerEl}
	onfocusin={handleFocusIn}
	onfocusout={handleFocusOut}
	onkeydown={handleKeydown}
>
	<div
		role="menuitem"
		tabindex="0"
		aria-haspopup="true"
		aria-expanded={isOpen}
		bind:this={triggerEl}
		class="group/button flex h-8 w-full cursor-pointer items-center justify-between rounded-sm py-3 pr-1.5 pl-3 text-left text-sm outline-hidden hover:bg-svelte-50 focus:bg-svelte-100 group-focus-within/submenu:bg-svelte-50"
	>
		<span>{label}</span>
		<CaretRight class="size-4 text-gray-400 group-hover/button:text-svelte-900 group-focus/button:text-svelte-900 group-focus-within/submenu:text-svelte-900" />
		<span class="sr-only">Open submenu</span>
	</div>
	<div
		role="menu"
		aria-label="{label} options"
		bind:this={submenuEl}
		class="invisible absolute left-full top-0 ml-1 min-w-44 rounded-xl bg-white px-1 py-3 opacity-0 shadow-2xl transition-all select-none group-focus-within/submenu:visible group-focus-within/submenu:opacity-100"
	>
		{#each await fetchItems() as item (item.value)}
			{@const isActive = isValueActive(page.url, paramName, item.value)}
			<a
				href={buildToggleHref(page.url, page.route.id, page.params, paramName, item.value)}
				role="menuitemcheckbox"
				aria-checked={isActive}
				onclick={() => onSelect?.()}
				onkeydown={(e) => {
					if (e.key === ' ') {
						e.preventDefault()
						e.currentTarget.click()
					}
				}}
				class="flex h-8 w-full items-center justify-between rounded-sm py-3 pr-2 pl-3 text-sm outline-hidden hover:bg-svelte-50 focus:bg-svelte-100"
			>
				{item.label}
				{#if isActive}
					<Check class="size-4 text-svelte-500" weight="bold" />
				{/if}
			</a>
		{/each}
	</div>
</div>
