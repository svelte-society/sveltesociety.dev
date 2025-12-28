<script lang="ts">
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import Check from 'phosphor-svelte/lib/Check'
	import { page } from '$app/state'
	import { afterNavigate } from '$app/navigation'
	import { getCategoryFromRoute } from './url-helpers'

	type Option = {
		label: string
		value: string
	}

	type Props = {
		options: Option[]
		paramName: string
		defaultValue?: string
	}

	let { options, paramName, defaultValue = '' }: Props = $props()

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
		return Array.from(menuEl.querySelectorAll<HTMLElement>('a'))
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

	// Get current value from URL or use default
	let currentValue = $derived(page.url.searchParams.get(paramName) ?? defaultValue)

	// Find the label for the current value
	let currentLabel = $derived(
		options.find((opt) => opt.value === currentValue)?.label ?? options[0]?.label ?? ''
	)

	// Build href that sets the param value (not toggle)
	function buildSetHref(value: string): string {
		const categoryType = getCategoryFromRoute(page.route.id, page.params)

		// If on category page, redirect to homepage
		const newUrl = categoryType ? new URL('/', page.url.origin) : new URL(page.url)

		// If redirecting from category page, copy existing params and add type
		if (categoryType) {
			newUrl.searchParams.append('type', categoryType)
			page.url.searchParams.forEach((v, k) => {
				if (k !== 'page' && k !== paramName) {
					newUrl.searchParams.append(k, v)
				}
			})
		}

		// Set the value (replace existing)
		newUrl.searchParams.delete(paramName)
		if (value !== defaultValue && value !== '') {
			newUrl.searchParams.set(paramName, value)
		}

		// Reset pagination
		newUrl.searchParams.delete('page')

		return newUrl.pathname + newUrl.search
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
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		aria-label="Select {paramName}"
		bind:this={triggerEl}
		onmousedown={handleTriggerMousedown}
		ontouchstart={handleTriggerMousedown}
		onclick={handleTriggerClick}
		onkeydown={handleTriggerKeydown}
		class="grid w-full min-w-36 cursor-pointer grid-cols-[1fr_auto] items-center rounded-md border-2 border-transparent bg-slate-100 px-3 py-1 pl-2 text-left text-sm focus:outline-2 focus:outline-svelte-300"
	>
		{currentLabel}
		<CaretUpDown class="ml-auto size-4 text-gray-500" />
	</div>

	<div
		role="listbox"
		aria-label="{paramName} options"
		bind:this={menuEl}
		class="invisible absolute left-0 top-full z-50 mt-1 min-w-44 rounded-xl bg-white px-1 py-3 opacity-0 shadow-2xl transition-all select-none group-focus-within/dropdown:visible group-focus-within/dropdown:opacity-100"
	>
		{#each options as option (option.value)}
			{@const isActive = currentValue === option.value}
			<a
				href={buildSetHref(option.value)}
				role="option"
				aria-selected={isActive}
				onclick={() => handleSelect()}
				onkeydown={(e) => {
					if (e.key === ' ') {
						e.preventDefault()
						e.currentTarget.click()
					}
				}}
				class="flex h-8 w-full items-center justify-between rounded-sm py-3 pr-2 pl-3 text-sm outline-hidden hover:bg-gray-100 focus:bg-gray-100"
			>
				{option.label}
				{#if isActive}
					<Check class="size-4 text-svelte-500" weight="bold" />
				{/if}
			</a>
		{/each}
	</div>
</div>
