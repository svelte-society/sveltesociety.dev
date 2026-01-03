<script lang="ts">
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import Check from 'phosphor-svelte/lib/Check'
	import { page } from '$app/state'
	import { afterNavigate } from '$app/navigation'
	import { getCategoryFromRoute } from './url-helpers'
	import Dropdown from '$lib/ui/Dropdown.svelte'

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

	let dropdownRef: { close: () => void } | undefined = $state()
	let shouldRefocus = $state(false)

	afterNavigate(() => {
		if (shouldRefocus) {
			dropdownRef?.close()
			shouldRefocus = false
		}
	})

	function handleSelect() {
		dropdownRef?.close()
		shouldRefocus = true
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

<Dropdown
	bind:this={dropdownRef}
	triggerLabel="Select {paramName}"
	triggerClass="grid w-full min-w-36 cursor-pointer grid-cols-[1fr_auto] items-center rounded-md border-2 border-transparent bg-slate-100 px-3 py-1 pl-2 text-left text-sm focus:outline-2 focus:outline-svelte-300"
	menuLabel="{paramName} options"
	menuClass="left-0 right-0 rounded-xl bg-white px-1 py-3 shadow-2xl"
	menuItemSelector="[role='menuitemradio']"
>
	{#snippet triggerContent()}
		{currentLabel}
		<CaretUpDown class="ml-auto size-4 text-gray-500" />
	{/snippet}

	{#each options as option (option.value)}
		{@const isActive = currentValue === option.value}
		<a
			href={buildSetHref(option.value)}
			data-sveltekit-preload-data="off"
			role="menuitemradio"
			aria-checked={isActive}
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
</Dropdown>
