<script lang="ts">
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import Check from 'phosphor-svelte/lib/Check'
	import { Select } from 'bits-ui'
	type Option = {
		label: string
		value: string
	}

	type Props = {
		options: Option[]
		value?: string
		name: string
		selected?: string
		props?: any
		disabled?: boolean
		onchange?: (value: string) => void
	}
	let { options, value = $bindable(), name, props, disabled = false, onchange }: Props = $props()

	const placeholder = $derived(props?.placeholder || 'Select...')
	const selectedLabel = $derived(options.find((option) => option.value === value)?.label)
</script>

<Select.Root type="single" bind:value onValueChange={onchange} {name} {disabled}>
	<Select.Trigger
		{...props}
		class="focus:outline-svelte-300 grid w-full grid-cols-[1fr_auto] items-center rounded-md border-2 border-transparent bg-slate-100 px-3 py-1 pl-2 text-left text-sm placeholder-slate-500 focus:outline-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 data-fs-error:border-red-300 data-fs-error:bg-red-50 data-fs-error:text-red-600"
		{disabled}
		tabindex={disabled ? -1 : 0}
		aria-label={selectedLabel || 'Select an option'}
	>
		{selectedLabel || placeholder}
		<CaretUpDown class="ml-auto size-4 text-gray-500" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="focus-override z-50 w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] rounded-xl bg-white px-1 py-3 shadow-2xl outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
		>
			{#each options as option}
				<Select.Item
					value={option.value}
					class="flex h-8 w-full items-center rounded-sm py-3 pr-1.5 pl-3 text-sm capitalize outline-hidden select-none data-disabled:opacity-50 data-highlighted:bg-gray-100"
				>
					{#snippet children({ selected })}
						{option.label}
						{#if selected}
							<div class="ml-auto">
								<Check />
							</div>
						{/if}
					{/snippet}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Portal>
</Select.Root>
