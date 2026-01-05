<script lang="ts">
	import CaretRight from 'phosphor-svelte/lib/CaretRight'
	import type { Snippet } from 'svelte'

	type Props = {
		label: string
		children: Snippet
	}

	let { label, children }: Props = $props()

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

	function getSubmenuTriggers(): HTMLElement[] {
		if (!submenuEl) return []
		return Array.from(submenuEl.querySelectorAll<HTMLElement>(':scope > div[role="group"] > div[role="menuitem"]'))
	}

	function handleKeydown(e: KeyboardEvent) {
		const submenuTriggers = getSubmenuTriggers()

		if (e.key === 'ArrowRight' && document.activeElement === triggerEl) {
			e.preventDefault()
			submenuTriggers[0]?.focus()
			return
		}

		if (e.key === 'ArrowLeft' && document.activeElement !== triggerEl) {
			// Check if we're on a direct child trigger (not inside a nested submenu)
			const activeEl = document.activeElement as HTMLElement
			if (submenuTriggers.includes(activeEl)) {
				e.preventDefault()
				triggerEl?.focus()
				return
			}
		}

		const currentIndex = submenuTriggers.findIndex((item) => item === document.activeElement)
		if (currentIndex < 0) return

		if (e.key === 'ArrowDown' && currentIndex < submenuTriggers.length - 1) {
			e.preventDefault()
			submenuTriggers[currentIndex + 1]?.focus()
		} else if (e.key === 'ArrowUp' && currentIndex > 0) {
			e.preventDefault()
			submenuTriggers[currentIndex - 1]?.focus()
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	role="group"
	class="group/submenu-group relative"
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
		class="group/button flex h-8 w-full cursor-pointer items-center justify-between rounded-sm py-3 pr-1.5 pl-3 text-left text-sm outline-hidden hover:bg-gray-100 focus:bg-gray-100 group-focus-within/submenu-group:bg-gray-100"
	>
		<span>{label}</span>
		<CaretRight class="size-4 text-gray-400 group-hover/button:text-gray-900 group-focus/button:text-gray-900 group-focus-within/submenu-group:text-gray-900" />
		<span class="sr-only">Open submenu</span>
	</div>
	<div
		class="invisible absolute min-w-44 rounded-xl bg-white shadow-2xl opacity-0 transition-all select-none group-focus-within/submenu-group:visible group-focus-within/submenu-group:opacity-100 left-0 top-full mt-1 w-full sm:left-full sm:top-0 sm:ml-1 sm:mt-0 sm:w-auto"
	>
		<div
			role="menu"
			aria-label="{label} filters"
			bind:this={submenuEl}
			class="px-1 py-3"
		>
			{@render children()}
		</div>
	</div>
</div>
